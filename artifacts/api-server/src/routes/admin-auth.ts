import { Router, type Request, type Response } from "express";
import { eq } from "drizzle-orm";
import { db, adminUsers } from "@workspace/db";
import {
  clearAdminSessionCookie,
  createAdminSession,
  getAdminContextFromRequest,
  revokeAdminSessionByRequest,
  setAdminSessionCookie,
  verifyPassword,
} from "../lib/admin-auth";
import { logger } from "../lib/logger";

const router = Router();

function getRequestIp(request: Request) {
  return (
    request.headers["x-forwarded-for"]?.toString().split(",")[0]?.trim() ||
    request.socket.remoteAddress ||
    undefined
  );
}

function getRequestUserAgent(request: Request) {
  return request.headers["user-agent"]?.toString();
}

function isValidEmail(email: unknown): email is string {
  return typeof email === "string" && email.includes("@") && email.length <= 254;
}

function isValidPassword(password: unknown): password is string {
  return typeof password === "string" && password.length >= 8;
}

router.post("/login", async (request: Request, response: Response) => {
  try {
    const { email, password } = request.body ?? {};

    if (!isValidEmail(email) || !isValidPassword(password)) {
      response.status(400).json({
        ok: false,
        error: "INVALID_INPUT",
        message: "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
      });
      return;
    }

    const [user] = await db
      .select({
        id: adminUsers.id,
        name: adminUsers.name,
        email: adminUsers.email,
        passwordHash: adminUsers.passwordHash,
        status: adminUsers.status,
        isSuperAdmin: adminUsers.isSuperAdmin,
        permissions: adminUsers.permissions,
      })
      .from(adminUsers)
      .where(eq(adminUsers.email, email.trim().toLowerCase()))
      .limit(1);

    if (!user || user.status !== "نشط") {
      response.status(401).json({
        ok: false,
        error: "INVALID_CREDENTIALS",
        message: "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
      });
      return;
    }

    const isPasswordValid = await verifyPassword(password, user.passwordHash);

    if (!isPasswordValid) {
      response.status(401).json({
        ok: false,
        error: "INVALID_CREDENTIALS",
        message: "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
      });
      return;
    }

    const session = await createAdminSession({
      userId: user.id,
      ipAddress: getRequestIp(request),
      userAgent: getRequestUserAgent(request),
    });

    await db
      .update(adminUsers)
      .set({ lastLoginAt: new Date() })
      .where(eq(adminUsers.id, user.id));

    setAdminSessionCookie(response, session.rawToken, session.maxAge);

    response.json({
      ok: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isSuperAdmin: user.isSuperAdmin,
        permissions: user.permissions,
      },
    });
  } catch (error) {
    logger.error({ err: error }, "Admin login failed");

    response.status(500).json({
      ok: false,
      error: "LOGIN_FAILED",
      message: "تعذر تسجيل الدخول. حاول لاحقًا.",
    });
  }
});

router.post("/logout", async (request: Request, response: Response) => {
  try {
    await revokeAdminSessionByRequest(request);
    clearAdminSessionCookie(response);

    response.json({ ok: true });
  } catch (error) {
    logger.error({ err: error }, "Admin logout failed");

    response.status(500).json({
      ok: false,
      error: "LOGOUT_FAILED",
      message: "تعذر تسجيل الخروج. حاول لاحقًا.",
    });
  }
});

router.get("/me", async (request: Request, response: Response) => {
  try {
    const context = await getAdminContextFromRequest(request);

    if (!context) {
      response.status(401).json({
        ok: false,
        error: "UNAUTHENTICATED",
        message: "يلزم تسجيل الدخول.",
      });
      return;
    }

    response.json({
      ok: true,
      user: context.user,
    });
  } catch (error) {
    logger.error({ err: error }, "Reading current admin failed");

    response.status(500).json({
      ok: false,
      error: "READ_CURRENT_ADMIN_FAILED",
      message: "تعذر التحقق من جلسة الدخول.",
    });
  }
});

export default router;