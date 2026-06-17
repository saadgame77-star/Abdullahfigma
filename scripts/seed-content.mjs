// One-time content importer: moves the legacy static data in
// artifacts/sheikh-site/src/app/data/* into the database so the public site
// (which now reads from /api/public) shows the existing content.
//
// Idempotent: re-running skips rows that already exist (categories/sections by
// slug, content rows by title), so it is safe to run again after adding new
// static entries.
//
// Run on Replit (DATABASE_URL must be set):
//   pnpm --filter @workspace/scripts run seed:content
//
// Imports resolve through tsx, which transpiles the referenced .ts files.

import {
  db,
  pool,
  knowledgeCategories,
  knowledgeSubcategories,
  scientificSeries,
  seriesVideos,
  lectures,
  words,
  shortClips,
  scheduleItems,
  miscSections,
  miscItems,
} from "../lib/db/src/index.ts";

import { knowledgeCategories as seedCategories } from "../artifacts/sheikh-site/src/app/data/knowledgeCategories.ts";
import { scientificSeries as seedSeries } from "../artifacts/sheikh-site/src/app/data/scientificSeries.ts";
import { lectures as seedLectures } from "../artifacts/sheikh-site/src/app/data/lectures.ts";
import { words as seedWords } from "../artifacts/sheikh-site/src/app/data/words.ts";
import { shortClips as seedShorts } from "../artifacts/sheikh-site/src/app/data/shortClips.ts";
import { scheduleItems as seedSchedule } from "../artifacts/sheikh-site/src/app/data/scheduleItems.ts";
import {
  miscSections as seedMiscSections,
  miscItems as seedMiscItems,
} from "../artifacts/sheikh-site/src/app/data/miscItems.ts";

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function slugify(input) {
  return (
    String(input ?? "")
      .trim()
      .toLowerCase()
      .replace(/[\s_]+/g, "-")
      .replace(/[^\p{L}\p{N}-]+/gu, "")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "") || "item"
  );
}

function makeUniqueSlug(desired, used) {
  const base = slugify(desired);
  let candidate = base;
  let counter = 1;
  while (used.has(candidate)) {
    counter += 1;
    candidate = `${base}-${counter}`;
  }
  used.add(candidate);
  return candidate;
}

function publishedAtFor(publishStatus) {
  return publishStatus === "منشور" ? new Date() : null;
}

function watchUrl(videoId, fallback) {
  if (videoId) return `https://www.youtube.com/watch?v=${videoId}`;
  return fallback || "";
}

let created = {
  categories: 0,
  subcategories: 0,
  series: 0,
  seriesVideos: 0,
  lectures: 0,
  words: 0,
  shorts: 0,
  schedule: 0,
  miscSections: 0,
  miscItems: 0,
};

/* -------------------------------------------------------------------------- */
/* Categories + subcategories                                                 */
/* -------------------------------------------------------------------------- */

// name -> id, and `${categoryName}::${subName}` -> subcategoryId
const categoryIdByName = new Map();
const subcategoryIdByKey = new Map();

async function seedKnowledge() {
  const existingCats = await db
    .select({
      id: knowledgeCategories.id,
      name: knowledgeCategories.name,
      slug: knowledgeCategories.slug,
    })
    .from(knowledgeCategories);

  const usedCatSlugs = new Set(existingCats.map((c) => c.slug));
  for (const c of existingCats) categoryIdByName.set(c.name, c.id);

  const existingSubs = await db
    .select({
      id: knowledgeSubcategories.id,
      categoryId: knowledgeSubcategories.categoryId,
      name: knowledgeSubcategories.name,
      slug: knowledgeSubcategories.slug,
    })
    .from(knowledgeSubcategories);

  const usedSubSlugs = new Set(existingSubs.map((s) => s.slug));
  const catNameById = new Map(existingCats.map((c) => [c.id, c.name]));
  for (const s of existingSubs) {
    const catName = catNameById.get(s.categoryId);
    if (catName) subcategoryIdByKey.set(`${catName}::${s.name}`, s.id);
  }

  let order = 0;
  for (const cat of seedCategories) {
    order += 1;
    let categoryId = categoryIdByName.get(cat.name);

    if (!categoryId) {
      const slug = makeUniqueSlug(cat.name, usedCatSlugs);
      const [row] = await db
        .insert(knowledgeCategories)
        .values({
          name: cat.name,
          slug,
          description: cat.description ?? "",
          displayOrder: cat.displayOrder ?? order,
          publishStatus: "منشور",
        })
        .returning({ id: knowledgeCategories.id });
      categoryId = row.id;
      categoryIdByName.set(cat.name, categoryId);
      created.categories += 1;
    }

    let subOrder = 0;
    for (const sub of cat.children ?? []) {
      subOrder += 1;
      const key = `${cat.name}::${sub.name}`;
      if (subcategoryIdByKey.has(key)) continue;

      const slug = makeUniqueSlug(`${cat.name}-${sub.name}`, usedSubSlugs);
      const [row] = await db
        .insert(knowledgeSubcategories)
        .values({
          categoryId,
          name: sub.name,
          slug,
          description: sub.description ?? null,
          displayOrder: subOrder,
          publishStatus: "منشور",
        })
        .returning({ id: knowledgeSubcategories.id });
      subcategoryIdByKey.set(key, row.id);
      created.subcategories += 1;
    }
  }
}

// Resolve a content row's knowledgeArea/subCategory names into ids, creating a
// category/subcategory on the fly when the static content references one that
// is not in the knowledge taxonomy.
const extraCatSlugs = new Set();
async function resolveCategory(knowledgeArea, subCategory) {
  let categoryId = null;
  let subcategoryId = null;

  if (knowledgeArea) {
    categoryId = categoryIdByName.get(knowledgeArea) ?? null;
    if (!categoryId) {
      const slug = makeUniqueSlug(knowledgeArea, extraCatSlugs);
      const [row] = await db
        .insert(knowledgeCategories)
        .values({
          name: knowledgeArea,
          slug,
          description: "",
          displayOrder: 999,
          publishStatus: "منشور",
        })
        .returning({ id: knowledgeCategories.id });
      categoryId = row.id;
      categoryIdByName.set(knowledgeArea, categoryId);
      created.categories += 1;
    }
  }

  if (categoryId && subCategory) {
    const key = `${knowledgeArea}::${subCategory}`;
    subcategoryId = subcategoryIdByKey.get(key) ?? null;
    if (!subcategoryId) {
      const slug = makeUniqueSlug(`${knowledgeArea}-${subCategory}`, extraCatSlugs);
      const [row] = await db
        .insert(knowledgeSubcategories)
        .values({
          categoryId,
          name: subCategory,
          slug,
          description: null,
          displayOrder: 999,
          publishStatus: "منشور",
        })
        .returning({ id: knowledgeSubcategories.id });
      subcategoryId = row.id;
      subcategoryIdByKey.set(key, subcategoryId);
      created.subcategories += 1;
    }
  }

  return { categoryId, subcategoryId };
}

/* -------------------------------------------------------------------------- */
/* Content                                                                    */
/* -------------------------------------------------------------------------- */

async function seedScientificSeries() {
  const existing = await db
    .select({ slug: scientificSeries.slug })
    .from(scientificSeries);
  const usedSlugs = new Set(existing.map((r) => r.slug));

  for (const s of seedSeries) {
    const slug = slugify(s.title);
    if (usedSlugs.has(slug)) continue;
    usedSlugs.add(slug);

    const { categoryId, subcategoryId } = await resolveCategory(
      s.knowledgeArea,
      s.subCategory,
    );

    const [row] = await db
      .insert(scientificSeries)
      .values({
        title: s.title,
        slug,
        bookTitle: s.bookTitle ?? null,
        categoryId,
        subcategoryId,
        channel: s.channel ?? null,
        playlistId: s.playlistId ?? null,
        url: s.url ?? null,
        videoCount: s.videoCount ?? s.videos?.length ?? 0,
        status: s.status === "مكتملة" ? "مكتملة" : "غير مكتملة",
        trust: s.trust ?? "متوسط",
        publishStatus: s.publishStatus ?? "مسودة",
        tags: s.tags ?? [],
        displayOrder: s.displayOrder ?? 0,
        description: s.description ?? "",
        note: s.note ?? null,
        publishedAt: publishedAtFor(s.publishStatus),
      })
      .returning({ id: scientificSeries.id });
    created.series += 1;

    for (const v of s.videos ?? []) {
      await db.insert(seriesVideos).values({
        seriesId: row.id,
        title: v.title,
        videoId: v.videoId ?? null,
        url: watchUrl(v.videoId, s.url),
        duration: v.duration ?? null,
        lessonOrder: v.displayOrder ?? 0,
        publishStatus: s.publishStatus ?? "مسودة",
        description: "",
        tags: [],
      });
      created.seriesVideos += 1;
    }
  }
}

async function seedSimpleVideo(table, rows, kind) {
  const existing = await db.select({ title: table.title }).from(table);
  const usedTitles = new Set(existing.map((r) => r.title));

  for (const r of rows) {
    if (usedTitles.has(r.title)) continue;
    usedTitles.add(r.title);

    const { categoryId, subcategoryId } = await resolveCategory(
      r.knowledgeArea,
      r.subCategory,
    );

    const base = {
      title: r.title,
      categoryId,
      subcategoryId,
      channel: r.channel ?? null,
      videoId: r.videoId ?? null,
      url: r.url ?? watchUrl(r.videoId),
      duration: r.duration ?? null,
      durationSeconds: r.durationSeconds ?? null,
      trust: r.trust ?? "متوسط",
      publishStatus: r.publishStatus ?? "مسودة",
      tags: r.tags ?? [],
      displayOrder: r.displayOrder ?? 0,
      description: r.description ?? "",
      note: r.note ?? null,
      publishedAt: publishedAtFor(r.publishStatus),
    };

    if (kind === "lecture") {
      await db.insert(table).values({
        ...base,
        lectureType: r.lectureType ?? "محاضرة عامة",
        dateHijri: r.dateHijri ?? null,
        dateGregorian: r.dateGregorian ?? null,
      });
      created.lectures += 1;
    } else if (kind === "word") {
      await db.insert(table).values({
        ...base,
        wordType: r.wordType ?? "كلمة توجيهية",
        dateHijri: r.dateHijri ?? null,
        dateGregorian: r.dateGregorian ?? null,
      });
      created.words += 1;
    } else {
      // short clip: durationSeconds is NOT NULL, no date columns
      await db.insert(table).values({
        ...base,
        durationSeconds: r.durationSeconds ?? 0,
      });
      created.shorts += 1;
    }
  }
}

async function seedScheduleItems() {
  const existing = await db
    .select({ title: scheduleItems.title })
    .from(scheduleItems);
  const usedTitles = new Set(existing.map((r) => r.title));

  for (const s of seedSchedule) {
    if (usedTitles.has(s.title)) continue;
    usedTitles.add(s.title);

    const { categoryId, subcategoryId } = await resolveCategory(
      s.knowledgeArea,
      s.subCategory,
    );

    await db.insert(scheduleItems).values({
      title: s.title,
      scheduleKind: s.scheduleKind ?? "درس",
      categoryId,
      subcategoryId,
      day: s.day ?? null,
      time: s.time ?? null,
      dateHijri: s.dateHijri ?? null,
      dateGregorian: s.dateGregorian ?? null,
      location: s.location ?? null,
      onlineUrl: s.onlineUrl ?? null,
      isRecurring: Boolean(s.isRecurring),
      recurrenceType: s.recurrenceType ?? "غير متكرر",
      recurrenceDetails: s.recurrenceDetails ?? null,
      status: s.status ?? "قائم",
      publishStatus: s.publishStatus ?? "مسودة",
      tags: s.tags ?? [],
      displayOrder: s.displayOrder ?? 0,
      description: s.description ?? "",
      note: s.note ?? null,
    });
    created.schedule += 1;
  }
}

async function seedMisc() {
  const existingSections = await db
    .select({ id: miscSections.id, slug: miscSections.slug })
    .from(miscSections);
  const usedSectionSlugs = new Set(existingSections.map((r) => r.slug));
  const sectionIdBySlug = new Map(
    existingSections.map((r) => [r.slug, r.id]),
  );

  for (const sec of seedMiscSections) {
    const slug = sec.slug ? slugify(sec.slug) : slugify(sec.title);
    if (sectionIdBySlug.has(slug)) continue;
    const uniqueSlug = makeUniqueSlug(slug, usedSectionSlugs);

    const [row] = await db
      .insert(miscSections)
      .values({
        title: sec.title,
        slug: uniqueSlug,
        description: sec.description ?? "",
        icon: sec.icon ?? "file",
        publishStatus: sec.publishStatus ?? "منشور",
        displayOrder: sec.displayOrder ?? 0,
      })
      .returning({ id: miscSections.id });
    sectionIdBySlug.set(slug, row.id);
    sectionIdBySlug.set(uniqueSlug, row.id);
    created.miscSections += 1;
  }

  const existingItems = await db
    .select({ title: miscItems.title })
    .from(miscItems);
  const usedItemTitles = new Set(existingItems.map((r) => r.title));

  for (const it of seedMiscItems) {
    if (usedItemTitles.has(it.title)) continue;
    usedItemTitles.add(it.title);

    const { categoryId, subcategoryId } = await resolveCategory(
      it.knowledgeArea,
      it.subCategory,
    );

    await db.insert(miscItems).values({
      sectionId: it.sectionSlug
        ? (sectionIdBySlug.get(slugify(it.sectionSlug)) ?? null)
        : null,
      title: it.title,
      kind: it.kind ?? "ملف",
      categoryId,
      subcategoryId,
      duration: it.duration ?? null,
      audioUrl: it.audioUrl ?? null,
      videoId: it.videoId ?? null,
      videoUrl: null,
      fileUrl: it.fileUrl ?? null,
      externalUrl: it.externalUrl ?? null,
      thumbnailUrl: it.thumbnailUrl ?? null,
      downloadLabel: it.downloadLabel ?? null,
      trust: it.trust ?? "متوسط",
      publishStatus: it.publishStatus ?? "مسودة",
      tags: it.tags ?? [],
      displayOrder: it.displayOrder ?? 0,
      description: it.description ?? "",
      note: it.note ?? null,
      publishedAt: publishedAtFor(it.publishStatus),
    });
    created.miscItems += 1;
  }
}

/* -------------------------------------------------------------------------- */
/* Run                                                                        */
/* -------------------------------------------------------------------------- */

async function main() {
  console.log("بدء استيراد المحتوى الثابت إلى قاعدة البيانات...");

  await seedKnowledge();
  await seedScientificSeries();
  await seedSimpleVideo(lectures, seedLectures, "lecture");
  await seedSimpleVideo(words, seedWords, "word");
  await seedSimpleVideo(shortClips, seedShorts, "short");
  await seedScheduleItems();
  await seedMisc();

  console.log("تم الاستيراد. العناصر المُضافة (الموجودة مسبقًا تُتخطّى):");
  console.table(created);
}

main()
  .then(async () => {
    await pool.end();
    process.exit(0);
  })
  .catch(async (error) => {
    console.error("فشل الاستيراد:", error);
    await pool.end().catch(() => {});
    process.exit(1);
  });
