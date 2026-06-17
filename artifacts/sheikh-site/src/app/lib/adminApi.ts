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

export type LectureType =
  | "محاضرة عامة"
  | "لقاء علمي"
  | "كلمة مطولة"
  | "برنامج";

export type LectureItem = {
  id: string;
  title: string;
  lectureType: LectureType;
  categoryId: string | null;
  subcategoryId: string | null;
  channel: string | null;
  videoId: string | null;
  url: string;
  duration: string | null;
  durationSeconds: number | null;
  dateHijri: string | null;
  dateGregorian: string | null;
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

export type LectureInput = {
  title: string;
  lectureType: LectureType;
  channel?: string;
  videoId?: string;
  url: string;
  duration?: string;
  durationSeconds?: number;
  dateHijri?: string;
  dateGregorian?: string;
  trust: TrustLevel;
  publishStatus: PublishStatus;
  tags: string[];
  displayOrder: number;
  description: string;
  note?: string;
  categoryId?: string | null;
  subcategoryId?: string | null;
};

export type WordType = "كلمة توجيهية" | "موعظة" | "توجيه" | "فائدة دعوية";

export type WordItem = {
  id: string;
  title: string;
  wordType: WordType;
  categoryId: string | null;
  subcategoryId: string | null;
  channel: string | null;
  videoId: string | null;
  url: string;
  duration: string | null;
  durationSeconds: number | null;
  dateHijri: string | null;
  dateGregorian: string | null;
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

export type WordInput = {
  title: string;
  wordType: WordType;
  channel?: string;
  videoId?: string;
  url: string;
  duration?: string;
  durationSeconds?: number;
  dateHijri?: string;
  dateGregorian?: string;
  trust: TrustLevel;
  publishStatus: PublishStatus;
  tags: string[];
  displayOrder: number;
  description: string;
  note?: string;
  categoryId?: string | null;
  subcategoryId?: string | null;
};

export type ShortClipItem = {
  id: string;
  title: string;
  categoryId: string | null;
  subcategoryId: string | null;
  channel: string | null;
  videoId: string | null;
  url: string;
  duration: string | null;
  durationSeconds: number;
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

export type ShortClipInput = {
  title: string;
  channel?: string;
  videoId?: string;
  url: string;
  duration?: string;
  durationSeconds?: number;
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

export type YouTubeMeta = {
  kind: "video" | "playlist";
  videoId: string | null;
  playlistId: string | null;
  title: string | null;
  channel: string | null;
  durationSeconds: number | null;
  duration: string | null;
  videoCount: number | null;
  publishedAt: string | null;
  thumbnailUrl: string | null;
  source: "youtube-api" | "oembed";
};

export type CategorySuggestion = {
  categoryId: string;
  categoryName: string | null;
  subcategoryId: string | null;
  subcategoryName: string | null;
  confidence: number;
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

  listLectures(params: { search?: string; publishStatus?: string } = {}) {
    const query = new URLSearchParams();
    if (params.search) query.set("search", params.search);
    if (params.publishStatus) query.set("publishStatus", params.publishStatus);
    const suffix = query.toString() ? `?${query.toString()}` : "";
    return request<{ ok: true; items: LectureItem[]; total: number }>(
      `/admin/lectures${suffix}`,
    );
  },

  createLecture(input: LectureInput) {
    return request<{ ok: true; item: LectureItem }>("/admin/lectures", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  updateLecture(id: string, input: LectureInput) {
    return request<{ ok: true; item: LectureItem }>(`/admin/lectures/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    });
  },

  deleteLecture(id: string) {
    return request<{ ok: true; id: string }>(`/admin/lectures/${id}`, {
      method: "DELETE",
    });
  },

  listWords(params: { search?: string; publishStatus?: string } = {}) {
    const query = new URLSearchParams();
    if (params.search) query.set("search", params.search);
    if (params.publishStatus) query.set("publishStatus", params.publishStatus);
    const suffix = query.toString() ? `?${query.toString()}` : "";
    return request<{ ok: true; items: WordItem[]; total: number }>(
      `/admin/words${suffix}`,
    );
  },

  createWord(input: WordInput) {
    return request<{ ok: true; item: WordItem }>("/admin/words", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  updateWord(id: string, input: WordInput) {
    return request<{ ok: true; item: WordItem }>(`/admin/words/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    });
  },

  deleteWord(id: string) {
    return request<{ ok: true; id: string }>(`/admin/words/${id}`, {
      method: "DELETE",
    });
  },

  listShorts(params: { search?: string; publishStatus?: string } = {}) {
    const query = new URLSearchParams();
    if (params.search) query.set("search", params.search);
    if (params.publishStatus) query.set("publishStatus", params.publishStatus);
    const suffix = query.toString() ? `?${query.toString()}` : "";
    return request<{ ok: true; items: ShortClipItem[]; total: number }>(
      `/admin/shorts${suffix}`,
    );
  },

  createShort(input: ShortClipInput) {
    return request<{ ok: true; item: ShortClipItem }>("/admin/shorts", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  updateShort(id: string, input: ShortClipInput) {
    return request<{ ok: true; item: ShortClipItem }>(`/admin/shorts/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    });
  },

  deleteShort(id: string) {
    return request<{ ok: true; id: string }>(`/admin/shorts/${id}`, {
      method: "DELETE",
    });
  },

  getYoutubeMeta(url: string, type?: "video" | "playlist") {
    const query = new URLSearchParams({ url });
    if (type) query.set("type", type);
    return request<{ ok: true; meta: YouTubeMeta; hasApiKey: boolean }>(
      `/admin/youtube/meta?${query.toString()}`,
    );
  },

  suggestCategory(params: { title?: string; channel?: string; tags?: string }) {
    const query = new URLSearchParams();
    if (params.title) query.set("title", params.title);
    if (params.channel) query.set("channel", params.channel);
    if (params.tags) query.set("tags", params.tags);
    return request<{ ok: true; suggestion: CategorySuggestion | null }>(
      `/admin/suggest-category?${query.toString()}`,
    );
  },
};
