import { Link } from "react-router";
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  Clock,
  Library,
  MapPin,
  MessageCircle,
  Mic2,
  Play,
  Repeat,
  Video,
} from "lucide-react";
import { scientificSeries } from "../data/scientificSeries";
import { shortClips } from "../data/shortClips";
import { lectures } from "../data/lectures";
import { words } from "../data/words";
import { scheduleItems } from "../data/scheduleItems";

export function Home() {
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
  const upcomingActivity = publishedScheduleItems[0];

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
    {
      title: "متفرقات",
      desc: "تلاوات وخطب وكتب إلكترونية ومواد أخرى",
      icon: <Library className="w-8 h-8" />,
      path: "/recitations",
      count: 0,
    },
  ];

  function getShortThumbnail(videoId: string) {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }

  function getScheduleStatusClass(status: string) {
    if (status === "قائم") return "bg-green-100 text-green-800";
    if (status === "مؤجل") return "bg-amber-100 text-amber-800";
    if (status === "متوقف") return "bg-gray-100 text-gray-700";
    return "bg-red-100 text-red-700";
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
              والمقاطع القصيرة، والمواد المتفرقة، وفق تصنيف منهجي لأبواب العلم.
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

      <section className="bg-white border-b border-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="rounded-sm border border-gray-200 bg-[var(--color-islamic-ivory)] shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_auto]">
              <div className="bg-[var(--color-islamic-green-dark)] text-white p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-sm bg-[var(--color-islamic-gold)] text-[var(--color-islamic-green-dark)] flex items-center justify-center">
                  <CalendarDays className="w-6 h-6" />
                </div>

                <div>
                  <p className="text-sm text-[var(--color-islamic-gold)] font-bold mb-1">
                    نافذة المتابعة
                  </p>
                  <h2 className="font-serif text-2xl font-bold">
                    النشاط القادم
                  </h2>
                </div>
              </div>

              <div className="p-6">
                {upcomingActivity ? (
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="inline-flex items-center rounded-sm bg-white border border-gray-200 px-3 py-1 text-xs font-bold text-[var(--color-islamic-green)]">
                        {upcomingActivity.scheduleKind}
                      </span>

                      <span
                        className={`inline-flex items-center rounded-sm px-3 py-1 text-xs font-bold ${getScheduleStatusClass(
                          upcomingActivity.status,
                        )}`}
                      >
                        {upcomingActivity.status}
                      </span>

                      <span className="inline-flex items-center gap-1 rounded-sm bg-white border border-gray-200 px-3 py-1 text-xs text-gray-600">
                        <Repeat className="w-3.5 h-3.5 text-[var(--color-islamic-gold)]" />
                        {upcomingActivity.recurrenceType}
                      </span>
                    </div>

                    <h3 className="font-serif text-2xl font-bold text-[var(--color-islamic-green-dark)] mb-2">
                      {upcomingActivity.title}
                    </h3>

                    <p className="text-sm text-gray-600 leading-relaxed mb-4 max-w-3xl">
                      {upcomingActivity.description}
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays className="w-4 h-4 text-[var(--color-islamic-gold)]" />
                        {upcomingActivity.day || "اليوم يحدد لاحقًا"}
                      </span>

                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-4 h-4 text-[var(--color-islamic-gold)]" />
                        {upcomingActivity.time || "الوقت يحدد لاحقًا"}
                      </span>

                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-[var(--color-islamic-gold)]" />
                        {upcomingActivity.location || "المكان يحدد لاحقًا"}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-[var(--color-islamic-green-dark)] mb-2">
                      لا يوجد نشاط قادم منشور حاليًا
                    </h3>

                    <p className="text-gray-600 leading-relaxed max-w-3xl">
                      عند إضافة موعد منشور في جدول المحاضرات والدروس سيظهر هنا
                      تلقائيًا أقرب درس أو محاضرة أو كلمة قادمة.
                    </p>
                  </div>
                )}
              </div>

              <div className="p-6 flex items-center bg-white border-t lg:border-t-0 lg:border-r border-gray-200">
                <Link
                  to="/schedule"
                  className="inline-flex items-center justify-center gap-2 bg-[var(--color-islamic-green)] text-white px-5 py-3 rounded-sm font-bold hover:bg-[var(--color-islamic-green-dark)] transition-colors whitespace-nowrap"
                >
                  عرض الجدول
                  <ChevronLeft className="w-4 h-4" />
                </Link>
              </div>
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
              {latestShorts.map((clip) => (
                <Link
                  key={clip.id}
                  to="/shorts"
                  className="group bg-[var(--color-islamic-ivory)] border border-gray-200 rounded-sm overflow-hidden hover:border-[var(--color-islamic-gold)] hover:shadow-lg transition-all"
                >
                  <div className="aspect-video bg-gray-900 relative">
                    <img
                      src={getShortThumbnail(clip.videoId)}
                      alt={clip.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-80"
                      loading="lazy"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="w-16 h-16 rounded-full bg-black/50 border border-white/20 flex items-center justify-center group-hover:bg-[var(--color-islamic-gold)] transition-colors">
                        <Play className="w-8 h-8 text-white group-hover:text-[var(--color-islamic-green-dark)] fill-current" />
                      </span>
                    </span>

                    <span className="absolute top-3 right-3 z-10 rounded-sm bg-[var(--color-islamic-green)] px-2.5 py-1 text-xs font-bold text-white">
                      {clip.duration}
                    </span>
                  </div>

                  <div className="p-5">
                    <h3 className="font-serif text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-[var(--color-islamic-green)] transition-colors">
                      {clip.title}
                    </h3>

                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                      {clip.description}
                    </p>

                    <span className="inline-flex items-center gap-1 text-sm font-bold text-[var(--color-islamic-green)]">
                      مشاهدة داخل الموقع
                      <ChevronLeft className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              ))}
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {platformSections.map((item) => (
            <Link
              key={item.title}
              to={item.path}
              className="group block bg-white border border-gray-200 p-7 rounded-sm hover:border-[var(--color-islamic-gold)] hover:shadow-lg transition-all text-center"
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
          <div className="bg-[var(--color-islamic-green)] text-white rounded-sm p-8 relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.25) 1px, transparent 0)",
                backgroundSize: "24px 24px",
              }}
            ></div>

            <div className="relative z-10 max-w-4xl mx-auto text-center">
              <h2 className="font-serif text-2xl font-bold mb-4">
                تصنيف علمي منهجي
              </h2>

              <p className="text-gray-100 leading-relaxed mb-6">
                صُممت المنصة لتجميع المحتوى وفق أبواب العلم والوسوم، بحيث يسهل
                الوصول لاحقًا إلى السلاسل، والفوائد، والمحاضرات، والكلمات حسب
                الموضوع والتصنيف.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
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
                  لوحة تحكم لاحقة
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
