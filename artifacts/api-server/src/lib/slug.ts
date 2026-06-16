import { and, eq, ne, type SQL } from "drizzle-orm";
import type { PgColumn, PgTable } from "drizzle-orm/pg-core";
import { db } from "@workspace/db";

/**
 * Builds a URL-friendly slug. Keeps Arabic and Latin letters/numbers and
 * collapses whitespace/punctuation into single hyphens.
 */
export function slugify(input: string): string {
  return input
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    // Keep unicode letters/numbers and hyphen, drop everything else.
    .replace(/[^\p{L}\p{N}-]+/gu, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Returns a slug that is unique within the given table column.
 * Appends -2, -3, ... when collisions are found. When `excludeId` is provided
 * (updates), the row being edited is ignored during the uniqueness check.
 */
export async function ensureUniqueSlug(params: {
  table: PgTable;
  slugColumn: PgColumn;
  idColumn: PgColumn;
  desired: string;
  fallback: string;
  excludeId?: string;
}): Promise<string> {
  const { table, slugColumn, idColumn, desired, fallback, excludeId } = params;

  const cleaned = slugify(desired) || slugify(fallback) || `item-${Date.now()}`;

  let candidate = cleaned;
  let counter = 1;

  // Cap attempts defensively; in practice this resolves in a couple of tries.
  while (counter < 1000) {
    const conditions: SQL[] = [eq(slugColumn, candidate)];

    if (excludeId) {
      conditions.push(ne(idColumn, excludeId));
    }

    const [existing] = await db
      .select({ id: idColumn })
      .from(table)
      .where(and(...conditions))
      .limit(1);

    if (!existing) {
      return candidate;
    }

    counter += 1;
    candidate = `${cleaned}-${counter}`;
  }

  return `${cleaned}-${Date.now()}`;
}
