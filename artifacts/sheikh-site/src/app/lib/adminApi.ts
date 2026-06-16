// Lightweight typed client for the admin API. Mirrors the auth pattern already
// used in ProtectedAdmin/AdminLogin: credentialed fetch against the /api proxy.

export type PublishStatus = "منشور" | "مخفي" | "مسودة";
export type CompletionStatus = "مكتملة" | "غير مكتملة";
export type TrustLevel = "عالٍ" | "متوسط";

export type SeriesItem = {
  id: string;
  title: string;
  slug: string;
  bookTitle: string | null;
  categoryId: string | null;
  subcategoryId: string | null;
  channel: string | null;
  playlistId: string | null;
  url: string | null;
  videoCount: number;
  status: CompletionStatus;
  trust: TrustLevel;
  publishStatus: PublishStatus;
  tags: string[];
  displayOrder: number;
  description: string;
  note: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type SeriesInput = {
  title: string;
  bookTitle?: string;
  channel?: string;
  playlistId?: string;
  url?: string;
  videoCount: number;
  status: CompletionStatus;
  trust: TrustLevel;
  publishStatus: PublishStatus;
  tags: string[];
  displayOrder: number;
  description: string;
  note?: string;
  categoryId?: string | null;
  subcategoryId?: string | null;
};

export type AdminStats = {
  totals: {
    series: number;
    seriesPublished: number;
    seriesDrafts: number;
    seriesVideos: number;
    lectures: number;
    words: number;
    shortClips: number;
    miscItems: number;
    scheduleItems: number;
    users: number;
  };
  recentSeries: Array<{
    id: string;
    title: string;
    publishStatus: PublishStatus;
    status: CompletionStatus;
    updatedAt: string;
  }>;
};

export type Subcategory = {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  displayOrder: number;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  displayOrder: number;
  subcategories: Subcategory[];
};

export class ApiError extends Error {
  status: number;
  code: string;
  fields?: Record<string, string>;

  constructor(
    message: string,
    options: { status: number; code: string; fields?: Record<string, string> },
  ) {
    super(message);
    this.name = "ApiError";
    this.status = options.status;
    this.code = options.code;
    this.fields = options.fields;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`/api${path}`, {
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers ?? {}),
    },
    ...options,
  });

  const data = (await response.json().catch(() => null)) as
    | (T & { ok?: boolean })
    | { ok: false; message?: string; error?: string; fields?: Record<string, string> }
    | null;

  if (!response.ok || !data || (data as { ok?: boolean }).ok === false) {
    const errorData = (data ?? {}) as {
      message?: string;
      error?: string;
      fields?: Record<string, string>;
    };

    throw new ApiError(errorData.message ?? "تعذر تنفيذ الطلب.", {
      status: response.status,
      code: errorData.error ?? "REQUEST_FAILED",
      fields: errorData.fields,
    });
  }

  return data as T;
}

export const adminApi = {
  getStats() {
    return request<{ ok: true } & AdminStats>("/admin/stats");
  },

  getCategories() {
    return request<{ ok: true; items: Category[] }>(
      "/admin/knowledge-categories",
    );
  },

  listSeries(params: { search?: string; publishStatus?: string } = {}) {
    const query = new URLSearchParams();
    if (params.search) query.set("search", params.search);
    if (params.publishStatus) query.set("publishStatus", params.publishStatus);
    const suffix = query.toString() ? `?${query.toString()}` : "";
    return request<{ ok: true; items: SeriesItem[]; total: number }>(
      `/admin/series${suffix}`,
    );
  },

  createSeries(input: SeriesInput) {
    return request<{ ok: true; item: SeriesItem }>("/admin/series", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  updateSeries(id: string, input: SeriesInput) {
    return request<{ ok: true; item: SeriesItem }>(`/admin/series/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    });
  },

  deleteSeries(id: string) {
    return request<{ ok: true; id: string }>(`/admin/series/${id}`, {
      method: "DELETE",
    });
  },
};
