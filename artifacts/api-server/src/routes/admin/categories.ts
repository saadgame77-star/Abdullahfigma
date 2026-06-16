import { Router, type Request, type Response } from "express";
import { asc } from "drizzle-orm";
import { db, knowledgeCategories, knowledgeSubcategories } from "@workspace/db";
import { requireAdminSession } from "../../middleware/admin-auth";
import { logger } from "../../lib/logger";

const router = Router();

router.use(requireAdminSession);

// GET /api/admin/knowledge-categories — categories with nested subcategories,
// used to populate selects in the content forms.
router.get("/", async (_request: Request, response: Response) => {
  try {
    const [categories, subcategories] = await Promise.all([
      db
        .select({
          id: knowledgeCategories.id,
          name: knowledgeCategories.name,
          slug: knowledgeCategories.slug,
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

export default router;
