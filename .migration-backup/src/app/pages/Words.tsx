import { MessageCircle, Clock, Calendar } from "lucide-react";

export function Words() {
  const words = Array(8).fill(null).map((_, i) => ({
    id: i,
    title: `كلمة توجيهية بعد صلاة العصر بعنوان: فضل الذكر`,
    duration: "15:20",
    date: "1445/09/10",
  }));

  return (
    <div className="container mx-auto px-4 py-12 animate-in fade-in duration-500">
      <div className="mb-10 text-center">
        <h1 className="font-serif text-4xl text-[var(--color-islamic-green-dark)] font-bold mb-4">الكلمات الدعوية</h1>
        <div className="w-24 h-1 bg-[var(--color-islamic-gold)] mx-auto mb-6"></div>
        <p className="text-gray-600 max-w-2xl mx-auto">كلمات موجزة وتوجيهات نافعة تلقى عقب الصلوات وفي المناسبات.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {words.map((word) => (
          <div key={word.id} className="bg-white border border-gray-100 rounded-sm p-5 shadow-sm hover:shadow-md transition-all hover:border-[var(--color-islamic-gold-light)] group">
            <div className="w-12 h-12 bg-[var(--color-islamic-ivory)] border border-gray-200 rounded-full flex items-center justify-center mb-4 text-[var(--color-islamic-green)] group-hover:bg-[var(--color-islamic-green)] group-hover:text-white transition-colors">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-800 mb-4 line-clamp-3 leading-relaxed">{word.title}</h3>
            
            <div className="flex flex-col gap-2 text-sm text-gray-500 border-t border-gray-50 pt-4">
               <div className="flex items-center justify-between">
                 <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> المدة:</span>
                 <span className="font-mono bg-gray-50 px-2 py-0.5 rounded text-gray-700">{word.duration}</span>
               </div>
               <div className="flex items-center justify-between">
                 <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> التاريخ:</span>
                 <span className="text-gray-700">{word.date}</span>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
