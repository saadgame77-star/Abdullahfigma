import { Image } from "lucide-react";

export function Schedule() {
  const days = [
    { name: "الأحد", time: "بعد صلاة المغرب", lesson: "شرح كتاب التوحيد", location: "جامع الراجحي" },
    { name: "الإثنين", time: "بعد صلاة الفجر", lesson: "تفسير ابن كثير", location: "مسجد الحي" },
    { name: "الثلاثاء", time: "بعد صلاة العشاء", lesson: "عمدة الأحكام", location: "جامع الراجحي" },
    { name: "الأربعاء", time: "-", lesson: "لا يوجد درس", location: "-" },
    { name: "الخميس", time: "بعد صلاة المغرب", lesson: "السيرة النبوية", location: "جامع الراجحي" },
  ];

  return (
    <div className="container mx-auto px-4 py-12 animate-in fade-in duration-500">
      <div className="mb-12 text-center">
        <h1 className="font-serif text-4xl text-[var(--color-islamic-green-dark)] font-bold mb-4">الجدول الأسبوعي للدروس</h1>
        <div className="w-24 h-1 bg-[var(--color-islamic-gold)] mx-auto mb-6"></div>
        <p className="text-gray-600 max-w-2xl mx-auto">تعرف على أوقات وأماكن دروس الشيخ الأسبوعية الثابتة.</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-12">
        {/* HTML Table Version */}
        <div className="bg-white shadow-md border border-gray-200 rounded-sm overflow-hidden">
          <div className="bg-[var(--color-islamic-green)] text-white p-4 flex justify-between items-center">
             <h2 className="font-serif text-xl font-bold">جدول الدروس (نصي)</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="p-4 font-bold text-gray-700">اليوم</th>
                  <th className="p-4 font-bold text-gray-700">الوقت</th>
                  <th className="p-4 font-bold text-gray-700">المتن / الدرس</th>
                  <th className="p-4 font-bold text-gray-700">المكان</th>
                </tr>
              </thead>
              <tbody>
                {days.map((day, idx) => (
                  <tr key={idx} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-bold text-[var(--color-islamic-green-dark)]">{day.name}</td>
                    <td className="p-4 text-gray-600">{day.time}</td>
                    <td className="p-4 text-gray-800">{day.lesson}</td>
                    <td className="p-4 text-gray-600">{day.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Image Version */}
        <div className="bg-white shadow-md border border-gray-200 rounded-sm overflow-hidden p-6 text-center">
           <h2 className="font-serif text-xl font-bold mb-6 text-[var(--color-islamic-green-dark)]">صورة الإعلان الرسمي للجدول</h2>
           <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-sm p-12 flex flex-col items-center justify-center text-gray-400">
              <Image className="w-16 h-16 mb-4 opacity-50" />
              <p>مكان صورة الجدول (سيتم إضافتها من قبل الإدارة)</p>
           </div>
           <button className="mt-6 bg-[var(--color-islamic-gold)] text-[var(--color-islamic-green-dark)] px-6 py-2 rounded-sm font-bold hover:bg-[var(--color-islamic-gold-light)] transition-colors">
             تحميل الصورة
           </button>
        </div>
      </div>
    </div>
  );
}
