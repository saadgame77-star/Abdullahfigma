import { Book, GraduationCap, Heart, Mic, Scale, Sparkles } from 'lucide-react';

export function VideoCategories() {
  const categories = [
    {
      icon: Book,
      label: 'العقيدة والتوحيد',
      count: '١٢٠ فيديو',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20'
    },
    {
      icon: Scale,
      label: 'الفقه والأحكام',
      count: '٩٥ فيديو',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      borderColor: 'border-accent/20'
    },
    {
      icon: Sparkles,
      label: 'التفسير',
      count: '٨٠ فيديو',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      borderColor: 'border-secondary/20'
    },
    {
      icon: Book,
      label: 'الحديث والسيرة',
      count: '٧٥ فيديو',
      color: 'text-primary',
      bgColor: 'bg-primary/5',
      borderColor: 'border-primary/15'
    },
    {
      icon: Mic,
      label: 'خطب الجمعة',
      count: '١٥٠ فيديو',
      color: 'text-accent',
      bgColor: 'bg-accent/5',
      borderColor: 'border-accent/15'
    },
    {
      icon: Heart,
      label: 'الأخلاق والآداب',
      count: '٦٠ فيديو',
      color: 'text-secondary',
      bgColor: 'bg-secondary/5',
      borderColor: 'border-secondary/15'
    },
    {
      icon: GraduationCap,
      label: 'طلب العلم',
      count: '٤٥ فيديو',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20'
    },
  ];

  return (
    <section id="categories" className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* العنوان */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-3">تصنيفات المرئيات</h2>
          <p className="text-muted-foreground">تصفح الفيديوهات حسب الموضوع</p>
        </div>

        {/* البطاقات */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((category, index) => (
            <a
              key={index}
              href="#"
              className={`group bg-card p-6 rounded-xl shadow-sm border ${category.borderColor} hover:shadow-lg hover:border-primary/40 transition-all text-center`}
            >
              <div className={`w-16 h-16 ${category.bgColor} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                <category.icon className={`w-8 h-8 ${category.color}`} strokeWidth={2} />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2 group-hover:text-primary transition-colors leading-relaxed">
                {category.label}
              </h3>
              <p className="text-sm text-muted-foreground">{category.count}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
