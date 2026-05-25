import { Search } from 'lucide-react';

export function SearchSection() {
  return (
    <section className="py-16 bg-gradient-to-b from-primary/5 to-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* العنوان */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-primary mb-3">البحث في المحتوى العلمي</h2>
          <p className="text-muted-foreground">ابحث في جميع الدروس، الخطب، المقالات، والمؤلفات</p>
        </div>

        {/* مربع البحث */}
        <div className="bg-card rounded-xl shadow-md border border-border p-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="اكتب كلمة البحث هنا..."
                className="w-full pr-12 pl-4 py-4 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <button className="px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all shadow-sm hover:shadow-md font-medium whitespace-nowrap">
              بحث
            </button>
          </div>

          {/* خيارات البحث المتقدم */}
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground mb-3">تصفية النتائج حسب:</p>
            <div className="flex flex-wrap gap-2">
              {['الكل', 'دروس', 'خطب', 'مقالات', 'كتب', 'فتاوى', 'صوتيات', 'مرئيات'].map((filter, index) => (
                <button
                  key={index}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    index === 0
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground hover:bg-muted/80'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* كلمات مفتاحية شائعة */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground mb-3">الكلمات الأكثر بحثاً:</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {['التوحيد', 'العقيدة', 'الصلاة', 'الزكاة', 'الحج', 'الصيام', 'الأخلاق', 'طلب العلم'].map((keyword, index) => (
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
