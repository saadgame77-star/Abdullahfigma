import { Link } from "react-router";
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  Clock,
  ExternalLink,
  Library,
  MessageCircle,
  Mic2,
  Play,
  PlaySquare,
  Tags,
  Video,
} from "lucide-react";
import { useState } from "react";
import { scientificSeries } from "../data/scientificSeries";
import { shortClips } from "../data/shortClips";
import { lectures } from "../data/lectures";
import { words } from "../data/words";
import { scheduleItems } from "../data/scheduleItems";

export function Home() {
  const [activeShortVideoId, setActiveShortVideoId] = useState<string | null>(
    null,
  );

  const publishedSeries = scientificSeries.filter(
    (series) => series.publishStatus === "منشور",
  );

  const publishedShorts = shortClips.filter(
    (clip) => clip.publishStatus === "منشور" && clip.durationSeconds <= 180,
  );

  const publishedLectures = lectures.filter(
    (lecture) => lecture.publishStatus === "منشور",
  );

  const publishedWords = words.filter((word) => word.publishStatus === "منشور");

  const publishedScheduleItems = scheduleItems.filter(
    (item) => item.publishStatus === "منشور",
  );

  const completedSeriesCount = publishedSeries.filter(
    (series) => series.statusLabel === "مكتملة",
  ).length;

  const inProgressSeriesCount = publishedSeries.filter(
    (series) => series.statusLabel === "قيد الاكتمال",
  ).length;

  const latestSeries = publishedSeries.slice(0, 3);
  const latestShorts = publishedShorts.slice(0, 3);
  const nextScheduleItems = publishedScheduleItems.slice(0, 3);

  const platformSections = [
    {
      title: "الدروس العلمية",
      desc: "سلاسل علمية وشروح منهجية مرتبة حسب أبواب العلم",
      icon: <BookOpen className="w-8 h-8" />,
      path: "/lessons",
      count: publishedSeries.length,
    },
    {
      title: "المحاضرات",
      desc: "محاضرات ولقاءات علمية ودعوية عامة",
      icon: <Mic2 className="w-8 h-8" />,
      path: "/lectures",
      count: publishedLectures.length,
    },
    {
      title: "الكلمات الدعوية",
      desc: "كلمات موجزة وتوجيهات نافعة",
      icon: <MessageCircle className="w-8 h-8" />,
      path: "/words",
      count: publishedWords.length,
    },
    {
      title: "المقاطع القصيرة",
      desc: "فوائد مختصرة لا تتجاوز ثلاث دقائق",
      icon: <Video className="w-8 h-8" />,
      path: "/shorts",
      count: publishedShorts.length,
    },
  ];

  function getShortThumbnail(videoId: string) {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }

  function getShortEmbedUrl(videoId: string) {
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
  }

  return (
    <div className="animate-in fade-in duration-700">
      <section className="relative bg-[var(--color-islamic-green)] text-white overflow-hidden py-24">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.2) 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        ></div>

        <div className="absolute -top-40 -left-40 w-96 h-96 border-[40px] border-[var(--color-islamic-green-light)] rounded-full opacity-20"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 border-[40px] border-[var(--color-islamic-gold)] rounded-full opacity-10"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="mb-8">
              <p className="text-[var(--color-islamic-gold)] font-sans text-xl sm:text-2xl md:text-3xl tracking-wide font-medium mb-4">
                الموقع الرسمي للشيخ
              </p>

              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-white max-w-5xl mx-auto">
                عبدالله بن سعد آل غلفيص
              </h1>
            </div>

            <p className="text-lg md:text-xl text-gray-200 leading-relaxed max-w-3xl mx-auto mb-12 font-light">
              منصة علمية تجمع السلاسل العلمية، والمحاضرات، والكلمات الدعوية،
              والمقاطع القصيرة، وفق تصنيف منهجي لأبواب العلم.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/schedule"
                className="bg-transparent border border-[var(--color-islamic-gold)] text-[var(--color-islamic-gold)] px-8 py-4 rounded-sm font-bold text-lg hover:bg-[var(--color-islamic-gold)] hover:text-[var(--color-islamic-green-dark)] transition-all flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <Clock className="w-5 h-5" />
                جدول المحاضرات والدروس
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            <div className="bg-[var(--color-islamic-ivory)] border border-gray-200 rounded-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <Library className="w-6 h-6 text-[var(--color-islamic-gold)]" />
                <span className="text-2xl font-bold text-[var(--color-islamic-green-dark)]">
                  {publishedSeries.length}
                </span>
              </div>
              <p className="text-sm text-gray-600">سلسلة علمية</p>
            </div>

            <div className="bg-[var(--color-islamic-ivory)] border border-gray-200 rounded-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <CheckCircle2 className="w-6 h-6 text-[var(--color-islamic-gold)]" />
                <span className="text-2xl font-bold text-[var(--color-islamic-green-dark)]">
                  {completedSeriesCount}
                </span>
              </div>
              <p className="text-sm text-gray-600">سلسلة مكتملة</p>
            </div>

            <div className="bg-[var(--color-islamic-ivory)] border border-gray-200 rounded-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <Clock className="w-6 h-6 text-[var(--color-islamic-gold)]" />
                <span className="text-2xl font-bold text-[var(--color-islamic-green-dark)]">
                  {inProgressSeriesCount}
                </span>
              </div>
              <p className="text-sm text-gray-600">قيد الاكتمال</p>
            </div>

            <div className="bg-[var(--color-islamic-ivory)] border border-gray-200 rounded-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <Video className="w-6 h-6 text-[var(--color-islamic-gold)]" />
                <span className="text-2xl font-bold text-[var(--color-islamic-green-dark)]">
                  {publishedShorts.length}
                </span>
              </div>
              <p className="text-sm text-gray-600">مقطع قصير</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 container mx-auto px-4">
        <div className="flex items-end justify-between mb-12 border-b-2 border-gray-200 pb-4">
          <div>
            <span className="text-[var(--color-islamic-gold)] font-serif text-xl block mb-2">
              السلاسل العلمية
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-[var(--color-islamic-green-dark)] font-bold">
              أحدث السلاسل المنشورة
            </h2>
          </div>

          <Link
            to="/lessons"
            className="hidden sm:flex items-center gap-1 text-[var(--color-islamic-green)] font-medium hover:text-[var(--color-islamic-gold)] transition-colors"
          >
            عرض الكل
            <ChevronLeft className="w-5 h-5" />
          </Link>
        </div>

        {latestSeries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestSeries.map((series) => (
              <article
                key={series.id}
                className="bg-white rounded-sm shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow group"
              >
                <div className="aspect-video bg-gray-900 relative flex items-center justify-center">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/videoseries?list=${series.playlistId}`}
                    title={series.title}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />

                  <div className="absolute top-4 right-4 bg-[var(--color-islamic-green)] text-white text-xs px-3 py-1 rounded-sm">
                    {series.knowledgeArea}
                  </div>

                  <div className="absolute top-4 left-4 bg-[var(--color-islamic-gold)] text-[var(--color-islamic-green-dark)] text-xs px-3 py-1 rounded-sm font-bold">
                    {series.statusLabel}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-serif font-bold text-xl mb-2 text-gray-800 line-clamp-2 group-hover:text-[var(--color-islamic-green)] transition-colors">
                    {series.title}
                  </h3>

                  {series.bookTitle && (
                    <p className="text-sm text-[var(--color-islamic-green)] font-bold mb-3">
                      {series.bookTitle}
                    </p>
                  )}

                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                    {series.description}
                  </p>

                  <div className="flex items-center text-sm text-gray-500 gap-4 mt-4 pt-4 border-t border-gray-100">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {series.subCategory}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {series.count}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-sm p-8 text-center text-gray-500">
            لا توجد سلاسل علمية منشورة حاليًا.
          </div>
        )}
      </section>

      <section className="bg-white py-20 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-12 border-b-2 border-gray-200 pb-4">
            <div>
              <span className="text-[var(--color-islamic-gold)] font-serif text-xl block mb-2">
                فوائد مختصرة
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-[var(--color-islamic-green-dark)] font-bold">
                أحدث المقاطع القصيرة
              </h2>
            </div>

            <Link
              to="/shorts"
              className="hidden sm:flex items-center gap-1 text-[var(--color-islamic-green)] font-medium hover:text-[var(--color-islamic-gold)] transition-colors"
            >
              عرض الكل
              <ChevronLeft className="w-5 h-5" />
            </Link>
          </div>

          {latestShorts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestShorts.map((clip) => {
                const isActive = activeShortVideoId === clip.videoId;

                return (
                  <article
                    key={clip.id}
                    className="bg-[var(--color-islamic-ivory)] border border-gray-200 rounded-sm overflow-hidden hover:border-[var(--color-islamic-gold)] hover:shadow-lg transition-all"
                  >
                    <div className="aspect-video bg-gray-900 relative">
                      {isActive ? (
                        <iframe
                          className="w-full h-full"
                          src={getShortEmbedUrl(clip.videoId)}
                          title={clip.title}
                          loading="lazy"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      ) : (
                        <button
                          type="button"
                          onClick={() => setActiveShortVideoId(clip.videoId)}
                          className="absolute inset-0 w-full h-full flex items-center justify-center group"
                        >
                          <img
                            src={getShortThumbnail(clip.videoId)}
                            alt={clip.title}
                            className="absolute inset-0 w-full h-full object-cover opacity-80"
                            loading="lazy"
                          />

                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                          <span className="relative z-10 w-16 h-16 rounded-full bg-black/50 border border-white/20 flex items-center justify-center group-hover:bg-[var(--color-islamic-gold)] transition-colors">
                            <Play className="w-8 h-8 text-white group-hover:text-[var(--color-islamic-green-dark)] fill-current" />
                          </span>

                          <span className="absolute top-3 right-3 z-10 rounded-sm bg-[var(--color-islamic-green)] px-2.5 py-1 text-xs font-bold text-white">
                            {clip.duration}
                          </span>
                        </button>
                      )}
                    </div>

                    <div className="p-5">
                      <h3 className="font-serif text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                        {clip.title}
                      </h3>

                      <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                        {clip.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-4">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[var(--color-islamic-gold)]" />
                          {clip.duration}
                        </span>

                        <span className="inline-flex items-center gap-1">
                          <Tags className="w-3.5 h-3.5 text-[var(--color-islamic-gold)]" />
                          {clip.category}
                        </span>
                      </div>

                      <a
                        href={clip.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-sm border border-[var(--color-islamic-green)] px-3 py-2 text-sm font-medium text-[var(--color-islamic-green)] transition-colors hover:bg-[var(--color-islamic-green)] hover:text-white"
                      >
                        فتح في يوتيوب
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="bg-[var(--color-islamic-ivory)] border border-gray-200 rounded-sm p-8 text-center text-gray-500">
              لا توجد مقاطع قصيرة منشورة حاليًا.
            </div>
          )}
        </div>
      </section>

      <section className="py-20 container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl text-[var(--color-islamic-green-dark)] font-bold mb-4">
            أقسام المنصة
          </h2>
          <div className="w-24 h-1 bg-[var(--color-islamic-gold)] mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {platformSections.map((item) => (
            <Link
              key={item.title}
              to={item.path}
              className="group block bg-white border border-gray-200 p-8 rounded-sm hover:border-[var(--color-islamic-gold)] hover:shadow-lg transition-all text-center"
            >
              <div className="w-16 h-16 mx-auto bg-[var(--color-islamic-ivory)] rounded-full flex items-center justify-center text-[var(--color-islamic-green)] group-hover:text-white group-hover:bg-[var(--color-islamic-green)] transition-colors shadow-sm mb-6">
                {item.icon}
              </div>

              <h3 className="font-serif text-xl font-bold text-gray-800 mb-2 group-hover:text-[var(--color-islamic-gold)] transition-colors">
                {item.title}
              </h3>

              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                {item.desc}
              </p>

              <span className="inline-flex items-center justify-center rounded-sm bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600">
                {item.count} منشور
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white py-16 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-[var(--color-islamic-ivory)] border border-gray-200 rounded-sm p-8">
              <div className="flex items-center gap-3 mb-5">
                <CalendarDays className="w-7 h-7 text-[var(--color-islamic-gold)]" />
                <h2 className="font-serif text-2xl font-bold text-[var(--color-islamic-green-dark)]">
                  جدول المحاضرات والدروس
                </h2>
              </div>

              {nextScheduleItems.length > 0 ? (
                <div className="space-y-4">
                  {nextScheduleItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white border border-gray-200 rounded-sm p-4"
                    >
                      <h3 className="font-bold text-gray-800 mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {item.day || "يحدد لاحقًا"} —{" "}
                        {item.time || "يحدد لاحقًا"}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 leading-relaxed">
                  لا توجد مواعيد منشورة حاليًا. سيتم تحديث الجدول عند اعتماد
                  المواعيد الرسمية.
                </p>
              )}

              <Link
                to="/schedule"
                className="inline-flex items-center gap-2 mt-6 text-[var(--color-islamic-green)] font-bold hover:text-[var(--color-islamic-gold)] transition-colors"
              >
                عرض الجدول
                <ChevronLeft className="w-5 h-5" />
              </Link>
            </div>

            <div className="bg-[var(--color-islamic-green)] text-white rounded-sm p-8 relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.25) 1px, transparent 0)",
                  backgroundSize: "24px 24px",
                }}
              ></div>

              <div className="relative z-10">
                <h2 className="font-serif text-2xl font-bold mb-4">
                  تصنيف علمي منهجي
                </h2>

                <p className="text-gray-100 leading-relaxed mb-6">
                  صُممت المنصة لتجميع المحتوى وفق أبواب العلم والوسوم، بحيث يسهل
                  الوصول لاحقًا إلى السلاسل، والفوائد، والمحاضرات، والكلمات حسب
                  الموضوع والتصنيف.
                </p>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <span className="bg-white/10 border border-white/10 rounded-sm px-3 py-2">
                    أبواب العلم
                  </span>
                  <span className="bg-white/10 border border-white/10 rounded-sm px-3 py-2">
                    وسوم البحث
                  </span>
                  <span className="bg-white/10 border border-white/10 rounded-sm px-3 py-2">
                    حالة النشر
                  </span>
                  <span className="bg-white/10 border border-white/10 rounded-sm px-3 py-2">
                    مصادر موثقة
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
