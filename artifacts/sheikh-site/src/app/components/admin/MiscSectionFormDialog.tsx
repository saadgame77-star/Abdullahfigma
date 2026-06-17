import { Loader2, X } from "lucide-react";
import { type FormEvent, useState } from "react";
import {
  adminApi,
  ApiError,
  type MiscSection,
  type MiscSectionInput,
} from "../../lib/adminApi";

type Props = {
  item: MiscSection | null;
  onClose: () => void;
  onSaved: (message: string) => void;
};

type FormState = {
  title: string;
  description: string;
  icon: MiscSection["icon"];
  publishStatus: MiscSection["publishStatus"];
  displayOrder: string;
};

function toFormState(item: MiscSection | null): FormState {
  return {
    title: item?.title ?? "",
    description: item?.description ?? "",
    icon: item?.icon ?? "file",
    publishStatus: item?.publishStatus ?? "منشور",
    displayOrder: String(item?.displayOrder ?? 0),
  };
}

const fieldClass =
  "w-full rounded-sm border border-gray-200 bg-gray-50 px-3 py-2 text-sm transition-all focus:border-[var(--color-islamic-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--color-islamic-gold)]";
const labelClass = "mb-1 block text-sm font-bold text-gray-700";

const ICON_OPTIONS: { value: MiscSection["icon"]; label: string }[] = [
  { value: "audio", label: "صوتيات" },
  { value: "video", label: "مرئيات" },
  { value: "file", label: "ملفات" },
  { value: "mic", label: "خطب / كلمات" },
  { value: "book", label: "كتب" },
];

export function MiscSectionFormDialog({ item, onClose, onSaved }: Props) {
  const [form, setForm] = useState<FormState>(() => toFormState(item));
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState("");

  const isEdit = Boolean(item);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setErrors({});
    setGeneralError("");

    const payload: MiscSectionInput = {
      title: form.title.trim(),
      description: form.description.trim(),
      icon: form.icon,
      publishStatus: form.publishStatus,
      displayOrder: Number(form.displayOrder) || 0,
    };

    try {
      if (item) {
        await adminApi.updateMiscSection(item.id, payload);
      } else {
        await adminApi.createMiscSection(payload);
      }
      onSaved(isEdit ? "تم تحديث القسم بنجاح." : "تمت إضافة القسم بنجاح.");
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.fields) setErrors(err.fields);
        setGeneralError(err.message);
      } else {
        setGeneralError("تعذر حفظ القسم. حاول مرة أخرى.");
      }
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 py-10">
      <div className="w-full max-w-xl rounded-sm border border-gray-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 p-5">
          <h2 className="font-serif text-2xl font-bold text-[var(--color-islamic-green-dark)]">
            {isEdit ? "تعديل قسم" : "إضافة قسم"}
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
              <label className={labelClass}>عنوان القسم *</label>
              <input
                className={fieldClass}
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="مثال: صوتيات، ملفات، خطب"
              />
              {errors.title && (
                <p className="mt-1 text-xs text-red-600">{errors.title}</p>
              )}
            </div>

            <div>
              <label className={labelClass}>الأيقونة / النوع</label>
              <select
                className={fieldClass}
                value={form.icon}
                onChange={(e) =>
                  update("icon", e.target.value as FormState["icon"])
                }
              >
                {ICON_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>ترتيب العرض</label>
              <input
                type="number"
                min={0}
                className={fieldClass}
                value={form.displayOrder}
                onChange={(e) => update("displayOrder", e.target.value)}
              />
            </div>

            <div>
              <label className={labelClass}>حالة النشر</label>
              <select
                className={fieldClass}
                value={form.publishStatus}
                onChange={(e) =>
                  update(
                    "publishStatus",
                    e.target.value as FormState["publishStatus"],
                  )
                }
              >
                <option value="منشور">منشور</option>
                <option value="مسودة">مسودة</option>
                <option value="مخفي">مخفي</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>الوصف</label>
              <textarea
                className={`${fieldClass} min-h-24`}
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="وصف مختصر للقسم"
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
              {isEdit ? "حفظ التعديلات" : "إضافة القسم"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
