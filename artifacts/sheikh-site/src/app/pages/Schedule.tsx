import {
  AlertCircle,
  CalendarDays,
  Clock,
  ExternalLink,
  Filter,
  Image,
  Library,
  Link as LinkIcon,
  MapPin,
  Repeat,
  Search,
  Tags,
} from "lucide-react";
import { useMemo, useState } from "react";
import { getAllKnowledgeAreaNames } from "../data/knowledgeCategories";
import { scheduleItems } from "../data/scheduleItems";

const officialScheduleImageUrl = "";

export function Schedule() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeKnowledgeArea, setActiveKnowledgeArea] = useState("الكل");
  const [activeKind, setActiveKind] = useState("الكل");
  const [activeStatus, setActiveStatus] = useState("الكل");

  const visibleScheduleItems = useMemo(() => {
    return scheduleItems.filter((item) => item.publishStatus === "منشور");
  }, []);

  const knowledgeAreas = useMemo(() => {
    return ["الكل", ...getAllKnowledgeAreaNames()];
  }, []);

  const kinds = useMemo(() => {
    return [
      "الكل",
      ...Array.from(
        new Set(visibleScheduleItems.map((item) => item.scheduleKind)),
      ),
    ];
  }, [visibleScheduleItems]);

  const statuses = ["الكل", "قائم", "متوقف", "مؤجل", "ملغي"];

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

      const matchesKnowledgeArea =
        activeKnowledgeArea === "الكل" ||
        item.knowledgeArea === activeKnowledgeArea;

      const matchesKind =
        activeKind === "الكل" || item.scheduleKind === activeKind;

      const matchesStatus =
        activeStatus === "الكل" || item.status === activeStatus;

      return (
        matchesSearch && matchesKnowledgeArea && matchesKind && matchesStatus
      );
    });
  }, [
    activeKind,
    activeKnowledgeArea,
    activeStatus,
    searchTerm,
    visibleScheduleItems,
  ]);

  const recurringCount = visibleScheduleItems.filter(
    (item) => item.isRecurring,
  ).length;

  const activeCount = visibleScheduleItems.filter(
    (item) => item.status === "قائم",
  ).length;

  function statusClass(status: string) {
    if (status === "قائم") return "bg-green-100 text-green-800";
    if (status === "مؤجل") return "bg-amber-100 text-amber-800";
    if (status === "متوقف") return "bg-gray-100 text-gray-700";
    return "bg-red-100 text-red-700";
  }

  return (
    <div className="container mx-auto px-4 py-12 animate-in fade-in duration-500">
      <div className="mb-12 text-center">
        <h1 className="font-serif text-4xl text-[var(--color-islamic-green-dark)] font-bold mb-4">
          جدول المحاضرات والدروس
        </h1>
        <div className="w-24 h-1 bg-[var(--color-islamic-gold)] mx-auto mb-6"></div>
        <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
          متابعة مواعيد الدروس والمحاضرات والبرامج العلمية، مع دعم المواعيد
          المتكررة وغير المتكررة، وإظهار حالة كل موعد بمرونة.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        <div className="bg-white border border-gray-200 rounded-sm p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <CalendarDays className="w-6 h-6 text-[var(--color-islamic-gold)]" />
            <span className="text-2xl font-bold text-[var(--color-islamic-green-dark)]">
              {visibleScheduleItems.length}
            </span>
          </div>
          <p className="text-sm text-gray-600">إجمالي المواعيد المنشورة</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-sm p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <Repeat className="w-6 h-6 text-[var(--color-islamic-gold)]" />
            <span className="text-2xl font-bold text-[var(--color-islamic-green-dark)]">
              {recurringCount}
            </span>
          </div>
          <p className="text-sm text-gray-600">مواعيد متكررة</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-sm p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <AlertCircle className="w-6 h-6 text-[var(--color-islamic-gold)]" />
            <span className="text-2xl font-bold text-[var(--color-islamic-green-dark)]">
              {activeCount}
            </span>
          </div>
          <p className="text-sm text-gray-600">مواعيد قائمة حاليًا</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-sm shadow-sm border border-gray-100 mb-10 flex flex-col gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="البحث في الجدول والمواعيد والوسوم..."
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
            <CalendarDays className="w-4 h-4" />
            نوع الموعد:
          </div>

          {kinds.map((kind) => (
            <button
              key={kind}
              onClick={() => setActiveKind(kind)}
              className={`px-4 py-2 rounded-sm text-sm font-medium transition-colors ${
                activeKind === kind
                  ? "bg-[var(--color-islamic-green)] text-white"
                  : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
              }`}
            >
              {kind}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 text-sm text-gray-600 ml-2">
            <AlertCircle className="w-4 h-4" />
            حالة الموعد:
          </div>

          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setActiveStatus(status)}
              className={`px-4 py-2 rounded-sm text-sm font-medium transition-colors ${
                activeStatus === status
                  ? "bg-[var(--color-islamic-green)] text-white"
                  : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-12">
        <section className="bg-white shadow-md border border-gray-200 rounded-sm overflow-hidden">
          <div className="bg-[var(--color-islamic-green)] text-white p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <h2 className="font-serif text-xl font-bold">
                جدول المواعيد النصي
              </h2>
              <p className="text-sm text-white/75 mt-1">
                يعرض المواعيد المنشورة فقط، مع بيان حالة كل موعد وتكراره.
              </p>
            </div>
          </div>

          {filteredScheduleItems.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-right min-w-[900px]">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="p-4 font-bold text-gray-700">الموعد</th>
                    <th className="p-4 font-bold text-gray-700">النوع</th>
                    <th className="p-4 font-bold text-gray-700">
                      اليوم والوقت
                    </th>
                    <th className="p-4 font-bold text-gray-700">المكان</th>
                    <th className="p-4 font-bold text-gray-700">الحالة</th>
                    <th className="p-4 font-bold text-gray-700">التكرار</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredScheduleItems.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors align-top"
                    >
                      <td className="p-4">
                        <h3 className="font-bold text-[var(--color-islamic-green-dark)] mb-1">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                          {item.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mt-3">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center gap-1 rounded-sm bg-[var(--color-islamic-ivory)] px-2.5 py-1 text-xs font-medium text-gray-700 border border-gray-200"
                            >
                              <Tags className="w-3 h-3 text-[var(--color-islamic-gold)]" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="p-4 text-gray-600">
                        <div className="space-y-1">
                          <span className="inline-flex items-center gap-1 rounded-sm bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-700">
                            {item.scheduleKind}
                          </span>
                          <p className="text-sm text-gray-500">
                            {item.knowledgeArea}
                          </p>
                          <p className="text-xs text-gray-400">
                            {item.subCategory}
                          </p>
                        </div>
                      </td>

                      <td className="p-4 text-gray-600">
                        <div className="space-y-2">
                          {item.day && (
                            <span className="flex items-center gap-1">
                              <CalendarDays className="w-4 h-4 text-[var(--color-islamic-gold)]" />
                              {item.day}
                            </span>
                          )}

                          {item.time && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4 text-[var(--color-islamic-gold)]" />
                              {item.time}
                            </span>
                          )}

                          {item.dateHijri && (
                            <span className="text-sm text-gray-500">
                              {item.dateHijri}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-4 text-gray-600">
                        <div className="space-y-2">
                          {item.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4 text-[var(--color-islamic-gold)]" />
                              {item.location}
                            </span>
                          )}

                          {item.onlineUrl && (
                            <a
                              href={item.onlineUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[var(--color-islamic-green)] hover:underline"
                            >
                              <LinkIcon className="w-4 h-4" />
                              رابط المتابعة
                            </a>
                          )}
                        </div>
                      </td>

                      <td className="p-4">
                        <span
                          className={`inline-flex rounded-sm px-3 py-1 text-xs font-bold ${statusClass(
                            item.status,
                          )}`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td className="p-4 text-gray-600">
                        <div className="space-y-1">
                          <span className="flex items-center gap-1">
                            <Repeat className="w-4 h-4 text-[var(--color-islamic-gold)]" />
                            {item.recurrenceType}
                          </span>

                          {item.recurrenceDetails && (
                            <p className="text-xs text-gray-500 leading-relaxed">
                              {item.recurrenceDetails}
                            </p>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              لا توجد مواعيد منشورة حاليًا.
            </div>
          )}
        </section>

        <section className="bg-white shadow-md border border-gray-200 rounded-sm overflow-hidden p-6 text-center">
          <h2 className="font-serif text-xl font-bold mb-6 text-[var(--color-islamic-green-dark)]">
            صورة الإعلان الرسمي للجدول
          </h2>

          {officialScheduleImageUrl ? (
            <div className="space-y-5">
              <img
                src={officialScheduleImageUrl}
                alt="صورة الإعلان الرسمي للجدول"
                className="mx-auto max-w-full rounded-sm border border-gray-200"
              />

              <a
                href={officialScheduleImageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[var(--color-islamic-gold)] text-[var(--color-islamic-green-dark)] px-6 py-2 rounded-sm font-bold hover:bg-[var(--color-islamic-gold-light)] transition-colors"
              >
                تحميل الصورة
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          ) : (
            <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-sm p-12 flex flex-col items-center justify-center text-gray-400">
              <Image className="w-16 h-16 mb-4 opacity-50" />
              <p>مكان صورة الجدول الرسمي عند اعتمادها من الإدارة</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
