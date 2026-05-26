import { Link } from "react-router";
import {
  Play,
  BookOpen,
  Clock,
  ChevronLeft,
  PlaySquare,
  Library,
  Video,
} from "lucide-react";

export function Home() {
  return (
    <div className="animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="relative bg-[var(--color-islamic-green)] text-white overflow-hidden py-24">
        {/* Subtle geometric background pattern */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.2) 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        ></div>
        <div className="absolute -top-40 -left-40 w-96 h-96 border-[40px] border-[var(--color-islamic-green-light)] rounded-full opacity-20"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 border-[40px] border-[var(--color-islamic-gold)] rounded-full opacity-10"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="mb-8">
              <p className="text-[var(--color-islamic-gold)] font-sans text-xl sm:text-2xl md:text-3xl tracking-wide font-medium mb-4">
                الموقع الرسمي للشيخ
              </p>

              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-white max-w-5xl mx-auto">
                عبدالله بن سعد آل غلفيص
              </h1>
            </div>

            <p className="text-lg md:text-xl text-gray-200 leading-relaxed max-w-2xl mx-auto mb-12 font-light">
              منصة علمية متكاملة تجمع الدروس المنهجية والمحاضرات النافعة.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/lessons"
                className="bg-[var(--color-islamic-gold)] text-[var(--color-islamic-green-dark)] px-8 py-4 rounded-sm font-bold text-lg hover:bg-white transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5 fill-current" />
                ابدأ رحلة التعلم
              </Link>

              <Link
                to="/schedule"
                className="bg-transparent border border-[var(--color-islamic-gold)] text-[var(--color-islamic-gold)] px-8 py-4 rounded-sm font-bold text-lg hover:bg-[var(--color-islamic-gold)] hover:text-[var(--color-islamic-green-dark)] transition-all flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <Clock className="w-5 h-5" />
                جدول المحاضرات والدروس
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Content Section */}
      <section className="py-20 container mx-auto px-4">
        <div className="flex items-end justify-between mb-12 border-b-2 border-gray-200 pb-4">
          <div>
            <span className="text-[var(--color-islamic-gold)] font-serif text-xl block mb-2">
              جديد المنصة
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-[var(--color-islamic-green-dark)] font-bold">
              أحدث الإضافات العلمية
            </h2>
          </div>

          <Link
            to="/lessons"
            className="hidden sm:flex items-center gap-1 text-[var(--color-islamic-green)] font-medium hover:text-[var(--color-islamic-gold)] transition-colors"
          >
            عرض الكل
            <ChevronLeft className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white rounded-sm shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow group">
            <div className="aspect-video bg-gray-900 relative flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <Play className="w-16 h-16 text-white/80 group-hover:text-[var(--color-islamic-gold)] transition-colors group-hover:scale-110 duration-300 z-10" />
              <div className="absolute top-4 right-4 bg-[var(--color-islamic-green)] text-white text-xs px-3 py-1 rounded-sm">
                شرح كتاب التوحيد
              </div>
              <div className="absolute bottom-4 right-4 text-white font-serif text-xl z-10">
                الدرس الرابع والعشرون
              </div>
            </div>

            <div className="p-6">
              <h3 className="font-bold text-xl mb-3 text-gray-800 line-clamp-2">
                باب ما جاء في الرقى والتمائم
              </h3>

              <div className="flex items-center text-sm text-gray-500 gap-4 mt-4 pt-4 border-t border-gray-100">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" /> 45:20
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" /> سلسلة التوحيد
                </span>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-sm shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow group">
            <div className="aspect-video bg-gray-900 relative flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <Play className="w-16 h-16 text-white/80 group-hover:text-[var(--color-islamic-gold)] transition-colors group-hover:scale-110 duration-300 z-10" />
              <div className="absolute top-4 right-4 bg-blue-800 text-white text-xs px-3 py-1 rounded-sm">
                محاضرة عامة
              </div>
              <div className="absolute bottom-4 right-4 text-white font-serif text-xl z-10">
                أهمية طلب العلم
              </div>
            </div>

            <div className="p-6">
              <h3 className="font-bold text-xl mb-3 text-gray-800 line-clamp-2">
                وصايا لطالب العلم في زمن الفتن والمشتتات
              </h3>

              <div className="flex items-center text-sm text-gray-500 gap-4 mt-4 pt-4 border-t border-gray-100">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" /> 1:12:05
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" /> توجيهات
                </span>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-sm shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow group">
            <div className="aspect-video bg-gray-900 relative flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <Play className="w-16 h-16 text-white/80 group-hover:text-[var(--color-islamic-gold)] transition-colors group-hover:scale-110 duration-300 z-10" />
              <div className="absolute top-4 right-4 bg-[var(--color-islamic-gold)] text-[var(--color-islamic-green-dark)] text-xs px-3 py-1 rounded-sm font-bold">
                تلاوة خاشعة
              </div>
              <div className="absolute bottom-4 right-4 text-white font-serif text-xl z-10">
                سورة الكهف
              </div>
            </div>

            <div className="p-6">
              <h3 className="font-bold text-xl mb-3 text-gray-800 line-clamp-2">
                تلاوة من صلاة التراويح لعام 1444هـ
              </h3>

              <div className="flex items-center text-sm text-gray-500 gap-4 mt-4 pt-4 border-t border-gray-100">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" /> 35:10
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" /> قرآن كريم
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Sections Grid */}
      <section className="bg-white py-20 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl text-[var(--color-islamic-green-dark)] font-bold mb-4">
              أقسام المنصة
            </h2>
            <div className="w-24 h-1 bg-[var(--color-islamic-gold)] mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "الدروس المنهجية",
                desc: "شروحات متسلسلة للكتب والمتون",
                icon: <BookOpen className="w-8 h-8" />,
                path: "/lessons",
              },
              {
                title: "المحاضرات",
                desc: "لقاءات وندوات علمية ودعوية",
                icon: <PlaySquare className="w-8 h-8" />,
                path: "/lectures",
              },
              {
                title: "السلاسل العلمية",
                desc: "مجموعات مترابطة في فن معين",
                icon: <Library className="w-8 h-8" />,
                path: "/series",
              },
              {
                title: "المقاطع القصيرة",
                desc: "فوائد وفرائد منتخبة",
                icon: <Video className="w-8 h-8" />,
                path: "/shorts",
              },
            ].map((item, idx) => (
              <Link
                key={idx}
                to={item.path}
                className="group block bg-[var(--color-islamic-ivory)] border border-gray-200 p-8 rounded-sm hover:border-[var(--color-islamic-gold)] hover:shadow-lg transition-all text-center"
              >
                <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center text-[var(--color-islamic-green)] group-hover:text-white group-hover:bg-[var(--color-islamic-green)] transition-colors shadow-sm mb-6">
                  {item.icon}
                </div>
                <h3 className="font-serif text-xl font-bold text-gray-800 mb-2 group-hover:text-[var(--color-islamic-gold)] transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
