import {
  Eye,
  EyeOff,
  Home,
  Loader2,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";

type LocationState = {
  from?: string;
  message?: string;
};

export function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();

  const locationState = location.state as LocationState | null;
  const redirectTo =
    locationState?.from && locationState.from !== "/admin/login"
      ? locationState.from
      : "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(locationState?.message ?? "");
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function checkExistingSession() {
      try {
        const response = await fetch("/api/admin/auth/me", {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        });

        const data = await response.json().catch(() => null);

        if (!isMounted) return;

        if (response.ok && data?.ok && data.user) {
          navigate(redirectTo, { replace: true });
          return;
        }
      } finally {
        if (isMounted) {
          setIsCheckingSession(false);
        }
      }
    }

    checkExistingSession();

    return () => {
      isMounted = false;
    };
  }, [navigate, redirectTo]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setMessage("");

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail || !password) {
      setError("أدخل البريد الإلكتروني وكلمة المرور.");
      return;
    }

    if (password.length < 8) {
      setError("كلمة المرور يجب ألا تقل عن 8 أحرف.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: trimmedEmail,
          password,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.ok) {
        setError(
          data?.message ??
            "تعذر تسجيل الدخول. تحقق من البريد الإلكتروني وكلمة المرور.",
        );
        return;
      }

      navigate(redirectTo, { replace: true });
    } catch {
      setError("تعذر الاتصال بالخادم. حاول لاحقًا.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isCheckingSession) {
    return (
      <main className="min-h-[60vh] bg-[var(--color-islamic-ivory)] px-4 py-16">
        <div className="mx-auto flex max-w-xl flex-col items-center justify-center rounded-sm border border-gray-200 bg-white p-8 text-center shadow-sm">
          <Loader2 className="mb-4 h-9 w-9 animate-spin text-[var(--color-islamic-gold)]" />
          <h1 className="font-serif text-2xl font-bold text-[var(--color-islamic-green-dark)]">
            جارٍ التحقق من الجلسة
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            نتحقق من وجود تسجيل دخول سابق قبل عرض النموذج.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[70vh] bg-[var(--color-islamic-ivory)] px-4 py-12">
      <div className="mx-auto grid max-w-5xl grid-cols-1 overflow-hidden rounded-sm border border-gray-200 bg-white shadow-sm lg:grid-cols-[1fr_420px]">
        <section className="order-2 bg-gradient-to-br from-[var(--color-islamic-green-dark)] to-[var(--color-islamic-green)] p-8 text-white lg:order-1 lg:p-10">
          <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-sm bg-white/10">
            <ShieldCheck className="h-8 w-8 text-[var(--color-islamic-gold)]" />
          </div>

          <h1 className="font-serif text-3xl font-bold leading-relaxed md:text-4xl">
            دخول آمن للوحة إدارة موقع الشيخ عبدالله بن سعد آل غلفيص
          </h1>

          <p className="mt-5 max-w-xl leading-8 text-white/80">
            هذه الصفحة مخصصة للمشرفين المخولين فقط لإدارة المحتوى العلمي
            والدعوي، ومراجعة المواد، وضبط التصنيفات والوسوم والصلاحيات.
          </p>

          <div className="mt-8 rounded-sm border border-white/10 bg-white/10 p-4 text-sm leading-7 text-white/80">
            لا تمنح بيانات الدخول لأي شخص، وسجّل الخروج بعد الانتهاء خصوصًا عند
            استخدام جهاز مشترك.
          </div>

          <Link
            to="/"
            className="mt-8 inline-flex items-center gap-2 rounded-sm border border-white/20 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-white/10"
          >
            <Home className="h-4 w-4" />
            العودة إلى الموقع
          </Link>
        </section>

        <section className="order-1 p-6 lg:order-2 lg:p-8">
          <div className="mb-8">
            <p className="text-sm font-bold text-[var(--color-islamic-gold)]">
              لوحة التحكم
            </p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-[var(--color-islamic-green-dark)]">
              تسجيل الدخول
            </h2>
            <p className="mt-2 text-sm leading-7 text-gray-600">
              أدخل البريد الإلكتروني وكلمة المرور الخاصة بالمستخدم الرئيسي أو
              المشرف المعتمد.
            </p>
          </div>

          {message ? (
            <div className="mb-5 rounded-sm border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-7 text-amber-800">
              {message}
            </div>
          ) : null}

          {error ? (
            <div className="mb-5 rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm leading-7 text-red-700">
              {error}
            </div>
          ) : null}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-gray-700">
                البريد الإلكتروني
              </span>

              <span className="relative block">
                <Mail className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  autoComplete="email"
                  dir="ltr"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-sm border border-gray-200 bg-white px-4 py-3 pr-11 text-left text-gray-900 outline-none transition-colors focus:border-[var(--color-islamic-gold)]"
                  placeholder="name@example.com"
                  required
                />
              </span>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-gray-700">
                كلمة المرور
              </span>

              <span className="relative block">
                <LockKeyhole className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  dir="ltr"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-sm border border-gray-200 bg-white px-12 py-3 text-left text-gray-900 outline-none transition-colors focus:border-[var(--color-islamic-gold)]"
                  placeholder="••••••••"
                  required
                  minLength={8}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 transition-colors hover:text-gray-800"
                  aria-label={
                    showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </span>
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-sm bg-[var(--color-islamic-green)] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[var(--color-islamic-green-dark)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <ShieldCheck className="h-5 w-5" />
              )}
              {isSubmitting ? "جارٍ تسجيل الدخول..." : "دخول لوحة التحكم"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}