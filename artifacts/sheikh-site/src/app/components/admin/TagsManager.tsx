import {
  AlertTriangle,
  Check,
  Edit3,
  Hash,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { adminApi, ApiError, type Tag } from "../../lib/adminApi";

type Feedback = { type: "success" | "error"; message: string };

type Props = {
  onMutate?: () => void;
};

export function TagsManager({ onMutate }: Props) {
  const [items, setItems] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const [deleteTarget, setDeleteTarget] = useState<Tag | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showFeedback = useCallback((next: Feedback) => {
    setFeedback(next);
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    feedbackTimer.current = setTimeout(() => setFeedback(null), 4000);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await adminApi.listTags({ search: search.trim() || undefined });
      setItems(result.items);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "تعذر تحميل الوسوم.");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const handle = setTimeout(() => void load(), 300);
    return () => clearTimeout(handle);
  }, [load]);

  useEffect(() => {
    return () => {
      if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    };
  }, []);

  async function handleCreate() {
    const name = newName.trim();
    if (!name) return;
    setCreating(true);
    try {
      await adminApi.createTag({ name });
      setNewName("");
      showFeedback({ type: "success", message: "تمت إضافة الوسم." });
      void load();
      onMutate?.();
    } catch (err) {
      showFeedback({
        type: "error",
        message: err instanceof ApiError ? err.message : "تعذر إنشاء الوسم.",
      });
    } finally {
      setCreating(false);
    }
  }

  async function handleSaveEdit(id: string) {
    const name = editingName.trim();
    if (!name) return;
    try {
      await adminApi.updateTag(id, { name });
      setEditingId(null);
      showFeedback({ type: "success", message: "تم تحديث الوسم." });
      void load();
      onMutate?.();
    } catch (err) {
      showFeedback({
        type: "error",
        message: err instanceof ApiError ? err.message : "تعذر تحديث الوسم.",
      });
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminApi.deleteTag(deleteTarget.id);
      showFeedback({ type: "success", message: "تم حذف الوسم." });
      setDeleteTarget(null);
      void load();
      onMutate?.();
    } catch (err) {
      showFeedback({
        type: "error",
        message: err instanceof ApiError ? err.message : "تعذر حذف الوسم.",
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

      <p className="mb-4 rounded-sm border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-600">
        هذه قائمة الوسوم المرجعية. عدد الاستخدام محسوب فعليًا من وسوم المحتوى.
        تعديل أو حذف وسم هنا لا يغيّر الوسوم المكتوبة داخل المواد.
      </p>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="ابحث في الوسوم..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-sm border border-gray-200 bg-gray-50 px-4 py-2.5 pr-11 text-sm transition-all focus:border-[var(--color-islamic-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--color-islamic-gold)]"
          />
          <Search className="absolute right-4 top-3 h-4 w-4 text-gray-400" />
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="وسم جديد..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") void handleCreate();
            }}
            className="rounded-sm border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-[var(--color-islamic-gold)] focus:outline-none"
          />
          <button
            type="button"
            onClick={() => void handleCreate()}
            disabled={creating || !newName.trim()}
            className="inline-flex items-center justify-center gap-2 rounded-sm bg-[var(--color-islamic-green)] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[var(--color-islamic-green-dark)] disabled:opacity-60"
          >
            {creating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            إضافة
          </button>
          <button
            type="button"
            onClick={() => void load()}
            className="inline-flex items-center justify-center rounded-sm border border-gray-200 bg-white px-3 py-2.5 text-gray-700 transition-colors hover:bg-gray-50"
            title="تحديث"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-sm border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-sm border border-gray-200 p-10 text-center text-gray-500">
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-[var(--color-islamic-gold)]" />
          <p className="mt-2">جارٍ تحميل الوسوم...</p>
        </div>
      ) : items.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {items.map((tag) =>
            editingId === tag.id ? (
              <span
                key={tag.id}
                className="inline-flex items-center gap-1 rounded-sm border border-[var(--color-islamic-gold)] bg-white px-2 py-1"
              >
                <input
                  autoFocus
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") void handleSaveEdit(tag.id);
                    if (e.key === "Escape") setEditingId(null);
                  }}
                  className="w-32 bg-transparent text-sm focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => void handleSaveEdit(tag.id)}
                  className="text-[var(--color-islamic-green)] hover:opacity-80"
                  title="حفظ"
                >
                  <Check className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="text-gray-400 hover:text-gray-600"
                  title="إلغاء"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ) : (
              <span
                key={tag.id}
                className="inline-flex items-center gap-2 rounded-sm border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"
              >
                <Hash className="h-4 w-4 text-[var(--color-islamic-gold)]" />
                {tag.name}
                <span
                  className="rounded-sm bg-gray-100 px-1.5 text-xs text-gray-500"
                  title="عدد الاستخدام في المحتوى"
                >
                  {tag.usageCount}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(tag.id);
                    setEditingName(tag.name);
                  }}
                  className="text-gray-400 hover:text-[var(--color-islamic-green)]"
                  title="تعديل"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(tag)}
                  className="text-gray-400 hover:text-red-600"
                  title="حذف"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </span>
            ),
          )}
        </div>
      ) : (
        <div className="rounded-sm border border-gray-200 p-10 text-center text-gray-500">
          لا توجد وسوم بعد. أضف وسمًا من الحقل أعلاه.
        </div>
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
                  يُحذف من قائمة الوسوم المرجعية فقط.
                </p>
              </div>
            </div>

            <p className="mb-6 leading-relaxed text-gray-700">
              هل أنت متأكد من حذف الوسم:{" "}
              <span className="font-bold">{deleteTarget.name}</span>؟
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
