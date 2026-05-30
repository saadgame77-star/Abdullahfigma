import { Outlet, NavLink, Link } from "react-router";
import {
  BookOpen,
  CalendarDays,
  PlaySquare,
  Video,
  MessageCircle,
  Phone,
  Menu,
  X,
  Mic2,
} from "lucide-react";
import { useState } from "react";

export function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "الرئيسية", path: "/", icon: <BookOpen className="w-4 h-4" /> },
    {
      name: "الدروس العلمية",
      path: "/lessons",
      icon: <BookOpen className="w-4 h-4" />,
    },
    {
      name: "المحاضرات",
      path: "/lectures",
      icon: <Mic2 className="w-4 h-4" />,
    },
    {
      name: "الكلمات الدعوية",
      path: "/words",
      icon: <MessageCircle className="w-4 h-4" />,
    },
    {
      name: "المقاطع القصيرة",
      path: "/shorts",
      icon: <Video className="w-4 h-4" />,
    },
    {
      name: "جدول المحاضرات والدروس",
      path: "/schedule",
      icon: <CalendarDays className="w-4 h-4" />,
    },
    {
      name: "تواصل معنا",
      path: "/contact",
      icon: <Phone className="w-4 h-4" />,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[var(--color-islamic-ivory)]">
      <header className="bg-[var(--color-islamic-green)] text-white shadow-md relative z-50">
        <div className="absolute top-0 left-0 w-full h-1 bg-[var(--color-islamic-gold)]"></div>

        <div className="container mx-auto px-4">
          <div className="relative flex items-center justify-center py-6 border-b border-[var(--color-islamic-green-light)]/40">
            <Link to="/" className="flex items-center gap-5 group">
              <div className="w-16 h-16 bg-[var(--color-islamic-gold)] rounded-sm flex items-center justify-center transform rotate-45 group-hover:rotate-0 transition-transform duration-500 shadow-lg border-2 border-[var(--color-islamic-green)] outline outline-1 outline-[var(--color-islamic-gold)]">
                <span className="font-serif text-3xl text-[var(--color-islamic-green)] -rotate-45 group-hover:rotate-0 transition-transform duration-500 font-bold">
                  ع
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-3 whitespace-nowrap text-center sm:text-right">
                <span className="font-sans text-[var(--color-islamic-gold)] text-sm md:text-base font-medium tracking-wider">
                  الموقع الرسمي للشيخ
                </span>

                <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold tracking-wide text-white">
                  عبدالله بن سعد آل غلفيص
                </h1>
              </div>
            </Link>

            <button
              className="lg:hidden absolute left-0 p-2 text-white hover:text-[var(--color-islamic-gold)] transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="فتح القائمة"
            >
              {isMobileMenuOpen ? (
                <X className="w-7 h-7" />
              ) : (
                <Menu className="w-7 h-7" />
              )}
            </button>
          </div>

          <nav className="hidden lg:flex items-center justify-center gap-1 py-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-3 xl:px-4 py-2.5 rounded-sm flex items-center gap-1.5 transition-all duration-300 font-medium whitespace-nowrap text-sm ${
                    isActive
                      ? "bg-[var(--color-islamic-green-light)] text-[var(--color-islamic-gold)] border-b-2 border-[var(--color-islamic-gold)]"
                      : "hover:bg-[var(--color-islamic-green-light)] hover:text-[var(--color-islamic-gold-light)] text-gray-200"
                  }`
                }
              >
                <span className="hidden xl:inline-flex">{link.icon}</span>
                <span>{link.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden bg-[var(--color-islamic-green-light)] border-t border-[var(--color-islamic-green-dark)]">
            <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-sm flex items-center gap-3 transition-all ${
                      isActive
                        ? "bg-[var(--color-islamic-green)] text-[var(--color-islamic-gold)] border-r-4 border-[var(--color-islamic-gold)]"
                        : "text-gray-200 hover:bg-[var(--color-islamic-green)] hover:text-[var(--color-islamic-gold-light)]"
                    }`
                  }
                >
                  {link.icon}
                  <span className="font-medium text-lg">{link.name}</span>
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-[var(--color-islamic-green-dark)] text-gray-300 pt-16 pb-8 border-t-[6px] border-[var(--color-islamic-gold)]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[var(--color-islamic-gold)] rounded-sm flex items-center justify-center transform rotate-45">
                  <span className="font-serif text-xl text-[var(--color-islamic-green-dark)] -rotate-45 font-bold">
                    ع
                  </span>
                </div>

                <h2 className="font-serif text-2xl text-white">
                  الشيخ عبدالله آل غلفيص
                </h2>
              </div>

              <p className="leading-relaxed text-sm opacity-80 max-w-sm">
                منصة علمية تعنى بنشر السلاسل العلمية، والمحاضرات، والكلمات
                الدعوية، والمقاطع القصيرة، لتكون مرجعًا منظمًا لطالبي العلم.
              </p>
            </div>

            <div>
              <h3 className="font-serif text-xl text-[var(--color-islamic-gold)] mb-6 border-b border-[var(--color-islamic-green-light)] pb-3 inline-block">
                روابط سريعة
              </h3>

              <ul className="space-y-3">
                <li>
                  <Link
                    to="/lessons"
                    className="hover:text-[var(--color-islamic-gold-light)] transition-colors flex items-center gap-2"
                  >
                    <span className="text-[var(--color-islamic-gold)]">▪</span>
                    الدروس العلمية
                  </Link>
                </li>

                <li>
                  <Link
                    to="/lectures"
                    className="hover:text-[var(--color-islamic-gold-light)] transition-colors flex items-center gap-2"
                  >
                    <span className="text-[var(--color-islamic-gold)]">▪</span>
                    المحاضرات
                  </Link>
                </li>

                <li>
                  <Link
                    to="/words"
                    className="hover:text-[var(--color-islamic-gold-light)] transition-colors flex items-center gap-2"
                  >
                    <span className="text-[var(--color-islamic-gold)]">▪</span>
                    الكلمات الدعوية
                  </Link>
                </li>

                <li>
                  <Link
                    to="/shorts"
                    className="hover:text-[var(--color-islamic-gold-light)] transition-colors flex items-center gap-2"
                  >
                    <span className="text-[var(--color-islamic-gold)]">▪</span>
                    المقاطع القصيرة
                  </Link>
                </li>

                <li>
                  <Link
                    to="/schedule"
                    className="hover:text-[var(--color-islamic-gold-light)] transition-colors flex items-center gap-2"
                  >
                    <span className="text-[var(--color-islamic-gold)]">▪</span>
                    جدول المحاضرات والدروس
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-serif text-xl text-[var(--color-islamic-gold)] mb-6 border-b border-[var(--color-islamic-green-light)] pb-3 inline-block">
                تواصل معنا
              </h3>

              <p className="text-sm opacity-80 mb-4">
                يسعدنا تواصلكم واستقبال مقترحاتكم عبر القنوات الرسمية.
              </p>

              <Link
                to="/contact"
                className="inline-block bg-[var(--color-islamic-gold)] text-[var(--color-islamic-green-dark)] px-6 py-2 rounded-sm font-medium hover:bg-white transition-colors"
              >
                صفحة التواصل
              </Link>
            </div>
          </div>

          <div className="border-t border-[var(--color-islamic-green-light)] pt-8 flex flex-col md:flex-row justify-between items-center text-sm opacity-70">
            <p>
              جميع الحقوق محفوظة للموقع الرسمي للشيخ عبدالله بن سعد آل غلفيص ©{" "}
              {new Date().getFullYear()}
            </p>

            <div className="mt-4 md:mt-0">
              <span className="font-serif text-[var(--color-islamic-gold)]">
                « وفوق كل ذي علم عليم »
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
