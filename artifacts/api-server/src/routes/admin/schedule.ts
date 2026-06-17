import { Router, type Request, type Response } from "express";
import { and, asc, desc, eq, ilike, or, type SQL } from "drizzle-orm";
import { db, scheduleItems } from "@workspace/db";
import { requireAdminSession } from "../../middleware/admin-auth";
import { writeAuditLog } from "../../lib/audit";
import { logger } from "../../lib/logger";
import {
  booleanValue,
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

const SCHEDULE_KINDS = ["درس", "محاضرة", "برنامج", "لقاء"] as const;
const RECURRENCE_TYPES = [
  "غير متكرر",
  "أسبوعي",
  "شهري",
  "مخصص",
] as const;
const SCHEDULE_STATUSES = ["قائم", "متوقف", "مؤجل", "ملغي"] as const;
const PUBLISH_STATUSES = ["منشور", "مخفي", "مسودة"] as const;

type ScheduleInput = {
  title: string;
  scheduleKind: (typeof SCHEDULE_KINDS)[number];
  categoryId: string | null;
  subcategoryId: string | null;
  day?: string;
  time?: string;
  dateHijri?: string;
  dateGregorian?: string;
  location?: string;
  onlineUrl?: string;
  isRecurring: boolean;
  recurrenceType: (typeof RECURRENCE_TYPES)[number];
  recurrenceDetails?: string;
  status: (typeof SCHEDULE_STATUSES)[number];
  publishStatus: (typeof PUBLISH_STATUSES)[number];
  tags: string[];
  displayOrder: number;
  description: string;
  note?: string;
};

function parseScheduleInput(body: unknown): {
  data?: ScheduleInput;
  errors: ValidationErrors;
} {
  const errors: ValidationErrors = {};
  const source = (body ?? {}) as Record<string, unknown>;

  const title = requiredString(errors, "title", source.title, {
    label: "عنوان الموعد",
    max: 300,
  });

  const data: ScheduleInput = {
    title,
    scheduleKind: enumValue(
      errors,
      "scheduleKind",
      source.scheduleKind,
      SCHEDULE_KINDS,
      { label: "نوع الموعد", fallback: "درس" },
    ),
    categoryId: uuidOrNull(errors, "categoryId", source.categoryId, {
      label: "التصنيف",
    }),
    subcategoryId: uuidOrNull(errors, "subcategoryId", source.subcategoryId, {
      label: "التصنيف الفرعي",
    }),
    day: optionalString(source.day, { max: 100 }),
    time: optionalString(source.time, { max: 100 }),
    dateHijri: optionalString(source.dateHijri, { max: 50 }),
    dateGregorian: optionalString(source.dateGregorian, { max: 50 }),
    location: optionalString(source.location, { max: 300 }),
    onlineUrl: optionalString(source.onlineUrl, { max: 1000 }),
    isRecurring: booleanValue(source.isRecurring, { fallback: false }),
    recurrenceType: enumValue(
      errors,
      "recurrenceType",
      source.recurrenceType,
      RECURRENCE_TYPES,
      { label: "نوع التكرار", fallback: "غير متكرر" },
    ),
    recurrenceDetails: optionalString(source.recurrenceDetails, { max: 1000 }),
    status: enumValue(errors, "status", source.status, SCHEDULE_STATUSES, {
      label: "حالة الموعد",
      fallback: "قائم",
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
  };

  if (hasErrors(errors)) {
    return { errors };
  }

  return { data, errors };
}

// GET /api/admin/schedule — list with optional search + status filters.
router.get("/", async (request: Request, response: Response) => {
  try {
    const search = optionalString(request.query.search);
    const publishStatus = optionalString(request.query.publishStatus);
    const status = optionalString(request.query.status);

    const conditions: SQL[] = [];

    if (search) {
      const pattern = `%${search}%`;
      const searchCondition = or(
        ilike(scheduleItems.title, pattern),
        ilike(scheduleItems.location, pattern),
      );
      if (searchCondition) conditions.push(searchCondition);
    }

    if (
      publishStatus &&
      (PUBLISH_STATUSES as readonly string[]).includes(publishStatus)
    ) {
      conditions.push(eq(scheduleItems.publishStatus, publishStatus as never));
    }

    if (status && (SCHEDULE_STATUSES as readonly string[]).includes(status)) {
      conditions.push(eq(scheduleItems.status, status as never));
    }

    const items = await db
      .select()
      .from(scheduleItems)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(asc(scheduleItems.displayOrder), desc(scheduleItems.createdAt));

    response.json({ ok: true, items, total: items.length });
  } catch (error) {
    logger.error({ err: error }, "Listing schedule items failed");
    response.status(500).json({
      ok: false,
      error: "LIST_FAILED",
      message: "تعذر تحميل الجدول.",
    });
  }
});

// GET /api/admin/schedule/:id
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
      .from(scheduleItems)
      .where(eq(scheduleItems.id, id))
      .limit(1);

    if (!item) {
      response.status(404).json({
        ok: false,
        error: "NOT_FOUND",
        message: "الموعد غير موجود.",
      });
      return;
    }

    response.json({ ok: true, item });
  } catch (error) {
    logger.error({ err: error }, "Reading schedule item failed");
    response.status(500).json({
      ok: false,
      error: "READ_FAILED",
      message: "تعذر تحميل الموعد.",
    });
  }
});

// POST /api/admin/schedule
router.post("/", async (request: Request, response: Response) => {
  try {
    const { data, errors } = parseScheduleInput(request.body);

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

    const [item] = await db
      .insert(scheduleItems)
      .values({
        title: data.title,
        scheduleKind: data.scheduleKind,
        categoryId: data.categoryId,
        subcategoryId: data.subcategoryId,
        day: data.day,
        time: data.time,
        dateHijri: data.dateHijri,
        dateGregorian: data.dateGregorian,
        location: data.location,
        onlineUrl: data.onlineUrl,
        isRecurring: data.isRecurring,
        recurrenceType: data.recurrenceType,
        recurrenceDetails: data.recurrenceDetails,
        status: data.status,
        publishStatus: data.publishStatus,
        tags: data.tags,
        displayOrder: data.displayOrder,
        description: data.description,
        note: data.note,
        createdByUserId: adminId,
        updatedByUserId: adminId,
      })
      .returning();

    await writeAuditLog({
      request,
      action: "create",
      entityType: "schedule_item",
      entityId: item.id,
      metadata: { title: item.title },
    });

    response.status(201).json({ ok: true, item });
  } catch (error) {
    logger.error({ err: error }, "Creating schedule item failed");
    response.status(500).json({
      ok: false,
      error: "CREATE_FAILED",
      message: "تعذر إنشاء الموعد.",
    });
  }
});

// PATCH /api/admin/schedule/:id
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
      .from(scheduleItems)
      .where(eq(scheduleItems.id, id))
      .limit(1);

    if (!existing) {
      response.status(404).json({
        ok: false,
        error: "NOT_FOUND",
        message: "الموعد غير موجود.",
      });
      return;
    }

    const { data, errors } = parseScheduleInput(request.body);

    if (!data) {
      response.status(400).json({
        ok: false,
        error: "INVALID_INPUT",
        message: "تحقق من الحقول المدخلة.",
        fields: errors,
      });
      return;
    }

    const [item] = await db
      .update(scheduleItems)
      .set({
        title: data.title,
        scheduleKind: data.scheduleKind,
        categoryId: data.categoryId,
        subcategoryId: data.subcategoryId,
        day: data.day,
        time: data.time,
        dateHijri: data.dateHijri,
        dateGregorian: data.dateGregorian,
        location: data.location,
        onlineUrl: data.onlineUrl,
        isRecurring: data.isRecurring,
        recurrenceType: data.recurrenceType,
        recurrenceDetails: data.recurrenceDetails,
        status: data.status,
        publishStatus: data.publishStatus,
        tags: data.tags,
        displayOrder: data.displayOrder,
        description: data.description,
        note: data.note,
        updatedByUserId: request.admin?.user.id ?? null,
      })
      .where(eq(scheduleItems.id, id))
      .returning();

    await writeAuditLog({
      request,
      action: "update",
      entityType: "schedule_item",
      entityId: id,
      metadata: { title: item.title },
    });

    response.json({ ok: true, item });
  } catch (error) {
    logger.error({ err: error }, "Updating schedule item failed");
    response.status(500).json({
      ok: false,
      error: "UPDATE_FAILED",
      message: "تعذر تحديث الموعد.",
    });
  }
});

// DELETE /api/admin/schedule/:id
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
      .delete(scheduleItems)
      .where(eq(scheduleItems.id, id))
      .returning({ id: scheduleItems.id, title: scheduleItems.title });

    if (!deleted) {
      response.status(404).json({
        ok: false,
        error: "NOT_FOUND",
        message: "الموعد غير موجود.",
      });
      return;
    }

    await writeAuditLog({
      request,
      action: "delete",
      entityType: "schedule_item",
      entityId: deleted.id,
      metadata: { title: deleted.title },
    });

    response.json({ ok: true, id: deleted.id });
  } catch (error) {
    logger.error({ err: error }, "Deleting schedule item failed");
    response.status(500).json({
      ok: false,
      error: "DELETE_FAILED",
      message: "تعذر حذف الموعد.",
    });
  }
});

export default router;
