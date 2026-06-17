import {
  AlertTriangle,
  Edit3,
  ExternalLink,
  Loader2,
  Plus,
  RefreshCw,
  Repeat,
  Search,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  adminApi,
  ApiError,
  type Category,
  type ScheduleItem,
} from "../../lib/adminApi";
import { ScheduleFormDialog } from "./ScheduleFormDialog";

type Feedback = { type: "success" | "error"; message: string };

type Props = {
  /** Called after a successful create/update/delete so the dashboard can refresh. */
  onMutate?: () => void;
};

function publishBadgeClass(status: ScheduleItem["publishStatus"]) {
  if (status === "منشور") return "bg-green-100 text-green-800";
  if (status === "مخفي") return "bg-gray-200 text-gray-700";
  return "bg-amber-100 text-amber-800";
}

function statusBadgeClass(status: ScheduleItem["status"]) {
  if (status === "قائم") return "bg-green-100 text-green-800";
  if (status === "ملغي") return "bg-red-100 text-red-700";
  return "bg-amber-100 text-amber-800";
}

export function ScheduleManager({ onMutate }: Props) {
  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [publishFilter, setPublishFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ScheduleItem | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<ScheduleItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showFeedback = useCallback((next: Feedback) => {
    setFeedback(next);
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    feedbackTimer.current = setTimeout(() => setFeedback(null), 4000);
  }, []);

  const loadSchedule = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await adminApi.listSchedule({
        search: search.trim() || undefined,
        publishStatus: publishFilter || undefined,
        status: statusFilter || undefined,
      });
      setItems(result.items);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "تعذر تحميل الجدول.");
    } finally {
      setLoading(false);
    }
  }, [search, publishFilter, statusFilter]);

  useEffect(() => {
    const handle = setTimeout(() => {
      void loadSchedule();
    }, 300);
    return () => clearTimeout(handle);
  }, [loadSchedule]);

  useEffect(() => {
    adminApi
      .getCategories()
      .then((result) => setCategories(result.items))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    return () => {
      if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    };
  }, []);

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(item: ScheduleItem) {
    setEditing(item);
    setDialogOpen(true);
  }

  function handleSaved(message: string) {
    setDialogOpen(false);
    setEditing(null);
    showFeedback({ type: "success", message });
    void loadSchedule();
    onMutate?.();
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminApi.deleteScheduleItem(deleteTarget.id);
      showFeedback({ type: "success", message: "تم حذف الموعد بنجاح." });
      setDeleteTarget(null);
      void loadSchedule();
      onMutate?.();
    } catch (err) {
      showFeedback({
        type: "error",
        message: err instanceof ApiError ? err.message : "تعذر حذف الموعد.",
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

      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="ابحث بالعنوان أو المكان..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-sm border border-gray-200 bg-gray-50 px-4 py-2.5 pr-11 text-sm transition-all focus:border-[var(--color-islamic-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--color-islamic-gold)]"
            />
            <Search className="absolute right-4 top-3 h-4 w-4 text-gray-400" />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-sm border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:border-[var(--color-islamic-gold)] focus:outline-none"
          >
            <option value="">كل الحالات</option>
            <option value="قائم">قائم</option>
            <option value="متوقف">متوقف</option>
            <option value="مؤجل">مؤجل</option>
            <option value="ملغي">ملغي</option>
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
            onClick={() => void loadSchedule()}
            className="inline-flex items-center justify-center gap-2 rounded-sm border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            title="تحديث"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 rounded-sm bg-[var(--color-islamic-green)] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[var(--color-islamic-green-dark)]"
        >
          <Plus className="h-4 w-4" />
          إضافة موعد
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
              <th className="px-5 py-3 font-bold">الموعد</th>
              <th className="px-5 py-3 font-bold">الحالة</th>
              <th className="px-5 py-3 font-bold">النشر</th>
              <th className="px-5 py-3 font-bold">الإجراءات</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-gray-500">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-[var(--color-islamic-gold)]" />
                  <p className="mt-2">جارٍ تحميل الجدول...</p>
                </td>
              </tr>
            ) : items.length > 0 ? (
              items.map((item) => (
                <tr
                  key={item.id}
                  className="align-top transition-colors hover:bg-gray-50"
                >
                  <td className="px-5 py-4">
                    <p className="font-bold text-gray-800">{item.title}</p>
                    {item.location && (
                      <p className="mt-1 text-xs text-gray-500">
                        {item.location}
                      </p>
                    )}
                    {item.isRecurring && (
                      <span className="mt-2 inline-flex items-center gap-1 rounded-sm bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                        <Repeat className="h-3 w-3" />
                        {item.recurrenceType}
                      </span>
                    )}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {item.scheduleKind}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {[item.day, item.time].filter(Boolean).join(" — ") || "—"}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-sm px-3 py-1 text-xs font-bold ${statusBadgeClass(
                        item.status,
                      )}`}
                    >
                      {item.status}
                    </span>
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
                      {item.onlineUrl && (
                        <a
                          href={item.onlineUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-sm p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-[var(--color-islamic-green)]"
                          title="فتح رابط البث"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => openEdit(item)}
                        className="rounded-sm p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-[var(--color-islamic-green)]"
                        title="تعديل"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(item)}
                        className="rounded-sm p-2 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
                        title="حذف"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-gray-500">
                  لا توجد مواعيد مطابقة. ابدأ بإضافة موعد جديد.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {dialogOpen && (
        <ScheduleFormDialog
          item={editing}
          categories={categories}
          onClose={() => setDialogOpen(false)}
          onSaved={handleSaved}
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
                  لا يمكن التراجع عن هذا الإجراء.
                </p>
              </div>
            </div>

            <p className="mb-6 leading-relaxed text-gray-700">
              هل أنت متأكد من حذف الموعد:{" "}
              <span className="font-bold">{deleteTarget.title}</span>؟
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
