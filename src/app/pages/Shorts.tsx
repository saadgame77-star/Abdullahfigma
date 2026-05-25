import { Play, Share2 } from "lucide-react";

export function Shorts() {
  const shorts = Array(6).fill(null).map((_, i) => ({
    id: i,
    title: `فائدة حول بر الوالدين`,
    duration: "02:15",
  }));

  return (
    <div className="container mx-auto px-4 py-12 animate-in fade-in duration-500 bg-[var(--color-islamic-ivory)]">
      <div className="mb-10 text-center">
        <h1 className="font-serif text-4xl text-[var(--color-islamic-green-dark)] font-bold mb-4">المقاطع القصيرة</h1>
        <div className="w-24 h-1 bg-[var(--color-islamic-gold)] mx-auto mb-6"></div>
        <p className="text-gray-600 max-w-2xl mx-auto">فوائد وفرائد منتخبة من الدروس والمحاضرات (تصميم طولي).</p>
      </div>

      <div className="flex flex-wrap justify-center gap-6">
        {shorts.map((short) => (
          <div key={short.id} className="w-[300px] bg-black rounded-xl overflow-hidden shadow-xl relative group">
            {/* Vertical Video Placeholder (9:16 aspect ratio roughly) */}
            <div className="aspect-[9/16] bg-gradient-to-b from-gray-800 to-gray-900 flex items-center justify-center relative">
               <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] mix-blend-overlay"></div>
               <Play className="w-16 h-16 text-white/50 group-hover:text-[var(--color-islamic-gold)] group-hover:scale-110 transition-all z-10" />
               
               {/* Overlay Info */}
               <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black via-black/80 to-transparent z-10">
                 <h3 className="text-white font-bold text-lg mb-2 leading-tight">{short.title}</h3>
                 <div className="flex items-center justify-between text-gray-300 text-sm">
                   <span className="font-mono bg-black/50 px-2 py-1 rounded">{short.duration}</span>
                   <button className="p-2 hover:bg-white/10 rounded-full transition-colors" title="مشاركة">
                     <Share2 className="w-5 h-5 text-[var(--color-islamic-gold)]" />
                   </button>
                 </div>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
