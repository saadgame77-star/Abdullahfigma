import { Router, type Request, type Response } from "express";
import { and, desc, eq, ilike, or, type SQL } from "drizzle-orm";
import { db, shortClips } from "@workspace/db";
import { requireAdminPermission } from "../../middleware/admin-auth";
import { canChangeContentStatus } from "../../lib/admin-auth";
import { writeAuditLog } from "../../lib/audit";
import { logger } from "../../lib/logger";
import {
  enumValue,
  hasErrors,
  integerValue,
  isUuid,
  optionalString,
  requiredString,
  stringArray,
  uuidOrNull,
  type ValidationErrors,
} from "../../lib/validate";

const router = Router();

router.use(requireAdminPermission("manageShorts"));

const TRUST_LEVELS = ["عالٍ", "متوسط"] as const;
const PUBLISH_STATUSES = ["منشور", "مخفي", "مسودة"] as const;

type ShortInput = {
  title: string;
  channel?: string;
  videoId?: string;
  url: string;
  duration?: string;
  durationSeconds: number;
  trust: (typeof TRUST_LEVELS)[number];
  publishStatus: (typeof PUBLISH_STATUSES)[number];
  tags: string[];
  displayOrder: number;
  description: string;
  note?: string;
  categoryId: string | null;
  subcategoryId: string | null;
};

function parseShortInput(body: unknown): {
  data?: ShortInput;
  errors: ValidationErrors;
} {
  const errors: ValidationErrors = {};
  const source = (body ?? {}) as Record<string, unknown>;

  const title = requiredString(errors, "title", source.title, {
    label: "عنوان المقطع",
    max: 300,
  });
  const url = requiredString(errors, "url", source.url, {
    label: "رابط المقطع",
    max: 1000,
  });

  const data: ShortInput = {
    title,
    url,
    channel: optionalString(source.channel, { max: 300 }),
    videoId: optionalString(source.videoId, { max: 200 }),
    duration: optionalString(source.duration, { max: 50 }),
    durationSeconds: integerValue(source.durationSeconds, {
      min: 0,
      fallback: 0,
    }),
    trust: enumValue(errors, "trust", source.trust, TRUST_LEVELS, {
      label: "درجة التوثيق",
      fallback: "متوسط",
    }),
    publishStatus: enumValue(
      errors,
      "publishStatus",
      source.publishStatus,
      PUBLISH_STATUSES,
      { label: "حالة النشر", fallback: "مسودة" },
    ),
    tags: stringArray(source.tags),
    displayOrder: integerValue(source.displayOrder, { min: 0, fallback: 0 }),
    description: optionalString(source.description, { max: 5000 }) ?? "",
    note: optionalString(source.note, { max: 2000 }),
    categoryId: uuidOrNull(errors, "categoryId", source.categoryId, {
      label: "التصنيف",
    }),
    subcategoryId: uuidOrNull(errors, "subcategoryId", source.subcategoryId, {
      label: "التصنيف الفرعي",
    }),
  };

  if (hasErrors(errors)) return { errors };
  return { data, errors };
}

router.get("/", async (request: Request, response: Response) => {
  try {
    const search = optionalString(request.query.search);
    const publishStatus = optionalString(request.query.publishStatus);

    const conditions: SQL[] = [];
    if (search) {
      const pattern = `%${search}%`;
      const searchCondition = or(
        ilike(shortClips.title, pattern),
        ilike(shortClips.channel, pattern),
      );
      if (searchCondition) conditions.push(searchCondition);
    }
    if (
      publishStatus &&
      (PUBLISH_STATUSES as readonly string[]).includes(publishStatus)
    ) {
      conditions.push(eq(shortClips.publishStatus, publishStatus as never));
    }

    const items = await db
      .select()
      .from(shortClips)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(shortClips.displayOrder, desc(shortClips.createdAt));

    response.json({ ok: true, items, total: items.length });
  } catch (error) {
    logger.error({ err: error }, "Listing short clips failed");
    response.status(500).json({
      ok: false,
      error: "LIST_FAILED",
      message: "تعذر تحميل المقاطع.",
    });
  }
});

router.get("/:id", async (request: Request, response: Response) => {
  try {
    const { id } = request.params;
    if (!isUuid(id)) {
      response
        .status(400)
        .json({ ok: false, error: "INVALID_ID", message: "معرّف غير صالح." });
      return;
    }
    const [item] = await db
      .select()
      .from(shortClips)
      .where(eq(shortClips.id, id))
      .limit(1);
    if (!item) {
      response
        .status(404)
        .json({ ok: false, error: "NOT_FOUND", message: "المقطع غير موجود." });
      return;
    }
    response.json({ ok: true, item });
  } catch (error) {
    logger.error({ err: error }, "Reading short clip failed");
    response
      .status(500)
      .json({ ok: false, error: "READ_FAILED", message: "تعذر تحميل المقطع." });
  }
});

router.post("/", async (request: Request, response: Response) => {
  try {
    const { data, errors } = parseShortInput(request.body);
    if (!data) {
      response.status(400).json({
        ok: false,
        error: "INVALID_INPUT",
        message: "تحقق من الحقول المدخلة.",
        fields: errors,
      });
      return;
    }

    const denyStatus = canChangeContentStatus(
      request.admin!.user,
      null,
      data.publishStatus,
    );
    if (denyStatus) {
      response
        .status(403)
        .json({ ok: false, error: "FORBIDDEN", message: denyStatus });
      return;
    }

    const adminId = request.admin?.user.id ?? null;
    const isPublished = data.publishStatus === "منشور";

    const [item] = await db
      .insert(shortClips)
      .values({
        title: data.title,
        channel: data.channel,
        videoId: data.videoId,
        url: data.url,
        duration: data.duration,
        durationSeconds: data.durationSeconds,
        trust: data.trust,
        publishStatus: data.publishStatus,
        tags: data.tags,
        displayOrder: data.displayOrder,
        description: data.description,
        note: data.note,
        categoryId: data.categoryId,
        subcategoryId: data.subcategoryId,
        createdByUserId: adminId,
        updatedByUserId: adminId,
        publishedAt: isPublished ? new Date() : null,
      })
      .returning();

    await writeAuditLog({
      request,
      action: "create",
      entityType: "short_clip",
      entityId: item.id,
      metadata: { title: item.title },
    });

    response.status(201).json({ ok: true, item });
  } catch (error) {
    logger.error({ err: error }, "Creating short clip failed");
    response.status(500).json({
      ok: false,
      error: "CREATE_FAILED",
      message: "تعذر إنشاء المقطع.",
    });
  }
});

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
      .from(shortClips)
      .where(eq(shortClips.id, id))
      .limit(1);
    if (!existing) {
      response
        .status(404)
        .json({ ok: false, error: "NOT_FOUND", message: "المقطع غير موجود." });
      return;
    }

    const { data, errors } = parseShortInput(request.body);
    if (!data) {
      response.status(400).json({
        ok: false,
        error: "INVALID_INPUT",
        message: "تحقق من الحقول المدخلة.",
        fields: errors,
      });
      return;
    }

    const denyStatus = canChangeContentStatus(
      request.admin!.user,
      existing.publishStatus,
      data.publishStatus,
    );
    if (denyStatus) {
      response
        .status(403)
        .json({ ok: false, error: "FORBIDDEN", message: denyStatus });
      return;
    }

    const wasPublished = existing.publishStatus === "منشور";
    const willPublish = data.publishStatus === "منشور";
    const publishedAt = willPublish
      ? (existing.publishedAt ?? new Date())
      : wasPublished
        ? existing.publishedAt
        : null;

    const [item] = await db
      .update(shortClips)
      .set({
        title: data.title,
        channel: data.channel,
        videoId: data.videoId,
        url: data.url,
        duration: data.duration,
        durationSeconds: data.durationSeconds,
        trust: data.trust,
        publishStatus: data.publishStatus,
        tags: data.tags,
        displayOrder: data.displayOrder,
        description: data.description,
        note: data.note,
        categoryId: data.categoryId,
        subcategoryId: data.subcategoryId,
        updatedByUserId: request.admin?.user.id ?? null,
        publishedAt,
      })
      .where(eq(shortClips.id, id))
      .returning();

    await writeAuditLog({
      request,
      action: "update",
      entityType: "short_clip",
      entityId: id,
      metadata: { title: item.title },
    });

    response.json({ ok: true, item });
  } catch (error) {
    logger.error({ err: error }, "Updating short clip failed");
    response.status(500).json({
      ok: false,
      error: "UPDATE_FAILED",
      message: "تعذر تحديث المقطع.",
    });
  }
});

router.delete(
  "/:id",
  requireAdminPermission("deleteContent"),
  async (request: Request, response: Response) => {
  try {
    const { id } = request.params;
    if (!isUuid(id)) {
      response
        .status(400)
        .json({ ok: false, error: "INVALID_ID", message: "معرّف غير صالح." });
      return;
    }

    const [deleted] = await db
      .delete(shortClips)
      .where(eq(shortClips.id, id))
      .returning({ id: shortClips.id, title: shortClips.title });

    if (!deleted) {
      response
        .status(404)
        .json({ ok: false, error: "NOT_FOUND", message: "المقطع غير موجود." });
      return;
    }

    await writeAuditLog({
      request,
      action: "delete",
      entityType: "short_clip",
      entityId: deleted.id,
      metadata: { title: deleted.title },
    });

    response.json({ ok: true, id: deleted.id });
  } catch (error) {
    logger.error({ err: error }, "Deleting short clip failed");
    response.status(500).json({
      ok: false,
      error: "DELETE_FAILED",
      message: "تعذر حذف المقطع.",
    });
  }
});

export default router;
