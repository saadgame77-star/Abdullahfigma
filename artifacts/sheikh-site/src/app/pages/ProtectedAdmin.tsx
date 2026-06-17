import { Loader2, LogOut, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router";
import { Admin } from "./Admin";

type AdminUser = {
  id: string;
  name: string;
  email: string;
  isSuperAdmin: boolean;
  permissions: string[];
};

type AuthState =
  | { status: "loading"; user: null; error: "" }
  | { status: "authenticated"; user: AdminUser; error: "" }
  | { status: "unauthenticated"; user: null; error: string };

export function ProtectedAdmin() {
  const navigate = useNavigate();
  const location = useLocation();

  const [authState, setAuthState] = useState<AuthState>({
    status: "loading",
    user: null,
    error: "",
  });

  useEffect(() => {
    let isMounted = true;

    async function loadCurrentAdmin() {
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

        if (!response.ok || !data?.ok || !data.user) {
          setAuthState({
            status: "unauthenticated",
            user: null,
            error: data?.message ?? "يلزم تسجيل الدخول.",
          });
          return;
        }

        setAuthState({
          status: "authenticated",
          user: data.user,
          error: "",
        });
      } catch {
        if (!isMounted) return;

        setAuthState({
          status: "unauthenticated",
          user: null,
          error: "تعذر التحقق من جلسة الدخول.",
        });
      }
    }

    loadCurrentAdmin();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleLogout() {
    try {
      await fetch("/api/admin/auth/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });
    } finally {
      navigate("/admin/login", { replace: true });
    }
  }

  if (authState.status === "loading") {
    return (
      <main className="min-h-[60vh] bg-[var(--color-islamic-ivory)] px-4 py-16">
        <div className="mx-auto flex max-w-xl flex-col items-center justify-center rounded-sm border border-gray-200 bg-white p-8 text-center shadow-sm">
          <Loader2 className="mb-4 h-9 w-9 animate-spin text-[var(--color-islamic-gold)]" />
          <h1 className="font-serif text-2xl font-bold text-[var(--color-islamic-green-dark)]">
            جارٍ التحقق من جلسة الدخول
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            لحظات ويتم فتح لوحة التحكم إن كانت الجلسة صالحة.
          </p>
        </div>
      </main>
    );
  }

  if (authState.status === "unauthenticated") {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{
          from: location.pathname,
          message: authState.error,
        }}
      />
    );
  }

  return (
    <div className="bg-[var(--color-islamic-ivory)]">
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto flex flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-sm bg-[var(--color-islamic-green)] text-white">
              <ShieldCheck className="h-5 w-5" />
            </span>

            <div>
              <p className="text-sm font-bold text-[var(--color-islamic-green-dark)]">
                جلسة إدارية آمنة
              </p>
              <p className="text-xs text-gray-500">
                مسجل الدخول: {authState.user.name} — {authState.user.email}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 rounded-sm border border-red-100 bg-red-50 px-4 py-2 text-sm font-bold text-red-700 transition-colors hover:bg-red-100"
          >
            <LogOut className="h-4 w-4" />
            تسجيل الخروج
          </button>
        </div>
      </div>

      <Admin currentUser={authState.user} />
    </div>
  );
}