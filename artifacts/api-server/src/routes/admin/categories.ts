import { Router, type Request, type Response } from "express";
import { asc, eq } from "drizzle-orm";
import { db, knowledgeCategories, knowledgeSubcategories } from "@workspace/db";
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
  type ValidationErrors,
} from "../../lib/validate";

const router = Router();

router.use(requireAdminSession);

const PUBLISH_STATUSES = ["منشور", "مخفي", "مسودة"] as const;

type CategoryInput = {
  name: string;
  description: string | null;
  publishStatus: (typeof PUBLISH_STATUSES)[number];
  displayOrder: number;
  slug?: string;
};

function parseCategoryInput(body: unknown): {
  data?: CategoryInput;
  errors: ValidationErrors;
} {
  const errors: ValidationErrors = {};
  const source = (body ?? {}) as Record<string, unknown>;

  const name = requiredString(errors, "name", source.name, {
    label: "اسم التصنيف",
    max: 200,
  });

  const data: CategoryInput = {
    name,
    description: optionalString(source.description, { max: 1000 }) ?? null,
    publishStatus: enumValue(
      errors,
      "publishStatus",
      source.publishStatus,
      PUBLISH_STATUSES,
      { label: "حالة النشر", fallback: "منشور" },
    ),
    displayOrder: integerValue(source.displayOrder, { min: 0, fallback: 0 }),
    slug: optionalString(source.slug, { max: 200 }),
  };

  if (hasErrors(errors)) {
    return { errors };
  }

  return { data, errors };
}

// GET /api/admin/knowledge-categories — categories with nested subcategories.
router.get("/", async (_request: Request, response: Response) => {
  try {
    const [categories, subcategories] = await Promise.all([
      db
        .select({
          id: knowledgeCategories.id,
          name: knowledgeCategories.name,
          slug: knowledgeCategories.slug,
          description: knowledgeCategories.description,
          publishStatus: knowledgeCategories.publishStatus,
          displayOrder: knowledgeCategories.displayOrder,
        })
        .from(knowledgeCategories)
        .orderBy(asc(knowledgeCategories.displayOrder)),
      db
        .select({
          id: knowledgeSubcategories.id,
          categoryId: knowledgeSubcategories.categoryId,
          name: knowledgeSubcategories.name,
          slug: knowledgeSubcategories.slug,
          description: knowledgeSubcategories.description,
          publishStatus: knowledgeSubcategories.publishStatus,
          displayOrder: knowledgeSubcategories.displayOrder,
        })
        .from(knowledgeSubcategories)
        .orderBy(asc(knowledgeSubcategories.displayOrder)),
    ]);

    const items = categories.map((category) => ({
      ...category,
      subcategories: subcategories.filter(
        (sub) => sub.categoryId === category.id,
      ),
    }));

    response.json({ ok: true, items });
  } catch (error) {
    logger.error({ err: error }, "Listing knowledge categories failed");
    response.status(500).json({
      ok: false,
      error: "LIST_FAILED",
      message: "تعذر تحميل التصنيفات.",
    });
  }
});

// POST /api/admin/knowledge-categories — create a category.
router.post("/", async (request: Request, response: Response) => {
  try {
    const { data, errors } = parseCategoryInput(request.body);
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
      table: knowledgeCategories,
      slugColumn: knowledgeCategories.slug,
      idColumn: knowledgeCategories.id,
      desired: data.slug ?? data.name,
      fallback: data.name,
    });

    const [item] = await db
      .insert(knowledgeCategories)
      .values({
        name: data.name,
        slug,
        description: data.description,
        publishStatus: data.publishStatus,
        displayOrder: data.displayOrder,
      })
      .returning();

    await writeAuditLog({
      request,
      action: "create",
      entityType: "knowledge_category",
      entityId: item.id,
      metadata: { name: item.name },
    });

    response.status(201).json({ ok: true, item });
  } catch (error) {
    logger.error({ err: error }, "Creating knowledge category failed");
    response.status(500).json({
      ok: false,
      error: "CREATE_FAILED",
      message: "تعذر إنشاء التصنيف.",
    });
  }
});

// PATCH /api/admin/knowledge-categories/:id — update a category.
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
      .from(knowledgeCategories)
      .where(eq(knowledgeCategories.id, id))
      .limit(1);

    if (!existing) {
      response.status(404).json({
        ok: false,
        error: "NOT_FOUND",
        message: "التصنيف غير موجود.",
      });
      return;
    }

    const { data, errors } = parseCategoryInput(request.body);
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
      table: knowledgeCategories,
      slugColumn: knowledgeCategories.slug,
      idColumn: knowledgeCategories.id,
      desired: data.slug ?? existing.slug ?? data.name,
      fallback: data.name,
      excludeId: id,
    });

    const [item] = await db
      .update(knowledgeCategories)
      .set({
        name: data.name,
        slug,
        description: data.description,
        publishStatus: data.publishStatus,
        displayOrder: data.displayOrder,
      })
      .where(eq(knowledgeCategories.id, id))
      .returning();

    await writeAuditLog({
      request,
      action: "update",
      entityType: "knowledge_category",
      entityId: id,
      metadata: { name: item.name },
    });

    response.json({ ok: true, item });
  } catch (error) {
    logger.error({ err: error }, "Updating knowledge category failed");
    response.status(500).json({
      ok: false,
      error: "UPDATE_FAILED",
      message: "تعذر تحديث التصنيف.",
    });
  }
});

// DELETE /api/admin/knowledge-categories/:id — delete a category. Subcategories
// cascade; content rows keep their data but lose the category link (SET NULL).
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
      .delete(knowledgeCategories)
      .where(eq(knowledgeCategories.id, id))
      .returning({ id: knowledgeCategories.id, name: knowledgeCategories.name });

    if (!deleted) {
      response.status(404).json({
        ok: false,
        error: "NOT_FOUND",
        message: "التصنيف غير موجود.",
      });
      return;
    }

    await writeAuditLog({
      request,
      action: "delete",
      entityType: "knowledge_category",
      entityId: deleted.id,
      metadata: { name: deleted.name },
    });

    response.json({ ok: true, id: deleted.id });
  } catch (error) {
    logger.error({ err: error }, "Deleting knowledge category failed");
    response.status(500).json({
      ok: false,
      error: "DELETE_FAILED",
      message: "تعذر حذف التصنيف.",
    });
  }
});

/* -------------------------------------------------------------------------- */
/* Subcategories                                                              */
/* -------------------------------------------------------------------------- */

type SubcategoryInput = {
  name: string;
  description: string | null;
  publishStatus: (typeof PUBLISH_STATUSES)[number];
  displayOrder: number;
  slug?: string;
};

function parseSubcategoryInput(body: unknown): {
  data?: SubcategoryInput;
  errors: ValidationErrors;
} {
  const errors: ValidationErrors = {};
  const source = (body ?? {}) as Record<string, unknown>;

  const name = requiredString(errors, "name", source.name, {
    label: "اسم التصنيف الفرعي",
    max: 200,
  });

  const data: SubcategoryInput = {
    name,
    description: optionalString(source.description, { max: 1000 }) ?? null,
    publishStatus: enumValue(
      errors,
      "publishStatus",
      source.publishStatus,
      PUBLISH_STATUSES,
      { label: "حالة النشر", fallback: "منشور" },
    ),
    displayOrder: integerValue(source.displayOrder, { min: 0, fallback: 0 }),
    slug: optionalString(source.slug, { max: 200 }),
  };

  if (hasErrors(errors)) {
    return { errors };
  }

  return { data, errors };
}

// POST /api/admin/knowledge-categories/:id/subcategories — add a subcategory.
router.post(
  "/:id/subcategories",
  async (request: Request, response: Response) => {
    try {
      const { id } = request.params;
      if (!isUuid(id)) {
        response
          .status(400)
          .json({ ok: false, error: "INVALID_ID", message: "معرّف غير صالح." });
        return;
      }

      const [parent] = await db
        .select({ id: knowledgeCategories.id })
        .from(knowledgeCategories)
        .where(eq(knowledgeCategories.id, id))
        .limit(1);

      if (!parent) {
        response.status(404).json({
          ok: false,
          error: "NOT_FOUND",
          message: "التصنيف الأصل غير موجود.",
        });
        return;
      }

      const { data, errors } = parseSubcategoryInput(request.body);
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
        table: knowledgeSubcategories,
        slugColumn: knowledgeSubcategories.slug,
        idColumn: knowledgeSubcategories.id,
        desired: data.slug ?? data.name,
        fallback: data.name,
      });

      const [item] = await db
        .insert(knowledgeSubcategories)
        .values({
          categoryId: id,
          name: data.name,
          slug,
          description: data.description,
          publishStatus: data.publishStatus,
          displayOrder: data.displayOrder,
        })
        .returning();

      await writeAuditLog({
        request,
        action: "create",
        entityType: "knowledge_subcategory",
        entityId: item.id,
        metadata: { name: item.name, categoryId: id },
      });

      response.status(201).json({ ok: true, item });
    } catch (error) {
      logger.error({ err: error }, "Creating knowledge subcategory failed");
      response.status(500).json({
        ok: false,
        error: "CREATE_FAILED",
        message: "تعذر إنشاء التصنيف الفرعي.",
      });
    }
  },
);

// PATCH /api/admin/knowledge-categories/subcategories/:subId — update.
router.patch(
  "/subcategories/:subId",
  async (request: Request, response: Response) => {
    try {
      const { subId } = request.params;
      if (!isUuid(subId)) {
        response
          .status(400)
          .json({ ok: false, error: "INVALID_ID", message: "معرّف غير صالح." });
        return;
      }

      const [existing] = await db
        .select()
        .from(knowledgeSubcategories)
        .where(eq(knowledgeSubcategories.id, subId))
        .limit(1);

      if (!existing) {
        response.status(404).json({
          ok: false,
          error: "NOT_FOUND",
          message: "التصنيف الفرعي غير موجود.",
        });
        return;
      }

      const { data, errors } = parseSubcategoryInput(request.body);
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
        table: knowledgeSubcategories,
        slugColumn: knowledgeSubcategories.slug,
        idColumn: knowledgeSubcategories.id,
        desired: data.slug ?? existing.slug ?? data.name,
        fallback: data.name,
        excludeId: subId,
      });

      const [item] = await db
        .update(knowledgeSubcategories)
        .set({
          name: data.name,
          slug,
          description: data.description,
          publishStatus: data.publishStatus,
          displayOrder: data.displayOrder,
        })
        .where(eq(knowledgeSubcategories.id, subId))
        .returning();

      await writeAuditLog({
        request,
        action: "update",
        entityType: "knowledge_subcategory",
        entityId: subId,
        metadata: { name: item.name },
      });

      response.json({ ok: true, item });
    } catch (error) {
      logger.error({ err: error }, "Updating knowledge subcategory failed");
      response.status(500).json({
        ok: false,
        error: "UPDATE_FAILED",
        message: "تعذر تحديث التصنيف الفرعي.",
      });
    }
  },
);

// DELETE /api/admin/knowledge-categories/subcategories/:subId — delete.
router.delete(
  "/subcategories/:subId",
  async (request: Request, response: Response) => {
    try {
      const { subId } = request.params;
      if (!isUuid(subId)) {
        response
          .status(400)
          .json({ ok: false, error: "INVALID_ID", message: "معرّف غير صالح." });
        return;
      }

      const [deleted] = await db
        .delete(knowledgeSubcategories)
        .where(eq(knowledgeSubcategories.id, subId))
        .returning({
          id: knowledgeSubcategories.id,
          name: knowledgeSubcategories.name,
        });

      if (!deleted) {
        response.status(404).json({
          ok: false,
          error: "NOT_FOUND",
          message: "التصنيف الفرعي غير موجود.",
        });
        return;
      }

      await writeAuditLog({
        request,
        action: "delete",
        entityType: "knowledge_subcategory",
        entityId: deleted.id,
        metadata: { name: deleted.name },
      });

      response.json({ ok: true, id: deleted.id });
    } catch (error) {
      logger.error({ err: error }, "Deleting knowledge subcategory failed");
      response.status(500).json({
        ok: false,
        error: "DELETE_FAILED",
        message: "تعذر حذف التصنيف الفرعي.",
      });
    }
  },
);

export default router;
