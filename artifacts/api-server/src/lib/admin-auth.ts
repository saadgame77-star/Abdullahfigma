import { promisify } from "node:util";
import {
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
  createHash,
} from "node:crypto";
import type { Request, Response } from "express";
import { and, eq, gt, isNull } from "drizzle-orm";
import { db, adminSessions, adminUsers } from "@workspace/db";

const scrypt = promisify(scryptCallback);

export const ADMIN_SESSION_COOKIE = "admin_session";

const SESSION_DURATION_DAYS = 14;
const SESSION_DURATION_MS = SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000;

export type AuthenticatedAdminUser = {
  id: string;
  name: string;
  email: string;
  isSuperAdmin: boolean;
  permissions: string[];
};

export type AuthenticatedAdminSession = {
  id: string;
  userId: string;
  expiresAt: Date;
};

export type AuthenticatedAdminContext = {
  user: AuthenticatedAdminUser;
  session: AuthenticatedAdminSession;
};

function getCookieSecureFlag() {
  return process.env.NODE_ENV === "production";
}

function getCookieOptions(maxAge?: number) {
  return {
    httpOnly: true,
    secure: getCookieSecureFlag(),
    sameSite: "lax" as const,
    path: "/",
    ...(maxAge ? { maxAge } : {}),
  };
}

function hashSessionToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;

  return `scrypt:v1:${salt}:${derivedKey.toString("hex")}`;
}

export async function verifyPassword(password: string, storedHash: string) {
  const [algorithm, version, salt, storedDerivedKey] = storedHash.split(":");

  if (
    algorithm !== "scrypt" ||
    version !== "v1" ||
    !salt ||
    !storedDerivedKey
  ) {
    return false;
  }

  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
  const storedKeyBuffer = Buffer.from(storedDerivedKey, "hex");

  if (derivedKey.length !== storedKeyBuffer.length) {
    return false;
  }

  return timingSafeEqual(derivedKey, storedKeyBuffer);
}

export function createRawSessionToken() {
  return randomBytes(32).toString("base64url");
}

export async function createAdminSession(params: {
  userId: string;
  ipAddress?: string;
  userAgent?: string;
}) {
  const rawToken = createRawSessionToken();
  const sessionTokenHash = hashSessionToken(rawToken);
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  const [session] = await db
    .insert(adminSessions)
    .values({
      userId: params.userId,
      sessionTokenHash,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
      expiresAt,
    })
    .returning({
      id: adminSessions.id,
      userId: adminSessions.userId,
      expiresAt: adminSessions.expiresAt,
    });

  return {
    rawToken,
    session,
    maxAge: SESSION_DURATION_MS,
  };
}

export function setAdminSessionCookie(
  response: Response,
  token: string,
  maxAge: number,
) {
  response.cookie(ADMIN_SESSION_COOKIE, token, getCookieOptions(maxAge));
}

export function clearAdminSessionCookie(response: Response) {
  response.clearCookie(ADMIN_SESSION_COOKIE, getCookieOptions());
}

export async function getAdminContextFromRequest(
  request: Request,
): Promise<AuthenticatedAdminContext | null> {
  const rawToken = request.cookies?.[ADMIN_SESSION_COOKIE];

  if (!rawToken || typeof rawToken !== "string") {
    return null;
  }

  const sessionTokenHash = hashSessionToken(rawToken);

  const [record] = await db
    .select({
      sessionId: adminSessions.id,
      sessionUserId: adminSessions.userId,
      sessionExpiresAt: adminSessions.expiresAt,
      userId: adminUsers.id,
      userName: adminUsers.name,
      userEmail: adminUsers.email,
      userIsSuperAdmin: adminUsers.isSuperAdmin,
      userPermissions: adminUsers.permissions,
    })
    .from(adminSessions)
    .innerJoin(adminUsers, eq(adminSessions.userId, adminUsers.id))
    .where(
      and(
        eq(adminSessions.sessionTokenHash, sessionTokenHash),
        isNull(adminSessions.revokedAt),
        gt(adminSessions.expiresAt, new Date()),
        eq(adminUsers.status, "نشط"),
      ),
    )
    .limit(1);

  if (!record) {
    return null;
  }

  return {
    user: {
      id: record.userId,
      name: record.userName,
      email: record.userEmail,
      isSuperAdmin: record.userIsSuperAdmin,
      permissions: record.userPermissions,
    },
    session: {
      id: record.sessionId,
      userId: record.sessionUserId,
      expiresAt: record.sessionExpiresAt,
    },
  };
}

export async function revokeAdminSessionByRequest(request: Request) {
  const rawToken = request.cookies?.[ADMIN_SESSION_COOKIE];

  if (!rawToken || typeof rawToken !== "string") {
    return;
  }

  const sessionTokenHash = hashSessionToken(rawToken);

  await db
    .update(adminSessions)
    .set({ revokedAt: new Date() })
    .where(eq(adminSessions.sessionTokenHash, sessionTokenHash));
}

export function hasAdminPermission(
  user: AuthenticatedAdminUser,
  permission: string,
) {
  return user.isSuperAdmin || user.permissions.includes(permission);
}

// Cross-cutting publish/hide gate. Returns an Arabic error message when the
// user may not move content INTO the given status, or null when allowed. Only
// transitions are checked, so editing an already-published item does not
// require the publish permission.
export function canChangeContentStatus(
  user: AuthenticatedAdminUser,
  previousStatus: string | null,
  nextStatus: string,
): string | null {
  if (
    nextStatus === "منشور" &&
    previousStatus !== "منشور" &&
    !hasAdminPermission(user, "publishContent")
  ) {
    return "لا تملك صلاحية نشر المحتوى.";
  }

  if (
    nextStatus === "مخفي" &&
    previousStatus !== "مخفي" &&
    !hasAdminPermission(user, "hideContent")
  ) {
    return "لا تملك صلاحية إخفاء المحتوى.";
  }

  return null;
}