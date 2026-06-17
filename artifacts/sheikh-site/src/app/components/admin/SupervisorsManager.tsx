import {
  AlertTriangle,
  Edit3,
  Loader2,
  Plus,
  RefreshCw,
  ShieldCheck,
  Trash2,
  UserCog,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { adminApi, ApiError, type AdminUser } from "../../lib/adminApi";
import { getPermissionLabel, type PermissionKey } from "../../data/adminPermissions";
import { UserFormDialog } from "./UserFormDialog";

type Feedback = { type: "success" | "error"; message: string };

type Props = {
  onMutate?: () => void;
};

export function SupervisorsManager({ onMutate }: Props) {
  const [items, setItems] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<AdminUser | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
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
      const result = await adminApi.listUsers();
      setItems(result.items);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "تعذر تحميل المستخدمين.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    return () => {
      if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    };
  }, []);

  function handleSaved(message: string) {
    setDialogOpen(false);
    setEditing(null);
    showFeedback({ type: "success", message });
    void load();
    onMutate?.();
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminApi.deleteUser(deleteTarget.id);
      showFeedback({ type: "success", message: "تم حذف المستخدم." });
      setDeleteTarget(null);
      void load();
      onMutate?.();
    } catch (err) {
      showFeedback({
        type: "error",
        message: err instanceof ApiError ? err.message : "تعذر حذف المستخدم.",
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

      <div className="mb-5 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => void load()}
          className="inline-flex items-center justify-center gap-2 rounded-sm border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          <RefreshCw className="h-4 w-4" />
          تحديث
        </button>

        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setDialogOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-sm bg-[var(--color-islamic-green)] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[var(--color-islamic-green-dark)]"
        >
          <Plus className="h-4 w-4" />
          إضافة مستخدم
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-sm border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-sm border border-gray-200 p-10 text-center text-gray-500">
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-[var(--color-islamic-gold)]" />
          <p className="mt-2">جارٍ تحميل المستخدمين...</p>
        </div>
      ) : items.length > 0 ? (
        <div className="space-y-4">
          {items.map((user) => (
            <article
              key={user.id}
              className="rounded-sm border border-gray-200 p-5"
            >
              <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-sm bg-[var(--color-islamic-ivory)] text-[var(--color-islamic-green)]">
                    {user.isSuperAdmin ? (
                      <ShieldCheck className="h-5 w-5" />
                    ) : (
                      <UserCog className="h-5 w-5" />
                    )}
                  </span>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[var(--color-islamic-green-dark)]">
                      {user.name}
                    </h3>
                    <p className="text-sm text-gray-500" dir="ltr">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-sm px-3 py-1 text-xs font-bold ${
                      user.status === "نشط"
                        ? "bg-green-100 text-green-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {user.status}
                  </span>

                  {user.isSuperAdmin ? (
                    <span className="rounded-sm bg-[var(--color-islamic-green)] px-3 py-1 text-xs font-bold text-white">
                      مشرف عام
                    </span>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setEditing(user);
                          setDialogOpen(true);
                        }}
                        className="rounded-sm p-2 text-gray-500 hover:bg-gray-100 hover:text-[var(--color-islamic-green)]"
                        title="تعديل"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(user)}
                        className="rounded-sm p-2 text-gray-500 hover:bg-red-50 hover:text-red-600"
                        title="حذف"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {user.isSuperAdmin ? (
                <p className="text-sm text-gray-600">
                  يملك جميع الصلاحيات تلقائيًا (لا يُدار من هنا).
                </p>
              ) : user.permissions.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {user.permissions.map((key) => (
                    <span
                      key={key}
                      className="rounded-sm bg-[var(--color-islamic-ivory)] px-2 py-1 text-xs text-gray-700"
                    >
                      {getPermissionLabel(key as PermissionKey)}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400">لا توجد صلاحيات ممنوحة.</p>
              )}
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-sm border border-gray-200 p-10 text-center text-gray-500">
          لا يوجد مستخدمون بعد. أضف مستخدمًا وامنحه صلاحياته.
        </div>
      )}

      {dialogOpen && (
        <UserFormDialog
          user={editing}
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
              هل أنت متأكد من حذف المستخدم:{" "}
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
