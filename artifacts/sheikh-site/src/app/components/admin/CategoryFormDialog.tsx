import { Loader2, X } from "lucide-react";
import { type FormEvent, useState } from "react";
import { ApiError, type PublishStatus } from "../../lib/adminApi";

export type CategoryFormValues = {
  name: string;
  description: string;
  publishStatus: PublishStatus;
  displayOrder: number;
};

type Props = {
  heading: string;
  /** Existing values when editing, or null when creating. */
  initial: CategoryFormValues | null;
  /** Persists the values; should throw ApiError on validation failure. */
  onSubmit: (values: CategoryFormValues) => Promise<void>;
  onClose: () => void;
};

const fieldClass =
  "w-full rounded-sm border border-gray-200 bg-gray-50 px-3 py-2 text-sm transition-all focus:border-[var(--color-islamic-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--color-islamic-gold)]";
const labelClass = "mb-1 block text-sm font-bold text-gray-700";

export function CategoryFormDialog({
  heading,
  initial,
  onSubmit,
  onClose,
}: Props) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [publishStatus, setPublishStatus] = useState<PublishStatus>(
    initial?.publishStatus ?? "منشور",
  );
  const [displayOrder, setDisplayOrder] = useState(
    String(initial?.displayOrder ?? 0),
  );

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setErrors({});
    setGeneralError("");

    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim(),
        publishStatus,
        displayOrder: Number(displayOrder) || 0,
      });
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.fields) setErrors(err.fields);
        setGeneralError(err.message);
      } else {
        setGeneralError("تعذر الحفظ. حاول مرة أخرى.");
      }
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 py-10">
      <div className="w-full max-w-lg rounded-sm border border-gray-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 p-5">
          <h2 className="font-serif text-2xl font-bold text-[var(--color-islamic-green-dark)]">
            {heading}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-sm p-2 text-gray-500 transition-colors hover:bg-gray-100"
            aria-label="إغلاق"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5">
          {generalError && (
            <div className="mb-4 rounded-sm border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              {generalError}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className={labelClass}>الاسم *</label>
              <input
                className={fieldClass}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: الفقه وأصوله"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label className={labelClass}>حالة النشر</label>
              <select
                className={fieldClass}
                value={publishStatus}
                onChange={(e) =>
                  setPublishStatus(e.target.value as PublishStatus)
                }
              >
                <option value="منشور">منشور</option>
                <option value="مسودة">مسودة</option>
                <option value="مخفي">مخفي</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>ترتيب العرض</label>
              <input
                type="number"
                min={0}
                className={fieldClass}
                value={displayOrder}
                onChange={(e) => setDisplayOrder(e.target.value)}
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>الوصف (اختياري)</label>
              <textarea
                className={`${fieldClass} min-h-20`}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="وصف مختصر يظهر في لوحة التحكم."
              />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 border-t border-gray-200 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-sm border border-gray-200 bg-white px-5 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-sm bg-[var(--color-islamic-green)] px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-[var(--color-islamic-green-dark)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              حفظ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
