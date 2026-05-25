import { Search, Filter, PlaySquare, Clock, Calendar } from "lucide-react";

export function Lectures() {
  const lectures = Array(6).fill(null).map((_, i) => ({
    id: i,
    title: `محاضرة بعنوان: كيف نستقبل شهر رمضان المبارك`,
    category: "مواسم الطاعات",
    duration: "1:20:00",
    date: "1445/08/25",
  }));

  return (
    <div className="container mx-auto px-4 py-12 animate-in fade-in duration-500">
      <div className="mb-10 text-center">
        <h1 className="font-serif text-4xl text-[var(--color-islamic-green-dark)] font-bold mb-4">المحاضرات العامة</h1>
        <div className="w-24 h-1 bg-[var(--color-islamic-gold)] mx-auto mb-6"></div>
        <p className="text-gray-600 max-w-2xl mx-auto">مجموعة من المحاضرات واللقاءات العلمية والدعوية في مختلف المناسبات والموضوعات.</p>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-sm shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <input 
            type="text" 
            placeholder="البحث في المحاضرات..." 
            className="w-full bg-gray-50 border border-gray-200 rounded-sm py-3 px-4 pr-12 focus:outline-none focus:border-[var(--color-islamic-gold)] focus:ring-1 focus:ring-[var(--color-islamic-gold)] transition-all"
          />
          <Search className="absolute right-4 top-3.5 text-gray-400 w-5 h-5" />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {lectures.map((lecture) => (
          <div key={lecture.id} className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
            <div className="aspect-video bg-[var(--color-islamic-green-dark)] relative flex items-center justify-center border-b border-gray-100">
               {/* Pattern overlay for lectures */}
               <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.4) 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>
              <PlaySquare className="w-12 h-12 text-white/50 group-hover:text-[var(--color-islamic-gold)] transition-colors group-hover:scale-110 duration-300 z-10" />
              <div className="absolute top-3 right-3 bg-[var(--color-islamic-gold)] text-[var(--color-islamic-green-dark)] font-bold text-xs px-3 py-1 rounded-sm z-10">{lecture.category}</div>
            </div>
            <div className="p-5">
              <h3 className="font-bold text-lg mb-2 text-gray-800 line-clamp-2">{lecture.title}</h3>
              <div className="flex items-center justify-between text-sm text-gray-500 mt-4 pt-4 border-t border-gray-50">
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {lecture.duration}</span>
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {lecture.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
