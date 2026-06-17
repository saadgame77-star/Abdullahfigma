import { Loader2, X } from "lucide-react";
import { type FormEvent, useState } from "react";
import {
  adminApi,
  ApiError,
  type AdminUser,
  type AdminUserInput,
  type AdminUserStatus,
} from "../../lib/adminApi";
import { permissionGroups } from "../../data/adminPermissions";

type Props = {
  user: AdminUser | null;
  onClose: () => void;
  onSaved: (message: string) => void;
};

const fieldClass =
  "w-full rounded-sm border border-gray-200 bg-gray-50 px-3 py-2 text-sm transition-all focus:border-[var(--color-islamic-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--color-islamic-gold)]";
const labelClass = "mb-1 block text-sm font-bold text-gray-700";

export function UserFormDialog({ user, onClose, onSaved }: Props) {
  const isEdit = Boolean(user);

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<AdminUserStatus>(user?.status ?? "نشط");
  const [permissions, setPermissions] = useState<Set<string>>(
    new Set(user?.permissions ?? []),
  );

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState("");

  function togglePermission(key: string) {
    setPermissions((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function toggleGroup(keys: string[], allOn: boolean) {
    setPermissions((prev) => {
      const next = new Set(prev);
      for (const key of keys) {
        if (allOn) next.delete(key);
        else next.add(key);
      }
      return next;
    });
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setErrors({});
    setGeneralError("");

    const payload: AdminUserInput = {
      name: name.trim(),
      email: email.trim(),
      status,
      permissions: Array.from(permissions),
      ...(password.trim() ? { password: password.trim() } : {}),
    };

    try {
      if (user) {
        await adminApi.updateUser(user.id, payload);
      } else {
        await adminApi.createUser(payload);
      }
      onSaved(isEdit ? "تم تحديث المستخدم بنجاح." : "تمت إضافة المستخدم بنجاح.");
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.fields) setErrors(err.fields);
        setGeneralError(err.message);
      } else {
        setGeneralError("تعذر حفظ المستخدم. حاول مرة أخرى.");
      }
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 py-10">
      <div className="w-full max-w-3xl rounded-sm border border-gray-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 p-5">
          <h2 className="font-serif text-2xl font-bold text-[var(--color-islamic-green-dark)]">
            {isEdit ? "تعديل مستخدم" : "إضافة مستخدم"}
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
            <div>
              <label className={labelClass}>الاسم *</label>
              <input
                className={fieldClass}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="اسم المستخدم"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label className={labelClass}>البريد الإلكتروني *</label>
              <input
                className={fieldClass}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                dir="ltr"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label className={labelClass}>
                كلمة المرور {isEdit ? "(اتركها فارغة لإبقائها)" : "*"}
              </label>
              <input
                type="password"
                className={fieldClass}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="٨ أحرف على الأقل"
                dir="ltr"
                autoComplete="new-password"
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password}</p>
              )}
            </div>

            <div>
              <label className={labelClass}>الحالة</label>
              <select
                className={fieldClass}
                value={status}
                onChange={(e) => setStatus(e.target.value as AdminUserStatus)}
              >
                <option value="نشط">نشط</option>
                <option value="موقوف">موقوف</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="mb-3 font-serif text-lg font-bold text-[var(--color-islamic-green-dark)]">
              الصلاحيات
            </h3>
            <p className="mb-4 text-sm text-gray-500">
              امنح هذا المستخدم ما يناسبه من صلاحيات مستقلة، دون أدوار جاهزة.
            </p>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {permissionGroups.map((group) => {
                const keys = group.permissions.map((p) => p.key);
                const allOn = keys.every((k) => permissions.has(k));
                return (
                  <div
                    key={group.title}
                    className="rounded-sm border border-gray-200 p-4"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <h4 className="font-bold text-gray-700">{group.title}</h4>
                      <button
                        type="button"
                        onClick={() => toggleGroup(keys, allOn)}
                        className="text-xs font-bold text-[var(--color-islamic-green)] hover:underline"
                      >
                        {allOn ? "إلغاء الكل" : "تحديد الكل"}
                      </button>
                    </div>

                    <div className="space-y-2">
                      {group.permissions.map((permission) => (
                        <label
                          key={permission.key}
                          className="flex items-center gap-2 text-sm text-gray-700"
                        >
                          <input
                            type="checkbox"
                            checked={permissions.has(permission.key)}
                            onChange={() => togglePermission(permission.key)}
                            className="h-4 w-4 accent-[var(--color-islamic-green)]"
                          />
                          {permission.label}
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
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
              {isEdit ? "حفظ التعديلات" : "إضافة المستخدم"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
