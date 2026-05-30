import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Clock,
  ExternalLink,
  Filter,
  Library,
  ListVideo,
  Search,
  Tags,
} from "lucide-react";
import { useMemo, useState } from "react";
import { getAllKnowledgeAreaNames } from "../data/knowledgeCategories";
import { scientificSeries } from "../data/scientificSeries";

export function Lessons() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeKnowledgeArea, setActiveKnowledgeArea] = useState("الكل");
  const [activeStatus, setActiveStatus] = useState("الكل");

  const visibleSeries = useMemo(() => {
    return scientificSeries.filter(
      (series) => series.publishStatus === "منشور",
    );
  }, []);

  const knowledgeAreas = useMemo(() => {
    return ["الكل", ...getAllKnowledgeAreaNames()];
  }, []);

  const statuses = ["الكل", "مكتملة", "قيد الاكتمال"];

  const filteredSeries = useMemo(() => {
    return visibleSeries.filter((series) => {
      const search = searchTerm.trim();

      const matchesSearch =
        search === "" ||
        series.title.includes(search) ||
        series.bookTitle?.includes(search) ||
        series.channel.includes(search) ||
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

  const completedCount = visibleSeries.filter(
    (series) => series.statusLabel === "مكتملة",
  ).length;

  const inProgressCount = visibleSeries.filter(
    (series) => series.statusLabel === "قيد الاكتمال",
  ).length;

  return (
    <div className="container mx-auto px-4 py-12 animate-in fade-in duration-500">
      <div className="mb-10 text-center">
        <h1 className="font-serif text-4xl text-[var(--color-islamic-green-dark)] font-bold mb-4">
          الدروس العلمية
        </h1>
        <div className="w-24 h-1 bg-[var(--color-islamic-gold)] mx-auto mb-6"></div>
        <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
          مكتبة منهجية للسلاسل العلمية والشروح، مرتبة حسب أبواب العلم، مع بيان
          حالة كل سلسلة، وتصنيفها، ووسومها لتسهيل الوصول والبحث.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        <div className="bg-white border border-gray-200 rounded-sm p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <ListVideo className="w-6 h-6 text-[var(--color-islamic-gold)]" />
            <span className="text-2xl font-bold text-[var(--color-islamic-green-dark)]">
              {visibleSeries.length}
            </span>
          </div>
          <p className="text-sm text-gray-600">إجمالي السلاسل العلمية</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-sm p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <CheckCircle2 className="w-6 h-6 text-[var(--color-islamic-gold)]" />
            <span className="text-2xl font-bold text-[var(--color-islamic-green-dark)]">
              {completedCount}
            </span>
          </div>
          <p className="text-sm text-gray-600">السلاسل المكتملة</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-sm p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <Clock className="w-6 h-6 text-[var(--color-islamic-gold)]" />
            <span className="text-2xl font-bold text-[var(--color-islamic-green-dark)]">
              {inProgressCount}
            </span>
          </div>
          <p className="text-sm text-gray-600">السلاسل قيد الاكتمال</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-sm shadow-sm border border-gray-100 mb-10 flex flex-col gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="البحث في السلاسل العلمية والكتب والوسوم..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-sm py-3 px-4 pr-12 focus:outline-none focus:border-[var(--color-islamic-gold)] focus:ring-1 focus:ring-[var(--color-islamic-gold)] transition-all"
          />
          <Search className="absolute right-4 top-3.5 text-gray-400 w-5 h-5" />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 text-sm text-gray-600 ml-2">
            <Filter className="w-4 h-4" />
            باب العلم:
          </div>

          {knowledgeAreas.map((area) => (
            <button
              key={area}
              onClick={() => setActiveKnowledgeArea(area)}
              className={`px-4 py-2 rounded-sm text-sm font-medium transition-colors ${
                activeKnowledgeArea === area
                  ? "bg-[var(--color-islamic-green)] text-white"
                  : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
              }`}
            >
              {area}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 text-sm text-gray-600 ml-2">
            <CheckCircle2 className="w-4 h-4" />
            حالة السلسلة:
          </div>

          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setActiveStatus(status)}
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

      <section className="mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b-2 border-gray-200 pb-4">
          <div>
            <span className="text-[var(--color-islamic-gold)] font-serif text-xl block mb-2">
              السلاسل العلمية
            </span>
            <h2 className="font-serif text-3xl text-[var(--color-islamic-green-dark)] font-bold">
              شروح مرتبة حسب أبواب العلم
            </h2>
          </div>
          <p className="text-sm text-gray-500 max-w-xl leading-relaxed">
            لا تُعرض الدروس هنا كدروس مفردة، بل ضمن سلاسل علمية، مع تمييز
            السلاسل المكتملة من السلاسل قيد الاكتمال.
          </p>
        </div>

        {filteredSeries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredSeries.map((series) => (
              <article
                key={series.id}
                className="bg-white border border-gray-200 rounded-sm shadow-sm hover:shadow-md transition-all overflow-hidden group"
              >
                <div className="aspect-video bg-gray-900">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/videoseries?list=${series.playlistId}`}
                    title={series.title}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>

                <div className="p-4">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-sm bg-[var(--color-islamic-green)] text-white font-medium">
                      <Library className="w-3 h-3" />
                      {series.knowledgeArea}
                    </span>

                    <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-sm bg-gray-100 text-gray-700 font-medium">
                      <BookOpen className="w-3 h-3" />
                      {series.subCategory}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-sm font-bold ${
                        series.statusLabel === "مكتملة"
                          ? "bg-green-100 text-green-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      {series.statusLabel}
                    </span>

                    {series.trust === "متوسط" ? (
                      <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-sm bg-amber-100 text-amber-800 font-bold">
                        <AlertTriangle className="w-3 h-3" />
                        بحاجة تحقق
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-sm bg-green-100 text-green-800 font-bold">
                        <CheckCircle2 className="w-3 h-3" />
                        موثوق
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif text-xl font-bold text-gray-800 leading-relaxed mb-2 group-hover:text-[var(--color-islamic-green)] transition-colors">
                    {series.title}
                  </h3>

                  {series.bookTitle && (
                    <p className="text-sm text-[var(--color-islamic-green)] font-bold mb-3">
                      الكتاب: {series.bookTitle}
                    </p>
                  )}

                  <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    {series.description}
                  </p>

                  <div className="space-y-1.5 text-sm text-gray-600 mb-4">
                    <p>
                      <span className="font-bold text-gray-700">القناة: </span>
                      {series.channel}
                    </p>

                    <p>
                      <span className="font-bold text-gray-700">
                        عدد المقاطع:{" "}
                      </span>
                      {series.count}
                    </p>

                    {series.note && (
                      <p className="leading-relaxed text-gray-500 border-r-2 border-[var(--color-islamic-gold)] pr-3">
                        {series.note}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {series.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 rounded-sm bg-[var(--color-islamic-ivory)] px-2.5 py-1 text-xs font-medium text-gray-700 border border-gray-200"
                      >
                        <Tags className="w-3 h-3 text-[var(--color-islamic-gold)]" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  <a
                    href={series.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 bg-white border border-[var(--color-islamic-green)] text-[var(--color-islamic-green)] px-4 py-2 rounded-sm hover:bg-[var(--color-islamic-green)] hover:text-white transition-colors font-medium text-sm"
                  >
                    فتح القائمة في يوتيوب
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-sm p-8 text-center text-gray-500">
            لا توجد نتائج مطابقة للبحث أو التصنيف المحدد.
          </div>
        )}
      </section>
    </div>
  );
}
