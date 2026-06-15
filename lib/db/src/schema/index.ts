import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export type AdminUserStatus = "نشط" | "موقوف";
export type PublishStatus = "منشور" | "مخفي" | "مسودة";
export type TrustLevel = "عالٍ" | "متوسط";
export type ContentReviewStatus = "مسودة" | "قيد المراجعة" | "معتمد" | "مرفوض";
export type AiJobStatus =
  | "قيد الانتظار"
  | "قيد المعالجة"
  | "مكتمل"
  | "فشل"
  | "قيد المراجعة";
export type AiSuggestionStatus = "مسودة" | "مقبول" | "مرفوض" | "مؤجل";

const now = () => timestamp("created_at", { withTimezone: true }).defaultNow();

const updatedAt = () =>
  timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date());

export const adminUsers = pgTable(
  "admin_users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    status: text("status").$type<AdminUserStatus>().notNull().default("نشط"),
    isSuperAdmin: boolean("is_super_admin").notNull().default(false),
    permissions: jsonb("permissions")
      .$type<string[]>()
      .notNull()
      .default(sql`'[]'::jsonb`),
    lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
    createdAt: now(),
    updatedAt: updatedAt(),
  },
  (table) => ({
    emailIdx: uniqueIndex("admin_users_email_idx").on(table.email),
    statusIdx: index("admin_users_status_idx").on(table.status),
  }),
);

export const adminSessions = pgTable(
  "admin_sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => adminUsers.id, { onDelete: "cascade" }),
    sessionTokenHash: text("session_token_hash").notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
    createdAt: now(),
  },
  (table) => ({
    tokenIdx: uniqueIndex("admin_sessions_token_idx").on(table.sessionTokenHash),
    userIdx: index("admin_sessions_user_idx").on(table.userId),
    expiresAtIdx: index("admin_sessions_expires_at_idx").on(table.expiresAt),
  }),
);

export const adminAuditLogs = pgTable(
  "admin_audit_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => adminUsers.id, {
      onDelete: "set null",
    }),
    action: text("action").notNull(),
    entityType: text("entity_type").notNull(),
    entityId: text("entity_id"),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    metadata: jsonb("metadata")
      .$type<Record<string, unknown>>()
      .notNull()
      .default(sql`'{}'::jsonb`),
    createdAt: now(),
  },
  (table) => ({
    userIdx: index("admin_audit_logs_user_idx").on(table.userId),
    entityIdx: index("admin_audit_logs_entity_idx").on(
      table.entityType,
      table.entityId,
    ),
    actionIdx: index("admin_audit_logs_action_idx").on(table.action),
  }),
);

export const knowledgeCategories = pgTable(
  "knowledge_categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    displayOrder: integer("display_order").notNull().default(0),
    publishStatus: text("publish_status")
      .$type<PublishStatus>()
      .notNull()
      .default("منشور"),
    createdAt: now(),
    updatedAt: updatedAt(),
  },
  (table) => ({
    slugIdx: uniqueIndex("knowledge_categories_slug_idx").on(table.slug),
    orderIdx: index("knowledge_categories_order_idx").on(table.displayOrder),
  }),
);

export const knowledgeSubcategories = pgTable(
  "knowledge_subcategories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => knowledgeCategories.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    displayOrder: integer("display_order").notNull().default(0),
    publishStatus: text("publish_status")
      .$type<PublishStatus>()
      .notNull()
      .default("منشور"),
    createdAt: now(),
    updatedAt: updatedAt(),
  },
  (table) => ({
    slugIdx: uniqueIndex("knowledge_subcategories_slug_idx").on(table.slug),
    categoryIdx: index("knowledge_subcategories_category_idx").on(
      table.categoryId,
    ),
    orderIdx: index("knowledge_subcategories_order_idx").on(table.displayOrder),
  }),
);

export const tags = pgTable(
  "tags",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    usageCount: integer("usage_count").notNull().default(0),
    createdAt: now(),
    updatedAt: updatedAt(),
  },
  (table) => ({
    nameIdx: uniqueIndex("tags_name_idx").on(table.name),
    slugIdx: uniqueIndex("tags_slug_idx").on(table.slug),
  }),
);

export const contentSources = pgTable(
  "content_sources",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sourceType: text("source_type").notNull(),
    sourceUrl: text("source_url").notNull(),
    externalId: text("external_id"),
    title: text("title"),
    metadata: jsonb("metadata")
      .$type<Record<string, unknown>>()
      .notNull()
      .default(sql`'{}'::jsonb`),
    createdAt: now(),
    updatedAt: updatedAt(),
  },
  (table) => ({
    urlIdx: uniqueIndex("content_sources_url_idx").on(table.sourceUrl),
    externalIdIdx: index("content_sources_external_id_idx").on(
      table.externalId,
    ),
  }),
);

export const scientificSeries = pgTable(
  "scientific_series",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    bookTitle: text("book_title"),
    categoryId: uuid("category_id").references(() => knowledgeCategories.id, {
      onDelete: "set null",
    }),
    subcategoryId: uuid("subcategory_id").references(
      () => knowledgeSubcategories.id,
      { onDelete: "set null" },
    ),
    sourceId: uuid("source_id").references(() => contentSources.id, {
      onDelete: "set null",
    }),
    channel: text("channel"),
    playlistId: text("playlist_id"),
    url: text("url"),
    videoCount: integer("video_count").notNull().default(0),
    status: text("status")
      .$type<"مكتملة" | "غير مكتملة">()
      .notNull()
      .default("غير مكتملة"),
    trust: text("trust").$type<TrustLevel>().notNull().default("متوسط"),
    publishStatus: text("publish_status")
      .$type<PublishStatus>()
      .notNull()
      .default("مسودة"),
    tags: jsonb("tags").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
    displayOrder: integer("display_order").notNull().default(0),
    description: text("description").notNull().default(""),
    note: text("note"),
    createdByUserId: uuid("created_by_user_id").references(() => adminUsers.id, {
      onDelete: "set null",
    }),
    updatedByUserId: uuid("updated_by_user_id").references(() => adminUsers.id, {
      onDelete: "set null",
    }),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: now(),
    updatedAt: updatedAt(),
  },
  (table) => ({
    slugIdx: uniqueIndex("scientific_series_slug_idx").on(table.slug),
    publishStatusIdx: index("scientific_series_publish_status_idx").on(
      table.publishStatus,
    ),
    categoryIdx: index("scientific_series_category_idx").on(table.categoryId),
  }),
);

export const seriesVideos = pgTable(
  "series_videos",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    seriesId: uuid("series_id")
      .notNull()
      .references(() => scientificSeries.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    videoId: text("video_id"),
    url: text("url").notNull(),
    duration: text("duration"),
    durationSeconds: integer("duration_seconds"),
    lessonOrder: integer("lesson_order").notNull().default(0),
    publishStatus: text("publish_status")
      .$type<PublishStatus>()
      .notNull()
      .default("مسودة"),
    description: text("description").notNull().default(""),
    tags: jsonb("tags").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
    sourceId: uuid("source_id").references(() => contentSources.id, {
      onDelete: "set null",
    }),
    createdAt: now(),
    updatedAt: updatedAt(),
  },
  (table) => ({
    seriesIdx: index("series_videos_series_idx").on(table.seriesId),
    videoIdIdx: index("series_videos_video_id_idx").on(table.videoId),
    orderIdx: index("series_videos_order_idx").on(table.lessonOrder),
  }),
);

export const lectures = pgTable(
  "lectures",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    lectureType: text("lecture_type")
      .$type<"محاضرة عامة" | "لقاء علمي" | "كلمة مطولة" | "برنامج">()
      .notNull()
      .default("محاضرة عامة"),
    categoryId: uuid("category_id").references(() => knowledgeCategories.id, {
      onDelete: "set null",
    }),
    subcategoryId: uuid("subcategory_id").references(
      () => knowledgeSubcategories.id,
      { onDelete: "set null" },
    ),
    sourceId: uuid("source_id").references(() => contentSources.id, {
      onDelete: "set null",
    }),
    channel: text("channel"),
    videoId: text("video_id"),
    url: text("url").notNull(),
    duration: text("duration"),
    durationSeconds: integer("duration_seconds"),
    dateHijri: text("date_hijri"),
    dateGregorian: text("date_gregorian"),
    trust: text("trust").$type<TrustLevel>().notNull().default("متوسط"),
    publishStatus: text("publish_status")
      .$type<PublishStatus>()
      .notNull()
      .default("مسودة"),
    tags: jsonb("tags").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
    displayOrder: integer("display_order").notNull().default(0),
    description: text("description").notNull().default(""),
    note: text("note"),
    createdByUserId: uuid("created_by_user_id").references(() => adminUsers.id, {
      onDelete: "set null",
    }),
    updatedByUserId: uuid("updated_by_user_id").references(() => adminUsers.id, {
      onDelete: "set null",
    }),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: now(),
    updatedAt: updatedAt(),
  },
  (table) => ({
    publishStatusIdx: index("lectures_publish_status_idx").on(
      table.publishStatus,
    ),
    categoryIdx: index("lectures_category_idx").on(table.categoryId),
    videoIdIdx: index("lectures_video_id_idx").on(table.videoId),
  }),
);

export const words = pgTable(
  "words",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    wordType: text("word_type")
      .$type<"كلمة توجيهية" | "موعظة" | "توجيه" | "فائدة دعوية">()
      .notNull()
      .default("كلمة توجيهية"),
    categoryId: uuid("category_id").references(() => knowledgeCategories.id, {
      onDelete: "set null",
    }),
    subcategoryId: uuid("subcategory_id").references(
      () => knowledgeSubcategories.id,
      { onDelete: "set null" },
    ),
    sourceId: uuid("source_id").references(() => contentSources.id, {
      onDelete: "set null",
    }),
    channel: text("channel"),
    videoId: text("video_id"),
    url: text("url").notNull(),
    duration: text("duration"),
    durationSeconds: integer("duration_seconds"),
    dateHijri: text("date_hijri"),
    dateGregorian: text("date_gregorian"),
    trust: text("trust").$type<TrustLevel>().notNull().default("متوسط"),
    publishStatus: text("publish_status")
      .$type<PublishStatus>()
      .notNull()
      .default("مسودة"),
    tags: jsonb("tags").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
    displayOrder: integer("display_order").notNull().default(0),
    description: text("description").notNull().default(""),
    note: text("note"),
    createdByUserId: uuid("created_by_user_id").references(() => adminUsers.id, {
      onDelete: "set null",
    }),
    updatedByUserId: uuid("updated_by_user_id").references(() => adminUsers.id, {
      onDelete: "set null",
    }),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: now(),
    updatedAt: updatedAt(),
  },
  (table) => ({
    publishStatusIdx: index("words_publish_status_idx").on(table.publishStatus),
    categoryIdx: index("words_category_idx").on(table.categoryId),
    videoIdIdx: index("words_video_id_idx").on(table.videoId),
  }),
);

export const shortClips = pgTable(
  "short_clips",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    categoryId: uuid("category_id").references(() => knowledgeCategories.id, {
      onDelete: "set null",
    }),
    subcategoryId: uuid("subcategory_id").references(
      () => knowledgeSubcategories.id,
      { onDelete: "set null" },
    ),
    sourceId: uuid("source_id").references(() => contentSources.id, {
      onDelete: "set null",
    }),
    channel: text("channel"),
    videoId: text("video_id"),
    url: text("url").notNull(),
    duration: text("duration"),
    durationSeconds: integer("duration_seconds").notNull().default(0),
    trust: text("trust").$type<TrustLevel>().notNull().default("متوسط"),
    publishStatus: text("publish_status")
      .$type<PublishStatus>()
      .notNull()
      .default("مسودة"),
    tags: jsonb("tags").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
    displayOrder: integer("display_order").notNull().default(0),
    description: text("description").notNull().default(""),
    originContentType: text("origin_content_type"),
    originContentId: uuid("origin_content_id"),
    note: text("note"),
    createdByUserId: uuid("created_by_user_id").references(() => adminUsers.id, {
      onDelete: "set null",
    }),
    updatedByUserId: uuid("updated_by_user_id").references(() => adminUsers.id, {
      onDelete: "set null",
    }),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: now(),
    updatedAt: updatedAt(),
  },
  (table) => ({
    publishStatusIdx: index("short_clips_publish_status_idx").on(
      table.publishStatus,
    ),
    videoIdIdx: index("short_clips_video_id_idx").on(table.videoId),
    durationIdx: index("short_clips_duration_idx").on(table.durationSeconds),
  }),
);

export const miscSections = pgTable(
  "misc_sections",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    description: text("description").notNull().default(""),
    icon: text("icon")
      .$type<"audio" | "video" | "file" | "mic" | "book">()
      .notNull()
      .default("file"),
    publishStatus: text("publish_status")
      .$type<PublishStatus>()
      .notNull()
      .default("منشور"),
    displayOrder: integer("display_order").notNull().default(0),
    createdAt: now(),
    updatedAt: updatedAt(),
  },
  (table) => ({
    slugIdx: uniqueIndex("misc_sections_slug_idx").on(table.slug),
    orderIdx: index("misc_sections_order_idx").on(table.displayOrder),
  }),
);

export const miscItems = pgTable(
  "misc_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sectionId: uuid("section_id").references(() => miscSections.id, {
      onDelete: "set null",
    }),
    title: text("title").notNull(),
    kind: text("kind").notNull(),
    categoryId: uuid("category_id").references(() => knowledgeCategories.id, {
      onDelete: "set null",
    }),
    subcategoryId: uuid("subcategory_id").references(
      () => knowledgeSubcategories.id,
      { onDelete: "set null" },
    ),
    sourceId: uuid("source_id").references(() => contentSources.id, {
      onDelete: "set null",
    }),
    duration: text("duration"),
    audioUrl: text("audio_url"),
    videoId: text("video_id"),
    videoUrl: text("video_url"),
    fileUrl: text("file_url"),
    externalUrl: text("external_url"),
    thumbnailUrl: text("thumbnail_url"),
    downloadLabel: text("download_label"),
    trust: text("trust").$type<TrustLevel>().notNull().default("متوسط"),
    publishStatus: text("publish_status")
      .$type<PublishStatus>()
      .notNull()
      .default("مسودة"),
    tags: jsonb("tags").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
    displayOrder: integer("display_order").notNull().default(0),
    description: text("description").notNull().default(""),
    note: text("note"),
    createdByUserId: uuid("created_by_user_id").references(() => adminUsers.id, {
      onDelete: "set null",
    }),
    updatedByUserId: uuid("updated_by_user_id").references(() => adminUsers.id, {
      onDelete: "set null",
    }),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: now(),
    updatedAt: updatedAt(),
  },
  (table) => ({
    sectionIdx: index("misc_items_section_idx").on(table.sectionId),
    publishStatusIdx: index("misc_items_publish_status_idx").on(
      table.publishStatus,
    ),
  }),
);

export const scheduleItems = pgTable(
  "schedule_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    scheduleKind: text("schedule_kind")
      .$type<"درس" | "محاضرة" | "برنامج" | "لقاء">()
      .notNull()
      .default("درس"),
    categoryId: uuid("category_id").references(() => knowledgeCategories.id, {
      onDelete: "set null",
    }),
    subcategoryId: uuid("subcategory_id").references(
      () => knowledgeSubcategories.id,
      { onDelete: "set null" },
    ),
    day: text("day"),
    time: text("time"),
    dateHijri: text("date_hijri"),
    dateGregorian: text("date_gregorian"),
    location: text("location"),
    onlineUrl: text("online_url"),
    isRecurring: boolean("is_recurring").notNull().default(false),
    recurrenceType: text("recurrence_type")
      .$type<"غير متكرر" | "أسبوعي" | "شهري" | "مخصص">()
      .notNull()
      .default("غير متكرر"),
    recurrenceDetails: text("recurrence_details"),
    status: text("status")
      .$type<"قائم" | "متوقف" | "مؤجل" | "ملغي">()
      .notNull()
      .default("قائم"),
    publishStatus: text("publish_status")
      .$type<PublishStatus>()
      .notNull()
      .default("مسودة"),
    tags: jsonb("tags").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
    displayOrder: integer("display_order").notNull().default(0),
    description: text("description").notNull().default(""),
    note: text("note"),
    createdByUserId: uuid("created_by_user_id").references(() => adminUsers.id, {
      onDelete: "set null",
    }),
    updatedByUserId: uuid("updated_by_user_id").references(() => adminUsers.id, {
      onDelete: "set null",
    }),
    createdAt: now(),
    updatedAt: updatedAt(),
  },
  (table) => ({
    publishStatusIdx: index("schedule_items_publish_status_idx").on(
      table.publishStatus,
    ),
    statusIdx: index("schedule_items_status_idx").on(table.status),
    orderIdx: index("schedule_items_order_idx").on(table.displayOrder),
  }),
);

export const aiImportJobs = pgTable(
  "ai_import_jobs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    submittedByUserId: uuid("submitted_by_user_id").references(
      () => adminUsers.id,
      { onDelete: "set null" },
    ),
    sourceType: text("source_type")
      .$type<"youtube_video" | "youtube_playlist" | "audio" | "pdf" | "url">()
      .notNull(),
    sourceUrl: text("source_url").notNull(),
    status: text("status")
      .$type<AiJobStatus>()
      .notNull()
      .default("قيد الانتظار"),
    resultSummary: text("result_summary"),
    errorMessage: text("error_message"),
    rawInput: jsonb("raw_input")
      .$type<Record<string, unknown>>()
      .notNull()
      .default(sql`'{}'::jsonb`),
    rawOutput: jsonb("raw_output")
      .$type<Record<string, unknown>>()
      .notNull()
      .default(sql`'{}'::jsonb`),
    createdAt: now(),
    updatedAt: updatedAt(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
  },
  (table) => ({
    submittedByIdx: index("ai_import_jobs_submitted_by_idx").on(
      table.submittedByUserId,
    ),
    statusIdx: index("ai_import_jobs_status_idx").on(table.status),
    sourceUrlIdx: index("ai_import_jobs_source_url_idx").on(table.sourceUrl),
  }),
);

export const aiSuggestions = pgTable(
  "ai_suggestions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    jobId: uuid("job_id")
      .notNull()
      .references(() => aiImportJobs.id, { onDelete: "cascade" }),
    targetContentType: text("target_content_type")
      .$type<
        | "scientific_series"
        | "series_video"
        | "lecture"
        | "word"
        | "short_clip"
        | "misc_item"
        | "schedule_item"
      >()
      .notNull(),
    suggestedTitle: text("suggested_title"),
    suggestedData: jsonb("suggested_data")
      .$type<Record<string, unknown>>()
      .notNull()
      .default(sql`'{}'::jsonb`),
    confidenceScore: integer("confidence_score").notNull().default(0),
    status: text("status")
      .$type<AiSuggestionStatus>()
      .notNull()
      .default("مسودة"),
    reviewNotes: text("review_notes"),
    reviewedByUserId: uuid("reviewed_by_user_id").references(
      () => adminUsers.id,
      { onDelete: "set null" },
    ),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    createdAt: now(),
    updatedAt: updatedAt(),
  },
  (table) => ({
    jobIdx: index("ai_suggestions_job_idx").on(table.jobId),
    statusIdx: index("ai_suggestions_status_idx").on(table.status),
    targetTypeIdx: index("ai_suggestions_target_type_idx").on(
      table.targetContentType,
    ),
  }),
);

export const adminUsersRelations = relations(adminUsers, ({ many }) => ({
  sessions: many(adminSessions),
  auditLogs: many(adminAuditLogs),
  aiImportJobs: many(aiImportJobs),
}));

export const adminSessionsRelations = relations(adminSessions, ({ one }) => ({
  user: one(adminUsers, {
    fields: [adminSessions.userId],
    references: [adminUsers.id],
  }),
}));

export const adminAuditLogsRelations = relations(adminAuditLogs, ({ one }) => ({
  user: one(adminUsers, {
    fields: [adminAuditLogs.userId],
    references: [adminUsers.id],
  }),
}));

export const knowledgeCategoriesRelations = relations(
  knowledgeCategories,
  ({ many }) => ({
    subcategories: many(knowledgeSubcategories),
    scientificSeries: many(scientificSeries),
    lectures: many(lectures),
    words: many(words),
    shortClips: many(shortClips),
    miscItems: many(miscItems),
    scheduleItems: many(scheduleItems),
  }),
);

export const knowledgeSubcategoriesRelations = relations(
  knowledgeSubcategories,
  ({ one, many }) => ({
    category: one(knowledgeCategories, {
      fields: [knowledgeSubcategories.categoryId],
      references: [knowledgeCategories.id],
    }),
    scientificSeries: many(scientificSeries),
    lectures: many(lectures),
    words: many(words),
    shortClips: many(shortClips),
    miscItems: many(miscItems),
    scheduleItems: many(scheduleItems),
  }),
);

export const scientificSeriesRelations = relations(
  scientificSeries,
  ({ one, many }) => ({
    category: one(knowledgeCategories, {
      fields: [scientificSeries.categoryId],
      references: [knowledgeCategories.id],
    }),
    subcategory: one(knowledgeSubcategories, {
      fields: [scientificSeries.subcategoryId],
      references: [knowledgeSubcategories.id],
    }),
    source: one(contentSources, {
      fields: [scientificSeries.sourceId],
      references: [contentSources.id],
    }),
    videos: many(seriesVideos),
  }),
);

export const seriesVideosRelations = relations(seriesVideos, ({ one }) => ({
  series: one(scientificSeries, {
    fields: [seriesVideos.seriesId],
    references: [scientificSeries.id],
  }),
  source: one(contentSources, {
    fields: [seriesVideos.sourceId],
    references: [contentSources.id],
  }),
}));

export const aiImportJobsRelations = relations(
  aiImportJobs,
  ({ one, many }) => ({
    submittedBy: one(adminUsers, {
      fields: [aiImportJobs.submittedByUserId],
      references: [adminUsers.id],
    }),
    suggestions: many(aiSuggestions),
  }),
);

export const aiSuggestionsRelations = relations(aiSuggestions, ({ one }) => ({
  job: one(aiImportJobs, {
    fields: [aiSuggestions.jobId],
    references: [aiImportJobs.id],
  }),
  reviewedBy: one(adminUsers, {
    fields: [aiSuggestions.reviewedByUserId],
    references: [adminUsers.id],
  }),
}));