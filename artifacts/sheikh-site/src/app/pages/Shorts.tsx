import {
  Clock,
  Filter,
  Library,
  Play,
  Search,
  Tag,
  Video,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { getAllKnowledgeAreaNames } from "../data/knowledgeCategories";
import { shortClips, type ShortClip } from "../data/shortClips";

const SHORTS_MAX_DURATION_SECONDS = 180;

function getClipLayout(clip: ShortClip) {
  if (clip.aspectRatio) {
    return {
      aspectRatio: clip.aspectRatio,
      maxWidthClass: "max-w-[1040px]",
    };
  }

  if (clip.displayMode === "portrait") {
    return {
      aspectRatio: "9 / 16",
      maxWidthClass: "max-w-[430px]",
    };
  }

  if (clip.displayMode === "square") {
    return {
      aspectRatio: "1 / 1",
      maxWidthClass: "max-w-[640px]",
    };
  }

  return {
    aspectRatio: "16 / 9",
    maxWidthClass: "max-w-[1040px]",
  };
}

export function Shorts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeKnowledgeArea, setActiveKnowledgeArea] = useState("الكل");
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [selectedShortId, setSelectedShortId] = useState<number | null>(null);

  const visibleShorts = useMemo(() => {
    return shortClips.filter((clip) => {
      return (
        clip.publishStatus === "منشور" &&
        clip.durationSeconds <= SHORTS_MAX_DURATION_SECONDS
      );
    });
  }, []);

  const knowledgeAreas = useMemo(() => {
    return ["الكل", ...getAllKnowledgeAreaNames()];
  }, []);

  const categories = useMemo(() => {
    return [
      "الكل",
      ...Array.from(new Set(visibleShorts.map((clip) => clip.category))),
    ];
  }, [visibleShorts]);

  const filteredShorts = useMemo(() => {
    return visibleShorts.filter((clip) => {
      const search = searchTerm.trim();

      const matchesSearch =
        search === "" ||
        clip.title.includes(search) ||
        clip.category.includes(search) ||
        clip.knowledgeArea.includes(search) ||
        clip.subCategory.includes(search) ||
        clip.tags.some((tag) => tag.includes(search));

      const matchesKnowledgeArea =
        activeKnowledgeArea === "الكل" ||
        clip.knowledgeArea === activeKnowledgeArea;

      const matchesCategory =
        activeCategory === "الكل" || clip.category === activeCategory;

      return matchesSearch && matchesKnowledgeArea && matchesCategory;
    });
  }, [activeCategory, activeKnowledgeArea, searchTerm, visibleShorts]);

  const selectedShort =
    filteredShorts.find((clip) => clip.id === selectedShortId) ??
    filteredShorts[0] ??
    null;

  const representedKnowledgeAreaCount = useMemo(() => {
    return new Set(visibleShorts.map((clip) => clip.knowledgeArea)).size;
  }, [visibleShorts]);

  const isKnowledgeAreaEmpty =
    filteredShorts.length === 0 && activeKnowledgeArea !== "الكل";

  function resetFilters() {
    setSearchTerm("");
    setActiveKnowledgeArea("الكل");
    setActiveCategory("الكل");
    setSelectedShortId(null);
  }

  function getEmbedUrl(videoId: string) {
    if (videoId.startsWith("videoseries?list=")) {
      return `https://www.youtube.com/embed/${videoId}&rel=0&modestbranding=1&playsinline=1`;
    }

    return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1`;
  }

  function getThumbnailUrl(videoId: string) {
    if (videoId.startsWith("videoseries?list=")) {
      return null;
    }

    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }

  return (
    <div className="animate-in fade-in duration-500">
      <section className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-14">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 rounded-sm bg-[var(--color-islamic-ivory)] border border-gray-200 px-4 py-2 text-sm font-bold text-[var(--color-islamic-green)] mb-5">
              <Video className="w-4 h-4 text-[var(--color-islamic-gold)]" />
              مكتبة الفوائد القصيرة
            </span>

            <h1 className="font-serif text-4xl md:text-5xl text-[var(--color-islamic-green-dark)] font-bold mb-5">
              المقاطع القصيرة
            </h1>

            <div className="w-24 h-1 bg-[var(--color-islamic-gold)] mx-auto mb-6"></div>

            <p className="text-gray-600 leading-relaxed text-lg">
              فوائد موجزة لا تتجاوز ثلاث دقائق، تُعرض داخل الصفحة بمشغل واضح
              يحافظ على أبعاد الفيديو دون قصّ أو اجتزاء.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-12">
            <div className="bg-[var(--color-islamic-ivory)] border border-gray-200 rounded-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <Video className="w-6 h-6 text-[var(--color-islamic-gold)]" />
                <span className="text-2xl font-bold text-[var(--color-islamic-green-dark)]">
                  {visibleShorts.length}
                </span>
              </div>
              <p className="text-sm text-gray-600">إجمالي المقاطع</p>
            </div>

            <div className="bg-[var(--color-islamic-ivory)] border border-gray-200 rounded-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <Library className="w-6 h-6 text-[var(--color-islamic-gold)]" />
                <span className="text-2xl font-bold text-[var(--color-islamic-green-dark)]">
                  {representedKnowledgeAreaCount}
                </span>
              </div>
              <p className="text-sm text-gray-600">أبواب علم ممثلة</p>
            </div>

            <div className="bg-[var(--color-islamic-ivory)] border border-gray-200 rounded-sm p-5 col-span-2 md:col-span-1">
              <div className="flex items-center justify-between mb-3">
                <Filter className="w-6 h-6 text-[var(--color-islamic-gold)]" />
                <span className="text-2xl font-bold text-[var(--color-islamic-green-dark)]">
                  {filteredShorts.length}
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
                placeholder="ابحث بعنوان المقطع أو باب العلم أو التصنيف..."
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                  setSelectedShortId(null);
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
                      setSelectedShortId(null);
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
                <Tag className="w-4 h-4 text-[var(--color-islamic-gold)]" />
                التصنيف
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => {
                      setActiveCategory(category);
                      setSelectedShortId(null);
                    }}
                    className={`shrink-0 px-4 py-2 rounded-sm text-sm font-medium transition-colors ${
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
          </div>
        </div>

        {selectedShort ? (
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6 items-start">
            <main className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
              <div className="bg-[var(--color-islamic-green-dark)] text-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="font-serif text-xl font-bold">
                      مشاهدة المقطع
                    </h2>
                    <p className="text-sm text-white/70 mt-1">
                      {selectedShort.duration}
                    </p>
                  </div>

                  <Video className="w-6 h-6 text-[var(--color-islamic-gold)]" />
                </div>
              </div>

              <div className="bg-[#050505] p-4 sm:p-6">
                <div
                  className={`mx-auto w-full overflow-hidden rounded-sm border border-gray-800 bg-black ${
                    getClipLayout(selectedShort).maxWidthClass
                  }`}
                  style={{
                    aspectRatio: getClipLayout(selectedShort).aspectRatio,
                  }}
                >
                  <iframe
                    key={selectedShort.videoId}
                    className="block w-full h-full border-0"
                    src={getEmbedUrl(selectedShort.videoId)}
                    title={selectedShort.title}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </div>

              <div className="p-5">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="inline-flex items-center rounded-sm bg-[var(--color-islamic-green)] px-3 py-1 text-xs font-bold text-white">
                    {selectedShort.knowledgeArea}
                  </span>

                  <span className="inline-flex items-center rounded-sm bg-[var(--color-islamic-ivory)] border border-gray-200 px-3 py-1 text-xs font-bold text-gray-700">
                    {selectedShort.category}
                  </span>

                  <span className="inline-flex items-center gap-1 rounded-sm bg-gray-50 border border-gray-200 px-3 py-1 text-xs font-bold text-gray-700">
                    <Clock className="w-3.5 h-3.5 text-[var(--color-islamic-gold)]" />
                    {selectedShort.duration}
                  </span>
                </div>

                <h2 className="font-serif text-2xl font-bold text-[var(--color-islamic-green-dark)] leading-relaxed">
                  {selectedShort.title}
                </h2>

                {selectedShort.description && (
                  <p className="text-gray-600 leading-relaxed mt-3">
                    {selectedShort.description}
                  </p>
                )}
              </div>
            </main>

            <aside className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
              <div className="bg-[var(--color-islamic-green-dark)] text-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-serif text-xl font-bold">
                      فهرس المقاطع
                    </h3>
                    <p className="text-sm text-white/70 mt-1">
                      {filteredShorts.length} مقطع
                    </p>
                  </div>

                  <Play className="w-6 h-6 text-[var(--color-islamic-gold)]" />
                </div>
              </div>

              <div className="max-h-[900px] overflow-y-auto divide-y divide-gray-100">
                {filteredShorts.map((clip) => {
                  const isSelected = selectedShort.id === clip.id;
                  const thumbnailUrl = getThumbnailUrl(clip.videoId);

                  return (
                    <button
                      key={clip.id}
                      type="button"
                      onClick={() => setSelectedShortId(clip.id)}
                      className={`w-full text-right p-4 transition-colors ${
                        isSelected
                          ? "bg-[var(--color-islamic-ivory)]"
                          : "bg-white hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex gap-3">
                        <span className="relative w-24 h-14 rounded-sm overflow-hidden bg-gray-900 shrink-0">
                          {thumbnailUrl ? (
                            <img
                              src={thumbnailUrl}
                              alt={clip.title}
                              className="w-full h-full object-cover opacity-80"
                              loading="lazy"
                            />
                          ) : (
                            <span className="absolute inset-0 bg-gray-900"></span>
                          )}

                          <span className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <Play className="w-5 h-5 text-white fill-current" />
                          </span>
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="block font-bold text-gray-800 leading-relaxed line-clamp-2">
                            {clip.title}
                          </span>

                          <span className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                            <span>{clip.category}</span>
                            <span>•</span>
                            <span>{clip.duration}</span>
                          </span>
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </aside>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-sm p-10 text-center">
            <p className="font-serif text-2xl font-bold text-[var(--color-islamic-green-dark)] mb-2">
              {isKnowledgeAreaEmpty
                ? "لا توجد مقاطع قصيرة مضافة في هذا الباب حاليًا"
                : "لا توجد مقاطع قصيرة منشورة حاليًا"}
            </p>

            <p className="text-gray-500 mb-6 max-w-2xl mx-auto leading-relaxed">
              {isKnowledgeAreaEmpty
                ? "سيُحدّث هذا القسم عند إضافة مقاطع مناسبة لهذا الباب، ويمكنك متابعة بقية أبواب العلم أو عرض جميع المقاطع المتاحة."
                : "ستظهر المقاطع القصيرة هنا عند اعتمادها ونشرها في لوحة التحكم."}
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
