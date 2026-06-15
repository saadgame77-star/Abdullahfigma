import type { NextFunction, Request, Response } from "express";
import {
  getAdminContextFromRequest,
  hasAdminPermission,
  type AuthenticatedAdminContext,
} from "../lib/admin-auth";

declare global {
  namespace Express {
    interface Request {
      admin?: AuthenticatedAdminContext;
    }
  }
}

export async function requireAdminSession(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const context = await getAdminContextFromRequest(request);

  if (!context) {
    response.status(401).json({
      ok: false,
      error: "UNAUTHENTICATED",
      message: "يلزم تسجيل الدخول.",
    });
    return;
  }

  request.admin = context;
  next();
}

export function requireAdminPermission(permission: string) {
  return async function requireAdminPermissionMiddleware(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    const context = await getAdminContextFromRequest(request);

    if (!context) {
      response.status(401).json({
        ok: false,
        error: "UNAUTHENTICATED",
        message: "يلزم تسجيل الدخول.",
      });
      return;
    }

    if (!hasAdminPermission(context.user, permission)) {
      response.status(403).json({
        ok: false,
        error: "FORBIDDEN",
        message: "لا تملك صلاحية تنفيذ هذا الإجراء.",
      });
      return;
    }

    request.admin = context;
    next();
  };
}