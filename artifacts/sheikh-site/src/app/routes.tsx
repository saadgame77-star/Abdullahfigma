import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { AdminLogin } from "./pages/AdminLogin";
import { Contact } from "./pages/Contact";
import { Home } from "./pages/Home";
import { Lectures } from "./pages/Lectures";
import { Lessons } from "./pages/Lessons";
import { ProtectedAdmin } from "./pages/ProtectedAdmin";
import { Recitations } from "./pages/Recitations";
import { Schedule } from "./pages/Schedule";
import { Series } from "./pages/Series";
import { Shorts } from "./pages/Shorts";
import { Words } from "./pages/Words";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      Component: Layout,
      children: [
        { index: true, Component: Home },
        { path: "lessons", Component: Lessons },
        { path: "schedule", Component: Schedule },
        { path: "lectures", Component: Lectures },
        { path: "series", Component: Series },
        { path: "words", Component: Words },
        { path: "shorts", Component: Shorts },
        { path: "recitations", Component: Recitations },
        { path: "contact", Component: Contact },
        { path: "admin/login", Component: AdminLogin },
        { path: "admin", Component: ProtectedAdmin },
        {
          path: "*",
          Component: () => (
            <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
              <h1 className="mb-4 font-serif text-6xl font-bold text-[var(--color-islamic-green)]">
                404
              </h1>
              <p className="mb-8 text-xl text-gray-600">
                عذرًا، الصفحة التي تبحث عنها غير موجودة.
              </p>
              <a
                href="/"
                className="rounded-sm bg-[var(--color-islamic-gold)] px-6 py-2 font-bold text-white"
              >
                العودة للرئيسية
              </a>
            </div>
          ),
        },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL.replace(/\/$/, "") || "/" },
);