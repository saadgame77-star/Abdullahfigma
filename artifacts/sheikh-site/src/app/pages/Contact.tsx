import {
  AlertCircle,
  ExternalLink,
  MessageCircle,
  Send,
  ShieldCheck,
} from "lucide-react";

type ContactLink = {
  title: string;
  description: string;
  href: string;
  label: string;
};

const officialLinks: ContactLink[] = [
  // أضف الروابط الرسمية هنا بعد اعتمادها
  // مثال:
  // {
  //   title: "القناة الرسمية في يوتيوب",
  //   description: "القناة المعتمدة لنشر الدروس والمحاضرات والمقاطع.",
  //   href: "https://www.youtube.com/@example",
  //   label: "فتح القناة",
  // },
];

export function Contact() {
  const hasOfficialLinks = officialLinks.length > 0;

  return (
    <div className="container mx-auto px-4 py-12 animate-in fade-in duration-500">
      <div className="mb-10 text-center">
        <h1 className="font-serif text-4xl text-[var(--color-islamic-green-dark)] font-bold mb-4">
          تواصل معنا
        </h1>
        <div className="w-24 h-1 bg-[var(--color-islamic-gold)] mx-auto mb-6"></div>
        <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
          هذه الصفحة مخصصة لاستقبال الملاحظات والمقترحات المتعلقة بالموقع، وسيتم
          تفعيل الإرسال المباشر بعد ربط النموذج بخدمة آمنة.
        </p>
      </div>

      <div className="max-w-6xl mx-auto space-y-8">
        <div className="bg-amber-50 border-r-4 border-amber-500 p-6 rounded-sm flex gap-4 items-start shadow-sm">
          <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />

          <div>
            <h2 className="font-bold text-amber-800 mb-2">تنبيه مهم</h2>
            <p className="text-amber-700 text-sm leading-relaxed">
              نموذج التواصل غير مفعل حاليًا. سيتم تفعيل الإرسال المباشر لاحقًا
              بعد ربطه بخدمة آمنة من جهة الخادم، حفاظًا على الخصوصية ومنع إساءة
              الاستخدام.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-8">
          <section className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
            <div className="bg-[var(--color-islamic-green)] text-white p-5">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-[var(--color-islamic-gold)]" />
                <div>
                  <h2 className="font-serif text-2xl font-bold">
                    القنوات الرسمية
                  </h2>
                  <p className="text-sm text-white/75 mt-1">
                    الروابط المعتمدة للمتابعة والتواصل.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {hasOfficialLinks ? (
                <div className="grid grid-cols-1 gap-4">
                  {officialLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block border border-gray-200 rounded-sm p-5 hover:border-[var(--color-islamic-gold)] hover:shadow-md transition-all"
                    >
                      <div className="flex items-start gap-4">
                        <span className="w-11 h-11 rounded-sm bg-[var(--color-islamic-ivory)] border border-gray-200 flex items-center justify-center text-[var(--color-islamic-green)] group-hover:bg-[var(--color-islamic-green)] group-hover:text-white transition-colors shrink-0">
                          <ExternalLink className="w-5 h-5" />
                        </span>

                        <div>
                          <h3 className="font-bold text-gray-800 mb-1 group-hover:text-[var(--color-islamic-green)] transition-colors">
                            {link.title}
                          </h3>
                          <p className="text-sm text-gray-600 leading-relaxed mb-3">
                            {link.description}
                          </p>
                          <span className="inline-flex items-center gap-1 text-sm font-bold text-[var(--color-islamic-green)]">
                            {link.label}
                            <ExternalLink className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="bg-[var(--color-islamic-ivory)] border border-gray-200 rounded-sm p-8 text-center">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 text-[var(--color-islamic-gold)]" />
                  <h3 className="font-serif text-2xl font-bold text-[var(--color-islamic-green-dark)] mb-2">
                    سيتم إضافة القنوات الرسمية قريبًا
                  </h3>
                  <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
                    ستظهر هنا روابط القنوات الرسمية بعد اعتمادها، مثل قناة
                    يوتيوب أو أي وسيلة تواصل أخرى تقررها إدارة الموقع.
                  </p>
                </div>
              )}

              <div className="mt-6 bg-gray-50 border border-gray-200 rounded-sm p-5">
                <h3 className="font-bold text-gray-800 mb-2">
                  قبل إرسال الرسالة
                </h3>
                <ul className="space-y-2 text-sm text-gray-600 leading-relaxed">
                  <li>• اكتب عنوانًا واضحًا ومختصرًا للرسالة.</li>
                  <li>
                    • إذا كانت الملاحظة فنية، اذكر رابط الصفحة أو اسم القسم.
                  </li>
                  <li>• لا تضع بيانات خاصة أو حساسة داخل نموذج التواصل.</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
            <div className="bg-[var(--color-islamic-green-dark)] text-white p-5">
              <div className="flex items-center gap-3">
                <Send className="w-6 h-6 text-[var(--color-islamic-gold)]" />
                <div>
                  <h2 className="font-serif text-2xl font-bold">
                    نموذج الإرسال
                  </h2>
                  <p className="text-sm text-white/75 mt-1">
                    سيتم تفعيله لاحقًا بعد الربط الآمن.
                  </p>
                </div>
              </div>
            </div>

            <form className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  الاسم الكريم
                </label>
                <input
                  type="text"
                  disabled
                  className="w-full border border-gray-200 bg-gray-50 rounded-sm px-4 py-3 text-gray-500 cursor-not-allowed"
                  placeholder="سيتم تفعيل الحقل لاحقًا"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  بريدك الإلكتروني
                </label>
                <input
                  type="email"
                  disabled
                  className="w-full border border-gray-200 bg-gray-50 rounded-sm px-4 py-3 text-gray-500 cursor-not-allowed"
                  placeholder="سيتم تفعيل الحقل لاحقًا"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  نوع الرسالة
                </label>
                <select
                  disabled
                  className="w-full border border-gray-200 bg-gray-50 rounded-sm px-4 py-3 text-gray-500 cursor-not-allowed"
                >
                  <option>اقتراح أو ملاحظة</option>
                  <option>ملاحظة على محتوى</option>
                  <option>مشكلة تقنية في الموقع</option>
                  <option>إضافة رابط أو مادة</option>
                  <option>أخرى</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  نص الرسالة
                </label>
                <textarea
                  rows={6}
                  disabled
                  className="w-full border border-gray-200 bg-gray-50 rounded-sm px-4 py-3 text-gray-500 cursor-not-allowed resize-none"
                  placeholder="سيتم تفعيل النموذج بعد ربطه بخدمة آمنة"
                ></textarea>
              </div>

              <button
                type="button"
                disabled
                className="w-full bg-gray-200 text-gray-500 font-bold py-3 rounded-sm cursor-not-allowed mt-4 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                الإرسال غير مفعل حاليًا
              </button>

              <p className="text-xs text-gray-500 leading-relaxed text-center">
                سيتم تفعيل الإرسال المباشر لاحقًا بعد ربط النموذج بخدمة آمنة.
              </p>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
