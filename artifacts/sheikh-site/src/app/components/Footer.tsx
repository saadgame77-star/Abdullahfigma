import { BookOpen, Facebook, Mail, Phone, Twitter, Youtube } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    main: [
      { label: 'الرئيسية', href: '#' },
      { label: 'البث المباشر', href: '#live' },
      { label: 'المرئيات', href: '#videos' },
      { label: 'قوائم التشغيل', href: '#playlists' },
      { label: 'التصنيفات', href: '#categories' },
    ],
    content: [
      { label: 'الصوتيات', href: '#audios' },
      { label: 'عن الشيخ', href: '#about' },
      { label: 'التواصل', href: '#contact' },
      { label: 'الأسئلة الشائعة', href: '#faq' },
      { label: 'سياسة الخصوصية', href: '#privacy' },
    ]
  };

  return (
    <footer className="bg-primary/5 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* القسم الأول - عن الموقع */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-primary to-primary/80 rounded-lg shadow-md">
                <BookOpen className="w-6 h-6 text-primary-foreground" strokeWidth={2} />
              </div>
              <h3 className="text-lg font-semibold text-primary">
                الشيخ عبدالله بن سعد آل غلفيص
              </h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              مكتبة مرئية ومسموعة شاملة للدروس والمحاضرات والخطب الشرعية، نسعى لنشر العلم الشرعي
              الصحيح المستمد من الكتاب والسنة بفهم سلف الأمة من خلال محتوى مرئي وصوتي عالي الجودة.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-10 h-10 flex items-center justify-center bg-primary/10 hover:bg-primary hover:text-primary-foreground text-primary rounded-lg transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 flex items-center justify-center bg-primary/10 hover:bg-primary hover:text-primary-foreground text-primary rounded-lg transition-all">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 flex items-center justify-center bg-primary/10 hover:bg-primary hover:text-primary-foreground text-primary rounded-lg transition-all">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* روابط سريعة */}
          <div>
            <h4 className="text-base font-semibold text-foreground mb-4">روابط سريعة</h4>
            <ul className="space-y-2">
              {footerLinks.main.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* المحتوى */}
          <div>
            <h4 className="text-base font-semibold text-foreground mb-4">المحتوى العلمي</h4>
            <ul className="space-y-2">
              {footerLinks.content.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* معلومات التواصل */}
        <div className="border-t border-border pt-8 mb-8">
          <h4 className="text-base font-semibold text-foreground mb-4 text-center">للتواصل والاستفسار</h4>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" />
              <span>info@sheikhalghulaifees.com</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary" />
              <span dir="ltr">+966 50 123 4567</span>
            </div>
          </div>
        </div>

        {/* حقوق النشر */}
        <div className="border-t border-border pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            جميع الحقوق محفوظة © {currentYear} - موقع الشيخ عبدالله بن سعد آل غلفيص
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            يسمح بنقل ونشر المحتوى لأغراض علمية مع ذكر المصدر
          </p>
        </div>
      </div>
    </footer>
  );
}
