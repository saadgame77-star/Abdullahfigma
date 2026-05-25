import { Search, Filter, Play, Clock, ChevronDown } from "lucide-react";

export function Lessons() {
  const lessons = Array(6).fill(null).map((_, i) => ({
    id: i,
    title: `الدرس ${i + 1}: من بداية الباب إلى فصل كذا`,
    series: "شرح زاد المستقنع",
    duration: "45:00",
    date: "1445/02/15",
  }));

  return (
    <div className="container mx-auto px-4 py-12 animate-in fade-in duration-500">
      <div className="mb-10 text-center">
        <h1 className="font-serif text-4xl text-[var(--color-islamic-green-dark)] font-bold mb-4">الدروس العلمية</h1>
        <div className="w-24 h-1 bg-[var(--color-islamic-gold)] mx-auto mb-6"></div>
        <p className="text-gray-600 max-w-2xl mx-auto">مكتبة شاملة للدروس المنهجية والشروحات العلمية، مصنفة ومنظمة لتسهيل طلب العلم.</p>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-sm shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <input 
            type="text" 
            placeholder="البحث في الدروس..." 
            className="w-full bg-gray-50 border border-gray-200 rounded-sm py-3 px-4 pr-12 focus:outline-none focus:border-[var(--color-islamic-gold)] focus:ring-1 focus:ring-[var(--color-islamic-gold)] transition-all"
          />
          <Search className="absolute right-4 top-3.5 text-gray-400 w-5 h-5" />
        </div>
        
        <div className="flex gap-4">
          <button className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-6 py-3 rounded-sm text-gray-700 hover:bg-gray-100 transition-colors whitespace-nowrap">
            <Filter className="w-4 h-4" />
            تصنيف حسب
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {lessons.map((lesson) => (
          <div key={lesson.id} className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
            <div className="aspect-video bg-gray-100 relative flex items-center justify-center border-b border-gray-100">
              <Play className="w-12 h-12 text-gray-300 group-hover:text-[var(--color-islamic-gold)] transition-colors group-hover:scale-110 duration-300" />
              <div className="absolute top-3 right-3 bg-[var(--color-islamic-green)] text-white text-xs px-2 py-1 rounded-sm">{lesson.series}</div>
            </div>
            <div className="p-5">
              <h3 className="font-bold text-lg mb-2 text-gray-800 line-clamp-2">{lesson.title}</h3>
              <div className="flex items-center justify-between text-sm text-gray-500 mt-4 pt-4 border-t border-gray-50">
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {lesson.duration}</span>
                <span>{lesson.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Pagination (Static) */}
      <div className="flex justify-center mt-12 gap-2">
        <button className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-sm bg-white text-gray-600 hover:bg-gray-50">1</button>
        <button className="w-10 h-10 flex items-center justify-center border border-[var(--color-islamic-gold)] rounded-sm bg-[var(--color-islamic-gold)] text-white">2</button>
        <button className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-sm bg-white text-gray-600 hover:bg-gray-50">3</button>
      </div>
    </div>
  );
}
