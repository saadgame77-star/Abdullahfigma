import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  ExternalLink,
  Filter,
  Play,
  Search,
  Share2,
  Tag,
} from "lucide-react";
import { useMemo, useState } from "react";
import { shortClips } from "../data/shortClips";

export function Shorts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  const categories = useMemo(() => {
    return [
      "الكل",
      ...Array.from(new Set(shortClips.map((clip) => clip.category))),
    ];
  }, []);

  const filteredShorts = useMemo(() => {
    return shortClips.filter((short) => {
      const matchesSearch =
        searchTerm.trim() === "" ||
        short.title.includes(searchTerm) ||
        short.channel.includes(searchTerm) ||
        short.category.includes(searchTerm);

      const matchesCategory =
        activeCategory === "الكل" || short.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [activeCategory, searchTerm]);

  function getEmbedUrl(videoId: string) {
    if (videoId.startsWith("videoseries?list=")) {
      return `https://www.youtube.com/embed/${videoId}&autoplay=1&rel=0`;
    }

    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
  }

  function getThumbnailUrl(videoId: string) {
    if (videoId.startsWith("videoseries?list=")) {
      return null;
    }

    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }

  return (
    <div className="container mx-auto px-4 py-12 animate-in fade-in duration-500 bg-[var(--color-islamic-ivory)]">
      <div className="mb-10 text-center">
        <h1 className="font-serif text-4xl text-[var(--color-islamic-green-dark)] font-bold mb-4">
          المقاطع القصيرة
        </h1>
        <div className="w-24 h-1 bg-[var(--color-islamic-gold)] mx-auto mb-6"></div>
        <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
          فوائد وفرائد منتخبة لا تتجاوز ثلاث دقائق، مصنفة بحسب موضوعها، مع تشغيل
          مقطع واحد في كل مرة داخل الصفحة.
        </p>
      </div>

      <div className="bg-white p-4 rounded-sm shadow-sm border border-gray-100 mb-10 flex flex-col gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="البحث في المقاطع القصيرة..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-sm py-3 px-4 pr-12 focus:outline-none focus:border-[var(--color-islamic-gold)] focus:ring-1 focus:ring-[var(--color-islamic-gold)] transition-all"
          />
          <Search className="absolute right-4 top-3.5 text-gray-400 w-5 h-5" />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 text-sm text-gray-600 ml-2">
            <Filter className="w-4 h-4" />
            تصفية حسب الموضوع:
          </div>

          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setActiveCategory(category);
                setActiveVideoId(null);
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

      {filteredShorts.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-6">
          {filteredShorts.map((short) => {
            const isActive = activeVideoId === short.videoId;
            const thumbnailUrl = getThumbnailUrl(short.videoId);

            return (
              <article
                key={short.id}
                className="w-full sm:w-[300px] bg-black rounded-xl overflow-hidden shadow-xl relative group border border-black/10"
              >
                <div className="aspect-[9/16] bg-gray-900 relative">
                  {isActive ? (
                    <iframe
                      className="w-full h-full"
                      src={getEmbedUrl(short.videoId)}
                      title={short.title}
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setActiveVideoId(short.videoId)}
                      className="w-full h-full relative flex items-center justify-center text-right"
                    >
                      {thumbnailUrl ? (
                        <img
                          src={thumbnailUrl}
                          alt={short.title}
                          className="absolute inset-0 w-full h-full object-cover opacity-70"
                          loading="lazy"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-950"></div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

                      <div className="relative z-10 w-20 h-20 rounded-full bg-black/50 border border-white/20 flex items-center justify-center group-hover:bg-[var(--color-islamic-gold)] group-hover:text-[var(--color-islamic-green-dark)] transition-all">
                        <Play className="w-10 h-10 text-white group-hover:text-[var(--color-islamic-green-dark)] fill-current" />
                      </div>
                    </button>
                  )}

                  {!isActive && (
                    <>
                      <div className="pointer-events-none absolute top-4 right-4 z-10 flex flex-col gap-2 items-start">
                        <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-sm bg-[var(--color-islamic-green)] text-white font-medium">
                          <Tag className="w-3.5 h-3.5" />
                          {short.category}
                        </span>

                        {short.trust === "متوسط" ? (
                          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-sm bg-amber-100 text-amber-800 font-bold">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            بحاجة تحقق
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-sm bg-green-100 text-green-800 font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            موثوق
                          </span>
                        )}
                      </div>

                      <div className="absolute bottom-0 left-0 w-full p-5 bg-gradient-to-t from-black via-black/80 to-transparent z-10">
                        <h3 className="text-white font-bold text-lg mb-3 leading-relaxed line-clamp-3">
                          {short.title}
                        </h3>

                        <div className="flex items-center justify-between text-gray-300 text-sm gap-3">
                          <span className="font-mono bg-black/60 px-2 py-1 rounded inline-flex items-center gap-1">
                            <Clock className="w-4 h-4 text-[var(--color-islamic-gold)]" />
                            {short.duration}
                          </span>

                          <a
                            href={short.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(event) => event.stopPropagation()}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors pointer-events-auto"
                            title="فتح المقطع في يوتيوب"
                          >
                            <Share2 className="w-5 h-5 text-[var(--color-islamic-gold)]" />
                          </a>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="bg-white p-4 space-y-3">
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>
                      <span className="font-bold text-gray-700">القناة: </span>
                      {short.channel}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1 rounded-sm bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                        <Clock className="w-3.5 h-3.5 text-[var(--color-islamic-gold)]" />
                        {short.duration}
                      </span>

                      <span className="inline-flex items-center gap-1 rounded-sm bg-[var(--color-islamic-ivory)] px-2.5 py-1 text-xs font-medium text-[var(--color-islamic-green)] border border-gray-200">
                        <Tag className="w-3.5 h-3.5" />
                        {short.category}
                      </span>
                    </div>
                  </div>

                  {short.note && (
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {short.note}
                    </p>
                  )}

                  <div className="flex flex-col gap-2">
                    <a
                      href={short.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-sm border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      فتح في يوتيوب
                      <Share2 className="w-4 h-4" />
                    </a>

                    {short.sourceUrl && (
                      <a
                        href={short.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-sm border border-[var(--color-islamic-green)] px-3 py-2 text-sm font-medium text-[var(--color-islamic-green)] transition-colors hover:bg-[var(--color-islamic-green)] hover:text-white"
                        title={short.sourceTitle ?? "مشاهدة أصل المقطع"}
                      >
                        {short.sourceTitle ?? "مشاهدة أصل المقطع"}
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-sm p-8 text-center text-gray-500">
          لا توجد نتائج مطابقة للبحث أو التصنيف المحدد.
        </div>
      )}
    </div>
  );
}
