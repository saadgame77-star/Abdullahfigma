import { Router, type Request, type Response } from "express";
import { and, desc, eq, ilike, or, type SQL } from "drizzle-orm";
import { db, lectures } from "@workspace/db";
import { requireAdminSession } from "../../middleware/admin-auth";
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

router.use(requireAdminSession);

const LECTURE_TYPES = [
  "محاضرة عامة",
  "لقاء علمي",
  "كلمة مطولة",
  "برنامج",
] as const;
const TRUST_LEVELS = ["عالٍ", "متوسط"] as const;
const PUBLISH_STATUSES = ["منشور", "مخفي", "مسودة"] as const;

type LectureInput = {
  title: string;
  lectureType: (typeof LECTURE_TYPES)[number];
  channel?: string;
  videoId?: string;
  url: string;
  duration?: string;
  durationSeconds?: number;
  dateHijri?: string;
  dateGregorian?: string;
  trust: (typeof TRUST_LEVELS)[number];
  publishStatus: (typeof PUBLISH_STATUSES)[number];
  tags: string[];
  displayOrder: number;
  description: string;
  note?: string;
  categoryId: string | null;
  subcategoryId: string | null;
};

function parseLectureInput(body: unknown): {
  data?: LectureInput;
  errors: ValidationErrors;
} {
  const errors: ValidationErrors = {};
  const source = (body ?? {}) as Record<string, unknown>;

  const title = requiredString(errors, "title", source.title, {
    label: "عنوان المحاضرة",
    max: 300,
  });

  // url is NOT NULL in the schema, so it is required.
  const url = requiredString(errors, "url", source.url, {
    label: "رابط المحاضرة",
    max: 1000,
  });

  const data: LectureInput = {
    title,
    url,
    lectureType: enumValue(
      errors,
      "lectureType",
      source.lectureType,
      LECTURE_TYPES,
      { label: "نوع المحاضرة", fallback: "محاضرة عامة" },
    ),
    channel: optionalString(source.channel, { max: 300 }),
    videoId: optionalString(source.videoId, { max: 200 }),
    duration: optionalString(source.duration, { max: 50 }),
    durationSeconds:
      source.durationSeconds === undefined || source.durationSeconds === ""
        ? undefined
        : integerValue(source.durationSeconds, { min: 0, fallback: 0 }),
    dateHijri: optionalString(source.dateHijri, { max: 50 }),
    dateGregorian: optionalString(source.dateGregorian, { max: 50 }),
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

  if (hasErrors(errors)) {
    return { errors };
  }

  return { data, errors };
}

// GET /api/admin/lectures
router.get("/", async (request: Request, response: Response) => {
  try {
    const search = optionalString(request.query.search);
    const publishStatus = optionalString(request.query.publishStatus);
    const lectureType = optionalString(request.query.lectureType);

    const conditions: SQL[] = [];

    if (search) {
      const pattern = `%${search}%`;
      const searchCondition = or(
        ilike(lectures.title, pattern),
        ilike(lectures.channel, pattern),
      );
      if (searchCondition) conditions.push(searchCondition);
    }

    if (
      publishStatus &&
      (PUBLISH_STATUSES as readonly string[]).includes(publishStatus)
    ) {
      conditions.push(eq(lectures.publishStatus, publishStatus as never));
    }

    if (
      lectureType &&
      (LECTURE_TYPES as readonly string[]).includes(lectureType)
    ) {
      conditions.push(eq(lectures.lectureType, lectureType as never));
    }

    const items = await db
      .select()
      .from(lectures)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(lectures.displayOrder, desc(lectures.createdAt));

    response.json({ ok: true, items, total: items.length });
  } catch (error) {
    logger.error({ err: error }, "Listing lectures failed");
    response.status(500).json({
      ok: false,
      error: "LIST_FAILED",
      message: "تعذر تحميل المحاضرات.",
    });
  }
});

// GET /api/admin/lectures/:id
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
      .from(lectures)
      .where(eq(lectures.id, id))
      .limit(1);

    if (!item) {
      response.status(404).json({
        ok: false,
        error: "NOT_FOUND",
        message: "المحاضرة غير موجودة.",
      });
      return;
    }

    response.json({ ok: true, item });
  } catch (error) {
    logger.error({ err: error }, "Reading lecture failed");
    response.status(500).json({
      ok: false,
      error: "READ_FAILED",
      message: "تعذر تحميل المحاضرة.",
    });
  }
});

// POST /api/admin/lectures
router.post("/", async (request: Request, response: Response) => {
  try {
    const { data, errors } = parseLectureInput(request.body);

    if (!data) {
      response.status(400).json({
        ok: false,
        error: "INVALID_INPUT",
        message: "تحقق من الحقول المدخلة.",
        fields: errors,
      });
      return;
    }

    const adminId = request.admin?.user.id ?? null;
    const isPublished = data.publishStatus === "منشور";

    const [item] = await db
      .insert(lectures)
      .values({
        title: data.title,
        lectureType: data.lectureType,
        channel: data.channel,
        videoId: data.videoId,
        url: data.url,
        duration: data.duration,
        durationSeconds: data.durationSeconds,
        dateHijri: data.dateHijri,
        dateGregorian: data.dateGregorian,
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
      entityType: "lecture",
      entityId: item.id,
      metadata: { title: item.title },
    });

    response.status(201).json({ ok: true, item });
  } catch (error) {
    logger.error({ err: error }, "Creating lecture failed");
    response.status(500).json({
      ok: false,
      error: "CREATE_FAILED",
      message: "تعذر إنشاء المحاضرة.",
    });
  }
});

// PATCH /api/admin/lectures/:id
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
      .from(lectures)
      .where(eq(lectures.id, id))
      .limit(1);

    if (!existing) {
      response.status(404).json({
        ok: false,
        error: "NOT_FOUND",
        message: "المحاضرة غير موجودة.",
      });
      return;
    }

    const { data, errors } = parseLectureInput(request.body);

    if (!data) {
      response.status(400).json({
        ok: false,
        error: "INVALID_INPUT",
        message: "تحقق من الحقول المدخلة.",
        fields: errors,
      });
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
      .update(lectures)
      .set({
        title: data.title,
        lectureType: data.lectureType,
        channel: data.channel,
        videoId: data.videoId,
        url: data.url,
        duration: data.duration,
        durationSeconds: data.durationSeconds,
        dateHijri: data.dateHijri,
        dateGregorian: data.dateGregorian,
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
      .where(eq(lectures.id, id))
      .returning();

    await writeAuditLog({
      request,
      action: "update",
      entityType: "lecture",
      entityId: id,
      metadata: { title: item.title },
    });

    response.json({ ok: true, item });
  } catch (error) {
    logger.error({ err: error }, "Updating lecture failed");
    response.status(500).json({
      ok: false,
      error: "UPDATE_FAILED",
      message: "تعذر تحديث المحاضرة.",
    });
  }
});

// DELETE /api/admin/lectures/:id
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
      .delete(lectures)
      .where(eq(lectures.id, id))
      .returning({ id: lectures.id, title: lectures.title });

    if (!deleted) {
      response.status(404).json({
        ok: false,
        error: "NOT_FOUND",
        message: "المحاضرة غير موجودة.",
      });
      return;
    }

    await writeAuditLog({
      request,
      action: "delete",
      entityType: "lecture",
      entityId: deleted.id,
      metadata: { title: deleted.title },
    });

    response.json({ ok: true, id: deleted.id });
  } catch (error) {
    logger.error({ err: error }, "Deleting lecture failed");
    response.status(500).json({
      ok: false,
      error: "DELETE_FAILED",
      message: "تعذر حذف المحاضرة.",
    });
  }
});

export default router;
