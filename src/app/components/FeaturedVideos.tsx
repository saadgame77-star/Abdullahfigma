import { VideoCard } from './VideoCard';

export function FeaturedVideos() {
  const featuredVideo = {
    title: 'شرح كتاب التوحيد - السلسلة الكاملة',
    description: 'سلسلة شرح مفصل لكتاب التوحيد للإمام محمد بن عبد الوهاب رحمه الله، تتناول أبواب التوحيد وما يضاده من الشرك والبدع',
    thumbnail: '',
    duration: '١٢:٣٤:٥٦',
    views: '٨٥,٠٠٠',
    date: '١٤٤٦/٥/١٥',
    category: 'العقيدة والتوحيد',
    likes: '٣,٢٠٠',
    featured: true
  };

  const videos = [
    {
      title: 'خطبة: التوكل على الله وأثره في حياة المسلم',
      description: 'خطبة جمعة مؤثرة تتناول معنى التوكل وثمراته',
      thumbnail: '',
      duration: '٣٥:٢٢',
      views: '٤٢,٥٠٠',
      date: '١٤٤٦/٥/١٢',
      category: 'خطب الجمعة',
      likes: '١,٨٠٠'
    },
    {
      title: 'آداب طالب العلم - محاضرة تربوية',
      description: 'محاضرة شاملة عن الآداب التي ينبغي لطالب العلم',
      thumbnail: '',
      duration: '٥٢:١٨',
      views: '٣٨,٢٠٠',
      date: '١٤٤٦/٥/٨',
      category: 'طلب العلم',
      likes: '١,٥٠٠'
    },
    {
      title: 'شرح العقيدة الواسطية - الدرس الأول',
      description: 'بداية شرح متن العقيدة الواسطية لشيخ الإسلام',
      thumbnail: '',
      duration: '٤٨:٣٥',
      views: '٥٦,٨٠٠',
      date: '١٤٤٦/٥/٥',
      category: 'العقيدة',
      likes: '٢,٤٠٠'
    },
    {
      title: 'أحكام الصلاة - سلسلة فقهية',
      description: 'شرح مفصل لأحكام الصلاة من الطهارة إلى السلام',
      thumbnail: '',
      duration: '٤٢:١٢',
      views: '٦٧,٣٠٠',
      date: '١٤٤٦/٥/٣',
      category: 'الفقه',
      likes: '٢,٩٠٠'
    },
    {
      title: 'تفسير سورة البقرة - الآيات ١-١٠',
      description: 'تفسير ميسر لأوائل سورة البقرة مع الفوائد',
      thumbnail: '',
      duration: '٥٥:٤٥',
      views: '٤٥,٦٠٠',
      date: '١٤٤٦/٤/٢٨',
      category: 'التفسير',
      likes: '٢,١٠٠'
    }
  ];

  return (
    <section id="videos" className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* العنوان */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-3">المقاطع المميزة</h2>
          <p className="text-muted-foreground">أبرز المحاضرات والدروس المرئية</p>
        </div>

        {/* الشبكة */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* الفيديو المميز - يأخذ مساحة أكبر */}
          <VideoCard {...featuredVideo} />

          {/* باقي الفيديوهات */}
          {videos.map((video, index) => (
            <VideoCard key={index} {...video} />
          ))}
        </div>

        {/* زر عرض المزيد */}
        <div className="text-center mt-10">
          <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all shadow-md hover:shadow-lg font-medium">
            عرض جميع المرئيات (٤٥٠+ فيديو)
          </button>
        </div>
      </div>
    </section>
  );
}
