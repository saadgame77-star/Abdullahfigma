import {
  AlertCircle,
  CalendarDays,
  Clock,
  ExternalLink,
  Image,
  Library,
  Link as LinkIcon,
  MapPin,
  Repeat,
  Search,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { publicApi, type PublicScheduleItem } from "../lib/publicApi";
import { useSiteContent } from "../components/SiteContentProvider";
import { usePublicData } from "../lib/usePublicData";


function statusClass(status: string) {
  if (status === "قائم") {
    return "bg-emerald-50 text-emerald-800 border-emerald-200";
  }

  if (status === "مؤجل") {
    return "bg-amber-50 text-amber-800 border-amber-200";
  }

  if (status === "متوقف") {
    return "bg-gray-50 text-gray-700 border-gray-200";
  }

  return "bg-red-50 text-red-700 border-red-200";
}

function kindClass(kind: string) {
  if (kind === "درس") {
    return "bg-[var(--color-islamic-green)] text-white border-[var(--color-islamic-green)]";
  }

  return "bg-[var(--color-islamic-ivory)] text-[var(--color-islamic-green-dark)] border-gray-200";
}

function getWhenText(item: PublicScheduleItem) {
  const parts = [item.day, item.time].filter(Boolean);

  if (parts.length > 0) {
    return parts.join(" - ");
  }

  if (item.dateHijri || item.dateGregorian) {
    return [item.dateHijri, item.dateGregorian].filter(Boolean).join(" - ");
  }

  return "لم يحدد الموعد بعد";
}

export function Schedule() {
  const page = useSiteContent().pages.schedule;
  const officialScheduleImageUrl = page.announcementImageUrl;
  const [searchTerm, setSearchTerm] = useState("");
  const [activeKind, setActiveKind] = useState("الكل");
  const [activeStatus, setActiveStatus] = useState("الكل");

  const { data, loading, error } = usePublicData(publicApi.getSchedule);
  const scheduleItems = data?.items ?? [];

  const visibleScheduleItems = useMemo(() => {
    return scheduleItems.filter((item) => item.publishStatus === "منشور");
  }, [scheduleItems]);

  const kinds = useMemo(() => {
    return [
      "الكل",
      ...Array.from(
        new Set(visibleScheduleItems.map((item) => item.scheduleKind)),
      ),
    ];
  }, [visibleScheduleItems]);

  const statuses = ["الكل", "قائم", "مؤجل", "متوقف", "ملغي"];

  const filteredScheduleItems = useMemo(() => {
    return visibleScheduleItems.filter((item) => {
      const search = searchTerm.trim();

      const matchesSearch =
        search === "" ||
        item.title.includes(search) ||
        item.scheduleKind.includes(search) ||
        item.knowledgeArea.includes(search) ||
        item.subCategory.includes(search) ||
        item.day?.includes(search) ||
        item.time?.includes(search) ||
        item.location?.includes(search) ||
        item.tags.some((tag) => tag.includes(search));

      const matchesKind =
        activeKind === "الكل" || item.scheduleKind === activeKind;

      const matchesStatus =
        activeStatus === "الكل" || item.status === activeStatus;

      return matchesSearch && matchesKind && matchesStatus;
    });
  }, [activeKind, activeStatus, searchTerm, visibleScheduleItems]);

  const featuredItem =
    filteredScheduleItems.find((item) => item.status === "قائم") ??
    filteredScheduleItems[0] ??
    null;

  const otherItems = featuredItem
    ? filteredScheduleItems.filter((item) => item.id !== featuredItem.id)
    : filteredScheduleItems;

  const recurringCount = visibleScheduleItems.filter(
    (item) => item.isRecurring,
  ).length;

  const activeCount = visibleScheduleItems.filter(
    (item) => item.status === "قائم",
  ).length;

  function resetFilters() {
    setSearchTerm("");
    setActiveKind("الكل");
    setActiveStatus("الكل");
  }

  return (
    <div className="animate-in fade-in duration-500">
      <section className="container mx-auto px-4 py-6">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold text-[var(--color-islamic-green-dark)] sm:text-4xl">
              {page.title}
            </h1>
            <div className="mt-3 h-1 w-24 bg-[var(--color-islamic-gold)]" />
          </div>

          <div className="w-full lg:max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder={page.searchPlaceholder}
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="w-full rounded-sm border border-gray-200 bg-white py-3 px-4 pr-12 shadow-sm transition-all focus:border-[var(--color-islamic-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--color-islamic-gold)]"
              />
              <Search className="absolute right-4 top-3.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="mb-6 space-y-3 rounded-sm border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap gap-2">
            {kinds.map((kind) => (
              <button
                key={kind}
                type="button"
                onClick={() => setActiveKind(kind)}
                className={`shrink-0 rounded-sm px-4 py-2 text-sm font-medium transition-colors ${
                  activeKind === kind
                    ? "bg-[var(--color-islamic-green)] text-white"
                    : "border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {kind}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {statuses.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setActiveStatus(status)}
                className={`shrink-0 rounded-sm px-4 py-2 text-sm font-medium transition-colors ${
                  activeStatus === status
                    ? "bg-[var(--color-islamic-green)] text-white"
                    : "border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="rounded-sm border border-gray-200 bg-white p-10 text-center text-gray-500">
            جارٍ تحميل الجدول...
          </div>
        ) : error ? (
          <div className="rounded-sm border border-red-100 bg-red-50 p-10 text-center text-red-700">
            تعذر تحميل الجدول. حاول تحديث الصفحة.
          </div>
        ) : featuredItem ? (
          <div className="space-y-8">
            <section className="overflow-hidden rounded-sm border border-gray-200 bg-white shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px]">
                <div className="p-6 sm:p-8">
                  <div className="mb-5 flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-sm border px-3 py-1 text-xs font-bold ${kindClass(
                        featuredItem.scheduleKind,
                      )}`}
                    >
                      {featuredItem.scheduleKind}
                    </span>

                    <span
                      className={`inline-flex items-center rounded-sm border px-3 py-1 text-xs font-bold ${statusClass(
                        featuredItem.status,
                      )}`}
                    >
                      {featuredItem.status}
                    </span>

                    {featuredItem.isRecurring && (
                      <span className="inline-flex items-center gap-1 rounded-sm border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-bold text-gray-700">
                        <Repeat className="h-3.5 w-3.5 text-[var(--color-islamic-gold)]" />
                        {featuredItem.recurrenceType}
                      </span>
                    )}
                  </div>

                  <h2 className="font-serif text-2xl font-bold leading-relaxed text-[var(--color-islamic-green-dark)] sm:text-3xl">
                    {featuredItem.title}
                  </h2>

                  <p className="mt-4 max-w-3xl leading-relaxed text-gray-600">
                    {featuredItem.description}
                  </p>

                  <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-sm border border-gray-200 bg-[var(--color-islamic-ivory)] p-4">
                      <span className="mb-2 flex items-center gap-2 text-sm font-bold text-[var(--color-islamic-green-dark)]">
                        <CalendarDays className="h-4 w-4 text-[var(--color-islamic-gold)]" />
                        الموعد
                      </span>
                      <p className="text-gray-700">
                        {getWhenText(featuredItem)}
                      </p>
                    </div>

                    <div className="rounded-sm border border-gray-200 bg-[var(--color-islamic-ivory)] p-4">
                      <span className="mb-2 flex items-center gap-2 text-sm font-bold text-[var(--color-islamic-green-dark)]">
                        <MapPin className="h-4 w-4 text-[var(--color-islamic-gold)]" />
                        المكان
                      </span>
                      <p className="text-gray-700">
                        {featuredItem.location || "لم يحدد المكان بعد"}
                      </p>
                    </div>
                  </div>

                  {featuredItem.onlineUrl && (
                    <a
                      href={featuredItem.onlineUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 inline-flex items-center gap-2 rounded-sm bg-[var(--color-islamic-green)] px-5 py-2.5 font-bold text-white transition-colors hover:bg-[var(--color-islamic-green-dark)]"
                    >
                      رابط المتابعة
                      <LinkIcon className="h-4 w-4" />
                    </a>
                  )}
                </div>

                <aside className="border-t border-gray-200 bg-[var(--color-islamic-green-dark)] p-6 text-white lg:border-t-0 lg:border-r">
                  <p className="text-sm text-white/70">التصنيف العلمي</p>
                  <h3 className="mt-2 font-serif text-xl font-bold">
                    {featuredItem.knowledgeArea}
                  </h3>
                  <p className="mt-2 text-sm text-white/75">
                    {featuredItem.subCategory}
                  </p>

                  {featuredItem.recurrenceDetails && (
                    <div className="mt-6 rounded-sm border border-white/15 bg-white/5 p-4">
                      <p className="mb-2 flex items-center gap-2 text-sm font-bold">
                        <Repeat className="h-4 w-4 text-[var(--color-islamic-gold)]" />
                        التكرار
                      </p>
                      <p className="text-sm leading-relaxed text-white/75">
                        {featuredItem.recurrenceDetails}
                      </p>
                    </div>
                  )}
                </aside>
              </div>
            </section>

            {otherItems.length > 0 && (
              <section>
                <h2 className="mb-4 font-serif text-2xl font-bold text-[var(--color-islamic-green-dark)]">
                  مواعيد أخرى
                </h2>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {otherItems.map((item) => (
                    <article
                      key={item.id}
                      className="rounded-sm border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                    >
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex rounded-sm border px-3 py-1 text-xs font-bold ${kindClass(
                            item.scheduleKind,
                          )}`}
                        >
                          {item.scheduleKind}
                        </span>

                        <span
                          className={`inline-flex rounded-sm border px-3 py-1 text-xs font-bold ${statusClass(
                            item.status,
                          )}`}
                        >
                          {item.status}
                        </span>
                      </div>

                      <h3 className="font-serif text-xl font-bold leading-relaxed text-[var(--color-islamic-green-dark)]">
                        {item.title}
                      </h3>

                      <div className="mt-4 space-y-2 text-sm text-gray-600">
                        <p className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-[var(--color-islamic-gold)]" />
                          {getWhenText(item)}
                        </p>

                        <p className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-[var(--color-islamic-gold)]" />
                          {item.location || "لم يحدد المكان بعد"}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : (
          <div className="rounded-sm border border-gray-200 bg-white p-10 text-center">
            <p className="mb-2 font-serif text-2xl font-bold text-[var(--color-islamic-green-dark)]">
              لا توجد مواعيد منشورة حاليًا
            </p>

            <p className="mx-auto mb-6 max-w-2xl leading-relaxed text-gray-500">
              ستظهر هنا المواعيد المعتمدة عند نشرها في جدول المحاضرات والدروس.
            </p>

            {(searchTerm ||
              activeKind !== "الكل" ||
              activeStatus !== "الكل") && (
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

        <section className="mt-12 rounded-sm border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-serif text-xl font-bold text-[var(--color-islamic-green-dark)]">
                معلومات الجدول
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                ملخص سريع يظهر بعد المحتوى الأساسي.
              </p>
            </div>

            <AlertCircle className="h-6 w-6 text-[var(--color-islamic-gold)]" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-sm border border-gray-200 bg-gray-50 p-4">
              <span className="block text-2xl font-bold text-[var(--color-islamic-green-dark)]">
                {visibleScheduleItems.length}
              </span>
              <p className="mt-1 text-sm text-gray-600">مواعيد منشورة</p>
            </div>

            <div className="rounded-sm border border-gray-200 bg-gray-50 p-4">
              <span className="block text-2xl font-bold text-[var(--color-islamic-green-dark)]">
                {activeCount}
              </span>
              <p className="mt-1 text-sm text-gray-600">مواعيد قائمة</p>
            </div>

            <div className="rounded-sm border border-gray-200 bg-gray-50 p-4">
              <span className="block text-2xl font-bold text-[var(--color-islamic-green-dark)]">
                {recurringCount}
              </span>
              <p className="mt-1 text-sm text-gray-600">مواعيد متكررة</p>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-sm border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-serif text-xl font-bold text-[var(--color-islamic-green-dark)]">
                الإعلان الرسمي للجدول
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                يمكن إضافة صورة الجدول الرسمية لاحقًا عند اعتمادها.
              </p>
            </div>

            <Image className="h-6 w-6 text-[var(--color-islamic-gold)]" />
          </div>

          {officialScheduleImageUrl ? (
            <div className="space-y-5 text-center">
              <img
                src={officialScheduleImageUrl}
                alt="صورة الإعلان الرسمي للجدول"
                className="mx-auto max-w-full rounded-sm border border-gray-200"
              />

              <a
                href={officialScheduleImageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-sm bg-[var(--color-islamic-gold)] px-6 py-2 font-bold text-[var(--color-islamic-green-dark)] transition-colors hover:bg-[var(--color-islamic-gold-light)]"
              >
                تحميل الصورة
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-sm border-2 border-dashed border-gray-300 bg-gray-50 p-10 text-center text-gray-400">
              <Image className="mb-4 h-14 w-14 opacity-50" />
              <p>سيظهر هنا الإعلان الرسمي عند إضافته.</p>
            </div>
          )}
        </section>
      </section>
    </div>
  );
}
