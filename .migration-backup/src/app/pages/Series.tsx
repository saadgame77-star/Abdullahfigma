import { Library, ListVideo, CheckCircle2 } from "lucide-react";

export function Series() {
  const seriesList = [
    { id: 1, title: "سلسلة العقيدة الواسطية", count: 24, completed: 24, status: "مكتملة" },
    { id: 2, title: "شرح كتاب التوحيد", count: 45, completed: 30, status: "مستمرة" },
    { id: 3, title: "التعليق على زاد المعاد", count: 120, completed: 15, status: "مستمرة" },
    { id: 4, title: "سلسلة فقه المعاملات", count: 12, completed: 12, status: "مكتملة" },
  ];

  return (
    <div className="container mx-auto px-4 py-12 animate-in fade-in duration-500">
      <div className="mb-10 text-center">
        <h1 className="font-serif text-4xl text-[var(--color-islamic-green-dark)] font-bold mb-4">السلاسل العلمية</h1>
        <div className="w-24 h-1 bg-[var(--color-islamic-gold)] mx-auto mb-6"></div>
        <p className="text-gray-600 max-w-2xl mx-auto">شروحات منهجية متسلسلة للكتب والمتون العلمية.</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {seriesList.map((series) => (
          <div key={series.id} className="bg-white border border-gray-200 rounded-sm p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-center gap-6 group">
            
            {/* Icon Box */}
            <div className="w-20 h-20 shrink-0 bg-gray-50 border border-gray-100 flex items-center justify-center rounded-sm text-[var(--color-islamic-green)] group-hover:bg-[var(--color-islamic-green)] group-hover:text-[var(--color-islamic-gold)] transition-colors">
              <Library className="w-8 h-8" />
            </div>

            {/* Info */}
            <div className="flex-grow text-center md:text-right w-full">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-2">
                <h2 className="font-serif text-2xl font-bold text-gray-800">{series.title}</h2>
                <span className={`text-xs px-3 py-1 rounded-sm font-bold inline-block self-center md:self-auto ${series.status === 'مكتملة' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                  {series.status}
                </span>
              </div>
              
              <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-gray-500 mb-4">
                <span className="flex items-center gap-1"><ListVideo className="w-4 h-4" /> {series.count} درس</span>
                {series.status === 'مكتملة' && <span className="flex items-center gap-1 text-green-600"><CheckCircle2 className="w-4 h-4" /> تم الإنجاز بنجاح</span>}
              </div>

              {/* Progress Bar (Visual representation of series completion) */}
              <div className="w-full bg-gray-100 rounded-full h-2.5 mb-2 overflow-hidden border border-gray-200">
                <div 
                  className="bg-[var(--color-islamic-gold)] h-2.5 transition-all duration-1000 ease-out" 
                  style={{ width: `${(series.completed / series.count) * 100}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-400 text-left">
                 تم إنجاز {series.completed} من {series.count} درس
              </div>
            </div>

            {/* Action */}
            <div className="shrink-0 w-full md:w-auto">
              <button className="w-full md:w-auto bg-white border border-[var(--color-islamic-green)] text-[var(--color-islamic-green)] px-6 py-2 rounded-sm hover:bg-[var(--color-islamic-green)] hover:text-white transition-colors font-medium">
                عرض الدروس
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
