import {
  BookOpen,
  Clock,
  Download,
  ExternalLink,
  FileText,
  Mic,
  Play,
  Search,
  Video,
  Volume2,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { publicApi, type PublicMiscItem } from "../lib/publicApi";
import { usePublicData } from "../lib/usePublicData";

type MiscItem = PublicMiscItem;

function getSectionIcon(icon: string) {
  if (icon === "book") return BookOpen;
  if (icon === "video") return Video;
  if (icon === "audio") return Volume2;
  if (icon === "mic") return Mic;
  return FileText;
}

function getItemIcon(kind: string) {
  if (kind === "كتاب إلكتروني") return BookOpen;
  if (kind === "خطبة" || kind === "صوتية") return Volume2;
  if (kind === "مرئية") return Video;
  if (kind === "تلاوة") return Mic;
  return FileText;
}

function getYouTubeEmbedUrl(videoId: string) {
  return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1`;
}

function getActionLabel(item: MiscItem) {
  if (item.downloadLabel) return item.downloadLabel;
  if (item.fileUrl) return "تحميل الملف";
  if (item.externalUrl) return "فتح الرابط";
  if (item.audioUrl) return "استماع";
  if (item.videoId) return "مشاهدة";
  return "قيد الإضافة";
}

function hasPlayableContent(item: MiscItem) {
  return Boolean(
    item.audioUrl || item.videoId || item.fileUrl || item.externalUrl,
  );
}

export function Recitations() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSectionSlug, setActiveSectionSlug] = useState("all");
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const { data, loading, error } = usePublicData(publicApi.getMisc);
  const miscSections = data?.sections ?? [];
  const miscItems = data?.items ?? [];

  const visibleSections = useMemo(() => {
    return miscSections.filter((section) => section.publishStatus === "منشور");
  }, [miscSections]);

  const visibleItems = useMemo(() => {
    return miscItems.filter((item) => item.publishStatus === "منشور");
  }, [miscItems]);

  const sectionsWithAll = useMemo(() => {
    return [
      {
        id: "all",
        title: "الكل",
        slug: "all",
        description: "عرض جميع المواد المتاحة.",
        icon: "file" as const,
        publishStatus: "منشور" as const,
        displayOrder: 0,
      },
      ...visibleSections,
    ];
  }, [visibleSections]);

  const filteredItems = useMemo(() => {
    return visibleItems.filter((item) => {
      const search = searchTerm.trim();

      const matchesSearch =
        search === "" ||
        item.title.includes(search) ||
        item.kind.includes(search) ||
        item.category.includes(search) ||
        item.knowledgeArea?.includes(search) ||
        item.subCategory?.includes(search) ||
        item.tags.some((tag) => tag.includes(search));

      const matchesSection =
        activeSectionSlug === "all" || item.sectionSlug === activeSectionSlug;

      return matchesSearch && matchesSection;
    });
  }, [activeSectionSlug, searchTerm, visibleItems]);

  const selectedItem =
    filteredItems.find((item) => item.id === selectedItemId) ??
    filteredItems[0] ??
    null;

  const activeSection =
    sectionsWithAll.find((section) => section.slug === activeSectionSlug) ??
    sectionsWithAll[0];

  function resetFilters() {
    setSearchTerm("");
    setActiveSectionSlug("all");
    setSelectedItemId(null);
  }

  function selectSection(slug: string) {
    setActiveSectionSlug(slug);
    setSelectedItemId(null);
  }

  function selectItem(itemId: string) {
    setSelectedItemId(itemId);
  }

  return (
    <div className="animate-in fade-in duration-500">
      <section className="container mx-auto px-4 py-6">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold text-[var(--color-islamic-green-dark)] sm:text-4xl">
              متفرقات
            </h1>
            <div className="mt-3 h-1 w-20 bg-[var(--color-islamic-gold)]" />
          </div>

          <div className="w-full lg:max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="ابحث في التلاوات والخطب والملفات..."
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                  setSelectedItemId(null);
                }}
                className="w-full rounded-sm border border-gray-200 bg-white py-3 px-4 pr-12 shadow-sm transition-all focus:border-[var(--color-islamic-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--color-islamic-gold)]"
              />
              <Search className="absolute right-4 top-3.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
          {sectionsWithAll.map((section) => {
            const Icon = getSectionIcon(section.icon);
            const isActive = activeSectionSlug === section.slug;

            return (
              <button
                key={section.slug}
                type="button"
                onClick={() => selectSection(section.slug)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-sm px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[var(--color-islamic-green)] text-white"
                    : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Icon
                  className={`h-4 w-4 ${
                    isActive
                      ? "text-[var(--color-islamic-gold)]"
                      : "text-gray-400"
                  }`}
                />
                {section.title}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="rounded-sm border border-gray-200 bg-white p-10 text-center text-gray-500">
            جارٍ تحميل المتفرقات...
          </div>
        ) : error ? (
          <div className="rounded-sm border border-red-100 bg-red-50 p-10 text-center text-red-700">
            تعذر تحميل المتفرقات. حاول تحديث الصفحة.
          </div>
        ) : selectedItem ? (
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_360px]">
            <main className="overflow-hidden rounded-sm border border-gray-200 bg-white shadow-sm">
              <div className="bg-[var(--color-islamic-green-dark)] px-5 py-4 text-white">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[var(--color-islamic-gold)]">
                      {selectedItem.kind}
                    </p>
                    <h2 className="mt-1 font-serif text-lg font-bold sm:text-xl">
                      {selectedItem.title}
                    </h2>
                  </div>

                  {(() => {
                    const Icon = getItemIcon(selectedItem.kind);
                    return (
                      <Icon className="h-6 w-6 shrink-0 text-[var(--color-islamic-gold)]" />
                    );
                  })()}
                </div>
              </div>

              <div className="bg-[#050505] p-4 sm:p-6">
                {selectedItem.videoId ? (
                  <div className="mx-auto aspect-video w-full max-w-5xl overflow-hidden rounded-sm bg-black">
                    <iframe
                      key={selectedItem.videoId}
                      className="h-full w-full border-0"
                      src={getYouTubeEmbedUrl(selectedItem.videoId)}
                      title={selectedItem.title}
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                ) : selectedItem.audioUrl ? (
                  <div className="mx-auto max-w-3xl rounded-sm border border-white/10 bg-white/5 p-6">
                    <div className="mb-5 flex items-center gap-4">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-[var(--color-islamic-gold)] bg-[var(--color-islamic-green)]">
                        <Volume2 className="h-8 w-8 text-[var(--color-islamic-gold)]" />
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-serif text-xl font-bold text-white">
                          {selectedItem.title}
                        </h3>

                        {selectedItem.duration && (
                          <p className="mt-1 flex items-center gap-2 text-sm text-white/60">
                            <Clock className="h-4 w-4 text-[var(--color-islamic-gold)]" />
                            {selectedItem.duration}
                          </p>
                        )}
                      </div>
                    </div>

                    <audio
                      src={selectedItem.audioUrl}
                      controls
                      className="w-full"
                    />
                  </div>
                ) : (
                  <div className="mx-auto max-w-3xl rounded-sm border border-white/10 bg-white/5 p-8 text-center">
                    {(() => {
                      const Icon = getItemIcon(selectedItem.kind);
                      return (
                        <Icon className="mx-auto mb-4 h-16 w-16 text-[var(--color-islamic-gold)]" />
                      );
                    })()}

                    <h3 className="font-serif text-2xl font-bold text-white">
                      {selectedItem.title}
                    </h3>

                    <p className="mx-auto mt-3 max-w-2xl leading-relaxed text-white/65">
                      {hasPlayableContent(selectedItem)
                        ? "يمكن فتح هذه المادة أو تحميلها من الزر أدناه."
                        : "لم تتم إضافة رابط هذه المادة بعد، وستظهر هنا عند اعتمادها من لوحة التحكم."}
                    </p>

                    {(selectedItem.fileUrl || selectedItem.externalUrl) && (
                      <a
                        href={selectedItem.fileUrl || selectedItem.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-6 inline-flex items-center gap-2 rounded-sm bg-[var(--color-islamic-gold)] px-5 py-2.5 font-bold text-[var(--color-islamic-green-dark)] transition-colors hover:bg-[var(--color-islamic-gold-light)]"
                      >
                        {getActionLabel(selectedItem)}
                        {selectedItem.fileUrl ? (
                          <Download className="h-4 w-4" />
                        ) : (
                          <ExternalLink className="h-4 w-4" />
                        )}
                      </a>
                    )}
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100 px-5 py-4">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-sm bg-[var(--color-islamic-green)] px-3 py-1 text-xs font-bold text-white">
                    {selectedItem.category}
                  </span>

                  {selectedItem.duration && (
                    <span className="inline-flex items-center gap-1 rounded-sm border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-bold text-gray-700">
                      <Clock className="h-3.5 w-3.5 text-[var(--color-islamic-gold)]" />
                      {selectedItem.duration}
                    </span>
                  )}
                </div>

                <p className="leading-relaxed text-gray-600">
                  {selectedItem.description}
                </p>
              </div>
            </main>

            <aside className="overflow-hidden rounded-sm border border-gray-200 bg-white shadow-sm lg:sticky lg:top-6">
              <div className="bg-[var(--color-islamic-green-dark)] px-5 py-4 text-white">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-serif text-lg font-bold sm:text-xl">
                      {activeSection.title}
                    </h3>
                    <p className="mt-1 text-xs text-white/70 sm:text-sm">
                      {filteredItems.length} مادة
                    </p>
                  </div>

                  <Play className="h-6 w-6 text-[var(--color-islamic-gold)]" />
                </div>
              </div>

              <div className="max-h-[640px] divide-y divide-gray-100 overflow-y-auto">
                {filteredItems.map((item) => {
                  const isSelected = selectedItem.id === item.id;
                  const Icon = getItemIcon(item.kind);

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => selectItem(item.id)}
                      className={`w-full border-r-2 p-4 text-right transition-colors ${
                        isSelected
                          ? "border-r-[var(--color-islamic-gold)] bg-[var(--color-islamic-ivory)]"
                          : "border-r-transparent bg-white hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex gap-3">
                        <span
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-sm ${
                            isSelected
                              ? "bg-[var(--color-islamic-green)] text-white"
                              : "bg-gray-100 text-[var(--color-islamic-green)]"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                        </span>

                        <span className="min-w-0 flex-1">
                          <span
                            className={`block line-clamp-2 font-bold leading-relaxed ${
                              isSelected
                                ? "text-[var(--color-islamic-green-dark)]"
                                : "text-gray-800"
                            }`}
                          >
                            {item.title}
                          </span>

                          <span className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                            <span>{item.kind}</span>
                            {item.duration && (
                              <>
                                <span>•</span>
                                <span>{item.duration}</span>
                              </>
                            )}
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
              لا توجد مواد منشورة في هذا القسم حاليًا
            </p>

            <p className="mx-auto mb-6 max-w-2xl leading-relaxed text-gray-500">
              ستظهر هنا المواد بعد اعتمادها ونشرها من لوحة التحكم، ويمكن إضافة
              أقسام جديدة لاحقًا مثل التلاوات والخطب والكتب الإلكترونية
              والملفات.
            </p>

            {(searchTerm || activeSectionSlug !== "all") && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center justify-center gap-2 rounded-sm bg-[var(--color-islamic-green)] px-5 py-2.5 font-bold text-white transition-colors hover:bg-[var(--color-islamic-green-dark)]"
              >
                <X className="h-4 w-4" />
                مسح التصفية
              </button>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
