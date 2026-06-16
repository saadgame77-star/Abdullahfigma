import type { Request } from "express";
import { db, adminAuditLogs } from "@workspace/db";
import { logger } from "./logger";

function getRequestIp(request: Request) {
  return (
    request.headers["x-forwarded-for"]?.toString().split(",")[0]?.trim() ||
    request.socket.remoteAddress ||
    undefined
  );
}

/**
 * Records an administrative action in the audit log. Audit writes must never
 * break the primary request, so failures are logged and swallowed.
 */
export async function writeAuditLog(params: {
  request: Request;
  action: string;
  entityType: string;
  entityId?: string | null;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  try {
    await db.insert(adminAuditLogs).values({
      userId: params.request.admin?.user.id ?? null,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId ?? null,
      ipAddress: getRequestIp(params.request),
      userAgent: params.request.headers["user-agent"]?.toString(),
      metadata: params.metadata ?? {},
    });
  } catch (error) {
    logger.error({ err: error }, "Failed to write audit log");
  }
}
