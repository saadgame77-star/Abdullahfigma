import { Router, type Request, type Response } from "express";
import { and, asc, desc, eq, ilike, or, type SQL } from "drizzle-orm";
import { db, miscSections, miscItems } from "@workspace/db";
import { requireAdminSession } from "../../middleware/admin-auth";
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

router.use(requireAdminSession);

const PUBLISH_STATUSES = ["منشور", "مخفي", "مسودة"] as const;
const TRUST_LEVELS = ["عالٍ", "متوسط"] as const;
const SECTION_ICONS = ["audio", "video", "file", "mic", "book"] as const;

/* -------------------------------------------------------------------------- */
/* Misc sections                                                              */
/* -------------------------------------------------------------------------- */

type SectionInput = {
  title: string;
  slug?: string;
  description: string;
  icon: (typeof SECTION_ICONS)[number];
  publishStatus: (typeof PUBLISH_STATUSES)[number];
  displayOrder: number;
};

function parseSectionInput(body: unknown): {
  data?: SectionInput;
  errors: ValidationErrors;
} {
  const errors: ValidationErrors = {};
  const source = (body ?? {}) as Record<string, unknown>;

  const title = requiredString(errors, "title", source.title, {
    label: "عنوان القسم",
    max: 300,
  });

  const data: SectionInput = {
    title,
    slug: optionalString(source.slug, { max: 300 }),
    description: optionalString(source.description, { max: 2000 }) ?? "",
    icon: enumValue(errors, "icon", source.icon, SECTION_ICONS, {
      label: "أيقونة القسم",
      fallback: "file",
    }),
    publishStatus: enumValue(
      errors,
      "publishStatus",
      source.publishStatus,
      PUBLISH_STATUSES,
      { label: "حالة النشر", fallback: "منشور" },
    ),
    displayOrder: integerValue(source.displayOrder, { min: 0, fallback: 0 }),
  };

  if (hasErrors(errors)) {
    return { errors };
  }

  return { data, errors };
}

// GET /api/admin/misc/sections
router.get("/sections", async (request: Request, response: Response) => {
  try {
    const search = optionalString(request.query.search);
    const conditions: SQL[] = [];

    if (search) {
      const pattern = `%${search}%`;
      const searchCondition = or(
        ilike(miscSections.title, pattern),
        ilike(miscSections.description, pattern),
      );
      if (searchCondition) conditions.push(searchCondition);
    }

    const items = await db
      .select()
      .from(miscSections)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(asc(miscSections.displayOrder), desc(miscSections.createdAt));

    response.json({ ok: true, items, total: items.length });
  } catch (error) {
    logger.error({ err: error }, "Listing misc sections failed");
    response.status(500).json({
      ok: false,
      error: "LIST_FAILED",
      message: "تعذر تحميل أقسام المتفرقات.",
    });
  }
});

// POST /api/admin/misc/sections
router.post("/sections", async (request: Request, response: Response) => {
  try {
    const { data, errors } = parseSectionInput(request.body);

    if (!data) {
      response.status(400).json({
        ok: false,
        error: "INVALID_INPUT",
        message: "تحقق من الحقول المدخلة.",
        fields: errors,
      });
      return;
    }

    const slug = await ensureUniqueSlug({
      table: miscSections,
      slugColumn: miscSections.slug,
      idColumn: miscSections.id,
      desired: data.slug ?? data.title,
      fallback: data.title,
    });

    const [item] = await db
      .insert(miscSections)
      .values({
        title: data.title,
        slug,
        description: data.description,
        icon: data.icon,
        publishStatus: data.publishStatus,
        displayOrder: data.displayOrder,
      })
      .returning();

    await writeAuditLog({
      request,
      action: "create",
      entityType: "misc_section",
      entityId: item.id,
      metadata: { title: item.title },
    });

    response.status(201).json({ ok: true, item });
  } catch (error) {
    logger.error({ err: error }, "Creating misc section failed");
    response.status(500).json({
      ok: false,
      error: "CREATE_FAILED",
      message: "تعذر إنشاء القسم.",
    });
  }
});

// PATCH /api/admin/misc/sections/:id
router.patch("/sections/:id", async (request: Request, response: Response) => {
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
      .from(miscSections)
      .where(eq(miscSections.id, id))
      .limit(1);

    if (!existing) {
      response.status(404).json({
        ok: false,
        error: "NOT_FOUND",
        message: "القسم غير موجود.",
      });
      return;
    }

    const { data, errors } = parseSectionInput(request.body);

    if (!data) {
      response.status(400).json({
        ok: false,
        error: "INVALID_INPUT",
        message: "تحقق من الحقول المدخلة.",
        fields: errors,
      });
      return;
    }

    const slug = await ensureUniqueSlug({
      table: miscSections,
      slugColumn: miscSections.slug,
      idColumn: miscSections.id,
      desired: data.slug ?? existing.slug ?? data.title,
      fallback: data.title,
      excludeId: id,
    });

    const [item] = await db
      .update(miscSections)
      .set({
        title: data.title,
        slug,
        description: data.description,
        icon: data.icon,
        publishStatus: data.publishStatus,
        displayOrder: data.displayOrder,
      })
      .where(eq(miscSections.id, id))
      .returning();

    await writeAuditLog({
      request,
      action: "update",
      entityType: "misc_section",
      entityId: id,
      metadata: { title: item.title },
    });

    response.json({ ok: true, item });
  } catch (error) {
    logger.error({ err: error }, "Updating misc section failed");
    response.status(500).json({
      ok: false,
      error: "UPDATE_FAILED",
      message: "تعذر تحديث القسم.",
    });
  }
});

// DELETE /api/admin/misc/sections/:id
router.delete("/sections/:id", async (request: Request, response: Response) => {
  try {
    const { id } = request.params;

    if (!isUuid(id)) {
      response
        .status(400)
        .json({ ok: false, error: "INVALID_ID", message: "معرّف غير صالح." });
      return;
    }

    // Items reference the section with ON DELETE SET NULL, so deleting a
    // section keeps its items but detaches them.
    const [deleted] = await db
      .delete(miscSections)
      .where(eq(miscSections.id, id))
      .returning({ id: miscSections.id, title: miscSections.title });

    if (!deleted) {
      response.status(404).json({
        ok: false,
        error: "NOT_FOUND",
        message: "القسم غير موجود.",
      });
      return;
    }

    await writeAuditLog({
      request,
      action: "delete",
      entityType: "misc_section",
      entityId: deleted.id,
      metadata: { title: deleted.title },
    });

    response.json({ ok: true, id: deleted.id });
  } catch (error) {
    logger.error({ err: error }, "Deleting misc section failed");
    response.status(500).json({
      ok: false,
      error: "DELETE_FAILED",
      message: "تعذر حذف القسم.",
    });
  }
});

/* -------------------------------------------------------------------------- */
/* Misc items                                                                 */
/* -------------------------------------------------------------------------- */

type ItemInput = {
  sectionId: string | null;
  title: string;
  kind: string;
  categoryId: string | null;
  subcategoryId: string | null;
  duration?: string;
  audioUrl?: string;
  videoId?: string;
  videoUrl?: string;
  fileUrl?: string;
  externalUrl?: string;
  thumbnailUrl?: string;
  downloadLabel?: string;
  trust: (typeof TRUST_LEVELS)[number];
  publishStatus: (typeof PUBLISH_STATUSES)[number];
  tags: string[];
  displayOrder: number;
  description: string;
  note?: string;
};

function parseItemInput(body: unknown): {
  data?: ItemInput;
  errors: ValidationErrors;
} {
  const errors: ValidationErrors = {};
  const source = (body ?? {}) as Record<string, unknown>;

  const title = requiredString(errors, "title", source.title, {
    label: "عنوان العنصر",
    max: 300,
  });

  const kind = requiredString(errors, "kind", source.kind, {
    label: "نوع العنصر",
    max: 100,
  });

  const data: ItemInput = {
    title,
    kind,
    sectionId: uuidOrNull(errors, "sectionId", source.sectionId, {
      label: "القسم",
    }),
    categoryId: uuidOrNull(errors, "categoryId", source.categoryId, {
      label: "التصنيف",
    }),
    subcategoryId: uuidOrNull(errors, "subcategoryId", source.subcategoryId, {
      label: "التصنيف الفرعي",
    }),
    duration: optionalString(source.duration, { max: 50 }),
    audioUrl: optionalString(source.audioUrl, { max: 1000 }),
    videoId: optionalString(source.videoId, { max: 200 }),
    videoUrl: optionalString(source.videoUrl, { max: 1000 }),
    fileUrl: optionalString(source.fileUrl, { max: 1000 }),
    externalUrl: optionalString(source.externalUrl, { max: 1000 }),
    thumbnailUrl: optionalString(source.thumbnailUrl, { max: 1000 }),
    downloadLabel: optionalString(source.downloadLabel, { max: 200 }),
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
  };

  if (hasErrors(errors)) {
    return { errors };
  }

  return { data, errors };
}

// GET /api/admin/misc/items
router.get("/items", async (request: Request, response: Response) => {
  try {
    const search = optionalString(request.query.search);
    const publishStatus = optionalString(request.query.publishStatus);
    const sectionId = optionalString(request.query.sectionId);

    const conditions: SQL[] = [];

    if (search) {
      const pattern = `%${search}%`;
      const searchCondition = or(
        ilike(miscItems.title, pattern),
        ilike(miscItems.kind, pattern),
      );
      if (searchCondition) conditions.push(searchCondition);
    }

    if (
      publishStatus &&
      (PUBLISH_STATUSES as readonly string[]).includes(publishStatus)
    ) {
      conditions.push(eq(miscItems.publishStatus, publishStatus as never));
    }

    if (sectionId && isUuid(sectionId)) {
      conditions.push(eq(miscItems.sectionId, sectionId));
    }

    const items = await db
      .select()
      .from(miscItems)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(asc(miscItems.displayOrder), desc(miscItems.createdAt));

    response.json({ ok: true, items, total: items.length });
  } catch (error) {
    logger.error({ err: error }, "Listing misc items failed");
    response.status(500).json({
      ok: false,
      error: "LIST_FAILED",
      message: "تعذر تحميل عناصر المتفرقات.",
    });
  }
});

// GET /api/admin/misc/items/:id
router.get("/items/:id", async (request: Request, response: Response) => {
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
      .from(miscItems)
      .where(eq(miscItems.id, id))
      .limit(1);

    if (!item) {
      response.status(404).json({
        ok: false,
        error: "NOT_FOUND",
        message: "العنصر غير موجود.",
      });
      return;
    }

    response.json({ ok: true, item });
  } catch (error) {
    logger.error({ err: error }, "Reading misc item failed");
    response.status(500).json({
      ok: false,
      error: "READ_FAILED",
      message: "تعذر تحميل العنصر.",
    });
  }
});

// POST /api/admin/misc/items
router.post("/items", async (request: Request, response: Response) => {
  try {
    const { data, errors } = parseItemInput(request.body);

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
      .insert(miscItems)
      .values({
        sectionId: data.sectionId,
        title: data.title,
        kind: data.kind,
        categoryId: data.categoryId,
        subcategoryId: data.subcategoryId,
        duration: data.duration,
        audioUrl: data.audioUrl,
        videoId: data.videoId,
        videoUrl: data.videoUrl,
        fileUrl: data.fileUrl,
        externalUrl: data.externalUrl,
        thumbnailUrl: data.thumbnailUrl,
        downloadLabel: data.downloadLabel,
        trust: data.trust,
        publishStatus: data.publishStatus,
        tags: data.tags,
        displayOrder: data.displayOrder,
        description: data.description,
        note: data.note,
        createdByUserId: adminId,
        updatedByUserId: adminId,
        publishedAt: isPublished ? new Date() : null,
      })
      .returning();

    await writeAuditLog({
      request,
      action: "create",
      entityType: "misc_item",
      entityId: item.id,
      metadata: { title: item.title },
    });

    response.status(201).json({ ok: true, item });
  } catch (error) {
    logger.error({ err: error }, "Creating misc item failed");
    response.status(500).json({
      ok: false,
      error: "CREATE_FAILED",
      message: "تعذر إنشاء العنصر.",
    });
  }
});

// PATCH /api/admin/misc/items/:id
router.patch("/items/:id", async (request: Request, response: Response) => {
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
      .from(miscItems)
      .where(eq(miscItems.id, id))
      .limit(1);

    if (!existing) {
      response.status(404).json({
        ok: false,
        error: "NOT_FOUND",
        message: "العنصر غير موجود.",
      });
      return;
    }

    const { data, errors } = parseItemInput(request.body);

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
      .update(miscItems)
      .set({
        sectionId: data.sectionId,
        title: data.title,
        kind: data.kind,
        categoryId: data.categoryId,
        subcategoryId: data.subcategoryId,
        duration: data.duration,
        audioUrl: data.audioUrl,
        videoId: data.videoId,
        videoUrl: data.videoUrl,
        fileUrl: data.fileUrl,
        externalUrl: data.externalUrl,
        thumbnailUrl: data.thumbnailUrl,
        downloadLabel: data.downloadLabel,
        trust: data.trust,
        publishStatus: data.publishStatus,
        tags: data.tags,
        displayOrder: data.displayOrder,
        description: data.description,
        note: data.note,
        updatedByUserId: request.admin?.user.id ?? null,
        publishedAt,
      })
      .where(eq(miscItems.id, id))
      .returning();

    await writeAuditLog({
      request,
      action: "update",
      entityType: "misc_item",
      entityId: id,
      metadata: { title: item.title },
    });

    response.json({ ok: true, item });
  } catch (error) {
    logger.error({ err: error }, "Updating misc item failed");
    response.status(500).json({
      ok: false,
      error: "UPDATE_FAILED",
      message: "تعذر تحديث العنصر.",
    });
  }
});

// DELETE /api/admin/misc/items/:id
router.delete("/items/:id", async (request: Request, response: Response) => {
  try {
    const { id } = request.params;

    if (!isUuid(id)) {
      response
        .status(400)
        .json({ ok: false, error: "INVALID_ID", message: "معرّف غير صالح." });
      return;
    }

    const [deleted] = await db
      .delete(miscItems)
      .where(eq(miscItems.id, id))
      .returning({ id: miscItems.id, title: miscItems.title });

    if (!deleted) {
      response.status(404).json({
        ok: false,
        error: "NOT_FOUND",
        message: "العنصر غير موجود.",
      });
      return;
    }

    await writeAuditLog({
      request,
      action: "delete",
      entityType: "misc_item",
      entityId: deleted.id,
      metadata: { title: deleted.title },
    });

    response.json({ ok: true, id: deleted.id });
  } catch (error) {
    logger.error({ err: error }, "Deleting misc item failed");
    response.status(500).json({
      ok: false,
      error: "DELETE_FAILED",
      message: "تعذر حذف العنصر.",
    });
  }
});

export default router;
