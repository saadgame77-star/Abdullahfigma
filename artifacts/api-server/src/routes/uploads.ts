import { Router, type Request, type Response } from "express";
import { logger } from "../lib/logger";
import { downloadImage, isSafeObjectName } from "../lib/storage";

const router = Router();

// GET /api/uploads/:name — publicly serves an uploaded image from object
// storage. Names are validated to a safe, slash-free charset.
router.get("/:name", async (request: Request, response: Response) => {
  try {
    const name = String(request.params.name ?? "");
    if (!isSafeObjectName(name)) {
      response.status(400).json({ ok: false, error: "INVALID_NAME" });
      return;
    }

    const file = await downloadImage(name);
    if (!file) {
      response.status(404).json({ ok: false, error: "NOT_FOUND" });
      return;
    }

    response.setHeader("Content-Type", file.mime);
    response.setHeader("Cache-Control", "public, max-age=86400");
    response.send(file.buffer);
  } catch (error) {
    logger.error({ err: error }, "Serving media failed");
    response.status(500).json({ ok: false, error: "SERVE_FAILED" });
  }
});

export default router;
