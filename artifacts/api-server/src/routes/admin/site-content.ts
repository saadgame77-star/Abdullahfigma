import { Router, type Request, type Response } from "express";
import { desc, eq } from "drizzle-orm";
import { db, siteContent, siteContentVersions } from "@workspace/db";
import { requireAdminPermission } from "../../middleware/admin-auth";
import { writeAuditLog } from "../../lib/audit";
import { logger } from "../../lib/logger";
import { isUuid } from "../../lib/validate";

const router = Router();

// Editing site content requires the "editSettings" permission (super admins
// implicit).
router.use(requireAdminPermission("editSettings"));

type Document = Record<string, unknown>;

function isPlainObject(value: unknown): value is Document {
  return (
    typeof value === "object" && value !== null && !Array.isArray(value)
  );
}

// Ensures the singleton row exists and returns it.
async function ensureRow() {
  const [existing] = await db.select().from(siteContent).limit(1);
  if (existing) return existing;
  const [created] = await db.insert(siteContent).values({}).returning();
  return created;
}

// GET /api/admin/site-content — draft + published + timestamps.
router.get("/", async (_request: Request, response: Response) => {
  try {
    const row = await ensureRow();
    response.json({
      ok: true,
      draft: row.draft,
      published: row.published,
      draftUpdatedAt: row.draftUpdatedAt,
      publishedAt: row.publishedAt,
    });
  } catch (error) {
    logger.error({ err: error }, "Reading site content failed");
    response.status(500).json({
      ok: false,
      error: "READ_FAILED",
      message: "تعذر تحميل محتوى الموقع.",
    });
  }
});

// PUT /api/admin/site-content/draft — replace the working draft.
router.put("/draft", async (request: Request, response: Response) => {
  try {
    const content = (request.body as { content?: unknown })?.content;
    if (!isPlainObject(content)) {
      response.status(400).json({
        ok: false,
        error: "INVALID_INPUT",
        message: "محتوى غير صالح.",
      });
      return;
    }

    const row = await ensureRow();
    const [updated] = await db
      .update(siteContent)
      .set({
        draft: content,
        draftUpdatedAt: new Date(),
        updatedByUserId: request.admin?.user.id ?? null,
      })
      .where(eq(siteContent.id, row.id))
      .returning();

    response.json({
      ok: true,
      draft: updated.draft,
      draftUpdatedAt: updated.draftUpdatedAt,
    });
  } catch (error) {
    logger.error({ err: error }, "Saving site content draft failed");
    response.status(500).json({
      ok: false,
      error: "SAVE_FAILED",
      message: "تعذر حفظ المسودة.",
    });
  }
});

// POST /api/admin/site-content/publish — copy draft → published and snapshot.
router.post("/publish", async (request: Request, response: Response) => {
  try {
    const row = await ensureRow();
    const label = (request.body as { label?: unknown })?.label;

    const [updated] = await db
      .update(siteContent)
      .set({
        published: row.draft,
        publishedAt: new Date(),
        updatedByUserId: request.admin?.user.id ?? null,
      })
      .where(eq(siteContent.id, row.id))
      .returning();

    await db.insert(siteContentVersions).values({
      snapshot: row.draft,
      label: typeof label === "string" && label.trim() ? label.trim() : null,
      createdByUserId: request.admin?.user.id ?? null,
    });

    await writeAuditLog({
      request,
      action: "publish",
      entityType: "site_content",
      entityId: row.id,
    });

    response.json({
      ok: true,
      published: updated.published,
      publishedAt: updated.publishedAt,
    });
  } catch (error) {
    logger.error({ err: error }, "Publishing site content failed");
    response.status(500).json({
      ok: false,
      error: "PUBLISH_FAILED",
      message: "تعذر نشر المحتوى.",
    });
  }
});

// GET /api/admin/site-content/versions — history (newest first, no snapshots).
router.get("/versions", async (_request: Request, response: Response) => {
  try {
    const rows = await db
      .select({
        id: siteContentVersions.id,
        label: siteContentVersions.label,
        createdAt: siteContentVersions.createdAt,
        createdByUserId: siteContentVersions.createdByUserId,
      })
      .from(siteContentVersions)
      .orderBy(desc(siteContentVersions.createdAt))
      .limit(50);

    response.json({ ok: true, items: rows });
  } catch (error) {
    logger.error({ err: error }, "Listing site content versions failed");
    response.status(500).json({
      ok: false,
      error: "LIST_FAILED",
      message: "تعذر تحميل سجل النسخ.",
    });
  }
});

// POST /api/admin/site-content/versions/:id/restore — load a snapshot into the
// draft (does not publish; the editor previews then publishes explicitly).
router.post(
  "/versions/:id/restore",
  async (request: Request, response: Response) => {
    try {
      const { id } = request.params;
      if (!isUuid(id)) {
        response
          .status(400)
          .json({ ok: false, error: "INVALID_ID", message: "معرّف غير صالح." });
        return;
      }

      const [version] = await db
        .select()
        .from(siteContentVersions)
        .where(eq(siteContentVersions.id, id))
        .limit(1);

      if (!version) {
        response.status(404).json({
          ok: false,
          error: "NOT_FOUND",
          message: "النسخة غير موجودة.",
        });
        return;
      }

      const row = await ensureRow();
      const [updated] = await db
        .update(siteContent)
        .set({
          draft: version.snapshot,
          draftUpdatedAt: new Date(),
          updatedByUserId: request.admin?.user.id ?? null,
        })
        .where(eq(siteContent.id, row.id))
        .returning();

      response.json({ ok: true, draft: updated.draft });
    } catch (error) {
      logger.error({ err: error }, "Restoring site content version failed");
      response.status(500).json({
        ok: false,
        error: "RESTORE_FAILED",
        message: "تعذر استرجاع النسخة.",
      });
    }
  },
);

export default router;
