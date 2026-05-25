import { List, Play } from 'lucide-react';

export function PlaylistsSection() {
  const playlists = [
    {
      title: 'شرح كتاب التوحيد',
      description: 'سلسلة كاملة من ٣٥ درساً',
      videosCount: '٣٥',
      totalDuration: '٢٨ ساعة',
      thumbnail: 'from-primary/30 to-primary/10',
      views: '١٢٠,٠٠٠'
    },
    {
      title: 'شرح العقيدة الواسطية',
      description: 'شرح متن العقيدة الواسطية كاملاً',
      videosCount: '٤٢',
      totalDuration: '٣٥ ساعة',
      thumbnail: 'from-accent/30 to-accent/10',
      views: '٩٥,٠٠٠'
    },
    {
      title: 'خطب الجمعة ١٤٤٦هـ',
      description: 'مجموعة خطب الجمعة للعام الحالي',
      videosCount: '٤٨',
      totalDuration: '٢٤ ساعة',
      thumbnail: 'from-secondary/30 to-secondary/10',
      views: '٢٠٠,٠٠٠'
    },
    {
      title: 'شرح بلوغ المرام',
      description: 'شرح كتاب بلوغ المرام من أدلة الأحكام',
      videosCount: '٦٨',
      totalDuration: '٥٦ ساعة',
      thumbnail: 'from-primary/20 to-accent/20',
      views: '٨٨,٠٠٠'
    },
    {
      title: 'تفسير جزء عم',
      description: 'تفسير ميسر لسور جزء عم',
      videosCount: '٣٧',
      totalDuration: '٣٠ ساعة',
      thumbnail: 'from-accent/20 to-secondary/20',
      views: '١١٠,٠٠٠'
    },
    {
      title: 'فقه العبادات',
      description: 'سلسلة شاملة في فقه العبادات',
      videosCount: '٥٥',
      totalDuration: '٤٦ ساعة',
      thumbnail: 'from-primary/25 to-primary/5',
      views: '٧٥,٠٠٠'
    }
  ];

  return (
    <section id="playlists" className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* العنوان */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-3">قوائم التشغيل</h2>
          <p className="text-muted-foreground">سلاسل علمية منظمة ومتكاملة</p>
        </div>

        {/* الشبكة */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {playlists.map((playlist, index) => (
            <div
              key={index}
              className="bg-card rounded-xl shadow-md border border-border hover:shadow-xl transition-all hover:border-primary/30 group overflow-hidden"
            >
              {/* الصورة */}
              <div className={`relative aspect-video bg-gradient-to-br ${playlist.thumbnail} flex items-center justify-center`}>
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10 flex flex-col items-center gap-2">
                  <List className="w-12 h-12 text-primary/80" strokeWidth={1.5} />
                  <div className="px-4 py-2 bg-black/60 text-white rounded-lg text-sm font-medium">
                    {playlist.videosCount} فيديو
                  </div>
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="w-16 h-16 bg-primary/90 rounded-full flex items-center justify-center">
                    <Play className="w-8 h-8 text-primary-foreground mr-1" fill="currentColor" />
                  </div>
                </div>
              </div>

              {/* المحتوى */}
              <div className="p-5">
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors leading-relaxed">
                  {playlist.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {playlist.description}
                </p>

                {/* المعلومات */}
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/50 mb-4">
                  <span>{playlist.totalDuration}</span>
                  <span>{playlist.views} مشاهدة</span>
                </div>

                {/* زر التشغيل */}
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all shadow-sm font-medium">
                  <Play className="w-4 h-4" />
                  <span>تشغيل القائمة</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
