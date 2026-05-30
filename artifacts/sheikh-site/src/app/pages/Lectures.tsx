import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Filter,
  Library,
  PlaySquare,
  Search,
  Tags,
} from "lucide-react";
import { useMemo, useState } from "react";
import { getAllKnowledgeAreaNames } from "../data/knowledgeCategories";
import { lectures } from "../data/lectures";

export function Lectures() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeKnowledgeArea, setActiveKnowledgeArea] = useState("الكل");
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [activeLectureId, setActiveLectureId] = useState<number | null>(null);

  const visibleLectures = useMemo(() => {
    return lectures.filter((lecture) => lecture.publishStatus === "منشور");
  }, []);

  const knowledgeAreas = useMemo(() => {
    return ["الكل", ...getAllKnowledgeAreaNames()];
  }, []);

  const categories = useMemo(() => {
    return [
      "الكل",
      ...Array.from(
        new Set(visibleLectures.map((lecture) => lecture.category)),
      ),
    ];
  }, [visibleLectures]);

  const filteredLectures = useMemo(() => {
    return visibleLectures.filter((lecture) => {
      const search = searchTerm.trim();

      const matchesSearch =
        search === "" ||
        lecture.title.includes(search) ||
        lecture.lectureType.includes(search) ||
        lecture.knowledgeArea.includes(search) ||
        lecture.subCategory.includes(search) ||
        lecture.category.includes(search) ||
        lecture.channel.includes(search) ||
        lecture.tags.some((tag) => tag.includes(search));

      const matchesKnowledgeArea =
        activeKnowledgeArea === "الكل" ||
        lecture.knowledgeArea === activeKnowledgeArea;

      const matchesCategory =
        activeCategory === "الكل" || lecture.category === activeCategory;

      return matchesSearch && matchesKnowledgeArea && matchesCategory;
    });
  }, [activeCategory, activeKnowledgeArea, searchTerm, visibleLectures]);

  const representedKnowledgeAreaCount = useMemo(() => {
    return new Set(visibleLectures.map((lecture) => lecture.knowledgeArea))
      .size;
  }, [visibleLectures]);

  function getEmbedUrl(videoId: string) {
    return `https://www.youtube.com/embed/${videoId}?rel=0`;
  }

  return (
    <div className="container mx-auto px-4 py-12 animate-in fade-in duration-500">
      <div className="mb-10 text-center">
        <h1 className="font-serif text-4xl text-[var(--color-islamic-green-dark)] font-bold mb-4">
          المحاضرات العامة
        </h1>
        <div className="w-24 h-1 bg-[var(--color-islamic-gold)] mx-auto mb-6"></div>
        <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
          محاضرات ولقاءات علمية ودعوية لا تندرج ضمن السلاسل العلمية، وليست من
          المقاطع القصيرة، وتُعرض هنا مصنفة بحسب أبواب العلم والموضوعات.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        <div className="bg-white border border-gray-200 rounded-sm p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <PlaySquare className="w-6 h-6 text-[var(--color-islamic-gold)]" />
            <span className="text-2xl font-bold text-[var(--color-islamic-green-dark)]">
              {visibleLectures.length}
            </span>
          </div>
          <p className="text-sm text-gray-600">إجمالي المحاضرات</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-sm p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <Library className="w-6 h-6 text-[var(--color-islamic-gold)]" />
            <span className="text-2xl font-bold text-[var(--color-islamic-green-dark)]">
              {representedKnowledgeAreaCount}
            </span>
          </div>
          <p className="text-sm text-gray-600">أبواب علم ممثلة</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-sm p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <Clock className="w-6 h-6 text-[var(--color-islamic-gold)]" />
            <span className="text-2xl font-bold text-[var(--color-islamic-green-dark)]">
              +3
            </span>
          </div>
          <p className="text-sm text-gray-600">
            مناسبة للمقاطع الأطول من 3 دقائق
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-sm shadow-sm border border-gray-100 mb-10 flex flex-col gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="البحث في المحاضرات والوسوم..."
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
              onClick={() => {
                setActiveKnowledgeArea(area);
                setActiveLectureId(null);
              }}
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
            <PlaySquare className="w-4 h-4" />
            التصنيف:
          </div>

          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setActiveCategory(category);
                setActiveLectureId(null);
              }}
              className={`px-4 py-2 rounded-sm text-sm font-medium transition-colors ${
                activeCategory === category
                  ? "bg-[var(--color-islamic-green)] text-white"
                  : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {filteredLectures.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredLectures.map((lecture) => {
            const isActive = activeLectureId === lecture.id;

            return (
              <article
                key={lecture.id}
                className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group"
              >
                <div className="aspect-video bg-[var(--color-islamic-green-dark)] relative flex items-center justify-center border-b border-gray-100">
                  {isActive && lecture.videoId ? (
                    <iframe
                      className="w-full h-full"
                      src={getEmbedUrl(lecture.videoId)}
                      title={lecture.title}
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setActiveLectureId(lecture.id)}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div
                        className="absolute inset-0 opacity-10"
                        style={{
                          backgroundImage:
                            "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.4) 1px, transparent 0)",
                          backgroundSize: "16px 16px",
                        }}
                      ></div>

                      <PlaySquare className="w-14 h-14 text-white/50 group-hover:text-[var(--color-islamic-gold)] transition-colors group-hover:scale-110 duration-300 z-10" />
                    </button>
                  )}

                  {!isActive && (
                    <>
                      <div className="absolute top-3 right-3 bg-[var(--color-islamic-gold)] text-[var(--color-islamic-green-dark)] font-bold text-xs px-3 py-1 rounded-sm z-10">
                        {lecture.category}
                      </div>

                      <div className="absolute top-3 left-3 bg-black/50 text-white font-bold text-xs px-3 py-1 rounded-sm z-10">
                        {lecture.lectureType}
                      </div>
                    </>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-sm bg-[var(--color-islamic-green)] text-white font-medium">
                      <Library className="w-3 h-3" />
                      {lecture.knowledgeArea}
                    </span>

                    <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-sm bg-gray-100 text-gray-700 font-medium">
                      {lecture.subCategory}
                    </span>

                    {lecture.trust === "متوسط" ? (
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

                  <h3 className="font-serif font-bold text-xl mb-3 text-gray-800 leading-relaxed line-clamp-2 group-hover:text-[var(--color-islamic-green)] transition-colors">
                    {lecture.title}
                  </h3>

                  <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    {lecture.description}
                  </p>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p>
                      <span className="font-bold text-gray-700">المصدر: </span>
                      {lecture.channel}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-gray-500 pt-2 border-t border-gray-50">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-[var(--color-islamic-gold)]" />
                        {lecture.duration}
                      </span>

                      {lecture.dateHijri && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-[var(--color-islamic-gold)]" />
                          {lecture.dateHijri}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {lecture.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 rounded-sm bg-[var(--color-islamic-ivory)] px-2.5 py-1 text-xs font-medium text-gray-700 border border-gray-200"
                      >
                        <Tags className="w-3 h-3 text-[var(--color-islamic-gold)]" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  {lecture.note && (
                    <p className="text-xs text-gray-500 leading-relaxed mb-4 border-r-2 border-[var(--color-islamic-gold)] pr-3">
                      {lecture.note}
                    </p>
                  )}

                  {lecture.url !== "#" && (
                    <a
                      href={lecture.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 bg-white border border-[var(--color-islamic-green)] text-[var(--color-islamic-green)] px-4 py-2 rounded-sm hover:bg-[var(--color-islamic-green)] hover:text-white transition-colors font-medium text-sm"
                    >
                      فتح المحاضرة
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-sm p-8 text-center text-gray-500">
          لا توجد محاضرات منشورة حاليًا.
        </div>
      )}
    </div>
  );
}
