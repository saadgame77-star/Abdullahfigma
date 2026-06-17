import { Router, type Request, type Response } from "express";
import { asc, eq, ilike } from "drizzle-orm";
import {
  db,
  tags,
  scientificSeries,
  lectures,
  words,
  shortClips,
  scheduleItems,
  miscItems,
} from "@workspace/db";
import {
  requireAdminPermission,
  requireAdminSession,
} from "../../middleware/admin-auth";
import { ensureUniqueSlug } from "../../lib/slug";
import { writeAuditLog } from "../../lib/audit";
import { logger } from "../../lib/logger";
import {
  hasErrors,
  isUuid,
  optionalString,
  requiredString,
  type ValidationErrors,
} from "../../lib/validate";

const router = Router();

router.use(requireAdminSession);

// Reads open to any signed-in admin; writes require "manageTags".
router.use((request, response, next) => {
  if (request.method === "GET") {
    next();
    return;
  }
  requireAdminPermission("manageTags")(request, response, next);
});

type TagInput = { name: string };

function parseTagInput(body: unknown): {
  data?: TagInput;
  errors: ValidationErrors;
} {
  const errors: ValidationErrors = {};
  const source = (body ?? {}) as Record<string, unknown>;

  const name = requiredString(errors, "name", source.name, {
    label: "اسم الوسم",
    max: 100,
  });

  if (hasErrors(errors)) return { errors };
  return { data: { name }, errors };
}

// Tally how many times each tag string appears across all content tables, so
// the catalog can show real usage. Content stores tags as free-text arrays.
async function computeTagUsage(): Promise<Map<string, number>> {
  const [a, b, c, d, e, f] = await Promise.all([
    db.select({ tags: scientificSeries.tags }).from(scientificSeries),
    db.select({ tags: lectures.tags }).from(lectures),
    db.select({ tags: words.tags }).from(words),
    db.select({ tags: shortClips.tags }).from(shortClips),
    db.select({ tags: scheduleItems.tags }).from(scheduleItems),
    db.select({ tags: miscItems.tags }).from(miscItems),
  ]);

  const usage = new Map<string, number>();
  for (const rows of [a, b, c, d, e, f]) {
    for (const row of rows) {
      for (const tag of row.tags ?? []) {
        const key = tag.trim();
        if (!key) continue;
        usage.set(key, (usage.get(key) ?? 0) + 1);
      }
    }
  }
  return usage;
}

// GET /api/admin/tags — catalog with live usage counts.
router.get("/", async (request: Request, response: Response) => {
  try {
    const search = optionalString(request.query.search);

    const rows = await db
      .select()
      .from(tags)
      .where(search ? ilike(tags.name, `%${search}%`) : undefined)
      .orderBy(asc(tags.name));

    const usage = await computeTagUsage();

    const items = rows.map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      usageCount: usage.get(row.name) ?? 0,
    }));

    response.json({ ok: true, items, total: items.length });
  } catch (error) {
    logger.error({ err: error }, "Listing tags failed");
    response.status(500).json({
      ok: false,
      error: "LIST_FAILED",
      message: "تعذر تحميل الوسوم.",
    });
  }
});

// POST /api/admin/tags
router.post("/", async (request: Request, response: Response) => {
  try {
    const { data, errors } = parseTagInput(request.body);
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
      .select({ id: tags.id })
      .from(tags)
      .where(eq(tags.name, data.name))
      .limit(1);

    if (duplicate) {
      response.status(400).json({
        ok: false,
        error: "DUPLICATE",
        message: "هذا الوسم موجود مسبقًا.",
        fields: { name: "هذا الوسم موجود مسبقًا." },
      });
      return;
    }

    const slug = await ensureUniqueSlug({
      table: tags,
      slugColumn: tags.slug,
      idColumn: tags.id,
      desired: data.name,
      fallback: data.name,
    });

    const [item] = await db
      .insert(tags)
      .values({ name: data.name, slug })
      .returning();

    await writeAuditLog({
      request,
      action: "create",
      entityType: "tag",
      entityId: item.id,
      metadata: { name: item.name },
    });

    response.status(201).json({ ok: true, item });
  } catch (error) {
    logger.error({ err: error }, "Creating tag failed");
    response.status(500).json({
      ok: false,
      error: "CREATE_FAILED",
      message: "تعذر إنشاء الوسم.",
    });
  }
});

// PATCH /api/admin/tags/:id
router.patch("/:id", async (request: Request, response: Response) => {
  try {
    const { id } = request.params;
    if (!isUuid(id)) {
      response
        .status(400)
        .json({ ok: false, error: "INVALID_ID", message: "معرّف غير صالح." });
      return;
    }

    const [existing] = await db
      .select()
      .from(tags)
      .where(eq(tags.id, id))
      .limit(1);

    if (!existing) {
      response
        .status(404)
        .json({ ok: false, error: "NOT_FOUND", message: "الوسم غير موجود." });
      return;
    }

    const { data, errors } = parseTagInput(request.body);
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
      .select({ id: tags.id })
      .from(tags)
      .where(eq(tags.name, data.name))
      .limit(1);

    if (duplicate && duplicate.id !== id) {
      response.status(400).json({
        ok: false,
        error: "DUPLICATE",
        message: "هذا الوسم موجود مسبقًا.",
        fields: { name: "هذا الوسم موجود مسبقًا." },
      });
      return;
    }

    const slug = await ensureUniqueSlug({
      table: tags,
      slugColumn: tags.slug,
      idColumn: tags.id,
      desired: data.name,
      fallback: data.name,
      excludeId: id,
    });

    const [item] = await db
      .update(tags)
      .set({ name: data.name, slug })
      .where(eq(tags.id, id))
      .returning();

    await writeAuditLog({
      request,
      action: "update",
      entityType: "tag",
      entityId: id,
      metadata: { name: item.name },
    });

    response.json({ ok: true, item });
  } catch (error) {
    logger.error({ err: error }, "Updating tag failed");
    response.status(500).json({
      ok: false,
      error: "UPDATE_FAILED",
      message: "تعذر تحديث الوسم.",
    });
  }
});

// DELETE /api/admin/tags/:id
router.delete("/:id", async (request: Request, response: Response) => {
  try {
    const { id } = request.params;
    if (!isUuid(id)) {
      response
        .status(400)
        .json({ ok: false, error: "INVALID_ID", message: "معرّف غير صالح." });
      return;
    }

    const [deleted] = await db
      .delete(tags)
      .where(eq(tags.id, id))
      .returning({ id: tags.id, name: tags.name });

    if (!deleted) {
      response
        .status(404)
        .json({ ok: false, error: "NOT_FOUND", message: "الوسم غير موجود." });
      return;
    }

    await writeAuditLog({
      request,
      action: "delete",
      entityType: "tag",
      entityId: deleted.id,
      metadata: { name: deleted.name },
    });

    response.json({ ok: true, id: deleted.id });
  } catch (error) {
    logger.error({ err: error }, "Deleting tag failed");
    response.status(500).json({
      ok: false,
      error: "DELETE_FAILED",
      message: "تعذر حذف الوسم.",
    });
  }
});

export default router;
