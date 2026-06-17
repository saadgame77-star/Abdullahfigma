import {
  BookOpen,
  CheckCircle2,
  Clock,
  Filter,
  Library,
  ListVideo,
  PlaySquare,
  Search,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { publicApi } from "../lib/publicApi";
import { useSiteContent } from "../components/SiteContentProvider";
import { InlineText } from "../components/InlineText";
import { usePublicData } from "../lib/usePublicData";

export function Lessons() {
  const page = useSiteContent().pages.lessons;
  const [searchTerm, setSearchTerm] = useState("");
  const [activeKnowledgeArea, setActiveKnowledgeArea] = useState("الكل");
  const [activeStatus, setActiveStatus] = useState("الكل");
  const [selectedSeriesId, setSelectedSeriesId] = useState<string | null>(null);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);

  const { data, loading, error } = usePublicData(publicApi.getSeries);
  const scientificSeries = data?.items ?? [];

  const visibleSeries = useMemo(() => {
    return scientificSeries.filter(
      (series) => series.publishStatus === "منشور",
    );
  }, [scientificSeries]);

  const knowledgeAreas = useMemo(() => {
    return [
      "الكل",
      ...Array.from(
        new Set(
          visibleSeries.map((series) => series.knowledgeArea).filter(Boolean),
        ),
      ),
    ];
  }, [visibleSeries]);

  const statuses = ["الكل", "مكتملة", "قيد الاكتمال"];

  const filteredSeries = useMemo(() => {
    return visibleSeries.filter((series) => {
      const search = searchTerm.trim();

      const matchesSearch =
        search === "" ||
        series.title.includes(search) ||
        series.bookTitle?.includes(search) ||
        series.category.includes(search) ||
        series.knowledgeArea.includes(search) ||
        series.subCategory.includes(search) ||
        series.tags.some((tag) => tag.includes(search));

      const matchesKnowledgeArea =
        activeKnowledgeArea === "الكل" ||
        series.knowledgeArea === activeKnowledgeArea;

      const matchesStatus =
        activeStatus === "الكل" || series.statusLabel === activeStatus;

      return matchesSearch && matchesKnowledgeArea && matchesStatus;
    });
  }, [activeKnowledgeArea, activeStatus, searchTerm, visibleSeries]);

  const selectedSeries =
    filteredSeries.find((series) => series.id === selectedSeriesId) ??
    filteredSeries[0] ??
    null;

  const selectedSeriesVideos = useMemo(() => {
    if (!selectedSeries) return [];

    return [...selectedSeries.videos].sort(
      (a, b) => a.displayOrder - b.displayOrder,
    );
  }, [selectedSeries]);

  const selectedVideo =
    selectedSeriesVideos.find((video) => video.videoId === selectedVideoId) ??
    selectedSeriesVideos[0] ??
    null;

  const completedCount = visibleSeries.filter(
    (series) => series.statusLabel === "مكتملة",
  ).length;

  const inProgressCount = visibleSeries.filter(
    (series) => series.statusLabel === "قيد الاكتمال",
  ).length;

  const isKnowledgeAreaEmpty =
    filteredSeries.length === 0 && activeKnowledgeArea !== "الكل";

  function resetFilters() {
    setSearchTerm("");
    setActiveKnowledgeArea("الكل");
    setActiveStatus("الكل");
    setSelectedSeriesId(null);
    setSelectedVideoId(null);
  }

  function selectSeries(seriesId: string) {
    setSelectedSeriesId(seriesId);
    setSelectedVideoId(null);
  }

  function getStatusClass(status: string) {
    if (status === "مكتملة") {
      return "bg-emerald-50 text-emerald-800 border-emerald-200";
    }

    return "bg-amber-50 text-amber-800 border-amber-200";
  }

  function getEmbedUrl() {
    if (!selectedSeries) return "";

    if (selectedVideo) {
      return `https://www.youtube.com/embed/${selectedVideo.videoId}?rel=0`;
    }

    return `https://www.youtube.com/embed/videoseries?list=${selectedSeries.playlistId}&rel=0`;
  }

  return (
    <div className="animate-in fade-in duration-500">
      <section className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-14">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 rounded-sm bg-[var(--color-islamic-ivory)] border border-gray-200 px-4 py-2 text-sm font-bold text-[var(--color-islamic-green)] mb-5">
              <Library className="w-4 h-4 text-[var(--color-islamic-gold)]" />
              <InlineText path="pages.lessons.badge" value={page.badge} />
            </span>

            <InlineText
              as="h1"
              className="font-serif text-4xl md:text-5xl text-[var(--color-islamic-green-dark)] font-bold mb-5"
              path="pages.lessons.title"
              value={page.title}
            />

            <div className="w-24 h-1 bg-[var(--color-islamic-gold)] mx-auto mb-6"></div>

            <InlineText
              as="p"
              className="text-gray-600 leading-relaxed text-lg"
              path="pages.lessons.description"
              value={page.description}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            <div className="bg-[var(--color-islamic-ivory)] border border-gray-200 rounded-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <ListVideo className="w-6 h-6 text-[var(--color-islamic-gold)]" />
                <span className="text-2xl font-bold text-[var(--color-islamic-green-dark)]">
                  {visibleSeries.length}
                </span>
              </div>
              <p className="text-sm text-gray-600">إجمالي السلاسل</p>
            </div>

            <div className="bg-[var(--color-islamic-ivory)] border border-gray-200 rounded-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <CheckCircle2 className="w-6 h-6 text-[var(--color-islamic-gold)]" />
                <span className="text-2xl font-bold text-[var(--color-islamic-green-dark)]">
                  {completedCount}
                </span>
              </div>
              <p className="text-sm text-gray-600">مكتملة</p>
            </div>

            <div className="bg-[var(--color-islamic-ivory)] border border-gray-200 rounded-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <Clock className="w-6 h-6 text-[var(--color-islamic-gold)]" />
                <span className="text-2xl font-bold text-[var(--color-islamic-green-dark)]">
                  {inProgressCount}
                </span>
              </div>
              <p className="text-sm text-gray-600">قيد الاكتمال</p>
            </div>

            <div className="bg-[var(--color-islamic-ivory)] border border-gray-200 rounded-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <Filter className="w-6 h-6 text-[var(--color-islamic-gold)]" />
                <span className="text-2xl font-bold text-[var(--color-islamic-green-dark)]">
                  {filteredSeries.length}
                </span>
              </div>
              <p className="text-sm text-gray-600">نتائج العرض</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-5 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 mb-5">
            <div className="relative">
              <input
                type="text"
                placeholder={page.searchPlaceholder}
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                  setSelectedSeriesId(null);
                  setSelectedVideoId(null);
                }}
                className="w-full bg-gray-50 border border-gray-200 rounded-sm py-3 px-4 pr-12 focus:outline-none focus:border-[var(--color-islamic-gold)] focus:ring-1 focus:ring-[var(--color-islamic-gold)] transition-all"
              />
              <Search className="absolute right-4 top-3.5 text-gray-400 w-5 h-5" />
            </div>

            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center justify-center gap-2 rounded-sm border border-gray-200 px-4 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <X className="w-4 h-4" />
              مسح التصفية
            </button>
          </div>

          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                <Library className="w-4 h-4 text-[var(--color-islamic-gold)]" />
                باب العلم
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1">
                {knowledgeAreas.map((area) => (
                  <button
                    key={area}
                    type="button"
                    onClick={() => {
                      setActiveKnowledgeArea(area);
                      setSelectedSeriesId(null);
                      setSelectedVideoId(null);
                    }}
                    className={`shrink-0 px-4 py-2 rounded-sm text-sm font-medium transition-colors ${
                      activeKnowledgeArea === area
                        ? "bg-[var(--color-islamic-green)] text-white"
                        : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                <CheckCircle2 className="w-4 h-4 text-[var(--color-islamic-gold)]" />
                حالة السلسلة
              </div>

              <div className="flex flex-wrap gap-2">
                {statuses.map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => {
                      setActiveStatus(status);
                      setSelectedSeriesId(null);
                      setSelectedVideoId(null);
                    }}
                    className={`px-4 py-2 rounded-sm text-sm font-medium transition-colors ${
                      activeStatus === status
                        ? "bg-[var(--color-islamic-green)] text-white"
                        : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="bg-white border border-gray-200 rounded-sm p-10 text-center text-gray-500">
            جارٍ تحميل السلاسل...
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-100 rounded-sm p-10 text-center text-red-700">
            تعذر تحميل السلاسل. حاول تحديث الصفحة.
          </div>
        ) : selectedSeries ? (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-4">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                  <span className="text-[var(--color-islamic-gold)] font-serif text-xl block mb-1">
                    السلاسل
                  </span>
                  <h2 className="font-serif text-2xl text-[var(--color-islamic-green-dark)] font-bold">
                    اختر السلسلة
                  </h2>
                </div>

                <span className="text-sm text-gray-500">
                  {filteredSeries.length} سلسلة
                </span>
              </div>

              <div className="flex gap-3 overflow-x-auto pb-2">
                {filteredSeries.map((series) => {
                  const isSelected = selectedSeries.id === series.id;

                  return (
                    <button
                      key={series.id}
                      type="button"
                      onClick={() => selectSeries(series.id)}
                      className={`shrink-0 w-24 h-24 rounded-sm border transition-all flex flex-col items-center justify-center gap-2 text-center px-2 ${
                        isSelected
                          ? "bg-[var(--color-islamic-green)] border-[var(--color-islamic-green)] text-white shadow-md"
                          : "bg-white border-gray-200 text-gray-700 hover:border-[var(--color-islamic-gold)] hover:bg-[var(--color-islamic-ivory)]"
                      }`}
                      title={series.title}
                    >
                      <BookOpen
                        className={`w-6 h-6 ${
                          isSelected
                            ? "text-[var(--color-islamic-gold)]"
                            : "text-[var(--color-islamic-green)]"
                        }`}
                      />

                      <span className="text-xs font-bold leading-relaxed line-clamp-2">
                        {series.bookTitle || series.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6 items-start">
              <main className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
                <div className="aspect-video bg-black">
                  <iframe
                    key={`${selectedSeries.id}-${selectedVideo?.videoId ?? selectedSeries.playlistId}`}
                    className="w-full h-full"
                    src={getEmbedUrl()}
                    title={selectedVideo?.title ?? selectedSeries.title}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>

                <div className="p-6">
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="inline-flex items-center rounded-sm bg-[var(--color-islamic-green)] px-3 py-1 text-xs font-bold text-white">
                      {selectedSeries.knowledgeArea}
                    </span>

                    <span
                      className={`inline-flex items-center rounded-sm border px-3 py-1 text-xs font-bold ${getStatusClass(
                        selectedSeries.statusLabel,
                      )}`}
                    >
                      {selectedSeries.statusLabel}
                    </span>

                    <span className="inline-flex items-center gap-1 rounded-sm bg-gray-50 border border-gray-200 px-3 py-1 text-xs font-bold text-gray-700">
                      <ListVideo className="w-3.5 h-3.5 text-[var(--color-islamic-gold)]" />
                      {selectedSeries.count}
                    </span>
                  </div>

                  <h2 className="font-serif text-3xl font-bold text-[var(--color-islamic-green-dark)] leading-relaxed mb-2">
                    {selectedVideo?.title ?? selectedSeries.title}
                  </h2>

                  <p className="text-gray-600 leading-relaxed">
                    {selectedSeries.title}
                    {selectedSeries.bookTitle
                      ? ` — ${selectedSeries.bookTitle}`
                      : ""}
                  </p>
                </div>
              </main>

              <aside className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
                <div className="bg-[var(--color-islamic-green-dark)] text-white p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="font-serif text-xl font-bold">
                        حلقات السلسلة
                      </h3>
                      <p className="text-sm text-white/70 mt-1">
                        {selectedSeriesVideos.length > 0
                          ? `${selectedSeriesVideos.length} حلقة`
                          : "قائمة التشغيل"}
                      </p>
                    </div>

                    <PlaySquare className="w-6 h-6 text-[var(--color-islamic-gold)]" />
                  </div>
                </div>

                {selectedSeriesVideos.length > 0 ? (
                  <div className="max-h-[620px] overflow-y-auto divide-y divide-gray-100">
                    {selectedSeriesVideos.map((video) => {
                      const isSelected =
                        selectedVideo?.videoId === video.videoId;

                      return (
                        <button
                          key={video.videoId}
                          type="button"
                          onClick={() => setSelectedVideoId(video.videoId)}
                          className={`w-full text-right p-4 transition-colors ${
                            isSelected
                              ? "bg-[var(--color-islamic-ivory)]"
                              : "bg-white hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex gap-3">
                            <span
                              className={`w-8 h-8 rounded-sm flex items-center justify-center text-xs font-bold shrink-0 ${
                                isSelected
                                  ? "bg-[var(--color-islamic-green)] text-white"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {video.displayOrder}
                            </span>

                            <span className="min-w-0 flex-1">
                              <span className="block font-bold text-gray-800 leading-relaxed line-clamp-2">
                                {video.title}
                              </span>

                              {video.duration && (
                                <span className="mt-2 inline-flex items-center gap-1 text-xs text-gray-500">
                                  <Clock className="w-3.5 h-3.5 text-[var(--color-islamic-gold)]" />
                                  {video.duration}
                                </span>
                              )}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <ListVideo className="w-12 h-12 mx-auto mb-4 text-[var(--color-islamic-gold)]" />
                    <h4 className="font-serif text-xl font-bold text-[var(--color-islamic-green-dark)] mb-2">
                      لم تُفهرس الحلقات بعد
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      سيعرض المشغل قائمة التشغيل كاملة، وتظهر الحلقات هنا بعد
                      اكتمال بيانات الفيديوهات.
                    </p>
                  </div>
                )}
              </aside>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-sm p-10 text-center">
            <p className="font-serif text-2xl font-bold text-[var(--color-islamic-green-dark)] mb-2">
              {isKnowledgeAreaEmpty
                ? "لا توجد سلاسل علمية مضافة في هذا الباب حاليًا"
                : "لا توجد نتائج مطابقة"}
            </p>

            <p className="text-gray-500 mb-6 max-w-2xl mx-auto leading-relaxed">
              {isKnowledgeAreaEmpty
                ? "سيُحدّث هذا القسم عند إضافة مواد علمية مناسبة له، ويمكنك متابعة بقية أبواب العلم أو عرض جميع السلاسل المتاحة."
                : "جرّب تغيير كلمات البحث أو إزالة بعض عوامل التصفية."}
            </p>

            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center justify-center gap-2 bg-[var(--color-islamic-green)] text-white px-5 py-2.5 rounded-sm font-bold hover:bg-[var(--color-islamic-green-dark)] transition-colors"
            >
              <X className="w-4 h-4" />
              مسح التصفية
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
