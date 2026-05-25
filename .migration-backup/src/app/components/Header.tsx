import { BookOpen, Menu, Search } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { label: 'الرئيسية', href: '#' },
    { label: 'البث المباشر', href: '#live' },
    { label: 'المرئيات', href: '#videos' },
    { label: 'قوائم التشغيل', href: '#playlists' },
    { label: 'الصوتيات', href: '#audios' },
    { label: 'التصنيفات', href: '#categories' },
    { label: 'التواصل', href: '#contact' },
  ];

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* شريط علوي */}
        <div className="flex items-center justify-between h-20">
          {/* الشعار والاسم */}
          <div className="flex items-center gap-4">
            {/* أيقونة رمزية */}
            <div className="relative w-14 h-14 flex items-center justify-center bg-gradient-to-br from-primary to-primary/80 rounded-lg shadow-md">
              <BookOpen className="w-7 h-7 text-primary-foreground" strokeWidth={2} />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-accent rounded-full opacity-30"></div>
            </div>
            {/* الاسم */}
            <div className="flex flex-col">
              <h1 className="text-lg sm:text-xl font-semibold text-primary">
                الشيخ عبدالله بن سعد آل غلفيص
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                منصة علمية شرعية متكاملة
              </p>
            </div>
          </div>

          {/* أيقونات البحث والقائمة للموبايل */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="بحث"
            >
              <Search className="w-5 h-5 text-foreground" />
            </button>
            <button
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="القائمة"
            >
              <Menu className="w-6 h-6 text-foreground" />
            </button>
          </div>

          {/* القائمة الرئيسية - Desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            {menuItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="px-4 py-2 text-sm text-foreground/80 hover:text-primary hover:bg-muted/50 rounded-lg transition-all"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* أيقونة البحث - Desktop */}
          <button
            className="hidden lg:flex items-center gap-2 px-4 py-2 bg-muted/50 hover:bg-muted rounded-lg transition-colors"
            aria-label="بحث"
          >
            <Search className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">بحث...</span>
          </button>
        </div>

        {/* القائمة المنسدلة - Mobile */}
        {isMenuOpen && (
          <nav className="lg:hidden border-t border-border py-4 space-y-1">
            {menuItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="block px-4 py-3 text-sm text-foreground/80 hover:text-primary hover:bg-muted/50 rounded-lg transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
