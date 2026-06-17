import { Router, type Request, type Response } from "express";
import { asc, eq } from "drizzle-orm";
import { db, adminUsers } from "@workspace/db";
import { requireAdminPermission } from "../../middleware/admin-auth";
import { hashPassword } from "../../lib/admin-auth";
import { writeAuditLog } from "../../lib/audit";
import { logger } from "../../lib/logger";
import {
  enumValue,
  hasErrors,
  isUuid,
  optionalString,
  requiredString,
  type ValidationErrors,
} from "../../lib/validate";

const router = Router();

// Managing users requires the "manageSupervisors" permission. Super admins
// satisfy this implicitly (hasAdminPermission returns true for them).
router.use(requireAdminPermission("manageSupervisors"));

const STATUSES = ["نشط", "موقوف"] as const;

// Canonical permission keys, kept in sync with the frontend catalog
// (adminPermissions.ts). Unknown keys are dropped on input.
const ALL_PERMISSION_KEYS = [
  "manageSeries",
  "manageShorts",
  "manageLectures",
  "manageWords",
  "manageSchedule",
  "manageMisc",
  "manageKnowledge",
  "manageTags",
  "publishContent",
  "hideContent",
  "deleteContent",
  "manageSupervisors",
  "editSettings",
] as const;

function sanitizePermissions(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const allowed = new Set<string>(ALL_PERMISSION_KEYS);
  const seen = new Set<string>();
  const result: string[] = [];
  for (const entry of value) {
    if (typeof entry === "string" && allowed.has(entry) && !seen.has(entry)) {
      seen.add(entry);
      result.push(entry);
    }
  }
  return result;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type UserInput = {
  name: string;
  email: string;
  status: (typeof STATUSES)[number];
  permissions: string[];
};

function parseUserInput(
  body: unknown,
  options: { requirePassword: boolean },
): { data?: UserInput & { password?: string }; errors: ValidationErrors } {
  const errors: ValidationErrors = {};
  const source = (body ?? {}) as Record<string, unknown>;

  const name = requiredString(errors, "name", source.name, {
    label: "الاسم",
    max: 200,
  });

  const email = (optionalString(source.email, { max: 320 }) ?? "").toLowerCase();
  if (!email || !EMAIL_RE.test(email)) {
    errors.email = "البريد الإلكتروني غير صالح.";
  }

  const password = optionalString(source.password, { max: 200 });
  if (options.requirePassword) {
    if (!password || password.length < 8) {
      errors.password = "كلمة المرور مطلوبة (٨ أحرف على الأقل).";
    }
  } else if (password !== undefined && password.length < 8) {
    errors.password = "كلمة المرور قصيرة (٨ أحرف على الأقل).";
  }

  const data = {
    name,
    email,
    status: enumValue(errors, "status", source.status, STATUSES, {
      label: "الحالة",
      fallback: "نشط",
    }),
    permissions: sanitizePermissions(source.permissions),
    password,
  };

  if (hasErrors(errors)) return { errors };
  return { data, errors };
}

function publicUser(row: typeof adminUsers.$inferSelect) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    status: row.status,
    isSuperAdmin: row.isSuperAdmin,
    permissions: row.permissions,
    lastLoginAt: row.lastLoginAt,
    createdAt: row.createdAt,
  };
}

// GET /api/admin/users
router.get("/", async (_request: Request, response: Response) => {
  try {
    const rows = await db
      .select()
      .from(adminUsers)
      .orderBy(asc(adminUsers.createdAt));
    response.json({ ok: true, items: rows.map(publicUser) });
  } catch (error) {
    logger.error({ err: error }, "Listing admin users failed");
    response.status(500).json({
      ok: false,
      error: "LIST_FAILED",
      message: "تعذر تحميل المستخدمين.",
    });
  }
});

// POST /api/admin/users
router.post("/", async (request: Request, response: Response) => {
  try {
    const { data, errors } = parseUserInput(request.body, {
      requirePassword: true,
    });
    if (!data) {
      response.status(400).json({
        ok: false,
        error: "INVALID_INPUT",
        message: "تحقق من الحقول المدخلة.",
        fields: errors,
      });
      return;
    }

    const [duplicate] = await db
      .select({ id: adminUsers.id })
      .from(adminUsers)
      .where(eq(adminUsers.email, data.email))
      .limit(1);

    if (duplicate) {
      response.status(400).json({
        ok: false,
        error: "DUPLICATE",
        message: "البريد الإلكتروني مستخدم مسبقًا.",
        fields: { email: "البريد الإلكتروني مستخدم مسبقًا." },
      });
      return;
    }

    const passwordHash = await hashPassword(data.password as string);

    const [item] = await db
      .insert(adminUsers)
      .values({
        name: data.name,
        email: data.email,
        passwordHash,
        status: data.status,
        isSuperAdmin: false,
        permissions: data.permissions,
      })
      .returning();

    await writeAuditLog({
      request,
      action: "create",
      entityType: "admin_user",
      entityId: item.id,
      metadata: { email: item.email },
    });

    response.status(201).json({ ok: true, item: publicUser(item) });
  } catch (error) {
    logger.error({ err: error }, "Creating admin user failed");
    response.status(500).json({
      ok: false,
      error: "CREATE_FAILED",
      message: "تعذر إنشاء المستخدم.",
    });
  }
});

// PATCH /api/admin/users/:id
router.patch("/:id", async (request: Request, response: Response) => {
  try {
    const { id } = request.params;
    if (!isUuid(id)) {
      response
        .status(400)
        .json({ ok: false, error: "INVALID_ID", message: "معرّف غير صالح." });
      return;
    }

    if (id === request.admin?.user.id) {
      response.status(400).json({
        ok: false,
        error: "SELF_EDIT",
        message: "لا يمكنك تعديل صلاحيات حسابك من هنا.",
      });
      return;
    }

    const [existing] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.id, id))
      .limit(1);

    if (!existing) {
      response.status(404).json({
        ok: false,
        error: "NOT_FOUND",
        message: "المستخدم غير موجود.",
      });
      return;
    }

    if (existing.isSuperAdmin) {
      response.status(403).json({
        ok: false,
        error: "PROTECTED",
        message: "لا يمكن تعديل المشرف العام من هنا.",
      });
      return;
    }

    const { data, errors } = parseUserInput(request.body, {
      requirePassword: false,
    });
    if (!data) {
      response.status(400).json({
        ok: false,
        error: "INVALID_INPUT",
        message: "تحقق من الحقول المدخلة.",
        fields: errors,
      });
      return;
    }

    if (data.email !== existing.email) {
      const [duplicate] = await db
        .select({ id: adminUsers.id })
        .from(adminUsers)
        .where(eq(adminUsers.email, data.email))
        .limit(1);
      if (duplicate && duplicate.id !== id) {
        response.status(400).json({
          ok: false,
          error: "DUPLICATE",
          message: "البريد الإلكتروني مستخدم مسبقًا.",
          fields: { email: "البريد الإلكتروني مستخدم مسبقًا." },
        });
        return;
      }
    }

    const updates: Partial<typeof adminUsers.$inferInsert> = {
      name: data.name,
      email: data.email,
      status: data.status,
      permissions: data.permissions,
    };

    if (data.password) {
      updates.passwordHash = await hashPassword(data.password);
    }

    const [item] = await db
      .update(adminUsers)
      .set(updates)
      .where(eq(adminUsers.id, id))
      .returning();

    await writeAuditLog({
      request,
      action: "update",
      entityType: "admin_user",
      entityId: id,
      metadata: { email: item.email },
    });

    response.json({ ok: true, item: publicUser(item) });
  } catch (error) {
    logger.error({ err: error }, "Updating admin user failed");
    response.status(500).json({
      ok: false,
      error: "UPDATE_FAILED",
      message: "تعذر تحديث المستخدم.",
    });
  }
});

// DELETE /api/admin/users/:id
router.delete("/:id", async (request: Request, response: Response) => {
  try {
    const { id } = request.params;
    if (!isUuid(id)) {
      response
        .status(400)
        .json({ ok: false, error: "INVALID_ID", message: "معرّف غير صالح." });
      return;
    }

    if (id === request.admin?.user.id) {
      response.status(400).json({
        ok: false,
        error: "SELF_DELETE",
        message: "لا يمكنك حذف حسابك.",
      });
      return;
    }

    const [target] = await db
      .select({
        id: adminUsers.id,
        email: adminUsers.email,
        isSuperAdmin: adminUsers.isSuperAdmin,
      })
      .from(adminUsers)
      .where(eq(adminUsers.id, id))
      .limit(1);

    if (!target) {
      response.status(404).json({
        ok: false,
        error: "NOT_FOUND",
        message: "المستخدم غير موجود.",
      });
      return;
    }

    if (target.isSuperAdmin) {
      response.status(403).json({
        ok: false,
        error: "PROTECTED",
        message: "لا يمكن حذف المشرف العام.",
      });
      return;
    }

    await db.delete(adminUsers).where(eq(adminUsers.id, id));

    await writeAuditLog({
      request,
      action: "delete",
      entityType: "admin_user",
      entityId: target.id,
      metadata: { email: target.email },
    });

    response.json({ ok: true, id: target.id });
  } catch (error) {
    logger.error({ err: error }, "Deleting admin user failed");
    response.status(500).json({
      ok: false,
      error: "DELETE_FAILED",
      message: "تعذر حذف المستخدم.",
    });
  }
});

export default router;
