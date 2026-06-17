import {
  AlertTriangle,
  Edit3,
  FolderTree,
  Loader2,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  adminApi,
  ApiError,
  type Category,
  type Subcategory,
} from "../../lib/adminApi";
import {
  CategoryFormDialog,
  type CategoryFormValues,
} from "./CategoryFormDialog";

type Feedback = { type: "success" | "error"; message: string };

type Props = {
  onMutate?: () => void;
};

type CategoryDialog =
  | { mode: "create-category" }
  | { mode: "edit-category"; category: Category }
  | { mode: "create-subcategory"; category: Category }
  | { mode: "edit-subcategory"; category: Category; subcategory: Subcategory };

type DeleteTarget =
  | { kind: "category"; item: Category }
  | { kind: "subcategory"; item: Subcategory };

function publishBadgeClass(status: string) {
  if (status === "منشور") return "bg-green-100 text-green-800";
  if (status === "مخفي") return "bg-gray-200 text-gray-700";
  return "bg-amber-100 text-amber-800";
}

export function CategoriesManager({ onMutate }: Props) {
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [dialog, setDialog] = useState<CategoryDialog | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
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
      const result = await adminApi.getCategories();
      setItems(result.items);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "تعذر تحميل التصنيفات.");
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

  async function handleSubmit(values: CategoryFormValues) {
    if (!dialog) return;

    const payload = {
      name: values.name,
      description: values.description || undefined,
      publishStatus: values.publishStatus,
      displayOrder: values.displayOrder,
    };

    if (dialog.mode === "create-category") {
      await adminApi.createCategory(payload);
      showFeedback({ type: "success", message: "تمت إضافة التصنيف." });
    } else if (dialog.mode === "edit-category") {
      await adminApi.updateCategory(dialog.category.id, payload);
      showFeedback({ type: "success", message: "تم تحديث التصنيف." });
    } else if (dialog.mode === "create-subcategory") {
      await adminApi.createSubcategory(dialog.category.id, payload);
      showFeedback({ type: "success", message: "تمت إضافة التصنيف الفرعي." });
    } else {
      await adminApi.updateSubcategory(dialog.subcategory.id, payload);
      showFeedback({ type: "success", message: "تم تحديث التصنيف الفرعي." });
    }

    setDialog(null);
    void load();
    onMutate?.();
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      if (deleteTarget.kind === "category") {
        await adminApi.deleteCategory(deleteTarget.item.id);
        showFeedback({ type: "success", message: "تم حذف التصنيف." });
      } else {
        await adminApi.deleteSubcategory(deleteTarget.item.id);
        showFeedback({ type: "success", message: "تم حذف التصنيف الفرعي." });
      }
      setDeleteTarget(null);
      void load();
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

  const dialogInitial: CategoryFormValues | null = !dialog
    ? null
    : dialog.mode === "edit-category"
      ? {
          name: dialog.category.name,
          description: dialog.category.description ?? "",
          publishStatus: dialog.category.publishStatus,
          displayOrder: dialog.category.displayOrder,
        }
      : dialog.mode === "edit-subcategory"
        ? {
            name: dialog.subcategory.name,
            description: dialog.subcategory.description ?? "",
            publishStatus: dialog.subcategory.publishStatus,
            displayOrder: dialog.subcategory.displayOrder,
          }
        : null;

  const dialogHeading = !dialog
    ? ""
    : dialog.mode === "create-category"
      ? "إضافة تصنيف (باب علم)"
      : dialog.mode === "edit-category"
        ? "تعديل تصنيف"
        : dialog.mode === "create-subcategory"
          ? `إضافة تصنيف فرعي إلى: ${dialog.category.name}`
          : "تعديل تصنيف فرعي";

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
          title="تحديث"
        >
          <RefreshCw className="h-4 w-4" />
          تحديث
        </button>

        <button
          type="button"
          onClick={() => setDialog({ mode: "create-category" })}
          className="inline-flex items-center justify-center gap-2 rounded-sm bg-[var(--color-islamic-green)] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[var(--color-islamic-green-dark)]"
        >
          <Plus className="h-4 w-4" />
          إضافة باب علم
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
          <p className="mt-2">جارٍ تحميل التصنيفات...</p>
        </div>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {items.map((category) => (
            <article
              key={category.id}
              className="rounded-sm border border-gray-200 p-5"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <FolderTree className="h-5 w-5 text-[var(--color-islamic-gold)]" />
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[var(--color-islamic-green-dark)]">
                      {category.name}
                    </h3>
                    <span
                      className={`mt-1 inline-flex rounded-sm px-2 py-0.5 text-xs font-bold ${publishBadgeClass(
                        category.publishStatus,
                      )}`}
                    >
                      {category.publishStatus}
                    </span>
                  </div>
                </div>

                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      setDialog({ mode: "edit-category", category })
                    }
                    className="rounded-sm p-2 text-gray-500 hover:bg-gray-100 hover:text-[var(--color-islamic-green)]"
                    title="تعديل"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setDeleteTarget({ kind: "category", item: category })
                    }
                    className="rounded-sm p-2 text-gray-500 hover:bg-red-50 hover:text-red-600"
                    title="حذف"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {category.subcategories.map((sub) => (
                  <span
                    key={sub.id}
                    className="group inline-flex items-center gap-1 rounded-sm bg-[var(--color-islamic-ivory)] px-3 py-1 text-sm text-gray-700"
                  >
                    {sub.name}
                    <button
                      type="button"
                      onClick={() =>
                        setDialog({
                          mode: "edit-subcategory",
                          category,
                          subcategory: sub,
                        })
                      }
                      className="text-gray-400 hover:text-[var(--color-islamic-green)]"
                      title="تعديل"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setDeleteTarget({ kind: "subcategory", item: sub })
                      }
                      className="text-gray-400 hover:text-red-600"
                      title="حذف"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    setDialog({ mode: "create-subcategory", category })
                  }
                  className="inline-flex items-center gap-1 rounded-sm border border-dashed border-gray-300 px-3 py-1 text-sm text-gray-600 hover:border-[var(--color-islamic-gold)] hover:text-[var(--color-islamic-green)]"
                >
                  <Plus className="h-3.5 w-3.5" />
                  تصنيف فرعي
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-sm border border-gray-200 p-10 text-center text-gray-500">
          لا توجد تصنيفات بعد. ابدأ بإضافة باب علم.
        </div>
      )}

      {dialog && (
        <CategoryFormDialog
          heading={dialogHeading}
          initial={dialogInitial}
          onSubmit={handleSubmit}
          onClose={() => setDialog(null)}
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
                  {deleteTarget.kind === "category"
                    ? "سيُحذف التصنيف وفروعه، وتفقد المواد المرتبطة ربطها به."
                    : "ستفقد المواد المرتبطة ربطها بهذا التصنيف الفرعي."}
                </p>
              </div>
            </div>

            <p className="mb-6 leading-relaxed text-gray-700">
              هل أنت متأكد من حذف{" "}
              {deleteTarget.kind === "category" ? "التصنيف" : "التصنيف الفرعي"}:{" "}
              <span className="font-bold">{deleteTarget.item.name}</span>؟
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
