// Client for the site-content document (public read + admin draft/publish).
import type { SiteContent } from "../data/siteContent";

export type SiteContentVersion = {
  id: string;
  label: string | null;
  createdAt: string;
  createdByUserId: string | null;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api${path}`, {
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
    },
    ...init,
  });

  const data = (await response.json().catch(() => null)) as
    | (T & { ok?: boolean; message?: string })
    | null;

  if (!response.ok || !data || data.ok === false) {
    throw new Error(data?.message ?? "SITE_CONTENT_REQUEST_FAILED");
  }

  return data as T;
}

export const siteContentApi = {
  // Public: the currently published document (raw, may be partial).
  getPublished() {
    return request<{ ok: true; content: Record<string, unknown> }>(
      "/public/site-content",
    );
  },

  // Admin: draft + published documents.
  getAdmin() {
    return request<{
      ok: true;
      draft: Record<string, unknown>;
      published: Record<string, unknown>;
      draftUpdatedAt: string | null;
      publishedAt: string | null;
    }>("/admin/site-content");
  },

  saveDraft(content: SiteContent) {
    return request<{ ok: true; draftUpdatedAt: string }>(
      "/admin/site-content/draft",
      { method: "PUT", body: JSON.stringify({ content }) },
    );
  },

  publish(label?: string) {
    return request<{ ok: true; publishedAt: string }>(
      "/admin/site-content/publish",
      { method: "POST", body: JSON.stringify({ label: label ?? "" }) },
    );
  },

  listVersions() {
    return request<{ ok: true; items: SiteContentVersion[] }>(
      "/admin/site-content/versions",
    );
  },

  restoreVersion(id: string) {
    return request<{ ok: true; draft: Record<string, unknown> }>(
      `/admin/site-content/versions/${id}/restore`,
      { method: "POST" },
    );
  },
};
