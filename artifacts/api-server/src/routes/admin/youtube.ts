import { Router, type Request, type Response } from "express";
import { requireAdminSession } from "../../middleware/admin-auth";
import { fetchYouTubeMeta, type YouTubeKind } from "../../lib/youtube";
import { optionalString } from "../../lib/validate";
import { logger } from "../../lib/logger";

const router = Router();

router.use(requireAdminSession);

// GET /api/admin/youtube/meta?url=...&type=video|playlist
router.get("/meta", async (request: Request, response: Response) => {
  try {
    const url = optionalString(request.query.url);

    if (!url) {
      response.status(400).json({
        ok: false,
        error: "INVALID_INPUT",
        message: "أدخل رابط يوتيوب.",
      });
      return;
    }

    const typeParam = optionalString(request.query.type);
    const preferred: YouTubeKind | undefined =
      typeParam === "playlist" || typeParam === "video" ? typeParam : undefined;

    const meta = await fetchYouTubeMeta(url, preferred);

    if (!meta || (!meta.videoId && !meta.playlistId)) {
      response.status(404).json({
        ok: false,
        error: "NOT_FOUND",
        message: "تعذّر التعرّف على الرابط. تأكد أنه رابط يوتيوب صحيح.",
      });
      return;
    }

    response.json({ ok: true, meta, hasApiKey: Boolean(process.env.YOUTUBE_API_KEY) });
  } catch (error) {
    logger.error({ err: error }, "Fetching YouTube metadata failed");
    response.status(502).json({
      ok: false,
      error: "FETCH_FAILED",
      message: "تعذّر جلب البيانات من يوتيوب. حاول مرة أخرى.",
    });
  }
});

export default router;
