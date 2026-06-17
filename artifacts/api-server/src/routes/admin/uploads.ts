import { Router, type Request, type Response, raw } from "express";
import { requireAdminPermission } from "../../middleware/admin-auth";
import { writeAuditLog } from "../../lib/audit";
import { logger } from "../../lib/logger";
import { extForMime, uploadImage } from "../../lib/storage";

const router = Router();

router.use(requireAdminPermission("editSettings"));

// POST /api/admin/uploads — raw binary body (the file), with its mime type in
// the Content-Type header. Returns the public URL to reference in content.
router.post(
  "/",
  raw({ type: () => true, limit: "6mb" }),
  async (request: Request, response: Response) => {
    try {
      const mime = (request.headers["content-type"] ?? "").split(";")[0].trim();

      if (!extForMime(mime)) {
        response.status(400).json({
          ok: false,
          error: "UNSUPPORTED_TYPE",
          message: "نوع الملف غير مدعوم (الصور فقط: png, jpg, webp, gif, svg).",
        });
        return;
      }

      const body = request.body;
      if (!Buffer.isBuffer(body) || body.length === 0) {
        response.status(400).json({
          ok: false,
          error: "EMPTY_FILE",
          message: "لم يتم استلام ملف صالح.",
        });
        return;
      }

      const name = await uploadImage(body, mime);
      const url = `/api/uploads/${name}`;

      await writeAuditLog({
        request,
        action: "upload",
        entityType: "media",
        entityId: name,
      });

      response.status(201).json({ ok: true, name, url });
    } catch (error) {
      logger.error({ err: error }, "Uploading media failed");
      response.status(500).json({
        ok: false,
        error: "UPLOAD_FAILED",
        message: "تعذر رفع الملف. تأكد من تفعيل التخزين.",
      });
    }
  },
);

export default router;
