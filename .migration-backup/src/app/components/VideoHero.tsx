import { Play, Radio, Video } from 'lucide-react';

export function VideoHero() {
  return (
    <section className="relative bg-gradient-to-b from-primary/10 via-accent/5 to-background py-12 sm:py-16">
      {/* زخرفة إسلامية خفيفة */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-10 right-10 w-32 h-32 border-4 border-primary rounded-full"></div>
        <div className="absolute bottom-10 left-10 w-24 h-24 border-4 border-accent rotate-45"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* النص */}
          <div className="text-center lg:text-right order-2 lg:order-1">
            <div className="mb-4">
              <span className="inline-block px-4 py-2 bg-accent/20 text-accent-foreground rounded-full text-sm font-medium border border-accent/30">
                بسم الله الرحمن الرحيم
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-4 leading-relaxed" style={{ fontFamily: 'var(--font-family-serif)' }}>
              الشيخ عبدالله بن سعد آل غلفيص
            </h1>

            <p className="text-lg sm:text-xl text-foreground/70 mb-6 leading-relaxed">
              مكتبة مرئية ومسموعة شاملة للدروس والمحاضرات<br className="hidden sm:block" />
              والخطب الشرعية
            </p>

            {/* إحصائيات */}
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0 mb-6">
              <div className="bg-card p-4 rounded-xl shadow-sm border border-border">
                <Video className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="text-xl font-bold text-primary">٤٥٠+</div>
                <div className="text-xs text-muted-foreground">فيديو</div>
              </div>
              <div className="bg-card p-4 rounded-xl shadow-sm border border-border">
                <Radio className="w-6 h-6 text-accent mx-auto mb-2" />
                <div className="text-xl font-bold text-primary">٢٠٠+</div>
                <div className="text-xs text-muted-foreground">صوتي</div>
              </div>
              <div className="bg-card p-4 rounded-xl shadow-sm border border-border">
                <Play className="w-6 h-6 text-secondary mx-auto mb-2" />
                <div className="text-xl font-bold text-primary">٦٥٠+</div>
                <div className="text-xs text-muted-foreground">مادة</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
              <a
                href="#videos"
                className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all shadow-md hover:shadow-lg font-medium flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" />
                <span>استعرض المرئيات</span>
              </a>
              <a
                href="#live"
                className="w-full sm:w-auto px-8 py-4 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-all shadow-md hover:shadow-lg font-medium flex items-center justify-center gap-2"
              >
                <Radio className="w-5 h-5" />
                <span>البث المباشر</span>
              </a>
            </div>
          </div>

          {/* الفيديو المميز */}
          <div className="order-1 lg:order-2">
            <div className="relative bg-card rounded-2xl shadow-xl border-2 border-primary/20 overflow-hidden">
              <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <div className="absolute inset-0 bg-black/5"></div>
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-2xl cursor-pointer">
                    <Play className="w-10 h-10 text-primary-foreground mr-1" fill="currentColor" />
                  </div>
                </div>
                <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/80 text-white text-sm rounded font-medium">
                  ٤٥:٣٢
                </div>
                <div className="absolute top-4 right-4 px-3 py-1.5 bg-red-600 text-white text-xs rounded-full font-medium shadow-lg animate-pulse flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                  بث مباشر
                </div>
              </div>
              <div className="p-5 bg-card">
                <h3 className="font-semibold text-foreground mb-2 leading-relaxed">
                  شرح كتاب التوحيد - الدرس المباشر الآن
                </h3>
                <p className="text-sm text-muted-foreground">
                  متابعة البث المباشر للدرس العلمي
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
