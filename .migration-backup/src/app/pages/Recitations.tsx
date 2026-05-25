import { Mic, PlayCircle, Clock, Download } from "lucide-react";

export function Recitations() {
  const recitations = [
    { id: 1, surah: "سورة الفاتحة", type: "تراويح", duration: "01:20", active: true },
    { id: 2, surah: "سورة البقرة (مقطع)", type: "تراويح", duration: "15:45", active: false },
    { id: 3, surah: "سورة الكهف", type: "تهجد", duration: "35:10", active: false },
    { id: 4, surah: "سورة مريم", type: "تراويح", duration: "22:15", active: false },
    { id: 5, surah: "سورة طه", type: "تهجد", duration: "28:30", active: false },
  ];

  return (
    <div className="container mx-auto px-4 py-12 animate-in fade-in duration-500">
      <div className="mb-10 text-center">
        <h1 className="font-serif text-4xl text-[var(--color-islamic-green-dark)] font-bold mb-4">التلاوات القرآنية</h1>
        <div className="w-24 h-1 bg-[var(--color-islamic-gold)] mx-auto mb-6"></div>
        <p className="text-gray-600 max-w-2xl mx-auto">تلاوات خاشعة من صلوات التراويح والتهجد والصلوات الجهرية.</p>
      </div>

      <div className="max-w-5xl mx-auto bg-white rounded-sm shadow-lg border border-gray-200 overflow-hidden flex flex-col md:flex-row">
        
        {/* Active Player Area */}
        <div className="md:w-1/2 bg-[var(--color-islamic-green-dark)] text-white p-8 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.4) 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>
          
          <div className="w-48 h-48 border-4 border-[var(--color-islamic-gold)] rounded-full flex items-center justify-center mb-8 relative z-10 bg-[var(--color-islamic-green)] shadow-[0_0_30px_rgba(197,160,89,0.3)]">
             <Mic className="w-20 h-20 text-[var(--color-islamic-gold)]" />
          </div>
          
          <h2 className="font-serif text-3xl font-bold mb-2 z-10 text-center">سورة الفاتحة</h2>
          <p className="text-[var(--color-islamic-gold-light)] mb-8 z-10">من صلوات التراويح لعام 1444هـ</p>
          
          {/* Audio Controls (Visual only) */}
          <div className="w-full max-w-sm z-10">
            <div className="bg-white/20 h-1.5 rounded-full mb-3 cursor-pointer">
              <div className="bg-[var(--color-islamic-gold)] w-1/3 h-full rounded-full relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-300 font-mono mb-6">
              <span>00:25</span>
              <span>01:20</span>
            </div>
            
            <div className="flex justify-center items-center gap-6">
               <button className="text-white hover:text-[var(--color-islamic-gold)] transition-colors">
                 <svg className="w-6 h-6 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" /></svg>
               </button>
               <button className="bg-[var(--color-islamic-gold)] text-[var(--color-islamic-green-dark)] w-14 h-14 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg">
                 <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
               </button>
               <button className="text-white hover:text-[var(--color-islamic-gold)] transition-colors">
                 <svg className="w-6 h-6 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.067 11.2a1 1 0 000 1.6l5.333 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.067 11.2a1 1 0 000 1.6l5.333 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.333 4z" /></svg>
               </button>
            </div>
          </div>
        </div>

        {/* Playlist */}
        <div className="md:w-1/2 bg-gray-50 flex flex-col h-[500px]">
          <div className="p-4 bg-white border-b border-gray-200">
            <h3 className="font-bold text-gray-800">قائمة التلاوات (5)</h3>
          </div>
          <div className="overflow-y-auto flex-grow p-2 space-y-2">
            {recitations.map((rec) => (
              <div 
                key={rec.id} 
                className={`flex items-center justify-between p-4 rounded-sm transition-colors border ${
                  rec.active 
                    ? 'bg-[var(--color-islamic-green-light)] text-white border-[var(--color-islamic-green)]' 
                    : 'bg-white border-gray-100 hover:border-[var(--color-islamic-gold-light)] text-gray-700'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-sm flex items-center justify-center shrink-0 bg-black/10">
                    <PlayCircle className={`w-6 h-6 ${rec.active ? 'text-[var(--color-islamic-gold)]' : 'text-gray-400'}`} />
                  </div>
                  <div>
                    <h4 className="font-bold">{rec.surah}</h4>
                    <span className={`text-xs ${rec.active ? 'text-gray-200' : 'text-gray-500'}`}>{rec.type}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-sm font-mono ${rec.active ? 'text-gray-200' : 'text-gray-500'}`}>{rec.duration}</span>
                  <button className={`p-2 rounded-full hover:bg-black/10 transition-colors ${rec.active ? 'text-white' : 'text-gray-400 hover:text-[var(--color-islamic-green)]'}`}>
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
