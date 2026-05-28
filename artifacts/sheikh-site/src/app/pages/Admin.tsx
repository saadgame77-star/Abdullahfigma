import {
  BookOpen,
  CheckCircle2,
  Clock,
  Edit3,
  Eye,
  FileText,
  LayoutDashboard,
  ListVideo,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Trash2,
  Video,
} from "lucide-react";
import { scientificSeries } from "../data/scientificSeries";
import { shortClips } from "../data/shortClips";

export function Admin() {
  const completedSeriesCount = scientificSeries.filter(
    (series) => series.status === "مكتملة",
  ).length;

  const incompleteSeriesCount = scientificSeries.filter(
    (series) => series.status === "غير مكتملة",
  ).length;

  const stats = [
    {
      title: "السلاسل العلمية",
      value: scientificSeries.length.toString(),
      icon: ListVideo,
    },
    {
      title: "السلاسل المكتملة",
      value: completedSeriesCount.toString(),
      icon: CheckCircle2,
    },
    {
      title: "السلاسل غير المكتملة",
      value: incompleteSeriesCount.toString(),
      icon: Clock,
    },
    {
      title: "المقاطع القصيرة",
      value: shortClips.length.toString(),
      icon: Video,
    },
  ];

  const contentSections = [
    {
      title: "إدارة السلاسل العلمية",
      description: "إضافة وتعديل السلاسل، وتحديد حالتها: مكتملة أو غير مكتملة.",
      icon: ListVideo,
    },
    {
      title: "إدارة الدروس العلمية",
      description: "تنظيم الدروس المفردة حسب الكتاب، الباب العلمي، والتصنيف.",
      icon: BookOpen,
    },
    {
      title: "إدارة المقاطع القصيرة",
      description: "إضافة الفوائد المختصرة التي لا تتجاوز ثلاث دقائق.",
      icon: Video,
    },
    {
      title: "إدارة الكلمات والمقالات",
      description: "رفع النصوص، المقالات، الكلمات، والمواد المكتوبة.",
      icon: FileText,
    },
  ];

  const latestContent = [
    ...scientificSeries.slice(0, 3).map((series) => ({
      title: series.title,
      type: "سلسلة علمية",
      status: series.status,
    })),
    ...shortClips.slice(0, 2).map((clip) => ({
      title: clip.title,
      type: "مقطع قصير",
      status: "منشور",
    })),
  ];

  return (
    <div className="container mx-auto px-4 py-12 animate-in fade-in duration-500">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-12 h-12 rounded-sm bg-[var(--color-islamic-green)] text-white flex items-center justify-center">
            <LayoutDashboard className="w-6 h-6" />
          </span>
          <div>
            <h1 className="font-serif text-4xl text-[var(--color-islamic-green-dark)] font-bold">
              لوحة التحكم
            </h1>
            <p className="text-gray-600 mt-2">
              مساحة مبدئية لإدارة محتوى الموقع وتنظيم المواد العلمية.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-10">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="bg-white border border-gray-200 rounded-sm p-5 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <Icon className="w-6 h-6 text-[var(--color-islamic-gold)]" />
                <span className="text-2xl font-bold text-[var(--color-islamic-green-dark)]">
                  {item.value}
                </span>
              </div>
              <p className="text-sm text-gray-600">{item.title}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white border border-gray-200 rounded-sm p-5 shadow-sm mb-10">
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="البحث في محتوى لوحة التحكم..."
              className="w-full bg-gray-50 border border-gray-200 rounded-sm py-3 px-4 pr-12 focus:outline-none focus:border-[var(--color-islamic-gold)] focus:ring-1 focus:ring-[var(--color-islamic-gold)] transition-all"
            />
            <Search className="absolute right-4 top-3.5 text-gray-400 w-5 h-5" />
          </div>

          <button className="inline-flex items-center justify-center gap-2 bg-[var(--color-islamic-green)] text-white px-5 py-3 rounded-sm font-medium hover:bg-[var(--color-islamic-green-dark)] transition-colors">
            <Plus className="w-5 h-5" />
            إضافة محتوى جديد
          </button>
        </div>
      </div>

      <section className="mb-12">
        <div className="flex items-center justify-between mb-6 border-b-2 border-gray-200 pb-4">
          <div>
            <span className="text-[var(--color-islamic-gold)] font-serif text-xl block mb-2">
              أقسام الإدارة
            </span>
            <h2 className="font-serif text-3xl text-[var(--color-islamic-green-dark)] font-bold">
              إدارة محتوى الموقع
            </h2>
          </div>
          <Settings className="w-7 h-7 text-gray-400" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contentSections.map((section) => {
            const Icon = section.icon;

            return (
              <article
                key={section.title}
                className="bg-white border border-gray-200 rounded-sm p-6 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-4">
                  <span className="w-12 h-12 rounded-sm bg-[var(--color-islamic-ivory)] border border-gray-200 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-[var(--color-islamic-green)]" />
                  </span>

                  <div className="flex-1">
                    <h3 className="font-serif text-2xl font-bold text-gray-800 mb-2">
                      {section.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-5">
                      {section.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      <button className="inline-flex items-center gap-2 border border-[var(--color-islamic-green)] text-[var(--color-islamic-green)] px-4 py-2 rounded-sm text-sm font-medium hover:bg-[var(--color-islamic-green)] hover:text-white transition-colors">
                        <Eye className="w-4 h-4" />
                        استعراض
                      </button>
                      <button className="inline-flex items-center gap-2 border border-gray-200 text-gray-700 px-4 py-2 rounded-sm text-sm font-medium hover:bg-gray-50 transition-colors">
                        <Edit3 className="w-4 h-4" />
                        تعديل
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-serif text-2xl font-bold text-[var(--color-islamic-green-dark)]">
            آخر عناصر المحتوى
          </h2>
          <Clock className="w-5 h-5 text-gray-400" />
        </div>

        <div className="divide-y divide-gray-100">
          {latestContent.map((item) => (
            <div
              key={`${item.type}-${item.title}`}
              className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div>
                <h3 className="font-bold text-gray-800 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.type}</p>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 text-xs px-3 py-1 rounded-sm font-bold ${
                    item.status === "غير مكتملة"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {item.status}
                </span>

                <button className="p-2 text-gray-500 hover:text-[var(--color-islamic-green)]">
                  <Edit3 className="w-4 h-4" />
                </button>

                <button className="p-2 text-gray-500 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-10 bg-[var(--color-islamic-ivory)] border border-gray-200 rounded-sm p-5">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-6 h-6 text-[var(--color-islamic-green)] mt-1" />
          <p className="text-gray-600 leading-relaxed">
            هذه لوحة تحكم مبدئية مرتبطة الآن بملفات بيانات الموقع. في المرحلة
            القادمة يمكن تحويل أزرار الإضافة والتعديل إلى نماذج فعلية، ثم ربطها
            لاحقًا بتسجيل دخول وقاعدة بيانات.
          </p>
        </div>
      </div>
    </div>
  );
}
