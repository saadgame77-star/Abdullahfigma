import { BookOpen, Download, ExternalLink } from 'lucide-react';

export function BooksSection() {
  const books = [
    {
      title: 'شرح كتاب التوحيد',
      description: 'شرح مفصل لكتاب التوحيد للإمام محمد بن عبد الوهاب',
      pages: '٤٥٠ صفحة',
      edition: 'الطبعة الثالثة',
      year: '١٤٤٥هـ'
    },
    {
      title: 'الفوائد المنتقاة من شرح العقيدة الواسطية',
      description: 'فوائد ودرر منتقاة من شرح العقيدة الواسطية لشيخ الإسلام ابن تيمية',
      pages: '٣٢٠ صفحة',
      edition: 'الطبعة الثانية',
      year: '١٤٤٤هـ'
    },
    {
      title: 'رسالة في أحكام الزكاة',
      description: 'رسالة مختصرة في أحكام الزكاة وما يتعلق بها من مسائل فقهية',
      pages: '١٨٠ صفحة',
      edition: 'الطبعة الأولى',
      year: '١٤٤٣هـ'
    },
    {
      title: 'الدروس المهمة لعامة الأمة',
      description: 'مختصر في العقيدة والفقه والأخلاق لعموم المسلمين',
      pages: '٢٥٠ صفحة',
      edition: 'الطبعة الرابعة',
      year: '١٤٤٦هـ'
    },
  ];

  return (
    <section id="books" className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* العنوان */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-3">المؤلفات</h2>
          <p className="text-muted-foreground">مؤلفات الشيخ ومصنفاته في العلوم الشرعية</p>
        </div>

        {/* البطاقات */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {books.map((book, index) => (
            <div
              key={index}
              className="bg-card rounded-xl shadow-sm border border-border hover:shadow-md transition-all hover:border-primary/30 group"
            >
              <div className="p-6 flex gap-6">
                {/* غلاف الكتاب */}
                <div className="flex-shrink-0">
                  <div className="w-24 h-32 bg-gradient-to-br from-primary to-primary/70 rounded-lg shadow-md flex items-center justify-center border-2 border-accent/30">
                    <BookOpen className="w-12 h-12 text-primary-foreground/80" strokeWidth={1.5} />
                  </div>
                </div>

                {/* التفاصيل */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors leading-relaxed">
                    {book.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {book.description}
                  </p>
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-4">
                    <span className="px-2 py-1 bg-muted rounded">{book.pages}</span>
                    <span className="px-2 py-1 bg-muted rounded">{book.edition}</span>
                    <span className="px-2 py-1 bg-muted rounded">{book.year}</span>
                  </div>

                  {/* الأزرار */}
                  <div className="flex flex-wrap gap-2">
                    <button className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all text-sm font-medium">
                      <Download className="w-4 h-4" />
                      <span>تحميل PDF</span>
                    </button>
                    <button className="flex items-center gap-1.5 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-all text-sm font-medium">
                      <ExternalLink className="w-4 h-4" />
                      <span>قراءة أونلاين</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* زر عرض المزيد */}
        <div className="text-center mt-10">
          <button className="px-8 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-all shadow-md hover:shadow-lg font-medium">
            عرض جميع المؤلفات
          </button>
        </div>
      </div>
    </section>
  );
}
