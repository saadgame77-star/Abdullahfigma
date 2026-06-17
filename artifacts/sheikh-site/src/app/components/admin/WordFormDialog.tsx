import { Loader2, Sparkles, X } from "lucide-react";
import { type FormEvent, useState } from "react";
import {
  adminApi,
  ApiError,
  type Category,
  type CategorySuggestion,
  type WordInput,
  type WordItem,
  type YouTubeMeta,
} from "../../lib/adminApi";
import { YouTubeFetch } from "./YouTubeFetch";

type Props = {
  item: WordItem | null;
  categories: Category[];
  onClose: () => void;
  onSaved: (message: string) => void;
};

type FormState = {
  title: string;
  url: string;
  wordType: WordItem["wordType"];
  channel: string;
  videoId: string;
  duration: string;
  dateHijri: string;
  dateGregorian: string;
  trust: WordItem["trust"];
  publishStatus: WordItem["publishStatus"];
  displayOrder: string;
  categoryId: string;
  subcategoryId: string;
  tags: string;
  description: string;
  note: string;
};

function toFormState(item: WordItem | null): FormState {
  return {
    title: item?.title ?? "",
    url: item?.url ?? "",
    wordType: item?.wordType ?? "كلمة توجيهية",
    channel: item?.channel ?? "",
    videoId: item?.videoId ?? "",
    duration: item?.duration ?? "",
    dateHijri: item?.dateHijri ?? "",
    dateGregorian: item?.dateGregorian ?? "",
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

const WORD_TYPES = ["كلمة توجيهية", "موعظة", "توجيه", "فائدة دعوية"] as const;

export function WordFormDialog({ item, categories, onClose, onSaved }: Props) {
  const [form, setForm] = useState<FormState>(() => toFormState(item));
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState("");
  const [suggestion, setSuggestion] = useState<CategorySuggestion | null>(null);

  const isEdit = Boolean(item);
  const selectedCategory = categories.find((c) => c.id === form.categoryId);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleYouTubeFill(meta: YouTubeMeta) {
    setForm((prev) => ({
      ...prev,
      title: prev.title.trim() || meta.title || prev.title,
      channel: prev.channel.trim() || meta.channel || prev.channel,
      videoId: prev.videoId.trim() || meta.videoId || prev.videoId,
      duration: prev.duration.trim() || meta.duration || prev.duration,
      dateGregorian:
        prev.dateGregorian.trim() ||
        (meta.publishedAt ? meta.publishedAt.slice(0, 10) : prev.dateGregorian),
    }));
    void requestSuggestion(meta.title ?? form.title, meta.channel ?? form.channel);
  }

  async function requestSuggestion(title: string, channel: string) {
    if (!title.trim() && !channel.trim()) return;
    try {
      const { suggestion: result } = await adminApi.suggestCategory({
        title,
        channel,
        tags: form.tags,
      });
      if (!result) {
        setSuggestion(null);
        return;
      }
      setSuggestion(result);
      if (result.confidence >= 60 && !form.categoryId) applySuggestion(result);
    } catch {
      setSuggestion(null);
    }
  }

  function applySuggestion(result: CategorySuggestion) {
    setForm((prev) => ({
      ...prev,
      categoryId: result.categoryId,
      subcategoryId: result.subcategoryId ?? "",
    }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setErrors({});
    setGeneralError("");

    const payload: WordInput = {
      title: form.title.trim(),
      url: form.url.trim(),
      wordType: form.wordType,
      channel: form.channel.trim() || undefined,
      videoId: form.videoId.trim() || undefined,
      duration: form.duration.trim() || undefined,
      dateHijri: form.dateHijri.trim() || undefined,
      dateGregorian: form.dateGregorian.trim() || undefined,
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
      if (item) await adminApi.updateWord(item.id, payload);
      else await adminApi.createWord(payload);
      onSaved(isEdit ? "تم تحديث الكلمة بنجاح." : "تمت إضافة الكلمة بنجاح.");
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.fields) setErrors(err.fields);
        setGeneralError(err.message);
      } else {
        setGeneralError("تعذر حفظ الكلمة. حاول مرة أخرى.");
      }
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 py-10">
      <div className="w-full max-w-3xl rounded-sm border border-gray-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 p-5">
          <h2 className="font-serif text-2xl font-bold text-[var(--color-islamic-green-dark)]">
            {isEdit ? "تعديل كلمة دعوية" : "إضافة كلمة دعوية"}
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
              <label className={labelClass}>عنوان الكلمة *</label>
              <input
                className={fieldClass}
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="مثال: وقفات مع آية"
              />
              {errors.title && (
                <p className="mt-1 text-xs text-red-600">{errors.title}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>رابط الكلمة (YouTube) *</label>
              <input
                className={fieldClass}
                value={form.url}
                onChange={(e) => update("url", e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                dir="ltr"
              />
              {errors.url && (
                <p className="mt-1 text-xs text-red-600">{errors.url}</p>
              )}
              <YouTubeFetch url={form.url} type="video" onFill={handleYouTubeFill} />
            </div>

            <div>
              <label className={labelClass}>نوع الكلمة</label>
              <select
                className={fieldClass}
                value={form.wordType}
                onChange={(e) =>
                  update("wordType", e.target.value as FormState["wordType"])
                }
              >
                {WORD_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
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

            <div>
              <label className={labelClass}>معرّف الفيديو</label>
              <input
                className={fieldClass}
                value={form.videoId}
                onChange={(e) => update("videoId", e.target.value)}
                dir="ltr"
              />
            </div>

            <div>
              <label className={labelClass}>المدة</label>
              <input
                className={fieldClass}
                value={form.duration}
                onChange={(e) => update("duration", e.target.value)}
                placeholder="مثال: 5:20"
                dir="ltr"
              />
            </div>

            <div>
              <label className={labelClass}>التاريخ الهجري</label>
              <input
                className={fieldClass}
                value={form.dateHijri}
                onChange={(e) => update("dateHijri", e.target.value)}
                placeholder="مثال: 1445/03/12"
              />
            </div>

            <div>
              <label className={labelClass}>التاريخ الميلادي</label>
              <input
                className={fieldClass}
                value={form.dateGregorian}
                onChange={(e) => update("dateGregorian", e.target.value)}
                placeholder="مثال: 2023/09/27"
              />
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className={labelClass + " mb-0"}>التصنيف (باب العلم)</label>
                <button
                  type="button"
                  onClick={() => requestSuggestion(form.title, form.channel)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[var(--color-islamic-green)] hover:underline"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  اقتراح ذكي
                </button>
              </div>
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
              {suggestion && suggestion.categoryId !== form.categoryId && (
                <button
                  type="button"
                  onClick={() => applySuggestion(suggestion)}
                  className="mt-1 inline-flex items-center gap-1 rounded-sm bg-[var(--color-islamic-gold)]/15 px-2 py-1 text-xs text-[var(--color-islamic-green-dark)] hover:bg-[var(--color-islamic-gold)]/25"
                >
                  <Sparkles className="h-3 w-3" />
                  مقترح: {suggestion.categoryName ?? "—"}
                  {suggestion.subcategoryName ? ` / ${suggestion.subcategoryName}` : ""}
                  {` (ثقة ${suggestion.confidence}%) — تطبيق`}
                </button>
              )}
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
                placeholder="موعظة، رقائق"
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>الوصف</label>
              <textarea
                className={`${fieldClass} min-h-24`}
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>ملاحظة داخلية (اختياري)</label>
              <input
                className={fieldClass}
                value={form.note}
                onChange={(e) => update("note", e.target.value)}
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
              {isEdit ? "حفظ التعديلات" : "إضافة الكلمة"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
