import { Search, SlidersHorizontal } from 'lucide-react';

export function VideoSearchSection() {
  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* العنوان */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-primary mb-3">البحث في المحتوى</h2>
          <p className="text-muted-foreground">ابحث في أكثر من ٦٥٠ مادة مرئية ومسموعة</p>
        </div>

        {/* مربع البحث */}
        <div className="bg-card rounded-2xl shadow-lg border border-border p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="ابحث عن موضوع، عنوان، أو كلمة مفتاحية..."
                className="w-full pr-12 pl-4 py-4 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <button className="px-8 py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all shadow-sm hover:shadow-md font-medium whitespace-nowrap flex items-center justify-center gap-2">
              <Search className="w-5 h-5" />
              <span>بحث</span>
            </button>
          </div>

          {/* خيارات التصفية */}
          <div className="border-t border-border pt-6">
            <div className="flex items-center gap-2 mb-4">
              <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">تصفية حسب:</p>
            </div>

            <div className="space-y-4">
              {/* نوع المحتوى */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">نوع المحتوى</p>
                <div className="flex flex-wrap gap-2">
                  {['الكل', 'مرئيات', 'صوتيات', 'بث مباشر'].map((type, index) => (
                    <button
                      key={index}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        index === 0
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'bg-muted text-foreground hover:bg-muted/80'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* التصنيف */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">التصنيف</p>
                <div className="flex flex-wrap gap-2">
                  {['العقيدة', 'الفقه', 'التفسير', 'الحديث', 'الخطب', 'الآداب'].map((category, index) => (
                    <button
                      key={index}
                      className="px-4 py-2 bg-muted text-foreground rounded-lg text-sm hover:bg-primary hover:text-primary-foreground transition-all"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* المدة */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">المدة الزمنية</p>
                <div className="flex flex-wrap gap-2">
                  {['الكل', 'أقل من ١٥ دقيقة', '١٥-٣٠ دقيقة', '٣٠-٦٠ دقيقة', 'أكثر من ساعة'].map((duration, index) => (
                    <button
                      key={index}
                      className="px-4 py-2 bg-muted text-foreground rounded-lg text-sm hover:bg-primary hover:text-primary-foreground transition-all"
                    >
                      {duration}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* اقتراحات البحث */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground mb-3">موضوعات شائعة:</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              'التوحيد',
              'أحكام الصلاة',
              'العقيدة الواسطية',
              'بلوغ المرام',
              'الأربعين النووية',
              'تفسير القرآن',
              'السيرة النبوية',
              'الأخلاق الإسلامية'
            ].map((keyword, index) => (
              <button
                key={index}
                className="px-4 py-2 bg-accent/10 text-accent-foreground rounded-full text-sm hover:bg-accent/20 transition-all border border-accent/20"
              >
                {keyword}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
