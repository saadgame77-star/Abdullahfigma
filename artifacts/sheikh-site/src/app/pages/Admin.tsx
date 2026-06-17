import {
  BookOpen,
  Boxes,
  CalendarDays,
  CheckCircle2,
  Clock,
  Edit3,
  ExternalLink,
  FolderTree,
  Hash,
  LayoutDashboard,
  ListChecks,
  ListVideo,
  Mail,
  Megaphone,
  Mic2,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Tags,
  Trash2,
  UserCog,
  Video,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SeriesManager } from "../components/admin/SeriesManager";
import { LecturesManager } from "../components/admin/LecturesManager";
import { WordsManager } from "../components/admin/WordsManager";
import { ShortsManager } from "../components/admin/ShortsManager";
import { CategoriesManager } from "../components/admin/CategoriesManager";
import { ScheduleManager } from "../components/admin/ScheduleManager";
import { MiscManager } from "../components/admin/MiscManager";
import { adminApi, type AdminStats } from "../lib/adminApi";
import { adminSections, type AdminSection } from "../data/adminSections";
import { adminSupervisors } from "../data/adminSupervisors";
import { adminTags } from "../data/adminTags";
import { knowledgeCategories } from "../data/knowledgeCategories";
import { permissionGroups } from "../data/adminPermissions";
import { scientificSeries } from "../data/scientificSeries";
import { shortClips } from "../data/shortClips";

type ContentStatus =
  | "منشور"
  | "مسودة"
  | "مخفي"
  | "مكتملة"
  | "قيد الاكتمال"
  | "مجدول"
  | "متوقف"
  | "مؤجل";

type ContentItem = {
  id: string;
  section: AdminSection;
  title: string;
  type: string;
  category: string;
  status: ContentStatus;
  source?: string;
  meta?: string;
  url?: string;
  tags: string[];
};

const sectionIcons = {
  overview: LayoutDashboard,
  series: ListVideo,
  shorts: Video,
  lectures: Mic2,
  words: Megaphone,
  schedule: CalendarDays,
  misc: Boxes,
  knowledge: FolderTree,
  tags: Tags,
  supervisors: UserCog,
  settings: Settings,
};

function statusClass(status: string) {
  if (
    status === "مسودة" ||
    status === "مخفي" ||
    status === "قيد الاكتمال" ||
    status === "متوقف" ||
    status === "مؤجل"
  ) {
    return "bg-amber-100 text-amber-800";
  }

  return "bg-green-100 text-green-800";
}

export function Admin() {
  const [activeSection, setActiveSection] = useState<AdminSection>("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [liveStats, setLiveStats] = useState<AdminStats | null>(null);

  const refreshStats = useCallback(() => {
    adminApi
      .getStats()
      .then((result) => setLiveStats(result))
      .catch(() => {
        /* keep last known stats on transient failure */
      });
  }, []);

  useEffect(() => {
    refreshStats();
  }, [refreshStats]);

  const contentItems: ContentItem[] = useMemo(() => {
    const seriesItems: ContentItem[] = scientificSeries.map((series) => ({
      id: `series-${series.id}`,
      section: "series",
      title: series.title,
      type: "سلسلة علمية",
      category: series.category,
      status: series.status === "مكتملة" ? "مكتملة" : "قيد الاكتمال",
      source: series.channel,
      meta: series.count,
      url: series.url,
      tags: [
        series.category.split("/")[0]?.trim() || "دروس علمية",
        "سلسلة علمية",
      ],
    }));

    const shortItems: ContentItem[] = shortClips.map((clip) => ({
      id: `short-${clip.id}`,
      section: "shorts",
      title: clip.title,
      type: "مقطع قصير",
      category: clip.category,
      status: "منشور",
      source: clip.channel,
      meta: clip.duration,
      url: clip.url,
      tags: [clip.category, "مقطع قصير"],
    }));

    const scheduleItems: ContentItem[] = [
      {
        id: "schedule-1",
        section: "schedule",
        title: "درس أسبوعي",
        type: "موعد متكرر",
        category: "جدول الدروس",
        status: "مجدول",
        source: "المسجد / رابط البث عند الحاجة",
        meta: "مرن: يحدد اليوم والوقت والتكرار من لوحة التحكم",
        tags: ["جدول", "موعد"],
      },
    ];

    return [...seriesItems, ...shortItems, ...scheduleItems];
  }, []);

  const activeInfo =
    adminSections.find((section) => section.key === activeSection) ??
    adminSections[0];

  // Sections that render their own DB-backed manager (with their own toolbar).
  const managedSections = [
    "series",
    "lectures",
    "words",
    "shorts",
    "schedule",
    "misc",
    "knowledge",
  ];
  const isManagedSection = managedSections.includes(activeSection);

  const visibleItems = contentItems.filter((item) => {
    const isCurrentSection = item.section === activeSection;

    const matchesSearch =
      searchTerm.trim() === "" ||
      item.title.includes(searchTerm) ||
      item.type.includes(searchTerm) ||
      item.category.includes(searchTerm) ||
      item.status.includes(searchTerm) ||
      (item.source ?? "").includes(searchTerm) ||
      item.tags.some((tag) => tag.includes(searchTerm));

    return isCurrentSection && matchesSearch;
  });

  const completedSeries = scientificSeries.filter(
    (series) => series.status === "مكتملة",
  ).length;

  const inProgressSeries = scientificSeries.length - completedSeries;

  const stats = [
    {
      label: "السلاسل العلمية",
      value: liveStats?.totals.series ?? scientificSeries.length,
      hint: "مكتملة وقيد الاكتمال",
      icon: ListVideo,
    },
    {
      label: "السلاسل المنشورة",
      value: liveStats?.totals.seriesPublished ?? completedSeries,
      hint: "ظاهرة على الموقع",
      icon: CheckCircle2,
    },
    {
      label: "المسودّات",
      value: liveStats?.totals.seriesDrafts ?? inProgressSeries,
      hint: "بانتظار المراجعة والنشر",
      icon: Clock,
    },
    {
      label: "المقاطع القصيرة",
      value: liveStats?.totals.shortClips ?? shortClips.length,
      hint: "لا تتجاوز ثلاث دقائق",
      icon: Video,
    },
  ];

  function sectionCount(section: AdminSection) {
    if (section === "overview") return contentItems.length;
    if (section === "series")
      return liveStats?.totals.series ?? scientificSeries.length;
    if (section === "lectures")
      return liveStats?.totals.lectures ?? 0;
    if (section === "words") return liveStats?.totals.words ?? 0;
    if (section === "shorts")
      return liveStats?.totals.shortClips ?? shortClips.length;
    if (section === "schedule")
      return liveStats?.totals.scheduleItems ?? 0;
    if (section === "misc")
      return liveStats?.totals.miscItems ?? 0;
    if (section === "knowledge") return knowledgeCategories.length;
    if (section === "tags") return adminTags.length;
    if (section === "supervisors") return adminSupervisors.length;
    if (section === "settings") return 0;

    return contentItems.filter((item) => item.section === section).length;
  }

  return (
    <div className="min-h-screen bg-[var(--color-islamic-ivory)]">
      <div className="container mx-auto px-4 py-10">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-sm bg-[var(--color-islamic-green)] text-white">
              <LayoutDashboard className="h-6 w-6" />
            </span>

            <div>
              <h1 className="font-serif text-4xl font-bold text-[var(--color-islamic-green-dark)]">
                لوحة التحكم
              </h1>
              <p className="mt-2 text-gray-600">
                لوحة مرنة لإدارة المحتوى العلمي والدعوي، والتصنيفات، والوسوم،
                والمشرفين حسب المهام والصلاحيات.
              </p>
            </div>
          </div>

          <a
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-sm border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            <ExternalLink className="h-4 w-4" />
            عرض الموقع
          </a>
        </header>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-sm border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="mb-3 flex items-center justify-between">
                  <Icon className="h-6 w-6 text-[var(--color-islamic-gold)]" />
                  <span className="text-2xl font-bold text-[var(--color-islamic-green-dark)]">
                    {stat.value}
                  </span>
                </div>
                <p className="text-sm font-bold text-gray-700">{stat.label}</p>
                <p className="mt-1 text-xs text-gray-500">{stat.hint}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr]">
          <aside className="rounded-sm border border-gray-200 bg-white p-3 shadow-sm">
            <div className="mb-3 px-3 py-2">
              <p className="text-sm font-bold text-gray-500">
                أقسام لوحة التحكم
              </p>
            </div>

            <div className="space-y-1">
              {adminSections.map((section) => {
                const Icon = sectionIcons[section.key];
                const isActive = activeSection === section.key;

                return (
                  <button
                    key={section.key}
                    onClick={() => {
                      setActiveSection(section.key);
                      setSearchTerm("");
                    }}
                    className={`flex w-full items-center justify-between rounded-sm px-3 py-3 text-right transition-colors ${
                      isActive
                        ? "bg-[var(--color-islamic-green)] text-white"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon
                        className={`h-5 w-5 ${
                          isActive
                            ? "text-[var(--color-islamic-gold)]"
                            : "text-[var(--color-islamic-green)]"
                        }`}
                      />
                      <span className="text-sm font-bold">{section.title}</span>
                    </span>

                    {section.key !== "settings" && (
                      <span
                        className={`rounded-sm px-2 py-0.5 text-xs font-bold ${
                          isActive
                            ? "bg-white/15 text-white"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {sectionCount(section.key)}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </aside>

          <main className="rounded-sm border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 p-5">
              <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <span className="mb-1 block font-serif text-lg text-[var(--color-islamic-gold)]">
                    {activeInfo.title}
                  </span>
                  <h2 className="font-serif text-3xl font-bold text-[var(--color-islamic-green-dark)]">
                    {activeInfo.description}
                  </h2>
                </div>

                {activeSection !== "overview" && !isManagedSection && (
                  <button className="inline-flex items-center gap-2 rounded-sm bg-[var(--color-islamic-green)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-islamic-green-dark)]">
                    <Plus className="h-4 w-4" />
                    إضافة جديد
                  </button>
                )}
              </div>

              {activeSection !== "overview" && !isManagedSection && (
                <div className="relative">
                  <input
                    type="text"
                    placeholder="ابحث في هذا القسم..."
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    className="w-full rounded-sm border border-gray-200 bg-gray-50 px-4 py-3 pr-12 transition-all focus:border-[var(--color-islamic-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--color-islamic-gold)]"
                  />
                  <Search className="absolute right-4 top-3.5 h-5 w-5 text-gray-400" />
                </div>
              )}
            </div>

            {activeSection === "overview" && (
              <section className="p-5">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div className="rounded-sm border border-gray-200 p-5">
                    <div className="mb-4 flex items-center gap-2">
                      <ListChecks className="h-5 w-5 text-[var(--color-islamic-gold)]" />
                      <h3 className="font-serif text-2xl font-bold text-[var(--color-islamic-green-dark)]">
                        نموذج إدارة المحتوى
                      </h3>
                    </div>
                    <p className="leading-relaxed text-gray-600">
                      الدروس العلمية تدار كسلاسل علمية فقط، ولا توجد دروس مفردة
                      خارج السلاسل. كل سلسلة لها حالة: مكتملة أو قيد الاكتمال،
                      وترتبط بباب علم، وتصنيف فرعي، ووسوم.
                    </p>
                  </div>

                  <div className="rounded-sm border border-gray-200 p-5">
                    <div className="mb-4 flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-[var(--color-islamic-gold)]" />
                      <h3 className="font-serif text-2xl font-bold text-[var(--color-islamic-green-dark)]">
                        الصلاحيات حسب المهام
                      </h3>
                    </div>
                    <p className="leading-relaxed text-gray-600">
                      لا تعتمد اللوحة على أدوار ثابتة، بل يمكن منح كل مشرف
                      المهام والصلاحيات المناسبة له بشكل مستقل، مثل إدارة
                      السلاسل أو الوسوم أو الجدول أو النشر.
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-sm border border-gray-200 p-5">
                  <h3 className="mb-4 font-serif text-2xl font-bold text-[var(--color-islamic-green-dark)]">
                    آخر عناصر المحتوى
                  </h3>

                  <div className="divide-y divide-gray-100">
                    {contentItems.slice(0, 5).map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between"
                      >
                        <div>
                          <p className="font-bold text-gray-800">
                            {item.title}
                          </p>
                          <p className="mt-1 text-sm text-gray-500">
                            {item.type} — {item.category}
                          </p>
                        </div>

                        <span
                          className={`w-fit rounded-sm px-3 py-1 text-xs font-bold ${statusClass(
                            item.status,
                          )}`}
                        >
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {activeSection === "series" && (
              <SeriesManager onMutate={refreshStats} />
            )}

            {activeSection === "lectures" && (
              <LecturesManager onMutate={refreshStats} />
            )}

            {activeSection === "words" && (
              <WordsManager onMutate={refreshStats} />
            )}

            {activeSection === "shorts" && (
              <ShortsManager onMutate={refreshStats} />
            )}

            {activeSection === "schedule" && (
              <ScheduleManager onMutate={refreshStats} />
            )}

            {activeSection === "misc" && (
              <MiscManager onMutate={refreshStats} />
            )}

            {activeSection === "knowledge" && (
              <CategoriesManager onMutate={refreshStats} />
            )}

            {activeSection === "tags" && (
              <section className="p-5">
                <div className="flex flex-wrap gap-2">
                  {adminTags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-2 rounded-sm border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"
                    >
                      <Hash className="h-4 w-4 text-[var(--color-islamic-gold)]" />
                      {tag}
                      <button className="text-gray-400 hover:text-[var(--color-islamic-green)]">
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              </section>
            )}

            {activeSection === "supervisors" && (
              <section className="p-5">
                <div className="space-y-5">
                  {adminSupervisors.map((supervisor) => (
                    <article
                      key={supervisor.id}
                      className="rounded-sm border border-gray-200 p-5"
                    >
                      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                          <h3 className="font-serif text-2xl font-bold text-[var(--color-islamic-green-dark)]">
                            {supervisor.name}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            {supervisor.email}
                          </p>
                        </div>

                        <span
                          className={`w-fit rounded-sm px-3 py-1 text-xs font-bold ${
                            supervisor.status === "نشط"
                              ? "bg-green-100 text-green-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {supervisor.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {permissionGroups.map((group) => (
                          <div
                            key={group.title}
                            className="rounded-sm bg-gray-50 p-4"
                          >
                            <h4 className="mb-3 font-bold text-gray-700">
                              {group.title}
                            </h4>

                            <div className="space-y-2">
                              {group.permissions.map((permission) => {
                                const isGranted =
                                  supervisor.permissions.includes(
                                    permission.key,
                                  );

                                return (
                                  <label
                                    key={permission.key}
                                    className="flex items-center gap-2 text-sm text-gray-700"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isGranted}
                                      readOnly
                                      className="h-4 w-4 accent-[var(--color-islamic-green)]"
                                    />
                                    {permission.label}
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {activeSection === "settings" && (
              <section className="p-5">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div className="rounded-sm border border-gray-200 p-5">
                    <div className="mb-3 flex items-center gap-2">
                      <SlidersHorizontal className="h-5 w-5 text-[var(--color-islamic-gold)]" />
                      <h3 className="font-serif text-2xl font-bold text-[var(--color-islamic-green-dark)]">
                        إعدادات العرض
                      </h3>
                    </div>
                    <p className="text-gray-600">
                      التحكم في ترتيب الأقسام، وإظهار أو إخفاء بعض الصفحات،
                      وتعديل العبارات العامة في الموقع.
                    </p>
                  </div>

                  <div className="rounded-sm border border-gray-200 p-5">
                    <div className="mb-3 flex items-center gap-2">
                      <Mail className="h-5 w-5 text-[var(--color-islamic-gold)]" />
                      <h3 className="font-serif text-2xl font-bold text-[var(--color-islamic-green-dark)]">
                        بيانات التواصل
                      </h3>
                    </div>
                    <p className="text-gray-600">
                      إدارة روابط القنوات الرسمية ووسائل التواصل ونماذج الاتصال.
                    </p>
                  </div>
                </div>
              </section>
            )}
          </main>
        </div>

        <div className="mt-8 rounded-sm border border-gray-200 bg-white p-5">
          <p className="text-sm leading-relaxed text-gray-600">
            هذه نسخة هيكلية متقدمة للوحة التحكم، مهيأة لاحقًا للربط بقاعدة
            بيانات وتسجيل دخول. الصلاحيات هنا مبنية على المهام الممنوحة لكل
            مشرف، وليست أدوارًا ثابتة.
          </p>
        </div>
      </div>
    </div>
  );
}
