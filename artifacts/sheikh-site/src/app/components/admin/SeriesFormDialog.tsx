import { Loader2, X } from "lucide-react";
import { type FormEvent, useState } from "react";
import {
  adminApi,
  ApiError,
  type Category,
  type SeriesInput,
  type SeriesItem,
} from "../../lib/adminApi";

type Props = {
  item: SeriesItem | null;
  categories: Category[];
  onClose: () => void;
  onSaved: (message: string) => void;
};

type FormState = {
  title: string;
  bookTitle: string;
  channel: string;
  url: string;
  playlistId: string;
  videoCount: string;
  status: SeriesItem["status"];
  trust: SeriesItem["trust"];
  publishStatus: SeriesItem["publishStatus"];
  displayOrder: string;
  categoryId: string;
  subcategoryId: string;
  tags: string;
  description: string;
  note: string;
};

function toFormState(item: SeriesItem | null): FormState {
  return {
    title: item?.title ?? "",
    bookTitle: item?.bookTitle ?? "",
    channel: item?.channel ?? "",
    url: item?.url ?? "",
    playlistId: item?.playlistId ?? "",
    videoCount: String(item?.videoCount ?? 0),
    status: item?.status ?? "غير مكتملة",
    trust: item?.trust ?? "متوسط",
    publishStatus: item?.publishStatus ?? "مسودة",
    displayOrder: String(item?.displayOrder ?? 0),
    categoryId: item?.categoryId ?? "",
    subcategoryId: item?.subcategoryId ?? "",
    tags: (item?.tags ?? []).join("، "),
    description: item?.description ?? "",
    note: item?.note ?? "",
  };
}

const fieldClass =
  "w-full rounded-sm border border-gray-200 bg-gray-50 px-3 py-2 text-sm transition-all focus:border-[var(--color-islamic-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--color-islamic-gold)]";
const labelClass = "mb-1 block text-sm font-bold text-gray-700";

export function SeriesFormDialog({ item, categories, onClose, onSaved }: Props) {
  const [form, setForm] = useState<FormState>(() => toFormState(item));
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState("");

  const isEdit = Boolean(item);
  const selectedCategory = categories.find((c) => c.id === form.categoryId);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setErrors({});
    setGeneralError("");

    const payload: SeriesInput = {
      title: form.title.trim(),
      bookTitle: form.bookTitle.trim() || undefined,
      channel: form.channel.trim() || undefined,
      url: form.url.trim() || undefined,
      playlistId: form.playlistId.trim() || undefined,
      videoCount: Number(form.videoCount) || 0,
      status: form.status,
      trust: form.trust,
      publishStatus: form.publishStatus,
      displayOrder: Number(form.displayOrder) || 0,
      categoryId: form.categoryId || null,
      subcategoryId: form.subcategoryId || null,
      tags: form.tags
        .split(/[،,]/)
        .map((tag) => tag.trim())
        .filter(Boolean),
      description: form.description.trim(),
      note: form.note.trim() || undefined,
    };

    try {
      if (item) {
        await adminApi.updateSeries(item.id, payload);
      } else {
        await adminApi.createSeries(payload);
      }
      onSaved(isEdit ? "تم تحديث السلسلة بنجاح." : "تمت إضافة السلسلة بنجاح.");
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.fields) setErrors(err.fields);
        setGeneralError(err.message);
      } else {
        setGeneralError("تعذر حفظ السلسلة. حاول مرة أخرى.");
      }
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 py-10">
      <div className="w-full max-w-3xl rounded-sm border border-gray-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 p-5">
          <h2 className="font-serif text-2xl font-bold text-[var(--color-islamic-green-dark)]">
            {isEdit ? "تعديل سلسلة علمية" : "إضافة سلسلة علمية"}
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
              <label className={labelClass}>عنوان السلسلة *</label>
              <input
                className={fieldClass}
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="مثال: التعليق على الملخص الفقهي"
              />
              {errors.title && (
                <p className="mt-1 text-xs text-red-600">{errors.title}</p>
              )}
            </div>

            <div>
              <label className={labelClass}>الكتاب المشروح</label>
              <input
                className={fieldClass}
                value={form.bookTitle}
                onChange={(e) => update("bookTitle", e.target.value)}
                placeholder="مثال: الملخص الفقهي"
              />
            </div>

            <div>
              <label className={labelClass}>القناة / المصدر</label>
              <input
                className={fieldClass}
                value={form.channel}
                onChange={(e) => update("channel", e.target.value)}
                placeholder="اسم القناة الناشرة"
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>رابط قائمة التشغيل (YouTube)</label>
              <input
                className={fieldClass}
                value={form.url}
                onChange={(e) => update("url", e.target.value)}
                placeholder="https://www.youtube.com/playlist?list=..."
                dir="ltr"
              />
            </div>

            <div>
              <label className={labelClass}>معرّف قائمة التشغيل</label>
              <input
                className={fieldClass}
                value={form.playlistId}
                onChange={(e) => update("playlistId", e.target.value)}
                placeholder="PLxxxxxxxx"
                dir="ltr"
              />
            </div>

            <div>
              <label className={labelClass}>عدد الفيديوهات</label>
              <input
                type="number"
                min={0}
                className={fieldClass}
                value={form.videoCount}
                onChange={(e) => update("videoCount", e.target.value)}
              />
            </div>

            <div>
              <label className={labelClass}>التصنيف (باب العلم)</label>
              <select
                className={fieldClass}
                value={form.categoryId}
                onChange={(e) => {
                  update("categoryId", e.target.value);
                  update("subcategoryId", "");
                }}
              >
                <option value="">— بدون تصنيف —</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>التصنيف الفرعي</label>
              <select
                className={fieldClass}
                value={form.subcategoryId}
                onChange={(e) => update("subcategoryId", e.target.value)}
                disabled={!selectedCategory?.subcategories.length}
              >
                <option value="">— بدون تصنيف فرعي —</option>
                {selectedCategory?.subcategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>حالة الاكتمال</label>
              <select
                className={fieldClass}
                value={form.status}
                onChange={(e) =>
                  update("status", e.target.value as FormState["status"])
                }
              >
                <option value="غير مكتملة">غير مكتملة</option>
                <option value="مكتملة">مكتملة</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>درجة التوثيق</label>
              <select
                className={fieldClass}
                value={form.trust}
                onChange={(e) =>
                  update("trust", e.target.value as FormState["trust"])
                }
              >
                <option value="متوسط">متوسط</option>
                <option value="عالٍ">عالٍ</option>
              </select>
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
                <option value="مسودة">مسودة</option>
                <option value="منشور">منشور</option>
                <option value="مخفي">مخفي</option>
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

            <div className="md:col-span-2">
              <label className={labelClass}>الوسوم (افصل بينها بفاصلة)</label>
              <input
                className={fieldClass}
                value={form.tags}
                onChange={(e) => update("tags", e.target.value)}
                placeholder="فقه، القضاء، شرح كتاب"
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>الوصف</label>
              <textarea
                className={`${fieldClass} min-h-24`}
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="وصف مختصر للسلسلة العلمية"
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>ملاحظة داخلية (اختياري)</label>
              <input
                className={fieldClass}
                value={form.note}
                onChange={(e) => update("note", e.target.value)}
                placeholder="ملاحظة تظهر في لوحة التحكم فقط"
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
              {isEdit ? "حفظ التعديلات" : "إضافة السلسلة"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
