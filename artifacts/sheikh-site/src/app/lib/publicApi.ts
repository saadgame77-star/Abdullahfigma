// Read-only client for the public content API. Mirrors the static data shapes
// the public pages used to import, so pages can swap imports for fetches with
// minimal change. All endpoints return only published content.

export type TrustLevel = "عالٍ" | "متوسط";
export type PublishStatus = "منشور" | "مخفي" | "مسودة";
export type CompletionStatus = "مكتملة" | "غير مكتملة";

export type SeriesVideo = {
  id: string;
  title: string;
  videoId: string;
  duration?: string;
  displayOrder: number;
};

export type PublicSeries = {
  id: string;
  title: string;
  bookTitle?: string;
  channel: string;
  count: string;
  videoCount: number;
  category: string;
  knowledgeArea: string;
  subCategory: string;
  section: string;
  playlistId: string;
  url: string;
  trust: TrustLevel;
  status: CompletionStatus;
  statusLabel: "مكتملة" | "قيد الاكتمال";
  publishStatus: PublishStatus;
  tags: string[];
  displayOrder: number;
  description: string;
  videos: SeriesVideo[];
  note?: string;
};

export type PublicLecture = {
  id: string;
  title: string;
  lectureType: "محاضرة عامة" | "لقاء علمي" | "كلمة مطولة" | "برنامج";
  knowledgeArea: string;
  subCategory: string;
  category: string;
  duration: string;
  durationSeconds?: number;
  dateHijri?: string;
  dateGregorian?: string;
  channel: string;
  videoId?: string;
  url: string;
  trust: TrustLevel;
  publishStatus: PublishStatus;
  tags: string[];
  displayOrder: number;
  description: string;
  note?: string;
};

export type PublicWord = {
  id: string;
  title: string;
  wordType: "كلمة توجيهية" | "موعظة" | "توجيه" | "فائدة دعوية";
  knowledgeArea: string;
  subCategory: string;
  category: string;
  duration: string;
  durationSeconds?: number;
  dateHijri?: string;
  dateGregorian?: string;
  channel: string;
  videoId?: string;
  url: string;
  trust: TrustLevel;
  publishStatus: PublishStatus;
  tags: string[];
  displayOrder: number;
  description: string;
  note?: string;
};

export type ShortDisplayMode = "auto" | "landscape" | "portrait" | "square";
export type ShortFitMode = "smart" | "contain" | "cover";

export type PublicShort = {
  id: string;
  title: string;
  channel: string;
  duration: string;
  durationSeconds: number;
  category: string;
  knowledgeArea: string;
  subCategory: string;
  videoId: string;
  url: string;
  trust: TrustLevel;
  publishStatus: PublishStatus;
  tags: string[];
  displayOrder: number;
  description: string;
  displayMode?: ShortDisplayMode;
  fitMode?: ShortFitMode;
  aspectRatio?: string;
  thumbnailUrl?: string;
  note?: string;
};

export type ScheduleStatus = "قائم" | "متوقف" | "مؤجل" | "ملغي";
export type ScheduleKind = "درس" | "محاضرة" | "برنامج" | "لقاء";
export type RecurrenceType = "غير متكرر" | "أسبوعي" | "شهري" | "مخصص";

export type PublicScheduleItem = {
  id: string;
  title: string;
  scheduleKind: ScheduleKind;
  knowledgeArea: string;
  subCategory: string;
  day?: string;
  time?: string;
  dateHijri?: string;
  dateGregorian?: string;
  location?: string;
  onlineUrl?: string;
  isRecurring: boolean;
  recurrenceType: RecurrenceType;
  recurrenceDetails?: string;
  status: ScheduleStatus;
  publishStatus: PublishStatus;
  tags: string[];
  displayOrder: number;
  description: string;
  note?: string;
};

export type PublicMiscSection = {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: "mic" | "book" | "file" | "video" | "audio";
  publishStatus: PublishStatus;
  displayOrder: number;
};

export type PublicMiscItem = {
  id: string;
  title: string;
  kind: string;
  sectionSlug: string;
  category: string;
  knowledgeArea?: string;
  subCategory?: string;
  duration?: string;
  dateHijri?: string;
  dateGregorian?: string;
  audioUrl?: string;
  videoId?: string;
  fileUrl?: string;
  externalUrl?: string;
  thumbnailUrl?: string;
  downloadLabel?: string;
  trust: TrustLevel;
  publishStatus: PublishStatus;
  tags: string[];
  displayOrder: number;
  description: string;
  note?: string;
};

export type PublicCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  displayOrder: number;
  children: { id: string; name: string; slug: string }[];
};

async function get<T>(path: string): Promise<T> {
  const response = await fetch(`/api/public${path}`, {
    headers: { Accept: "application/json" },
  });

  const data = (await response.json().catch(() => null)) as
    | (T & { ok?: boolean })
    | null;

  if (!response.ok || !data || (data as { ok?: boolean }).ok === false) {
    throw new Error("PUBLIC_READ_FAILED");
  }

  return data as T;
}

export const publicApi = {
  getSeries() {
    return get<{ ok: true; items: PublicSeries[] }>("/series");
  },
  getLectures() {
    return get<{ ok: true; items: PublicLecture[] }>("/lectures");
  },
  getWords() {
    return get<{ ok: true; items: PublicWord[] }>("/words");
  },
  getShorts() {
    return get<{ ok: true; items: PublicShort[] }>("/shorts");
  },
  getSchedule() {
    return get<{ ok: true; items: PublicScheduleItem[] }>("/schedule");
  },
  getMisc() {
    return get<{
      ok: true;
      sections: PublicMiscSection[];
      items: PublicMiscItem[];
    }>("/misc");
  },
  getCategories() {
    return get<{ ok: true; items: PublicCategory[] }>("/categories");
  },
};
