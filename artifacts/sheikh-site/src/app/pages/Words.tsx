import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Filter,
  Library,
  MessageCircle,
  Search,
  Tags,
} from "lucide-react";
import { useMemo, useState } from "react";
import { getAllKnowledgeAreaNames } from "../data/knowledgeCategories";
import { words } from "../data/words";

export function Words() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeKnowledgeArea, setActiveKnowledgeArea] = useState("الكل");
  const [activeCategory, setActiveCategory] = useState("الكل");

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
        word.channel.includes(search) ||
        word.tags.some((tag) => tag.includes(search));

      const matchesKnowledgeArea =
        activeKnowledgeArea === "الكل" ||
        word.knowledgeArea === activeKnowledgeArea;

      const matchesCategory =
        activeCategory === "الكل" || word.category === activeCategory;

      return matchesSearch && matchesKnowledgeArea && matchesCategory;
    });
  }, [activeCategory, activeKnowledgeArea, searchTerm, visibleWords]);

  const representedKnowledgeAreaCount = useMemo(() => {
    return new Set(visibleWords.map((word) => word.knowledgeArea)).size;
  }, [visibleWords]);

  return (
    <div className="container mx-auto px-4 py-12 animate-in fade-in duration-500">
      <div className="mb-10 text-center">
        <h1 className="font-serif text-4xl text-[var(--color-islamic-green-dark)] font-bold mb-4">
          الكلمات الدعوية
        </h1>
        <div className="w-24 h-1 bg-[var(--color-islamic-gold)] mx-auto mb-6"></div>
        <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
          كلمات موجزة وتوجيهات نافعة تلقى عقب الصلوات وفي المناسبات، مصنفة حسب
          أبواب العلم والموضوعات، مع وسوم تساعد على البحث والوصول.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        <div className="bg-white border border-gray-200 rounded-sm p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <MessageCircle className="w-6 h-6 text-[var(--color-islamic-gold)]" />
            <span className="text-2xl font-bold text-[var(--color-islamic-green-dark)]">
              {visibleWords.length}
            </span>
          </div>
          <p className="text-sm text-gray-600">إجمالي الكلمات المنشورة</p>
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
              موجزة
            </span>
          </div>
          <p className="text-sm text-gray-600">
            مناسبة للكلمات والتوجيهات العامة
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-sm shadow-sm border border-gray-100 mb-10 flex flex-col gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="البحث في الكلمات الدعوية والوسوم..."
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
            <MessageCircle className="w-4 h-4" />
            التصنيف:
          </div>

          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
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

      {filteredWords.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {filteredWords.map((word) => (
            <article
              key={word.id}
              className="bg-white border border-gray-100 rounded-sm p-5 shadow-sm hover:shadow-md transition-all hover:border-[var(--color-islamic-gold-light)] group"
            >
              <div className="w-12 h-12 bg-[var(--color-islamic-ivory)] border border-gray-200 rounded-full flex items-center justify-center mb-4 text-[var(--color-islamic-green)] group-hover:bg-[var(--color-islamic-green)] group-hover:text-white transition-colors">
                <MessageCircle className="w-6 h-6" />
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-sm bg-[var(--color-islamic-green)] text-white font-medium">
                  <Library className="w-3 h-3" />
                  {word.knowledgeArea}
                </span>

                <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-sm bg-gray-100 text-gray-700 font-medium">
                  {word.wordType}
                </span>

                {word.trust === "متوسط" ? (
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

              <h3 className="font-serif font-bold text-xl text-gray-800 mb-3 line-clamp-3 leading-relaxed group-hover:text-[var(--color-islamic-green)] transition-colors">
                {word.title}
              </h3>

              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                {word.description}
              </p>

              <div className="space-y-2 text-sm text-gray-600 border-t border-gray-50 pt-4 mb-4">
                <p>
                  <span className="font-bold text-gray-700">المصدر: </span>
                  {word.channel}
                </p>

                <p>
                  <span className="font-bold text-gray-700">
                    التصنيف الفرعي:{" "}
                  </span>
                  {word.subCategory}
                </p>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-[var(--color-islamic-gold)]" />
                    المدة:
                  </span>
                  <span className="font-mono bg-gray-50 px-2 py-0.5 rounded text-gray-700">
                    {word.duration}
                  </span>
                </div>

                {word.dateHijri && (
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-[var(--color-islamic-gold)]" />
                      التاريخ:
                    </span>
                    <span className="text-gray-700">{word.dateHijri}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {word.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-sm bg-[var(--color-islamic-ivory)] px-2.5 py-1 text-xs font-medium text-gray-700 border border-gray-200"
                  >
                    <Tags className="w-3 h-3 text-[var(--color-islamic-gold)]" />
                    {tag}
                  </span>
                ))}
              </div>

              {word.note && (
                <p className="text-xs text-gray-500 leading-relaxed mb-4 border-r-2 border-[var(--color-islamic-gold)] pr-3">
                  {word.note}
                </p>
              )}

              {word.url !== "#" && (
                <a
                  href={word.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 bg-white border border-[var(--color-islamic-green)] text-[var(--color-islamic-green)] px-4 py-2 rounded-sm hover:bg-[var(--color-islamic-green)] hover:text-white transition-colors font-medium text-sm"
                >
                  فتح الكلمة
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </article>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-sm p-8 text-center text-gray-500">
          لا توجد كلمات دعوية منشورة حاليًا.
        </div>
      )}
    </div>
  );
}
