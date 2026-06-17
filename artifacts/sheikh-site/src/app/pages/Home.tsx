import { Link } from "react-router";
import {
  ArrowLeft,
  Clock3,
  Layers,
  MapPin,
  Mic,
  MessageSquare,
  PlayCircle,
} from "lucide-react";
import {
  publicApi,
  type PublicLecture,
  type PublicScheduleItem,
  type PublicSeries,
  type PublicShort,
  type PublicWord,
} from "../lib/publicApi";
import { usePublicData } from "../lib/usePublicData";

type ContentType = "سلسلة" | "محاضرة" | "كلمة";

type UnifiedItem = {
  key: string;
  type: ContentType;
  title: string;
  description: string;
  badge: string;
  knowledgeArea: string;
  href: string;
  thumbnail: string | null;
  displayOrder: number;
};

function youtubeThumb(videoId?: string) {
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
}

function getSeriesThumbnail(videos?: { videoId?: string }[]) {
  if (videos?.length && videos[0].videoId) {
    return youtubeThumb(videos[0].videoId);
  }

  return null;
}

function getShortThumbnail(videoId: string) {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

function getPublishedTeachings(
  scientificSeries: PublicSeries[],
  lectures: PublicLecture[],
  words: PublicWord[],
): UnifiedItem[] {
  const seriesItems: UnifiedItem[] = scientificSeries
    .filter((series) => series.publishStatus === "منشور")
    .map((series) => ({
      key: `series-${series.id}`,
      type: "سلسلة",
      title: series.title,
      description: series.description,
      badge: "سلسلة علمية",
      knowledgeArea: series.knowledgeArea,
      href: "/lessons",
      thumbnail: getSeriesThumbnail(series.videos),
      displayOrder: series.displayOrder,
    }));

  const lectureItems: UnifiedItem[] = lectures
    .filter((lecture) => lecture.publishStatus === "منشور")
    .map((lecture) => ({
      key: `lecture-${lecture.id}`,
      type: "محاضرة",
      title: lecture.title,
      description: lecture.description,
      badge: lecture.lectureType,
      knowledgeArea: lecture.knowledgeArea,
      href: "/lectures",
      thumbnail: youtubeThumb(lecture.videoId),
      displayOrder: lecture.displayOrder,
    }));

  const wordItems: UnifiedItem[] = words
    .filter((word) => word.publishStatus === "منشور")
    .map((word) => ({
      key: `word-${word.id}`,
      type: "كلمة",
      title: word.title,
      description: word.description,
      badge: word.wordType,
      knowledgeArea: word.knowledgeArea,
      href: "/words",
      thumbnail: youtubeThumb(word.videoId),
      displayOrder: word.displayOrder,
    }));

  return [...seriesItems, ...lectureItems, ...wordItems].sort(
    (a, b) => a.displayOrder - b.displayOrder,
  );
}

function getUpcomingActivity(scheduleItems: PublicScheduleItem[]) {
  const publishedItems = scheduleItems
    .filter(
      (item) =>
        item.publishStatus === "منشور" &&
        (item.status === "قائم" || item.status === "مؤجل"),
    )
    .sort((a, b) => a.displayOrder - b.displayOrder);

  return publishedItems[0] ?? null;
}

function getStats(
  scientificSeries: PublicSeries[],
  lectures: PublicLecture[],
  words: PublicWord[],
  shortClips: PublicShort[],
) {
  const publishedSeries = scientificSeries.filter(
    (series) => series.publishStatus === "منشور",
  );

  const seriesCount = publishedSeries.length;

  const episodesCount = publishedSeries.reduce(
    (sum, series) => sum + (series.videos?.length ?? 0),
    0,
  );

  const shortsCount = shortClips.filter(
    (clip) => clip.publishStatus === "منشور" && clip.durationSeconds <= 180,
  ).length;

  const areas = new Set<string>();

  for (const series of publishedSeries) {
    if (series.knowledgeArea) areas.add(series.knowledgeArea);
  }

  for (const lecture of lectures) {
    if (lecture.publishStatus === "منشور" && lecture.knowledgeArea) {
      areas.add(lecture.knowledgeArea);
    }
  }

  for (const word of words) {
    if (word.publishStatus === "منشور" && word.knowledgeArea) {
      areas.add(word.knowledgeArea);
    }
  }

  return [
    { value: seriesCount, label: "سلسلة علمية" },
    { value: episodesCount, label: "درس وحلقة" },
    { value: shortsCount, label: "مقطع قصير" },
    { value: areas.size, label: "باب علم" },
  ];
}

const TYPE_ICON: Record<ContentType, typeof Layers> = {
  سلسلة: Layers,
  محاضرة: Mic,
  كلمة: MessageSquare,
};

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  to?: string;
};

function SectionHeading({ eyebrow, title, to }: SectionHeadingProps) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div className="text-right">
        <p className="mb-1 text-sm font-medium text-[var(--color-islamic-gold)]">
          {eyebrow}
        </p>

        <h2 className="font-serif text-2xl font-bold text-[var(--color-islamic-green-dark)] sm:text-3xl">
          {title}
        </h2>
      </div>

      {to && (
        <Link
          to={to}
          className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-[var(--color-islamic-green-dark)] transition-colors hover:text-[var(--color-islamic-gold)]"
        >
          عرض الكل
          <ArrowLeft className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

export function Home() {
  const seriesData = usePublicData(publicApi.getSeries);
  const lecturesData = usePublicData(publicApi.getLectures);
  const wordsData = usePublicData(publicApi.getWords);
  const shortsData = usePublicData(publicApi.getShorts);
  const scheduleData = usePublicData(publicApi.getSchedule);

  const scientificSeries = seriesData.data?.items ?? [];
  const lectures = lecturesData.data?.items ?? [];
  const words = wordsData.data?.items ?? [];
  const shortClips = shortsData.data?.items ?? [];
  const scheduleItems = scheduleData.data?.items ?? [];

  const teachings = getPublishedTeachings(scientificSeries, lectures, words);

  const leadItem = teachings[0] ?? null;
  const sideItems = teachings.slice(1, 4);

  const stats = getStats(scientificSeries, lectures, words, shortClips);
  const upcomingActivity = getUpcomingActivity(scheduleItems);

  const featuredShorts = shortClips
    .filter(
      (clip) => clip.publishStatus === "منشور" && clip.durationSeconds <= 180,
    )
    .slice(0, 4);

  return (
    <div dir="rtl" className="animate-in fade-in duration-500">
      {/* ===== الهيرو: رسالة موجزة + نشاط قادم مدمج ===== */}
      <section className="relative overflow-hidden border-b border-gray-100 bg-[var(--color-islamic-ivory)]">
        <div className="pointer-events-none absolute inset-0 opacity-70">
          <div className="absolute -right-24 -top-16 h-72 w-72 rounded-full border border-[var(--color-islamic-gold)]/15" />
          <div className="absolute -left-24 bottom-0 h-80 w-80 rounded-full border border-[var(--color-islamic-green)]/10" />
          <div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, rgba(10,54,34,0.06) 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="container relative z-10 mx-auto px-4 py-10 md:py-14">
          <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 lg:grid-cols-[1.25fr_0.75fr]">
            <div className="text-right">
              <p className="mb-4 inline-flex items-center gap-2 text-sm font-bold tracking-wide text-[var(--color-islamic-gold)]">
                <span className="h-px w-8 bg-[var(--color-islamic-gold)]" />
                بوابة علمية شرعية
              </p>

              <h1 className="mb-5 font-serif text-3xl font-bold leading-[1.4] text-[var(--color-islamic-green-dark)] sm:text-4xl md:text-[2.45rem]">
                دروس الشيخ ومحاضراته وكلماته
                <br />
                في موضعٍ واحد منظّم
              </h1>

              <p className="max-w-2xl text-base leading-loose text-gray-600 sm:text-lg">
                جمعٌ يعتني به نفرٌ من طلاب الشيخ، يضمّ سلاسله العلمية ومحاضراته
                وكلماته الدعوية وفوائده القصيرة، مرتّبةً وفق أبواب العلم تيسيرًا
                على طالب العلم.
              </p>
            </div>

            <div className="lg:pr-4">
              {upcomingActivity ? (
                <Link
                  to="/schedule"
                  className="group block rounded-sm border border-gray-200 bg-white p-5 text-right shadow-sm transition-all hover:border-[var(--color-islamic-gold)] hover:shadow-md"
                >
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-islamic-ivory)] px-3 py-1 text-xs font-bold text-[var(--color-islamic-green-dark)]">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-islamic-gold)]" />
                      النشاط القادم
                    </span>

                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-[var(--color-islamic-green-dark)] text-[var(--color-islamic-gold)]">
                      <Clock3 className="h-5 w-5" />
                    </span>
                  </div>

                  <h2 className="font-serif text-xl font-bold leading-relaxed text-[var(--color-islamic-green-dark)]">
                    {upcomingActivity.title}
                  </h2>

                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600">
                    {upcomingActivity.scheduleKind && (
                      <span className="inline-flex items-center gap-1.5">
                        <Layers className="h-4 w-4 text-[var(--color-islamic-gold)]" />
                        {upcomingActivity.scheduleKind}
                      </span>
                    )}

                    {(upcomingActivity.day || upcomingActivity.time) && (
                      <span className="inline-flex items-center gap-1.5">
                        <Clock3 className="h-4 w-4 text-[var(--color-islamic-gold)]" />
                        {[upcomingActivity.day, upcomingActivity.time]
                          .filter(Boolean)
                          .join(" • ")}
                      </span>
                    )}

                    {upcomingActivity.location && (
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-[var(--color-islamic-gold)]" />
                        {upcomingActivity.location}
                      </span>
                    )}
                  </div>

                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-[var(--color-islamic-green-dark)]">
                    عرض الجدول
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                  </span>
                </Link>
              ) : (
                <div className="rounded-sm border border-gray-200 bg-white p-5 text-right shadow-sm">
                  <p className="mb-2 text-sm font-bold text-[var(--color-islamic-gold)]">
                    النشاط القادم
                  </p>

                  <h2 className="font-serif text-xl font-bold text-[var(--color-islamic-green-dark)]">
                    لا يوجد نشاط قادم منشور حاليًا
                  </h2>

                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    سيظهر هنا أقرب موعد عند نشره في جدول المحاضرات والدروس.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===== أحدث المحاضرات والدروس: عنصر بارز + قائمة جانبية ===== */}
      <section className="bg-white/60 py-14">
        <div className="container mx-auto px-4">
          <SectionHeading
            eyebrow="المحتوى العلمي"
            title="أحدث المحاضرات والدروس المنشورة"
            to="/lessons"
          />

          <div className="mb-8 h-px bg-gray-200" />

          {leadItem ? (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
              <article className="group overflow-hidden rounded-sm border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md">
                <Link to={leadItem.href} className="block">
                  <div className="relative aspect-video overflow-hidden bg-[var(--color-islamic-green-dark)]">
                    {leadItem.thumbnail ? (
                      <img
                        src={leadItem.thumbnail}
                        alt={leadItem.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[var(--color-islamic-green-dark)] to-[var(--color-islamic-green)]">
                        {(() => {
                          const I = TYPE_ICON[leadItem.type];
                          return <I className="h-14 w-14 text-white/25" />;
                        })()}
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />

                    <span className="absolute right-3 top-3 rounded-sm bg-[var(--color-islamic-green-dark)]/90 px-2.5 py-1 text-xs font-bold text-white">
                      {leadItem.badge}
                    </span>
                  </div>

                  <div className="p-5 text-right">
                    <h3 className="mb-2 font-serif text-xl font-bold leading-snug text-[var(--color-islamic-green-dark)]">
                      {leadItem.title}
                    </h3>

                    <p className="leading-relaxed text-gray-600">
                      {leadItem.description}
                    </p>
                  </div>
                </Link>
              </article>

              <div className="flex flex-col gap-3">
                {sideItems.length > 0 ? (
                  sideItems.map((item) => {
                    const ItemIcon = TYPE_ICON[item.type];

                    return (
                      <Link
                        key={item.key}
                        to={item.href}
                        className="group flex gap-3 rounded-sm border border-gray-200 bg-white p-3 text-right shadow-sm transition-all hover:border-[var(--color-islamic-gold)] hover:shadow-md"
                      >
                        <span className="relative h-16 w-24 shrink-0 overflow-hidden rounded-sm bg-[var(--color-islamic-green-dark)]">
                          {item.thumbnail ? (
                            <img
                              src={item.thumbnail}
                              alt={item.title}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <span className="absolute inset-0 flex items-center justify-center">
                              <ItemIcon className="h-6 w-6 text-white/30" />
                            </span>
                          )}
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="mb-1 inline-flex items-center gap-1 text-xs font-bold text-[var(--color-islamic-gold)]">
                            <ItemIcon className="h-3 w-3" />
                            {item.badge}
                          </span>

                          <span className="block font-bold leading-snug text-[var(--color-islamic-green-dark)] line-clamp-2">
                            {item.title}
                          </span>
                        </span>
                      </Link>
                    );
                  })
                ) : (
                  <Link
                    to="/lessons"
                    className="flex h-full items-center justify-center rounded-sm border border-dashed border-gray-300 bg-white p-6 text-center text-sm text-gray-500 transition-colors hover:border-[var(--color-islamic-gold)]"
                  >
                    تصفّح بقية المحتوى العلمي داخل الموقع
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-sm border border-gray-200 bg-white p-8 text-center text-gray-500">
              لا يوجد محتوى منشور إضافي حاليًا.
            </div>
          )}
        </div>
      </section>

      {/* ===== فوائد قصيرة: شريط أفقي ===== */}
      {featuredShorts.length > 0 && (
        <section className="container mx-auto px-4 py-14">
          <SectionHeading
            eyebrow="فوائد مختصرة"
            title="أحدث المقاطع القصيرة"
            to="/shorts"
          />

          <div className="mb-8 h-px bg-gray-200" />

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {featuredShorts.map((clip) => (
              <Link
                key={clip.id}
                to="/shorts"
                className="group overflow-hidden rounded-sm border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="relative aspect-video overflow-hidden bg-gray-100">
                  <img
                    src={getShortThumbnail(clip.videoId)}
                    alt={clip.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />

                  <span className="absolute right-2 top-2 rounded-sm bg-[var(--color-islamic-green-dark)]/90 px-2 py-0.5 text-xs font-bold text-white">
                    {clip.duration}
                  </span>

                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 shadow-md transition-transform duration-300 group-hover:scale-110">
                      <PlayCircle className="h-6 w-6 fill-current text-[var(--color-islamic-gold)]" />
                    </span>
                  </span>
                </div>

                <div className="p-3 text-right">
                  <h3 className="font-bold leading-snug text-[var(--color-islamic-green-dark)] line-clamp-2">
                    {clip.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ===== الإحصاءات: شريط ختامي على خلفية داكنة ===== */}
      <section className="bg-[var(--color-islamic-green-dark)] py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <p className="mb-1 text-sm font-medium text-[var(--color-islamic-gold)]">
              المحتوى في أرقام
            </p>

            <h2 className="font-serif text-2xl font-bold text-white sm:text-3xl">
              نظرة على ما يضمّه الموقع
            </h2>
          </div>

          <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center justify-center gap-1 rounded-sm border border-[var(--color-islamic-gold)]/20 bg-[var(--color-islamic-green-light)]/20 px-4 py-6 text-center transition-colors hover:bg-[var(--color-islamic-green-light)]/30"
              >
                <span className="font-serif text-3xl font-bold text-white sm:text-4xl">
                  {stat.value}
                </span>

                <span className="h-0.5 w-8 rounded-full bg-[var(--color-islamic-gold)]" />

                <span className="mt-1 text-sm font-medium text-gray-200">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
