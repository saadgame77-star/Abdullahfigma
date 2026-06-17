import { db, knowledgeCategories, knowledgeSubcategories } from "@workspace/db";

export type NameRef = { name: string; slug: string };

export type CategoryMaps = {
  categories: Map<string, NameRef>;
  subcategories: Map<string, NameRef>;
};

/**
 * Loads id → {name, slug} lookups for knowledge categories and subcategories
 * in two queries, so public content rows can be enriched with the human
 * readable names the public pages expect (knowledgeArea / subCategory).
 */
export async function loadCategoryMaps(): Promise<CategoryMaps> {
  const [cats, subs] = await Promise.all([
    db
      .select({
        id: knowledgeCategories.id,
        name: knowledgeCategories.name,
        slug: knowledgeCategories.slug,
      })
      .from(knowledgeCategories),
    db
      .select({
        id: knowledgeSubcategories.id,
        name: knowledgeSubcategories.name,
        slug: knowledgeSubcategories.slug,
      })
      .from(knowledgeSubcategories),
  ]);

  const categories = new Map<string, NameRef>();
  for (const row of cats) {
    categories.set(row.id, { name: row.name, slug: row.slug });
  }

  const subcategories = new Map<string, NameRef>();
  for (const row of subs) {
    subcategories.set(row.id, { name: row.name, slug: row.slug });
  }

  return { categories, subcategories };
}

/**
 * Resolves the trio of name fields the public UI uses for display, search and
 * filtering: the knowledge area (category name), the subcategory name, and a
 * combined "area / subcategory" label.
 */
export function resolveCategoryFields(
  maps: CategoryMaps,
  categoryId: string | null,
  subcategoryId: string | null,
): { knowledgeArea: string; subCategory: string; category: string } {
  const area = categoryId ? (maps.categories.get(categoryId)?.name ?? "") : "";
  const sub = subcategoryId
    ? (maps.subcategories.get(subcategoryId)?.name ?? "")
    : "";

  const category = sub ? `${area} / ${sub}`.trim() : area;

  return { knowledgeArea: area, subCategory: sub, category };
}
