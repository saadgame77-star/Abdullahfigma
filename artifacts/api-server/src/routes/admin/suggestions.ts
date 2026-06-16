import { Router, type Request, type Response } from "express";
import { eq, isNotNull } from "drizzle-orm";
import {
  db,
  knowledgeCategories,
  knowledgeSubcategories,
  lectures,
  scientificSeries,
  shortClips,
  words,
} from "@workspace/db";
import { requireAdminSession } from "../../middleware/admin-auth";
import { optionalString } from "../../lib/validate";
import { logger } from "../../lib/logger";

const router = Router();

router.use(requireAdminSession);

// Common Arabic/structural words that carry no categorization signal.
const STOPWORDS = new Set([
  "في",
  "من",
  "على",
  "عن",
  "إلى",
  "الى",
  "مع",
  "شرح",
  "التعليق",
  "تعليق",
  "كتاب",
  "باب",
  "درس",
  "الدرس",
  "محاضرة",
  "سلسلة",
  "الشيخ",
  "بن",
  "آل",
  "أبي",
  "ابن",
  "the",
  "and",
  "of",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 3 && !STOPWORDS.has(t));
}

function normalizeChannel(value: string | null | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

type CandidateRow = {
  title: string;
  channel: string | null;
  categoryId: string | null;
  subcategoryId: string | null;
  tags: string[];
};

// GET /api/admin/suggest-category?title=...&channel=...&tags=a,b
router.get("/", async (request: Request, response: Response) => {
  try {
    const title = optionalString(request.query.title) ?? "";
    const channel = optionalString(request.query.channel) ?? "";
    const tagsParam = optionalString(request.query.tags) ?? "";

    const inputTokens = new Set(tokenize(title));
    const inputChannel = normalizeChannel(channel);
    const inputTags = new Set(
      tagsParam
        .split(/[،,]/)
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean),
    );

    if (inputTokens.size === 0 && !inputChannel) {
      response.json({ ok: true, suggestion: null });
      return;
    }

    // Pull categorized history from the content tables that carry a channel.
    const selectShape = {
      title: scientificSeries.title,
      channel: scientificSeries.channel,
      categoryId: scientificSeries.categoryId,
      subcategoryId: scientificSeries.subcategoryId,
      tags: scientificSeries.tags,
    } as const;

    const [seriesRows, lectureRows, wordRows, shortRows] = await Promise.all([
      db
        .select(selectShape)
        .from(scientificSeries)
        .where(isNotNull(scientificSeries.categoryId)),
      db
        .select({
          title: lectures.title,
          channel: lectures.channel,
          categoryId: lectures.categoryId,
          subcategoryId: lectures.subcategoryId,
          tags: lectures.tags,
        })
        .from(lectures)
        .where(isNotNull(lectures.categoryId)),
      db
        .select({
          title: words.title,
          channel: words.channel,
          categoryId: words.categoryId,
          subcategoryId: words.subcategoryId,
          tags: words.tags,
        })
        .from(words)
        .where(isNotNull(words.categoryId)),
      db
        .select({
          title: shortClips.title,
          channel: shortClips.channel,
          categoryId: shortClips.categoryId,
          subcategoryId: shortClips.subcategoryId,
          tags: shortClips.tags,
        })
        .from(shortClips)
        .where(isNotNull(shortClips.categoryId)),
    ]);

    const rows: CandidateRow[] = [
      ...seriesRows,
      ...lectureRows,
      ...wordRows,
      ...shortRows,
    ];

    if (rows.length === 0) {
      response.json({ ok: true, suggestion: null });
      return;
    }

    // Score each historical row, then aggregate by category.
    type Agg = {
      score: number;
      channelMatched: boolean;
      subScores: Map<string, number>;
    };
    const byCategory = new Map<string, Agg>();

    for (const row of rows) {
      if (!row.categoryId) continue;

      let score = 0;
      const channelMatched =
        Boolean(inputChannel) && normalizeChannel(row.channel) === inputChannel;
      if (channelMatched) score += 6;

      const rowTokens = tokenize(row.title);
      for (const tok of rowTokens) {
        if (inputTokens.has(tok)) score += 2;
      }

      if (inputTags.size > 0) {
        for (const tag of row.tags) {
          if (inputTags.has(tag.trim().toLowerCase())) score += 1;
        }
      }

      if (score <= 0) continue;

      const agg =
        byCategory.get(row.categoryId) ??
        { score: 0, channelMatched: false, subScores: new Map() };
      agg.score += score;
      agg.channelMatched = agg.channelMatched || channelMatched;
      if (row.subcategoryId) {
        agg.subScores.set(
          row.subcategoryId,
          (agg.subScores.get(row.subcategoryId) ?? 0) + score,
        );
      }
      byCategory.set(row.categoryId, agg);
    }

    if (byCategory.size === 0) {
      response.json({ ok: true, suggestion: null });
      return;
    }

    const ranked = [...byCategory.entries()].sort(
      (a, b) => b[1].score - a[1].score,
    );
    const [topCategoryId, top] = ranked[0];
    const secondScore = ranked[1]?.[1].score ?? 0;

    // Pick the dominant subcategory within the winning category.
    let topSubcategoryId: string | null = null;
    if (top.subScores.size > 0) {
      topSubcategoryId = [...top.subScores.entries()].sort(
        (a, b) => b[1] - a[1],
      )[0][0];
    }

    // Confidence heuristic: channel match is a strong signal; a clear margin
    // over the runner-up raises confidence further.
    let confidence = 30;
    if (top.channelMatched) confidence += 45;
    confidence += Math.min(20, (top.score - secondScore) * 5);
    confidence = Math.max(0, Math.min(95, confidence));

    // Resolve names for display.
    const [category] = await db
      .select({ name: knowledgeCategories.name })
      .from(knowledgeCategories)
      .where(eq(knowledgeCategories.id, topCategoryId))
      .limit(1);

    let subcategoryName: string | null = null;
    if (topSubcategoryId) {
      const [sub] = await db
        .select({ name: knowledgeSubcategories.name })
        .from(knowledgeSubcategories)
        .where(eq(knowledgeSubcategories.id, topSubcategoryId))
        .limit(1);
      subcategoryName = sub?.name ?? null;
    }

    response.json({
      ok: true,
      suggestion: {
        categoryId: topCategoryId,
        categoryName: category?.name ?? null,
        subcategoryId: topSubcategoryId,
        subcategoryName,
        confidence,
      },
    });
  } catch (error) {
    logger.error({ err: error }, "Suggesting category failed");
    response.status(500).json({
      ok: false,
      error: "SUGGEST_FAILED",
      message: "تعذّر اقتراح التصنيف.",
    });
  }
});

export default router;
