import { Mail, Phone, MapPin, ExternalLink, AlertCircle } from "lucide-react";

export function Contact() {
  return (
    <div className="container mx-auto px-4 py-12 animate-in fade-in duration-500">
      <div className="mb-10 text-center">
        <h1 className="font-serif text-4xl text-[var(--color-islamic-green-dark)] font-bold mb-4">تواصل معنا</h1>
        <div className="w-24 h-1 bg-[var(--color-islamic-gold)] mx-auto mb-6"></div>
        <p className="text-gray-600 max-w-2xl mx-auto">نسعد بتواصلكم عبر القنوات الرسمية المعتمدة.</p>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Important Notice */}
        <div className="bg-amber-50 border-r-4 border-amber-500 p-6 rounded-sm mb-12 flex gap-4 items-start shadow-sm">
          <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-amber-800 mb-2">تنبيه هام</h3>
            <p className="text-amber-700 text-sm leading-relaxed">
              هذه هي القنوات الرسمية الوحيدة للتواصل مع إدارة الموقع والمسؤولين عن دروس الشيخ. نرجو عدم اعتماد أي حسابات أو قنوات أخرى غير المذكورة هنا.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <h2 className="font-serif text-2xl font-bold text-[var(--color-islamic-green-dark)] border-b pb-4 mb-6">معلومات التواصل</h2>
            
            <div className="flex gap-4 items-start bg-white p-6 rounded-sm shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-[var(--color-islamic-ivory)] border border-gray-200 rounded-full flex items-center justify-center shrink-0 text-[var(--color-islamic-green)]">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-1">البريد الإلكتروني</h3>
                <p className="text-gray-600 font-mono text-left" dir="ltr">info@alghulais.com</p>
              </div>
            </div>

            <div className="flex gap-4 items-start bg-white p-6 rounded-sm shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-[var(--color-islamic-ivory)] border border-gray-200 rounded-full flex items-center justify-center shrink-0 text-[var(--color-islamic-green)]">
                <ExternalLink className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-1">حسابات التواصل الاجتماعي</h3>
                <div className="flex gap-4 mt-3">
                  <a href="#" className="text-gray-500 hover:text-[var(--color-islamic-green)] transition-colors text-sm font-medium">تويتر (X)</a>
                  <a href="#" className="text-gray-500 hover:text-[var(--color-islamic-green)] transition-colors text-sm font-medium">يوتيوب</a>
                  <a href="#" className="text-gray-500 hover:text-[var(--color-islamic-green)] transition-colors text-sm font-medium">تليجرام</a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-100">
            <h2 className="font-serif text-2xl font-bold text-[var(--color-islamic-green-dark)] border-b pb-4 mb-6">نموذج المراسلة</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">الاسم الكريم</label>
                <input type="text" className="w-full border border-gray-300 rounded-sm px-4 py-3 focus:outline-none focus:border-[var(--color-islamic-gold)] focus:ring-1 focus:ring-[var(--color-islamic-gold)]" placeholder="أدخل اسمك" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">البريد الإلكتروني</label>
                <input type="email" className="w-full border border-gray-300 rounded-sm px-4 py-3 focus:outline-none focus:border-[var(--color-islamic-gold)] focus:ring-1 focus:ring-[var(--color-islamic-gold)]" placeholder="أدخل بريدك الإلكتروني" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">نوع الرسالة</label>
                <select className="w-full border border-gray-300 rounded-sm px-4 py-3 focus:outline-none focus:border-[var(--color-islamic-gold)] focus:ring-1 focus:ring-[var(--color-islamic-gold)] text-gray-700 bg-white">
                  <option>استفسار علمي</option>
                  <option>اقتراح</option>
                  <option>مشكلة تقنية بالموقع</option>
                  <option>أخرى</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">نص الرسالة</label>
                <textarea rows={4} className="w-full border border-gray-300 rounded-sm px-4 py-3 focus:outline-none focus:border-[var(--color-islamic-gold)] focus:ring-1 focus:ring-[var(--color-islamic-gold)] resize-none" placeholder="اكتب رسالتك هنا..."></textarea>
              </div>
              <button type="button" className="w-full bg-[var(--color-islamic-green)] text-white font-bold py-3 rounded-sm hover:bg-[var(--color-islamic-green-light)] transition-colors mt-4">
                إرسال الرسالة
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
