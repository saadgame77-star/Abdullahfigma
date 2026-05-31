import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Lessons } from "./pages/Lessons";
import { Schedule } from "./pages/Schedule";
import { Lectures } from "./pages/Lectures";
import { Series } from "./pages/Series";
import { Words } from "./pages/Words";
import { Shorts } from "./pages/Shorts";
import { Recitations } from "./pages/Recitations";
import { Contact } from "./pages/Contact";

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
        {
          path: "*",
          Component: () => (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
              <h1 className="font-serif text-6xl font-bold text-[var(--color-islamic-green)] mb-4">
                404
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                عذرًا، الصفحة التي تبحث عنها غير موجودة.
              </p>
              <a
                href="/"
                className="bg-[var(--color-islamic-gold)] text-white px-6 py-2 rounded-sm font-bold"
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
