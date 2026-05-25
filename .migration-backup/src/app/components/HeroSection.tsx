import { BookMarked, Headphones, Video } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-b from-primary/5 via-accent/5 to-background py-16 sm:py-24">
      {/* زخرفة إسلامية خفيفة */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-10 right-10 w-32 h-32 border-4 border-primary rounded-full"></div>
        <div className="absolute bottom-10 left-10 w-24 h-24 border-4 border-accent rotate-45"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          {/* عبارة ترحيبية */}
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-accent/20 text-accent-foreground rounded-full text-sm font-medium border border-accent/30">
              بسم الله الرحمن الرحيم
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-6 leading-relaxed" style={{ fontFamily: 'var(--font-family-serif)' }}>
            موقع الشيخ عبدالله بن سعد آل غلفيص
          </h2>

          <p className="text-lg sm:text-xl text-foreground/70 mb-10 leading-relaxed">
            منصة علمية تجمع الدروس والخطب والمؤلفات والمقالات<br className="hidden sm:block" />
            في قالب منظم وميسر لطالب العلم
          </p>

          {/* أزرار الإجراءات */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <a
              href="#lessons"
              className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all shadow-md hover:shadow-lg font-medium"
            >
              تصفح الدروس
            </a>
            <a
              href="#books"
              className="w-full sm:w-auto px-8 py-4 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-all shadow-md hover:shadow-lg font-medium"
            >
              المؤلفات
            </a>
            <a
              href="#latest"
              className="w-full sm:w-auto px-8 py-4 bg-card text-card-foreground border-2 border-border rounded-lg hover:bg-muted transition-all font-medium"
            >
              آخر الإضافات
            </a>
          </div>

          {/* إحصائيات سريعة */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
              <BookMarked className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="text-2xl font-bold text-primary mb-1">50+</div>
              <div className="text-sm text-muted-foreground">مؤلف ومصنف</div>
            </div>
            <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
              <Headphones className="w-8 h-8 text-accent mx-auto mb-3" />
              <div className="text-2xl font-bold text-primary mb-1">300+</div>
              <div className="text-sm text-muted-foreground">محاضرة صوتية</div>
            </div>
            <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
              <Video className="w-8 h-8 text-secondary mx-auto mb-3" />
              <div className="text-2xl font-bold text-primary mb-1">150+</div>
              <div className="text-sm text-muted-foreground">مقطع مرئي</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
