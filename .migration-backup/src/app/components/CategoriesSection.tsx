import { Book, FileText, Headphones, MessageSquare, Mic, Scale, Video } from 'lucide-react';

export function CategoriesSection() {
  const categories = [
    { icon: Book, label: 'الدروس', count: '٢٥٠+', color: 'text-primary', bgColor: 'bg-primary/10', href: '#lessons' },
    { icon: Mic, label: 'الخطب', count: '١٨٠+', color: 'text-accent', bgColor: 'bg-accent/10', href: '#sermons' },
    { icon: FileText, label: 'المقالات', count: '١٢٠+', color: 'text-secondary', bgColor: 'bg-secondary/10', href: '#articles' },
    { icon: Scale, label: 'الفتاوى', count: '٣٠٠+', color: 'text-primary', bgColor: 'bg-primary/5', href: '#fatwas' },
    { icon: Book, label: 'الكتب', count: '٥٠+', color: 'text-accent', bgColor: 'bg-accent/5', href: '#books' },
    { icon: Headphones, label: 'الصوتيات', count: '٤٠٠+', color: 'text-secondary', bgColor: 'bg-secondary/5', href: '#audios' },
    { icon: Video, label: 'المرئيات', count: '١٥٠+', color: 'text-primary', bgColor: 'bg-primary/10', href: '#videos' },
    { icon: MessageSquare, label: 'التواصل', count: '', color: 'text-accent', bgColor: 'bg-accent/10', href: '#contact' },
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* العنوان */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-3">تصنيفات المحتوى</h2>
          <p className="text-muted-foreground">اختر القسم المناسب لك للوصول السريع للمحتوى العلمي</p>
        </div>

        {/* البطاقات */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((category, index) => (
            <a
              key={index}
              href={category.href}
              className="group bg-card p-6 rounded-xl shadow-sm border border-border hover:shadow-md hover:border-primary/30 transition-all text-center"
            >
              <div className={`w-14 h-14 ${category.bgColor} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                <category.icon className={`w-7 h-7 ${category.color}`} strokeWidth={2} />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                {category.label}
              </h3>
              {category.count && (
                <p className="text-sm text-muted-foreground">{category.count}</p>
              )}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
