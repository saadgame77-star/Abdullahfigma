import { Clock, Play, Search, Video, X } from "lucide-react";
import { useMemo, useState } from "react";
import {
  publicApi,
  type PublicShort,
  type ShortDisplayMode,
  type ShortFitMode,
} from "../lib/publicApi";
import { useSiteContent } from "../components/SiteContentProvider";
import { InlineText } from "../components/InlineText";
import { usePublicData } from "../lib/usePublicData";

type ShortClip = PublicShort;

const SHORTS_MAX_DURATION_SECONDS = 180;

function resolveDisplayMode(clip: ShortClip): ShortDisplayMode {
  if (!clip.displayMode || clip.displayMode === "auto") return "landscape";
  return clip.displayMode;
}

function resolveFitMode(clip: ShortClip): ShortFitMode {
  return clip.fitMode ?? "smart";
}

function getFrameAspect(clip: ShortClip): string {
  if (clip.aspectRatio) return clip.aspectRatio;

  switch (resolveDisplayMode(clip)) {
    case "portrait":
      return "9 / 16";
    case "square":
      return "1 / 1";
    case "landscape":
    default:
      return "16 / 9";
  }
}

function getFrameMaxWidth(clip: ShortClip): string {
  switch (resolveDisplayMode(clip)) {
    case "portrait":
      return "clamp(280px, 90vw, 420px)";
    case "square":
      return "clamp(320px, 90vw, 600px)";
    case "landscape":
    default:
      return "100%";
  }
}

function isFullBleed(clip: ShortClip): boolean {
  return resolveDisplayMode(clip) === "landscape" && !clip.aspectRatio;
}

function getEmbedUrl(videoId: string, autoplay: boolean) {
  const params = [
    "rel=0",
    "modestbranding=1",
    "playsinline=1",
    "iv_load_policy=3",
    autoplay ? "autoplay=1" : "",
  ]
    .filter(Boolean)
    .join("&");

  if (videoId.startsWith("videoseries?list=")) {
    return `https://www.youtube-nocookie.com/embed/${videoId}&${params}`;
  }

  return `https://www.youtube-nocookie.com/embed/${videoId}?${params}`;
}

function getThumbnailUrl(clip: ShortClip) {
  if (clip.thumbnailUrl) return clip.thumbnailUrl;
  if (clip.videoId.startsWith("videoseries?list=")) return null;

  return `https://img.youtube.com/vi/${clip.videoId}/hqdefault.jpg`;
}

function SmartPlayer({
  clip,
  autoplay,
}: {
  clip: ShortClip;
  autoplay: boolean;
}) {
  const fitMode = resolveFitMode(clip);
  const fullBleed = isFullBleed(clip);
  const thumbnailUrl = getThumbnailUrl(clip);
  const useDecorativeBackdrop =
    !fullBleed && fitMode === "smart" && !!thumbnailUrl;

  const frame = (
    <div
      className="relative w-full overflow-hidden bg-black"
      style={{
        aspectRatio: getFrameAspect(clip),
        maxWidth: getFrameMaxWidth(clip),
      }}
    >
      <iframe
        key={clip.videoId}
        className="absolute inset-0 h-full w-full border-0"
        src={getEmbedUrl(clip.videoId, autoplay)}
        title={clip.title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );

  if (fullBleed) return frame;

  return (
    <div className="relative w-full">
      {useDecorativeBackdrop && (
        <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0 scale-125"
            style={{
              backgroundImage: `url(${thumbnailUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(44px) saturate(1.1) brightness(0.5)",
            }}
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}

      <div className="relative flex justify-center py-6">{frame}</div>
    </div>
  );
}

export function Shorts() {
  const page = useSiteContent().pages.shorts;
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [selectedShortId, setSelectedShortId] = useState<string | null>(null);
  const [autoplay, setAutoplay] = useState(false);

  const { data, loading, error } = usePublicData(publicApi.getShorts);
  const shortClips = data?.items ?? [];

  const visibleShorts = useMemo(() => {
    return shortClips.filter(
      (clip) =>
        clip.publishStatus === "منشور" &&
        clip.durationSeconds <= SHORTS_MAX_DURATION_SECONDS,
    );
  }, [shortClips]);

  const categories = useMemo(
    () => [
      "الكل",
      ...Array.from(new Set(visibleShorts.map((clip) => clip.category))),
    ],
    [visibleShorts],
  );

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

      const matchesCategory =
        activeCategory === "الكل" || clip.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [activeCategory, searchTerm, visibleShorts]);

  const selectedShort =
    filteredShorts.find((clip) => clip.id === selectedShortId) ??
    filteredShorts[0] ??
    null;

  const isCategoryEmpty =
    filteredShorts.length === 0 && activeCategory !== "الكل";

  function resetFilters() {
    setSearchTerm("");
    setActiveCategory("الكل");
    setSelectedShortId(null);
    setAutoplay(false);
  }

  function selectShort(clipId: string) {
    setSelectedShortId(clipId);
    setAutoplay(true);
  }

  return (
    <div className="animate-in fade-in duration-500">
      <section className="container mx-auto px-4 py-6">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <InlineText
              as="h1"
              className="font-serif text-3xl font-bold text-[var(--color-islamic-green-dark)] sm:text-4xl"
              path="pages.shorts.title"
              value={page.title}
            />
            <div className="mt-3 h-1 w-20 bg-[var(--color-islamic-gold)]" />
          </div>

          <div className="w-full lg:max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder={page.searchPlaceholder}
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                  setSelectedShortId(null);
                  setAutoplay(false);
                }}
                className="w-full rounded-sm border border-gray-200 bg-white py-3 px-4 pr-12 shadow-sm transition-all focus:border-[var(--color-islamic-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--color-islamic-gold)]"
              />
              <Search className="absolute right-4 top-3.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => {
                setActiveCategory(category);
                setSelectedShortId(null);
                setAutoplay(false);
              }}
              className={`shrink-0 rounded-sm px-4 py-2 text-sm font-medium transition-colors ${
                activeCategory === category
                  ? "bg-[var(--color-islamic-green)] text-white"
                  : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="rounded-sm border border-gray-200 bg-white p-10 text-center text-gray-500">
            جارٍ تحميل المقاطع...
          </div>
        ) : error ? (
          <div className="rounded-sm border border-red-100 bg-red-50 p-10 text-center text-red-700">
            تعذر تحميل المقاطع. حاول تحديث الصفحة.
          </div>
        ) : selectedShort ? (
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_360px]">
            <main className="overflow-hidden rounded-sm border border-gray-200 bg-white shadow-sm">
              <div className="bg-[var(--color-islamic-green-dark)] px-5 py-4 text-white">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="font-serif text-lg font-bold sm:text-xl">
                      مشاهدة المقطع
                    </h2>
                    <p className="mt-1 flex items-center gap-2 text-xs text-white/70 sm:text-sm">
                      <Clock className="h-3.5 w-3.5" />
                      {selectedShort.duration}
                    </p>
                  </div>

                  <Video className="h-6 w-6 shrink-0 text-[var(--color-islamic-gold)]" />
                </div>
              </div>

              <SmartPlayer clip={selectedShort} autoplay={autoplay} />

              <div className="border-t border-gray-100 px-5 py-4">
                <h2 className="font-serif text-lg font-bold leading-relaxed text-[var(--color-islamic-green-dark)] sm:text-xl">
                  {selectedShort.title}
                </h2>
              </div>
            </main>

            <aside className="overflow-hidden rounded-sm border border-gray-200 bg-white shadow-sm lg:sticky lg:top-6">
              <div className="bg-[var(--color-islamic-green-dark)] px-5 py-4 text-white">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-serif text-lg font-bold sm:text-xl">
                      فهرس المقاطع
                    </h3>
                    <p className="mt-1 text-xs text-white/70 sm:text-sm">
                      {filteredShorts.length} مقطع
                    </p>
                  </div>

                  <Play className="h-6 w-6 text-[var(--color-islamic-gold)]" />
                </div>
              </div>

              <div className="max-h-[640px] divide-y divide-gray-100 overflow-y-auto">
                {filteredShorts.map((clip) => {
                  const isSelected = selectedShort.id === clip.id;
                  const thumbnailUrl = getThumbnailUrl(clip);

                  return (
                    <button
                      key={clip.id}
                      type="button"
                      onClick={() => selectShort(clip.id)}
                      className={`w-full border-r-2 p-4 text-right transition-colors ${
                        isSelected
                          ? "border-r-[var(--color-islamic-gold)] bg-[var(--color-islamic-ivory)]"
                          : "border-r-transparent bg-white hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex gap-3">
                        <span className="relative h-14 w-24 shrink-0 overflow-hidden rounded-sm bg-gray-900">
                          {thumbnailUrl ? (
                            <img
                              src={thumbnailUrl}
                              alt={clip.title}
                              className="h-full w-full object-cover opacity-90"
                              loading="lazy"
                            />
                          ) : (
                            <span className="absolute inset-0 bg-gray-900" />
                          )}

                          <span
                            className={`absolute inset-0 flex items-center justify-center transition-colors ${
                              isSelected ? "bg-black/10" : "bg-black/25"
                            }`}
                          >
                            <Play className="h-5 w-5 fill-current text-white drop-shadow" />
                          </span>
                        </span>

                        <span className="min-w-0 flex-1">
                          <span
                            className={`block line-clamp-2 font-bold leading-relaxed ${
                              isSelected
                                ? "text-[var(--color-islamic-green-dark)]"
                                : "text-gray-800"
                            }`}
                          >
                            {clip.title}
                          </span>

                          <span className="mt-1.5 flex items-center gap-1.5 text-xs text-gray-500">
                            <Clock className="h-3 w-3 text-[var(--color-islamic-gold)]" />
                            {clip.duration}
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
          <div className="rounded-sm border border-gray-200 bg-white p-10 text-center">
            <p className="mb-2 font-serif text-xl font-bold text-[var(--color-islamic-green-dark)] sm:text-2xl">
              {isCategoryEmpty
                ? "لا توجد مقاطع قصيرة مضافة في هذا التصنيف حاليًا"
                : "لا توجد مقاطع قصيرة منشورة حاليًا"}
            </p>

            <p className="mx-auto mb-6 max-w-2xl leading-relaxed text-gray-500">
              {isCategoryEmpty
                ? "سيُحدّث هذا القسم عند إضافة مقاطع مناسبة لهذا التصنيف، ويمكنك تصفّح بقية التصنيفات أو عرض جميع المقاطع المتاحة."
                : "ستظهر المقاطع القصيرة هنا عند اعتمادها ونشرها في لوحة التحكم."}
            </p>

            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center justify-center gap-2 rounded-sm bg-[var(--color-islamic-green)] px-5 py-2.5 font-bold text-white transition-colors hover:bg-[var(--color-islamic-green-dark)]"
            >
              <X className="h-4 w-4" />
              مسح التصفية
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
