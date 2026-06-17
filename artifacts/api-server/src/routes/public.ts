import { Router, type Request, type Response } from "express";
import { asc, eq, inArray } from "drizzle-orm";
import {
  db,
  knowledgeCategories,
  knowledgeSubcategories,
  lectures,
  miscItems,
  miscSections,
  scheduleItems,
  scientificSeries,
  seriesVideos,
  shortClips,
  words,
} from "@workspace/db";
import { logger } from "../lib/logger";
import { loadCategoryMaps, resolveCategoryFields } from "../lib/categoryMap";

const router = Router();

const PUBLISHED = "منشور" as const;

function fail(response: Response, message: string) {
  response
    .status(500)
    .json({ ok: false, error: "PUBLIC_READ_FAILED", message });
}

// GET /api/public/categories — knowledge areas + subcategories for filters.
router.get("/categories", async (_request: Request, response: Response) => {
  try {
    const [cats, subs] = await Promise.all([
      db
        .select({
          id: knowledgeCategories.id,
          name: knowledgeCategories.name,
          slug: knowledgeCategories.slug,
          description: knowledgeCategories.description,
          displayOrder: knowledgeCategories.displayOrder,
        })
        .from(knowledgeCategories)
        .where(eq(knowledgeCategories.publishStatus, PUBLISHED))
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
        .where(eq(knowledgeSubcategories.publishStatus, PUBLISHED))
        .orderBy(asc(knowledgeSubcategories.displayOrder)),
    ]);

    const items = cats.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description ?? "",
      displayOrder: cat.displayOrder,
      children: subs
        .filter((sub) => sub.categoryId === cat.id)
        .map((sub) => ({ id: sub.id, name: sub.name, slug: sub.slug })),
    }));

    response.json({ ok: true, items });
  } catch (error) {
    logger.error({ err: error }, "Public categories read failed");
    fail(response, "تعذر تحميل التصنيفات.");
  }
});

// GET /api/public/series — published scientific series with their videos.
router.get("/series", async (_request: Request, response: Response) => {
  try {
    const maps = await loadCategoryMaps();

    const rows = await db
      .select()
      .from(scientificSeries)
      .where(eq(scientificSeries.publishStatus, PUBLISHED))
      .orderBy(asc(scientificSeries.displayOrder));

    const seriesIds = rows.map((row) => row.id);
    const videos = seriesIds.length
      ? await db
          .select()
          .from(seriesVideos)
          .where(
            inArray(seriesVideos.seriesId, seriesIds),
          )
          .orderBy(asc(seriesVideos.lessonOrder))
      : [];

    const videosBySeries = new Map<string, typeof videos>();
    for (const video of videos) {
      if (video.publishStatus !== PUBLISHED) continue;
      const list = videosBySeries.get(video.seriesId) ?? [];
      list.push(video);
      videosBySeries.set(video.seriesId, list);
    }

    const items = rows.map((row) => {
      const names = resolveCategoryFields(maps, row.categoryId, row.subcategoryId);
      const seriesVideoList = (videosBySeries.get(row.id) ?? []).map((video) => ({
        id: video.id,
        title: video.title,
        videoId: video.videoId ?? "",
        duration: video.duration ?? undefined,
        displayOrder: video.lessonOrder,
      }));

      const videoCount = row.videoCount || seriesVideoList.length;

      return {
        id: row.id,
        title: row.title,
        bookTitle: row.bookTitle ?? undefined,
        channel: row.channel ?? "",
        count: `${videoCount} فيديو`,
        videoCount,
        category: names.category,
        knowledgeArea: names.knowledgeArea,
        subCategory: names.subCategory,
        section: names.knowledgeArea,
        playlistId: row.playlistId ?? "",
        url: row.url ?? "",
        trust: row.trust,
        status: row.status,
        statusLabel: row.status === "مكتملة" ? "مكتملة" : "قيد الاكتمال",
        publishStatus: row.publishStatus,
        tags: row.tags,
        displayOrder: row.displayOrder,
        description: row.description,
        videos: seriesVideoList,
        note: row.note ?? undefined,
      };
    });

    response.json({ ok: true, items });
  } catch (error) {
    logger.error({ err: error }, "Public series read failed");
    fail(response, "تعذر تحميل السلاسل العلمية.");
  }
});

// GET /api/public/lectures — published lectures.
router.get("/lectures", async (_request: Request, response: Response) => {
  try {
    const maps = await loadCategoryMaps();

    const rows = await db
      .select()
      .from(lectures)
      .where(eq(lectures.publishStatus, PUBLISHED))
      .orderBy(asc(lectures.displayOrder));

    const items = rows.map((row) => {
      const names = resolveCategoryFields(maps, row.categoryId, row.subcategoryId);
      return {
        id: row.id,
        title: row.title,
        lectureType: row.lectureType,
        knowledgeArea: names.knowledgeArea,
        subCategory: names.subCategory,
        category: names.category,
        duration: row.duration ?? "",
        durationSeconds: row.durationSeconds ?? undefined,
        dateHijri: row.dateHijri ?? undefined,
        dateGregorian: row.dateGregorian ?? undefined,
        channel: row.channel ?? "",
        videoId: row.videoId ?? undefined,
        url: row.url,
        trust: row.trust,
        publishStatus: row.publishStatus,
        tags: row.tags,
        displayOrder: row.displayOrder,
        description: row.description,
        note: row.note ?? undefined,
      };
    });

    response.json({ ok: true, items });
  } catch (error) {
    logger.error({ err: error }, "Public lectures read failed");
    fail(response, "تعذر تحميل المحاضرات.");
  }
});

// GET /api/public/words — published da'wah words.
router.get("/words", async (_request: Request, response: Response) => {
  try {
    const maps = await loadCategoryMaps();

    const rows = await db
      .select()
      .from(words)
      .where(eq(words.publishStatus, PUBLISHED))
      .orderBy(asc(words.displayOrder));

    const items = rows.map((row) => {
      const names = resolveCategoryFields(maps, row.categoryId, row.subcategoryId);
      return {
        id: row.id,
        title: row.title,
        wordType: row.wordType,
        knowledgeArea: names.knowledgeArea,
        subCategory: names.subCategory,
        category: names.category,
        duration: row.duration ?? "",
        durationSeconds: row.durationSeconds ?? undefined,
        dateHijri: row.dateHijri ?? undefined,
        dateGregorian: row.dateGregorian ?? undefined,
        channel: row.channel ?? "",
        videoId: row.videoId ?? undefined,
        url: row.url,
        trust: row.trust,
        publishStatus: row.publishStatus,
        tags: row.tags,
        displayOrder: row.displayOrder,
        description: row.description,
        note: row.note ?? undefined,
      };
    });

    response.json({ ok: true, items });
  } catch (error) {
    logger.error({ err: error }, "Public words read failed");
    fail(response, "تعذر تحميل الكلمات الدعوية.");
  }
});

// GET /api/public/shorts — published short clips (<= 3 minutes).
router.get("/shorts", async (_request: Request, response: Response) => {
  try {
    const maps = await loadCategoryMaps();

    const rows = await db
      .select()
      .from(shortClips)
      .where(eq(shortClips.publishStatus, PUBLISHED))
      .orderBy(asc(shortClips.displayOrder));

    const items = rows.map((row) => {
      const names = resolveCategoryFields(maps, row.categoryId, row.subcategoryId);
      return {
        id: row.id,
        title: row.title,
        channel: row.channel ?? "",
        duration: row.duration ?? "",
        durationSeconds: row.durationSeconds,
        category: names.category,
        knowledgeArea: names.knowledgeArea,
        subCategory: names.subCategory,
        videoId: row.videoId ?? "",
        url: row.url,
        trust: row.trust,
        publishStatus: row.publishStatus,
        tags: row.tags,
        displayOrder: row.displayOrder,
        description: row.description,
        note: row.note ?? undefined,
      };
    });

    response.json({ ok: true, items });
  } catch (error) {
    logger.error({ err: error }, "Public shorts read failed");
    fail(response, "تعذر تحميل المقاطع القصيرة.");
  }
});

// GET /api/public/schedule — published schedule items.
router.get("/schedule", async (_request: Request, response: Response) => {
  try {
    const maps = await loadCategoryMaps();

    const rows = await db
      .select()
      .from(scheduleItems)
      .where(eq(scheduleItems.publishStatus, PUBLISHED))
      .orderBy(asc(scheduleItems.displayOrder));

    const items = rows.map((row) => {
      const names = resolveCategoryFields(maps, row.categoryId, row.subcategoryId);
      return {
        id: row.id,
        title: row.title,
        scheduleKind: row.scheduleKind,
        knowledgeArea: names.knowledgeArea,
        subCategory: names.subCategory,
        day: row.day ?? undefined,
        time: row.time ?? undefined,
        dateHijri: row.dateHijri ?? undefined,
        dateGregorian: row.dateGregorian ?? undefined,
        location: row.location ?? undefined,
        onlineUrl: row.onlineUrl ?? undefined,
        isRecurring: row.isRecurring,
        recurrenceType: row.recurrenceType,
        recurrenceDetails: row.recurrenceDetails ?? undefined,
        status: row.status,
        publishStatus: row.publishStatus,
        tags: row.tags,
        displayOrder: row.displayOrder,
        description: row.description,
        note: row.note ?? undefined,
      };
    });

    response.json({ ok: true, items });
  } catch (error) {
    logger.error({ err: error }, "Public schedule read failed");
    fail(response, "تعذر تحميل الجدول.");
  }
});

// GET /api/public/misc — published misc sections + items.
router.get("/misc", async (_request: Request, response: Response) => {
  try {
    const maps = await loadCategoryMaps();

    const [sectionRows, itemRows] = await Promise.all([
      db
        .select()
        .from(miscSections)
        .where(eq(miscSections.publishStatus, PUBLISHED))
        .orderBy(asc(miscSections.displayOrder)),
      db
        .select()
        .from(miscItems)
        .where(eq(miscItems.publishStatus, PUBLISHED))
        .orderBy(asc(miscItems.displayOrder)),
    ]);

    const sectionSlugById = new Map<string, string>();
    for (const section of sectionRows) {
      sectionSlugById.set(section.id, section.slug);
    }

    const sections = sectionRows.map((section) => ({
      id: section.id,
      title: section.title,
      slug: section.slug,
      description: section.description,
      icon: section.icon,
      publishStatus: section.publishStatus,
      displayOrder: section.displayOrder,
    }));

    const items = itemRows.map((row) => {
      const names = resolveCategoryFields(maps, row.categoryId, row.subcategoryId);
      return {
        id: row.id,
        title: row.title,
        kind: row.kind,
        sectionSlug: row.sectionId
          ? (sectionSlugById.get(row.sectionId) ?? "")
          : "",
        category: names.category,
        knowledgeArea: names.knowledgeArea || undefined,
        subCategory: names.subCategory || undefined,
        duration: row.duration ?? undefined,
        dateHijri: undefined,
        dateGregorian: undefined,
        audioUrl: row.audioUrl ?? undefined,
        videoId: row.videoId ?? undefined,
        fileUrl: row.fileUrl ?? undefined,
        externalUrl: row.externalUrl ?? undefined,
        thumbnailUrl: row.thumbnailUrl ?? undefined,
        downloadLabel: row.downloadLabel ?? undefined,
        trust: row.trust,
        publishStatus: row.publishStatus,
        tags: row.tags,
        displayOrder: row.displayOrder,
        description: row.description,
        note: row.note ?? undefined,
      };
    });

    response.json({ ok: true, sections, items });
  } catch (error) {
    logger.error({ err: error }, "Public misc read failed");
    fail(response, "تعذر تحميل المتفرقات.");
  }
});

export default router;
