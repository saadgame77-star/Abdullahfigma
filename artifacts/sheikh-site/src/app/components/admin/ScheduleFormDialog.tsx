import { Loader2, X } from "lucide-react";
import { type FormEvent, useState } from "react";
import {
  adminApi,
  ApiError,
  type Category,
  type ScheduleInput,
  type ScheduleItem,
} from "../../lib/adminApi";

type Props = {
  item: ScheduleItem | null;
  categories: Category[];
  onClose: () => void;
  onSaved: (message: string) => void;
};

type FormState = {
  title: string;
  scheduleKind: ScheduleItem["scheduleKind"];
  categoryId: string;
  subcategoryId: string;
  day: string;
  time: string;
  dateHijri: string;
  dateGregorian: string;
  location: string;
  onlineUrl: string;
  isRecurring: boolean;
  recurrenceType: ScheduleItem["recurrenceType"];
  recurrenceDetails: string;
  status: ScheduleItem["status"];
  publishStatus: ScheduleItem["publishStatus"];
  displayOrder: string;
  tags: string;
  description: string;
  note: string;
};

function toFormState(item: ScheduleItem | null): FormState {
  return {
    title: item?.title ?? "",
    scheduleKind: item?.scheduleKind ?? "درس",
    categoryId: item?.categoryId ?? "",
    subcategoryId: item?.subcategoryId ?? "",
    day: item?.day ?? "",
    time: item?.time ?? "",
    dateHijri: item?.dateHijri ?? "",
    dateGregorian: item?.dateGregorian ?? "",
    location: item?.location ?? "",
    onlineUrl: item?.onlineUrl ?? "",
    isRecurring: item?.isRecurring ?? false,
    recurrenceType: item?.recurrenceType ?? "غير متكرر",
    recurrenceDetails: item?.recurrenceDetails ?? "",
    status: item?.status ?? "قائم",
    publishStatus: item?.publishStatus ?? "مسودة",
    displayOrder: String(item?.displayOrder ?? 0),
    tags: (item?.tags ?? []).join("، "),
    description: item?.description ?? "",
    note: item?.note ?? "",
  };
}

const fieldClass =
  "w-full rounded-sm border border-gray-200 bg-gray-50 px-3 py-2 text-sm transition-all focus:border-[var(--color-islamic-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--color-islamic-gold)]";
const labelClass = "mb-1 block text-sm font-bold text-gray-700";

const SCHEDULE_KINDS = ["درس", "محاضرة", "برنامج", "لقاء"] as const;
const RECURRENCE_TYPES = ["غير متكرر", "أسبوعي", "شهري", "مخصص"] as const;
const SCHEDULE_STATUSES = ["قائم", "متوقف", "مؤجل", "ملغي"] as const;

export function ScheduleFormDialog({ item, categories, onClose, onSaved }: Props) {
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

    const payload: ScheduleInput = {
      title: form.title.trim(),
      scheduleKind: form.scheduleKind,
      categoryId: form.categoryId || null,
      subcategoryId: form.subcategoryId || null,
      day: form.day.trim() || undefined,
      time: form.time.trim() || undefined,
      dateHijri: form.dateHijri.trim() || undefined,
      dateGregorian: form.dateGregorian.trim() || undefined,
      location: form.location.trim() || undefined,
      onlineUrl: form.onlineUrl.trim() || undefined,
      isRecurring: form.isRecurring,
      recurrenceType: form.recurrenceType,
      recurrenceDetails: form.recurrenceDetails.trim() || undefined,
      status: form.status,
      publishStatus: form.publishStatus,
      displayOrder: Number(form.displayOrder) || 0,
      tags: form.tags
        .split(/[،,]/)
        .map((tag) => tag.trim())
        .filter(Boolean),
      description: form.description.trim(),
      note: form.note.trim() || undefined,
    };

    try {
      if (item) {
        await adminApi.updateScheduleItem(item.id, payload);
      } else {
        await adminApi.createScheduleItem(payload);
      }
      onSaved(isEdit ? "تم تحديث الموعد بنجاح." : "تمت إضافة الموعد بنجاح.");
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.fields) setErrors(err.fields);
        setGeneralError(err.message);
      } else {
        setGeneralError("تعذر حفظ الموعد. حاول مرة أخرى.");
      }
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 py-10">
      <div className="w-full max-w-3xl rounded-sm border border-gray-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 p-5">
          <h2 className="font-serif text-2xl font-bold text-[var(--color-islamic-green-dark)]">
            {isEdit ? "تعديل موعد" : "إضافة موعد"}
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
              <label className={labelClass}>عنوان الموعد *</label>
              <input
                className={fieldClass}
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="مثال: التعليق على تفسير البغوي"
              />
              {errors.title && (
                <p className="mt-1 text-xs text-red-600">{errors.title}</p>
              )}
            </div>

            <div>
              <label className={labelClass}>نوع الموعد</label>
              <select
                className={fieldClass}
                value={form.scheduleKind}
                onChange={(e) =>
                  update(
                    "scheduleKind",
                    e.target.value as FormState["scheduleKind"],
                  )
                }
              >
                {SCHEDULE_KINDS.map((kind) => (
                  <option key={kind} value={kind}>
                    {kind}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>حالة الموعد</label>
              <select
                className={fieldClass}
                value={form.status}
                onChange={(e) =>
                  update("status", e.target.value as FormState["status"])
                }
              >
                {SCHEDULE_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
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
              <label className={labelClass}>اليوم</label>
              <input
                className={fieldClass}
                value={form.day}
                onChange={(e) => update("day", e.target.value)}
                placeholder="مثال: الأحد"
              />
            </div>

            <div>
              <label className={labelClass}>الوقت</label>
              <input
                className={fieldClass}
                value={form.time}
                onChange={(e) => update("time", e.target.value)}
                placeholder="مثال: بعد صلاة المغرب"
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
              <label className={labelClass}>المكان</label>
              <input
                className={fieldClass}
                value={form.location}
                onChange={(e) => update("location", e.target.value)}
                placeholder="مثال: المسجد / يحدد لاحقًا"
              />
            </div>

            <div>
              <label className={labelClass}>رابط البث (اختياري)</label>
              <input
                className={fieldClass}
                value={form.onlineUrl}
                onChange={(e) => update("onlineUrl", e.target.value)}
                placeholder="https://..."
                dir="ltr"
              />
            </div>

            <div className="flex items-center gap-2 md:col-span-2">
              <input
                id="schedule-recurring"
                type="checkbox"
                checked={form.isRecurring}
                onChange={(e) => update("isRecurring", e.target.checked)}
                className="h-4 w-4 accent-[var(--color-islamic-green)]"
              />
              <label
                htmlFor="schedule-recurring"
                className="text-sm font-bold text-gray-700"
              >
                موعد متكرر
              </label>
            </div>

            <div>
              <label className={labelClass}>نوع التكرار</label>
              <select
                className={fieldClass}
                value={form.recurrenceType}
                onChange={(e) =>
                  update(
                    "recurrenceType",
                    e.target.value as FormState["recurrenceType"],
                  )
                }
              >
                {RECURRENCE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
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

            <div className="md:col-span-2">
              <label className={labelClass}>تفاصيل التكرار (اختياري)</label>
              <input
                className={fieldClass}
                value={form.recurrenceDetails}
                onChange={(e) => update("recurrenceDetails", e.target.value)}
                placeholder="مثال: يتكرر أسبوعيًا ما لم يعلن عن توقفه."
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
                <option value="مسودة">مسودة</option>
                <option value="منشور">منشور</option>
                <option value="مخفي">مخفي</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>الوسوم (افصل بينها بفاصلة)</label>
              <input
                className={fieldClass}
                value={form.tags}
                onChange={(e) => update("tags", e.target.value)}
                placeholder="درس، تفسير، جدول"
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>الوصف</label>
              <textarea
                className={`${fieldClass} min-h-24`}
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="وصف مختصر للموعد"
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
              {isEdit ? "حفظ التعديلات" : "إضافة الموعد"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
