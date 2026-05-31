import {
  Calendar,
  Clock,
  Filter,
  Library,
  MessageCircle,
  PlaySquare,
  Search,
  Video,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { getAllKnowledgeAreaNames } from "../data/knowledgeCategories";
import { words } from "../data/words";

export function Words() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeKnowledgeArea, setActiveKnowledgeArea] = useState("الكل");
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [selectedWordId, setSelectedWordId] = useState<number | null>(null);

  const visibleWords = useMemo(() => {
    return words.filter((word) => word.publishStatus === "منشور");
  }, []);

  const knowledgeAreas = useMemo(() => {
    return ["الكل", ...getAllKnowledgeAreaNames()];
  }, []);

  const categories = useMemo(() => {
    return [
      "الكل",
      ...Array.from(new Set(visibleWords.map((word) => word.category))),
    ];
  }, [visibleWords]);

  const filteredWords = useMemo(() => {
    return visibleWords.filter((word) => {
      const search = searchTerm.trim();

      const matchesSearch =
        search === "" ||
        word.title.includes(search) ||
        word.wordType.includes(search) ||
        word.knowledgeArea.includes(search) ||
        word.subCategory.includes(search) ||
        word.category.includes(search) ||
        word.tags.some((tag) => tag.includes(search));

      const matchesKnowledgeArea =
        activeKnowledgeArea === "الكل" ||
        word.knowledgeArea === activeKnowledgeArea;

      const matchesCategory =
        activeCategory === "الكل" || word.category === activeCategory;

      return matchesSearch && matchesKnowledgeArea && matchesCategory;
    });
  }, [activeCategory, activeKnowledgeArea, searchTerm, visibleWords]);

  const selectedWord =
    filteredWords.find((word) => word.id === selectedWordId) ??
    filteredWords[0] ??
    null;

  const representedKnowledgeAreaCount = useMemo(() => {
    return new Set(visibleWords.map((word) => word.knowledgeArea)).size;
  }, [visibleWords]);

  const isKnowledgeAreaEmpty =
    filteredWords.length === 0 && activeKnowledgeArea !== "الكل";

  function resetFilters() {
    setSearchTerm("");
    setActiveKnowledgeArea("الكل");
    setActiveCategory("الكل");
    setSelectedWordId(null);
  }

  function getEmbedUrl(videoId: string) {
    return `https://www.youtube.com/embed/${videoId}?rel=0`;
  }

  return (
    <div className="animate-in fade-in duration-500">
      <section className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-14">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 rounded-sm bg-[var(--color-islamic-ivory)] border border-gray-200 px-4 py-2 text-sm font-bold text-[var(--color-islamic-green)] mb-5">
              <MessageCircle className="w-4 h-4 text-[var(--color-islamic-gold)]" />
              مكتبة الكلمات الدعوية
            </span>

            <h1 className="font-serif text-4xl md:text-5xl text-[var(--color-islamic-green-dark)] font-bold mb-5">
              الكلمات الدعوية
            </h1>

            <div className="w-24 h-1 bg-[var(--color-islamic-gold)] mx-auto mb-6"></div>

            <p className="text-gray-600 leading-relaxed text-lg">
              كلمات موجزة وتوجيهات نافعة، تُعرض داخل الصفحة بفهرس مختصر ومشغل
              واضح عند توفر الفيديو.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-12">
            <div className="bg-[var(--color-islamic-ivory)] border border-gray-200 rounded-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <MessageCircle className="w-6 h-6 text-[var(--color-islamic-gold)]" />
                <span className="text-2xl font-bold text-[var(--color-islamic-green-dark)]">
                  {visibleWords.length}
                </span>
              </div>
              <p className="text-sm text-gray-600">إجمالي الكلمات</p>
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
                  {filteredWords.length}
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
                placeholder="ابحث باسم الكلمة أو باب العلم أو التصنيف..."
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                  setSelectedWordId(null);
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
                      setSelectedWordId(null);
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
                <MessageCircle className="w-4 h-4 text-[var(--color-islamic-gold)]" />
                التصنيف
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => {
                      setActiveCategory(category);
                      setSelectedWordId(null);
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

        {selectedWord ? (
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6 items-start">
            <main className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
              <div className="aspect-video bg-black">
                {selectedWord.videoId ? (
                  <iframe
                    key={selectedWord.videoId}
                    className="w-full h-full"
                    src={getEmbedUrl(selectedWord.videoId)}
                    title={selectedWord.title}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-white px-6 text-center">
                    <PlaySquare className="w-16 h-16 text-[var(--color-islamic-gold)] mb-4" />
                    <h2 className="font-serif text-2xl font-bold mb-2">
                      لم تتم إضافة رابط الفيديو بعد
                    </h2>
                    <p className="text-white/70 text-sm leading-relaxed max-w-xl">
                      ستظهر الكلمة هنا عند إضافة معرّف الفيديو من لوحة التحكم
                      لاحقًا.
                    </p>
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="inline-flex items-center rounded-sm bg-[var(--color-islamic-green)] px-3 py-1 text-xs font-bold text-white">
                    {selectedWord.knowledgeArea}
                  </span>

                  <span className="inline-flex items-center rounded-sm bg-[var(--color-islamic-ivory)] border border-gray-200 px-3 py-1 text-xs font-bold text-gray-700">
                    {selectedWord.wordType}
                  </span>

                  <span className="inline-flex items-center gap-1 rounded-sm bg-gray-50 border border-gray-200 px-3 py-1 text-xs font-bold text-gray-700">
                    <Clock className="w-3.5 h-3.5 text-[var(--color-islamic-gold)]" />
                    {selectedWord.duration}
                  </span>
                </div>

                <h2 className="font-serif text-3xl font-bold text-[var(--color-islamic-green-dark)] leading-relaxed mb-3">
                  {selectedWord.title}
                </h2>

                <p className="text-gray-600 leading-relaxed max-w-4xl">
                  {selectedWord.description}
                </p>

                <div className="mt-5 pt-5 border-t border-gray-100 flex flex-wrap gap-3 text-sm text-gray-600">
                  <span>{selectedWord.subCategory}</span>

                  {selectedWord.dateHijri && (
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-[var(--color-islamic-gold)]" />
                      {selectedWord.dateHijri}
                    </span>
                  )}
                </div>
              </div>
            </main>

            <aside className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden xl:sticky xl:top-28">
              <div className="bg-[var(--color-islamic-green-dark)] text-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-serif text-xl font-bold">
                      فهرس الكلمات
                    </h3>
                    <p className="text-sm text-white/70 mt-1">
                      {filteredWords.length} كلمة
                    </p>
                  </div>

                  <MessageCircle className="w-6 h-6 text-[var(--color-islamic-gold)]" />
                </div>
              </div>

              <div className="max-h-[620px] overflow-y-auto divide-y divide-gray-100">
                {filteredWords.map((word) => {
                  const isSelected = selectedWord.id === word.id;

                  return (
                    <button
                      key={word.id}
                      type="button"
                      onClick={() => setSelectedWordId(word.id)}
                      className={`w-full text-right p-4 transition-colors ${
                        isSelected
                          ? "bg-[var(--color-islamic-ivory)]"
                          : "bg-white hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex gap-3">
                        <span
                          className={`w-9 h-9 rounded-sm flex items-center justify-center shrink-0 ${
                            isSelected
                              ? "bg-[var(--color-islamic-green)] text-white"
                              : "bg-gray-100 text-[var(--color-islamic-green)]"
                          }`}
                        >
                          <MessageCircle className="w-5 h-5" />
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="block font-bold text-gray-800 leading-relaxed line-clamp-2">
                            {word.title}
                          </span>

                          <span className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                            <span>{word.category}</span>
                            <span>•</span>
                            <span>{word.duration}</span>
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
                ? "لا توجد كلمات دعوية مضافة في هذا الباب حاليًا"
                : "لا توجد كلمات دعوية منشورة حاليًا"}
            </p>

            <p className="text-gray-500 mb-6 max-w-2xl mx-auto leading-relaxed">
              {isKnowledgeAreaEmpty
                ? "سيُحدّث هذا القسم عند إضافة كلمات مناسبة لهذا الباب، ويمكنك متابعة بقية أبواب العلم أو عرض جميع الكلمات المتاحة."
                : "ستظهر الكلمات الدعوية هنا عند اعتمادها ونشرها في لوحة التحكم."}
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
