import { Router, type Request, type Response } from "express";
import { and, desc, eq, ilike, or, type SQL } from "drizzle-orm";
import { db, scientificSeries } from "@workspace/db";
import { requireAdminPermission } from "../../middleware/admin-auth";
import { canChangeContentStatus } from "../../lib/admin-auth";
import { ensureUniqueSlug } from "../../lib/slug";
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

router.use(requireAdminPermission("manageSeries"));

const COMPLETION_STATUSES = ["مكتملة", "غير مكتملة"] as const;
const TRUST_LEVELS = ["عالٍ", "متوسط"] as const;
const PUBLISH_STATUSES = ["منشور", "مخفي", "مسودة"] as const;

type SeriesInput = {
  title: string;
  bookTitle?: string;
  channel?: string;
  playlistId?: string;
  url?: string;
  videoCount: number;
  status: (typeof COMPLETION_STATUSES)[number];
  trust: (typeof TRUST_LEVELS)[number];
  publishStatus: (typeof PUBLISH_STATUSES)[number];
  tags: string[];
  displayOrder: number;
  description: string;
  note?: string;
  categoryId: string | null;
  subcategoryId: string | null;
  slug?: string;
};

function parseSeriesInput(body: unknown): {
  data?: SeriesInput;
  errors: ValidationErrors;
} {
  const errors: ValidationErrors = {};
  const source = (body ?? {}) as Record<string, unknown>;

  const title = requiredString(errors, "title", source.title, {
    label: "عنوان السلسلة",
    max: 300,
  });

  const data: SeriesInput = {
    title,
    bookTitle: optionalString(source.bookTitle, { max: 300 }),
    channel: optionalString(source.channel, { max: 300 }),
    playlistId: optionalString(source.playlistId, { max: 200 }),
    url: optionalString(source.url, { max: 1000 }),
    videoCount: integerValue(source.videoCount, { min: 0, fallback: 0 }),
    status: enumValue(errors, "status", source.status, COMPLETION_STATUSES, {
      label: "حالة الاكتمال",
      fallback: "غير مكتملة",
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
    slug: optionalString(source.slug, { max: 300 }),
  };

  if (hasErrors(errors)) {
    return { errors };
  }

  return { data, errors };
}

// GET /api/admin/series — list with optional search + status filters.
router.get("/", async (request: Request, response: Response) => {
  try {
    const search = optionalString(request.query.search);
    const publishStatus = optionalString(request.query.publishStatus);
    const status = optionalString(request.query.status);

    const conditions: SQL[] = [];

    if (search) {
      const pattern = `%${search}%`;
      const searchCondition = or(
        ilike(scientificSeries.title, pattern),
        ilike(scientificSeries.bookTitle, pattern),
        ilike(scientificSeries.channel, pattern),
      );
      if (searchCondition) conditions.push(searchCondition);
    }

    if (
      publishStatus &&
      (PUBLISH_STATUSES as readonly string[]).includes(publishStatus)
    ) {
      conditions.push(eq(scientificSeries.publishStatus, publishStatus as never));
    }

    if (status && (COMPLETION_STATUSES as readonly string[]).includes(status)) {
      conditions.push(eq(scientificSeries.status, status as never));
    }

    const items = await db
      .select()
      .from(scientificSeries)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(
        scientificSeries.displayOrder,
        desc(scientificSeries.createdAt),
      );

    response.json({ ok: true, items, total: items.length });
  } catch (error) {
    logger.error({ err: error }, "Listing series failed");
    response.status(500).json({
      ok: false,
      error: "LIST_FAILED",
      message: "تعذر تحميل السلاسل العلمية.",
    });
  }
});

// GET /api/admin/series/:id
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
      .from(scientificSeries)
      .where(eq(scientificSeries.id, id))
      .limit(1);

    if (!item) {
      response
        .status(404)
        .json({ ok: false, error: "NOT_FOUND", message: "السلسلة غير موجودة." });
      return;
    }

    response.json({ ok: true, item });
  } catch (error) {
    logger.error({ err: error }, "Reading series failed");
    response.status(500).json({
      ok: false,
      error: "READ_FAILED",
      message: "تعذر تحميل السلسلة.",
    });
  }
});

// POST /api/admin/series
router.post("/", async (request: Request, response: Response) => {
  try {
    const { data, errors } = parseSeriesInput(request.body);

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

    const slug = await ensureUniqueSlug({
      table: scientificSeries,
      slugColumn: scientificSeries.slug,
      idColumn: scientificSeries.id,
      desired: data.slug ?? data.title,
      fallback: data.title,
    });

    const adminId = request.admin?.user.id ?? null;
    const isPublished = data.publishStatus === "منشور";

    const [item] = await db
      .insert(scientificSeries)
      .values({
        title: data.title,
        slug,
        bookTitle: data.bookTitle,
        channel: data.channel,
        playlistId: data.playlistId,
        url: data.url,
        videoCount: data.videoCount,
        status: data.status,
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
      entityType: "scientific_series",
      entityId: item.id,
      metadata: { title: item.title },
    });

    response.status(201).json({ ok: true, item });
  } catch (error) {
    logger.error({ err: error }, "Creating series failed");
    response.status(500).json({
      ok: false,
      error: "CREATE_FAILED",
      message: "تعذر إنشاء السلسلة.",
    });
  }
});

// PATCH /api/admin/series/:id
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
      .from(scientificSeries)
      .where(eq(scientificSeries.id, id))
      .limit(1);

    if (!existing) {
      response
        .status(404)
        .json({ ok: false, error: "NOT_FOUND", message: "السلسلة غير موجودة." });
      return;
    }

    const { data, errors } = parseSeriesInput(request.body);

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

    const slug = await ensureUniqueSlug({
      table: scientificSeries,
      slugColumn: scientificSeries.slug,
      idColumn: scientificSeries.id,
      desired: data.slug ?? existing.slug ?? data.title,
      fallback: data.title,
      excludeId: id,
    });

    const wasPublished = existing.publishStatus === "منشور";
    const willPublish = data.publishStatus === "منشور";

    const publishedAt = willPublish
      ? (existing.publishedAt ?? new Date())
      : wasPublished
        ? existing.publishedAt
        : null;

    const [item] = await db
      .update(scientificSeries)
      .set({
        title: data.title,
        slug,
        bookTitle: data.bookTitle,
        channel: data.channel,
        playlistId: data.playlistId,
        url: data.url,
        videoCount: data.videoCount,
        status: data.status,
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
      .where(eq(scientificSeries.id, id))
      .returning();

    await writeAuditLog({
      request,
      action: "update",
      entityType: "scientific_series",
      entityId: id,
      metadata: { title: item.title },
    });

    response.json({ ok: true, item });
  } catch (error) {
    logger.error({ err: error }, "Updating series failed");
    response.status(500).json({
      ok: false,
      error: "UPDATE_FAILED",
      message: "تعذر تحديث السلسلة.",
    });
  }
});

// DELETE /api/admin/series/:id
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
      .delete(scientificSeries)
      .where(eq(scientificSeries.id, id))
      .returning({ id: scientificSeries.id, title: scientificSeries.title });

    if (!deleted) {
      response
        .status(404)
        .json({ ok: false, error: "NOT_FOUND", message: "السلسلة غير موجودة." });
      return;
    }

    await writeAuditLog({
      request,
      action: "delete",
      entityType: "scientific_series",
      entityId: deleted.id,
      metadata: { title: deleted.title },
    });

    response.json({ ok: true, id: deleted.id });
  } catch (error) {
    logger.error({ err: error }, "Deleting series failed");
    response.status(500).json({
      ok: false,
      error: "DELETE_FAILED",
      message: "تعذر حذف السلسلة.",
    });
  }
});

export default router;
