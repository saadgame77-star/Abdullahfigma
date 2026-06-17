import {
  AlertTriangle,
  Edit3,
  ExternalLink,
  FolderOpen,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  adminApi,
  ApiError,
  type Category,
  type MiscItem,
  type MiscSection,
} from "../../lib/adminApi";
import { MiscItemFormDialog } from "./MiscItemFormDialog";
import { MiscSectionFormDialog } from "./MiscSectionFormDialog";

type Feedback = { type: "success" | "error"; message: string };

type Props = {
  /** Called after a successful create/update/delete so the dashboard can refresh. */
  onMutate?: () => void;
};

type DeleteTarget =
  | { kind: "section"; item: MiscSection }
  | { kind: "item"; item: MiscItem };

function publishBadgeClass(status: MiscItem["publishStatus"]) {
  if (status === "منشور") return "bg-green-100 text-green-800";
  if (status === "مخفي") return "bg-gray-200 text-gray-700";
  return "bg-amber-100 text-amber-800";
}

export function MiscManager({ onMutate }: Props) {
  const [sections, setSections] = useState<MiscSection[]>([]);
  const [items, setItems] = useState<MiscItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [publishFilter, setPublishFilter] = useState("");
  const [sectionFilter, setSectionFilter] = useState("");

  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MiscItem | null>(null);

  const [sectionDialogOpen, setSectionDialogOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<MiscSection | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showFeedback = useCallback((next: Feedback) => {
    setFeedback(next);
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    feedbackTimer.current = setTimeout(() => setFeedback(null), 4000);
  }, []);

  const loadSections = useCallback(async () => {
    try {
      const result = await adminApi.listMiscSections();
      setSections(result.items);
    } catch {
      setSections([]);
    }
  }, []);

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await adminApi.listMiscItems({
        search: search.trim() || undefined,
        publishStatus: publishFilter || undefined,
        sectionId: sectionFilter || undefined,
      });
      setItems(result.items);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "تعذر تحميل عناصر المتفرقات.",
      );
    } finally {
      setLoading(false);
    }
  }, [search, publishFilter, sectionFilter]);

  useEffect(() => {
    const handle = setTimeout(() => {
      void loadItems();
    }, 300);
    return () => clearTimeout(handle);
  }, [loadItems]);

  useEffect(() => {
    void loadSections();
    adminApi
      .getCategories()
      .then((result) => setCategories(result.items))
      .catch(() => setCategories([]));
  }, [loadSections]);

  useEffect(() => {
    return () => {
      if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    };
  }, []);

  const sectionTitle = useCallback(
    (id: string | null) =>
      id ? (sections.find((s) => s.id === id)?.title ?? "—") : "—",
    [sections],
  );

  function handleItemSaved(message: string) {
    setItemDialogOpen(false);
    setEditingItem(null);
    showFeedback({ type: "success", message });
    void loadItems();
    onMutate?.();
  }

  function handleSectionSaved(message: string) {
    setSectionDialogOpen(false);
    setEditingSection(null);
    showFeedback({ type: "success", message });
    void loadSections();
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      if (deleteTarget.kind === "section") {
        await adminApi.deleteMiscSection(deleteTarget.item.id);
        showFeedback({ type: "success", message: "تم حذف القسم بنجاح." });
        void loadSections();
        void loadItems();
      } else {
        await adminApi.deleteMiscItem(deleteTarget.item.id);
        showFeedback({ type: "success", message: "تم حذف العنصر بنجاح." });
        void loadItems();
      }
      setDeleteTarget(null);
      onMutate?.();
    } catch (err) {
      showFeedback({
        type: "error",
        message: err instanceof ApiError ? err.message : "تعذر تنفيذ الحذف.",
      });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <section className="p-5">
      {feedback && (
        <div
          className={`mb-4 rounded-sm border px-4 py-3 text-sm ${
            feedback.type === "success"
              ? "border-green-100 bg-green-50 text-green-800"
              : "border-red-100 bg-red-50 text-red-700"
          }`}
        >
          {feedback.message}
        </div>
      )}

      {/* Sections panel */}
      <div className="mb-6 rounded-sm border border-gray-200 p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-[var(--color-islamic-gold)]" />
            <h3 className="font-serif text-xl font-bold text-[var(--color-islamic-green-dark)]">
              أقسام المتفرقات
            </h3>
          </div>
          <button
            type="button"
            onClick={() => {
              setEditingSection(null);
              setSectionDialogOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-sm border border-gray-200 bg-white px-3 py-2 text-sm font-bold text-[var(--color-islamic-green)] transition-colors hover:bg-gray-50"
          >
            <Plus className="h-4 w-4" />
            إضافة قسم
          </button>
        </div>

        {sections.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sections.map((section) => (
              <div
                key={section.id}
                className="flex items-start justify-between rounded-sm border border-gray-200 p-3"
              >
                <div>
                  <p className="font-bold text-gray-800">{section.title}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    {section.publishStatus} — ترتيب {section.displayOrder}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingSection(section);
                      setSectionDialogOpen(true);
                    }}
                    className="rounded-sm p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-[var(--color-islamic-green)]"
                    title="تعديل"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setDeleteTarget({ kind: "section", item: section })
                    }
                    className="rounded-sm p-1.5 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
                    title="حذف"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            لا توجد أقسام بعد. أضف قسمًا لتنظيم العناصر (صوتيات، ملفات، روابط...).
          </p>
        )}
      </div>

      {/* Items toolbar */}
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="ابحث بالعنوان أو النوع..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-sm border border-gray-200 bg-gray-50 px-4 py-2.5 pr-11 text-sm transition-all focus:border-[var(--color-islamic-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--color-islamic-gold)]"
            />
            <Search className="absolute right-4 top-3 h-4 w-4 text-gray-400" />
          </div>

          <select
            value={sectionFilter}
            onChange={(e) => setSectionFilter(e.target.value)}
            className="rounded-sm border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:border-[var(--color-islamic-gold)] focus:outline-none"
          >
            <option value="">كل الأقسام</option>
            {sections.map((section) => (
              <option key={section.id} value={section.id}>
                {section.title}
              </option>
            ))}
          </select>

          <select
            value={publishFilter}
            onChange={(e) => setPublishFilter(e.target.value)}
            className="rounded-sm border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:border-[var(--color-islamic-gold)] focus:outline-none"
          >
            <option value="">كل حالات النشر</option>
            <option value="منشور">منشور</option>
            <option value="مسودة">مسودة</option>
            <option value="مخفي">مخفي</option>
          </select>

          <button
            type="button"
            onClick={() => void loadItems()}
            className="inline-flex items-center justify-center gap-2 rounded-sm border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            title="تحديث"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingItem(null);
            setItemDialogOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-sm bg-[var(--color-islamic-green)] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[var(--color-islamic-green-dark)]"
        >
          <Plus className="h-4 w-4" />
          إضافة عنصر
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-sm border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-x-auto rounded-sm border border-gray-200">
        <table className="w-full min-w-[820px] text-right">
          <thead className="bg-gray-50 text-sm text-gray-500">
            <tr>
              <th className="px-5 py-3 font-bold">العنوان</th>
              <th className="px-5 py-3 font-bold">النوع</th>
              <th className="px-5 py-3 font-bold">القسم</th>
              <th className="px-5 py-3 font-bold">النشر</th>
              <th className="px-5 py-3 font-bold">الإجراءات</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-gray-500">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-[var(--color-islamic-gold)]" />
                  <p className="mt-2">جارٍ تحميل العناصر...</p>
                </td>
              </tr>
            ) : items.length > 0 ? (
              items.map((item) => {
                const link =
                  item.videoUrl ||
                  item.externalUrl ||
                  item.audioUrl ||
                  item.fileUrl ||
                  "";
                return (
                  <tr
                    key={item.id}
                    className="align-top transition-colors hover:bg-gray-50"
                  >
                    <td className="px-5 py-4">
                      <p className="font-bold text-gray-800">{item.title}</p>
                      {item.duration && (
                        <p className="mt-1 text-xs text-gray-500" dir="ltr">
                          {item.duration}
                        </p>
                      )}
                      {item.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {item.tags.slice(0, 4).map((tag) => (
                            <span
                              key={tag}
                              className="rounded-sm bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {item.kind}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {sectionTitle(item.sectionId)}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-sm px-3 py-1 text-xs font-bold ${publishBadgeClass(
                          item.publishStatus,
                        )}`}
                      >
                        {item.publishStatus}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {link && (
                          <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-sm p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-[var(--color-islamic-green)]"
                            title="فتح الرابط"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setEditingItem(item);
                            setItemDialogOpen(true);
                          }}
                          className="rounded-sm p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-[var(--color-islamic-green)]"
                          title="تعديل"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setDeleteTarget({ kind: "item", item })
                          }
                          className="rounded-sm p-2 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
                          title="حذف"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-gray-500">
                  لا توجد عناصر مطابقة. ابدأ بإضافة عنصر جديد.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {itemDialogOpen && (
        <MiscItemFormDialog
          item={editingItem}
          sections={sections}
          categories={categories}
          onClose={() => setItemDialogOpen(false)}
          onSaved={handleItemSaved}
        />
      )}

      {sectionDialogOpen && (
        <MiscSectionFormDialog
          item={editingSection}
          onClose={() => setSectionDialogOpen(false)}
          onSaved={handleSectionSaved}
        />
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-sm border border-gray-200 bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-600">
                <AlertTriangle className="h-6 w-6" />
              </span>
              <div>
                <h3 className="font-serif text-xl font-bold text-[var(--color-islamic-green-dark)]">
                  تأكيد الحذف
                </h3>
                <p className="text-sm text-gray-500">
                  {deleteTarget.kind === "section"
                    ? "سيتم فصل العناصر المرتبطة بهذا القسم دون حذفها."
                    : "لا يمكن التراجع عن هذا الإجراء."}
                </p>
              </div>
            </div>

            <p className="mb-6 leading-relaxed text-gray-700">
              هل أنت متأكد من حذف{" "}
              {deleteTarget.kind === "section" ? "القسم" : "العنصر"}:{" "}
              <span className="font-bold">{deleteTarget.item.title}</span>؟
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="rounded-sm border border-gray-200 bg-white px-5 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={() => void confirmDelete()}
                disabled={deleting}
                className="inline-flex items-center gap-2 rounded-sm bg-red-600 px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
              >
                {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
                حذف نهائي
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
