import { Router, type Request, type Response } from "express";
import { count, desc, eq } from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";
import {
  db,
  adminUsers,
  lectures,
  miscItems,
  scheduleItems,
  scientificSeries,
  seriesVideos,
  shortClips,
  words,
} from "@workspace/db";
import { requireAdminSession } from "../../middleware/admin-auth";
import { logger } from "../../lib/logger";

const router = Router();

router.use(requireAdminSession);

async function countRows(table: PgTable) {
  const [row] = await db.select({ value: count() }).from(table);
  return row?.value ?? 0;
}

// GET /api/admin/stats — dashboard totals + recent content.
router.get("/", async (_request: Request, response: Response) => {
  try {
    const [
      seriesTotal,
      seriesPublished,
      seriesDrafts,
      videosTotal,
      lecturesTotal,
      wordsTotal,
      shortsTotal,
      miscTotal,
      scheduleTotal,
      usersTotal,
    ] = await Promise.all([
      countRows(scientificSeries),
      db
        .select({ value: count() })
        .from(scientificSeries)
        .where(eq(scientificSeries.publishStatus, "منشور"))
        .then((rows) => rows[0]?.value ?? 0),
      db
        .select({ value: count() })
        .from(scientificSeries)
        .where(eq(scientificSeries.publishStatus, "مسودة"))
        .then((rows) => rows[0]?.value ?? 0),
      countRows(seriesVideos),
      countRows(lectures),
      countRows(words),
      countRows(shortClips),
      countRows(miscItems),
      countRows(scheduleItems),
      countRows(adminUsers),
    ]);

    const recentSeries = await db
      .select({
        id: scientificSeries.id,
        title: scientificSeries.title,
        publishStatus: scientificSeries.publishStatus,
        status: scientificSeries.status,
        updatedAt: scientificSeries.updatedAt,
      })
      .from(scientificSeries)
      .orderBy(desc(scientificSeries.updatedAt))
      .limit(6);

    response.json({
      ok: true,
      totals: {
        series: seriesTotal,
        seriesPublished,
        seriesDrafts,
        seriesVideos: videosTotal,
        lectures: lecturesTotal,
        words: wordsTotal,
        shortClips: shortsTotal,
        miscItems: miscTotal,
        scheduleItems: scheduleTotal,
        users: usersTotal,
      },
      recentSeries,
    });
  } catch (error) {
    logger.error({ err: error }, "Loading admin stats failed");
    response.status(500).json({
      ok: false,
      error: "STATS_FAILED",
      message: "تعذر تحميل الإحصائيات.",
    });
  }
});

export default router;
