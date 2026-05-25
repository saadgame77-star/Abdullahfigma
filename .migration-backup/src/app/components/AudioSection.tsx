import { Headphones, Download, Pause, Play, Volume2 } from 'lucide-react';
import { useState } from 'react';

export function AudioSection() {
  const [playingId, setPlayingId] = useState<number | null>(null);

  const audioTracks = [
    {
      title: 'شرح الأربعين النووية - الحديث الأول',
      duration: '٢٨:٤٥',
      size: '٢٦ MB',
      date: '١٤٤٦/٥/١٥',
      plays: '١٥,٢٠٠'
    },
    {
      title: 'فوائد من كتاب الإيمان - صحيح البخاري',
      duration: '٣٥:١٢',
      size: '٣٢ MB',
      date: '١٤٤٦/٥/١٢',
      plays: '١٢,٨٠٠'
    },
    {
      title: 'شرح حديث جبريل في الإيمان والإسلام',
      duration: '٤٢:٣٠',
      size: '٣٩ MB',
      date: '١٤٤٦/٥/٨',
      plays: '١٨,٥٠٠'
    },
    {
      title: 'أحكام الوضوء والطهارة - درس صوتي',
      duration: '٣٢:٥٥',
      size: '٣٠ MB',
      date: '١٤٤٦/٥/٥',
      plays: '١٤,٣٠٠'
    },
    {
      title: 'تفسير سورة الفاتحة - تسجيل صوتي',
      duration: '٢٥:٢٠',
      size: '٢٣ MB',
      date: '١٤٤٦/٥/٣',
      plays: '٢٠,١٠٠'
    },
    {
      title: 'مقاصد سورة الإخلاص - محاضرة صوتية',
      duration: '٣٨:١٥',
      size: '٣٥ MB',
      date: '١٤٤٦/٤/٢٨',
      plays: '١٦,٧٠٠'
    }
  ];

  return (
    <section id="audios" className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* العنوان */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-3">المواد الصوتية</h2>
          <p className="text-muted-foreground">دروس ومحاضرات صوتية للاستماع والتحميل</p>
        </div>

        {/* القائمة */}
        <div className="max-w-4xl mx-auto space-y-3">
          {audioTracks.map((track, index) => (
            <div
              key={index}
              className="bg-card rounded-xl shadow-sm border border-border hover:shadow-md transition-all hover:border-primary/30 group"
            >
              <div className="p-5 flex items-center gap-4">
                {/* أيقونة التشغيل */}
                <button
                  onClick={() => setPlayingId(playingId === index ? null : index)}
                  className="flex-shrink-0 w-14 h-14 bg-primary/10 hover:bg-primary group-hover:bg-primary rounded-full flex items-center justify-center transition-all"
                  aria-label={playingId === index ? 'إيقاف' : 'تشغيل'}
                >
                  {playingId === index ? (
                    <Pause className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                  ) : (
                    <Play className="w-6 h-6 text-primary group-hover:text-primary-foreground mr-1 transition-colors" fill="currentColor" />
                  )}
                </button>

                {/* التفاصيل */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors leading-relaxed truncate">
                    {track.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Volume2 className="w-3.5 h-3.5" />
                      {track.duration}
                    </span>
                    <span>{track.size}</span>
                    <span>{track.plays} استماع</span>
                    <span>{track.date}</span>
                  </div>

                  {/* شريط التقدم (يظهر عند التشغيل) */}
                  {playingId === index && (
                    <div className="mt-3">
                      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full w-1/3 transition-all"></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* زر التحميل */}
                <button
                  className="flex-shrink-0 p-3 bg-muted hover:bg-primary hover:text-primary-foreground rounded-lg transition-all"
                  aria-label="تحميل"
                >
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* زر عرض المزيد */}
        <div className="text-center mt-10">
          <button className="px-8 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-all shadow-md hover:shadow-lg font-medium flex items-center justify-center gap-2 mx-auto">
            <Headphones className="w-5 h-5" />
            <span>عرض جميع الصوتيات (٢٠٠+ تسجيل)</span>
          </button>
        </div>
      </div>
    </section>
  );
}
