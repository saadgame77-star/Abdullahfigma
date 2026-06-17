import { Outlet, NavLink, Link } from "react-router";
import {
  BookOpen,
  CalendarDays,
  Video,
  MessageCircle,
  Phone,
  Menu,
  X,
  Mic2,
  Library,
} from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { useSiteContent } from "./SiteContentProvider";

function useTodayDates() {
  return useMemo(() => {
    const now = new Date();
    let hijri = "";
    let gregorian = "";

    try {
      hijri = new Intl.DateTimeFormat("ar-SA-u-ca-islamic", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(now);
    } catch {
      hijri = "";
    }

    try {
      gregorian = new Intl.DateTimeFormat("ar-SA-u-ca-gregory", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(now);
    } catch {
      gregorian = "";
    }

    return { hijri, gregorian };
  }, []);
}

const navIcons: Record<string, ReactNode> = {
  "/": <BookOpen className="w-4 h-4" />,
  "/lessons": <BookOpen className="w-4 h-4" />,
  "/lectures": <Mic2 className="w-4 h-4" />,
  "/words": <MessageCircle className="w-4 h-4" />,
  "/shorts": <Video className="w-4 h-4" />,
  "/recitations": <Library className="w-4 h-4" />,
  "/schedule": <CalendarDays className="w-4 h-4" />,
  "/contact": <Phone className="w-4 h-4" />,
};

export function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { hijri, gregorian } = useTodayDates();
  const content = useSiteContent();

  const navLinks = content.nav.items.map((item) => ({
    name: item.label,
    path: item.href,
    icon: navIcons[item.href] ?? <BookOpen className="w-4 h-4" />,
  }));

  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[var(--color-islamic-ivory)]">
      <header className="bg-[var(--color-islamic-green)] text-white shadow-md relative z-50">
        <div className="absolute top-0 left-0 w-full h-1 bg-[var(--color-islamic-gold)]" />

        <div className="container mx-auto px-4">
          <div className="relative flex items-center justify-center py-6 pr-4 pl-12 lg:px-0 border-b border-[var(--color-islamic-green-light)]/40">
            <Link
              to="/"
              className="flex min-w-0 items-center gap-3 sm:gap-5 group"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 shrink-0 bg-[var(--color-islamic-gold)] rounded-sm flex items-center justify-center transform rotate-45 group-hover:rotate-0 transition-transform duration-500 shadow-lg border-2 border-[var(--color-islamic-green)] outline outline-1 outline-[var(--color-islamic-gold)]">
                <span className="font-serif text-2xl sm:text-3xl text-[var(--color-islamic-green)] -rotate-45 group-hover:rotate-0 transition-transform duration-500 font-bold">
                  {content.brand.logoText}
                </span>
              </div>

              <div className="flex min-w-0 flex-col sm:flex-row sm:items-baseline sm:gap-3 whitespace-nowrap text-center sm:text-right">
                <span
                  className="font-sans text-[var(--color-islamic-gold)] font-medium tracking-wider"
                  style={{ fontSize: "clamp(0.65rem, 2.2vw, 1rem)" }}
                >
                  {content.brand.siteSubtitle}
                </span>

                <h1
                  className="font-serif font-bold tracking-wide text-white"
                  style={{ fontSize: "clamp(1rem, 5vw, 2.25rem)" }}
                >
                  {content.brand.siteTitle}
                </h1>
              </div>
            </Link>

            <button
              className="lg:hidden absolute left-0 top-2 p-2 text-white hover:text-[var(--color-islamic-gold)] transition-colors"
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

          <nav className="hidden lg:flex items-center justify-between gap-2 py-2">
            <div className="flex items-center gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-3 xl:px-3.5 py-2.5 rounded-sm flex items-center gap-1.5 transition-all duration-300 font-medium whitespace-nowrap text-sm ${
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
            </div>

            {(hijri || gregorian) && (
              <div className="hidden 2xl:flex shrink-0 items-center gap-2 rounded-sm border border-[var(--color-islamic-green-light)]/40 bg-[var(--color-islamic-green-light)]/20 px-3 py-2 text-sm">
                <CalendarDays className="w-4 h-4 text-[var(--color-islamic-gold)] shrink-0" />

                <span className="flex items-center gap-1 whitespace-nowrap text-gray-100">
                  {hijri && <span>{hijri}</span>}

                  {hijri && gregorian && (
                    <span className="px-1 font-bold text-[var(--color-islamic-gold)]">
                      |
                    </span>
                  )}

                  {gregorian && <span>{gregorian} م</span>}
                </span>
              </div>
            )}
          </nav>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden bg-[var(--color-islamic-green-light)] border-t border-[var(--color-islamic-green-dark)]">
            <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
              {(hijri || gregorian) && (
                <div className="flex items-center gap-2.5 rounded-sm bg-[var(--color-islamic-green)]/60 px-4 py-3 mb-1">
                  <CalendarDays className="w-5 h-5 text-[var(--color-islamic-gold)] shrink-0" />
                  <div className="leading-tight text-right">
                    {hijri && (
                      <p className="text-sm font-bold text-white">{hijri}</p>
                    )}
                    {gregorian && (
                      <p className="text-xs text-[var(--color-islamic-gold)]">
                        {gregorian} م
                      </p>
                    )}
                  </div>
                </div>
              )}

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
                    {content.brand.logoText}
                  </span>
                </div>

                <h2 className="font-serif text-2xl text-white">
                  {content.footer.title}
                </h2>
              </div>

              <p className="leading-relaxed text-sm opacity-80 max-w-sm">
                {content.footer.description}
              </p>
            </div>

            <div>
              <h3 className="font-serif text-xl text-[var(--color-islamic-gold)] mb-6 border-b border-[var(--color-islamic-green-light)] pb-3 inline-block">
                {content.footer.quickLinksTitle}
              </h3>

              <ul className="space-y-3">
                {content.footer.quickLinks.map((link) => (
                  <li key={`${link.href}-${link.label}`}>
                    <Link
                      to={link.href}
                      className="hover:text-[var(--color-islamic-gold-light)] transition-colors flex items-center gap-2"
                    >
                      <span className="text-[var(--color-islamic-gold)]">▪</span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-serif text-xl text-[var(--color-islamic-gold)] mb-6 border-b border-[var(--color-islamic-green-light)] pb-3 inline-block">
                {content.footer.contactTitle}
              </h3>

              <p className="text-sm opacity-80 mb-4">
                {content.footer.contactMessage}
              </p>

              <Link
                to="/contact"
                className="inline-block bg-[var(--color-islamic-gold)] text-[var(--color-islamic-green-dark)] px-6 py-2 rounded-sm font-medium hover:bg-white transition-colors"
              >
                {content.footer.contactButton}
              </Link>
            </div>
          </div>

          <div className="border-t border-[var(--color-islamic-green-light)] pt-8 flex flex-col md:flex-row justify-between items-center text-sm opacity-70">
            <p>{content.footer.copyright.replace("{year}", String(year))}</p>

            <div className="mt-4 md:mt-0">
              <span className="font-serif text-[var(--color-islamic-gold)]">
                {content.footer.quote}
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
