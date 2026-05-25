import { Radio, Users, Calendar, Clock } from 'lucide-react';

export function LiveStreamSection() {
  const upcomingStreams = [
    {
      title: 'شرح كتاب التوحيد - الدرس السادس عشر',
      date: 'الأحد',
      time: 'بعد صلاة المغرب',
      viewers: 'متوقع ٢٠٠٠+',
      category: 'العقيدة'
    },
    {
      title: 'خطبة الجمعة المباشرة',
      date: 'الجمعة',
      time: '١٢:٣٠ ظهراً',
      viewers: 'متوقع ٥٠٠٠+',
      category: 'خطب'
    },
    {
      title: 'شرح صحيح البخاري - كتاب الصلاة',
      date: 'الثلاثاء',
      time: 'بعد صلاة العشاء',
      viewers: 'متوقع ١٥٠٠+',
      category: 'الحديث'
    }
  ];

  return (
    <section id="live" className="py-16 bg-gradient-to-b from-primary/5 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* البث المباشر الحالي */}
        <div className="mb-12">
          <div className="bg-card rounded-2xl shadow-xl border-2 border-primary/30 overflow-hidden">
            <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <div className="absolute inset-0 bg-black/5"></div>

              {/* علامة البث المباشر */}
              <div className="absolute top-6 right-6 flex items-center gap-3">
                <div className="px-4 py-2 bg-red-600 text-white rounded-full font-medium shadow-xl animate-pulse flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-white rounded-full"></span>
                  <span>بث مباشر الآن</span>
                </div>
                <div className="px-4 py-2 bg-black/60 text-white rounded-full flex items-center gap-2 shadow-lg">
                  <Users className="w-4 h-4" />
                  <span>٢,٣٤٥ مشاهد</span>
                </div>
              </div>

              {/* أيقونة التشغيل */}
              <div className="relative z-10">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-2xl cursor-pointer">
                  <Radio className="w-10 h-10 text-primary-foreground" />
                </div>
              </div>

              {/* وقت البث */}
              <div className="absolute bottom-6 left-6 px-3 py-1.5 bg-black/80 text-white text-sm rounded font-medium">
                ٢٣:٤٥
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs rounded-lg mb-3 border border-primary/20">
                    العقيدة والتوحيد
                  </span>
                  <h2 className="text-2xl font-bold text-foreground mb-2 leading-relaxed">
                    شرح كتاب التوحيد - الدرس الخامس عشر
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    شرح باب ما جاء في الرقى والتمائم من كتاب التوحيد للإمام محمد بن عبد الوهاب رحمه الله
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all shadow-md hover:shadow-lg font-medium flex items-center gap-2">
                  <Radio className="w-5 h-5" />
                  <span>انضم للبث الآن</span>
                </button>
                <button className="px-6 py-3 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-all font-medium">
                  مشاركة البث
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* البث القادم */}
        <div>
          <h3 className="text-2xl font-bold text-primary mb-6 text-center">البث المباشر القادم</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingStreams.map((stream, index) => (
              <div
                key={index}
                className="bg-card rounded-xl shadow-sm border border-border hover:shadow-md transition-all hover:border-primary/30 p-6"
              >
                <span className="inline-block px-3 py-1 bg-accent/10 text-accent-foreground text-xs rounded-lg mb-4 border border-accent/20">
                  {stream.category}
                </span>

                <h4 className="font-semibold text-foreground mb-4 leading-relaxed">
                  {stream.title}
                </h4>

                <div className="space-y-2.5 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>{stream.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>{stream.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    <span>{stream.viewers}</span>
                  </div>
                </div>

                <button className="w-full px-4 py-2.5 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-primary-foreground transition-all font-medium">
                  تذكير بالبث
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
