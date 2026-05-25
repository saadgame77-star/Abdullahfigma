import { ContentCard } from './ContentCard';

export function LatestContent() {
  const latestItems = [
    {
      title: 'شرح كتاب التوحيد - الدرس الخامس عشر',
      description: 'شرح باب ما جاء في الرقى والتمائم من كتاب التوحيد للإمام محمد بن عبد الوهاب رحمه الله',
      type: 'درس' as const,
      date: '١٤٤٦/٥/١٥',
      duration: '٤٥ دقيقة',
      views: '١٢٠٠',
      category: 'العقيدة'
    },
    {
      title: 'خطبة: التوكل على الله وأثره في حياة المسلم',
      description: 'خطبة جمعة تتناول معنى التوكل على الله وثمراته في الدنيا والآخرة',
      type: 'خطبة' as const,
      date: '١٤٤٦/٥/١٢',
      duration: '٣٥ دقيقة',
      views: '٢٣٠٠',
      category: 'الإيمان والتوحيد'
    },
    {
      title: 'حكم الاحتفال بالمولد النبوي',
      description: 'مقال يوضح الحكم الشرعي للاحتفال بالمولد النبوي مع الأدلة من الكتاب والسنة',
      type: 'مقال' as const,
      date: '١٤٤٦/٥/٨',
      category: 'البدع والمحدثات'
    },
    {
      title: 'التعليق على صحيح البخاري - المجلس السابع',
      description: 'تعليقات وفوائد على كتاب الإيمان من صحيح الإمام البخاري رحمه الله',
      type: 'درس' as const,
      date: '١٤٤٦/٥/٥',
      duration: '٥٢ دقيقة',
      views: '٨٥٠',
      category: 'الحديث'
    },
    {
      title: 'الفرق بين الرؤيا الصالحة والحلم',
      description: 'فتوى تفصيلية توضح الفرق بين الرؤيا الصالحة والحلم وما يتعلق بذلك من أحكام',
      type: 'فتوى' as const,
      date: '١٤٤٦/٥/٣',
      category: 'الفقه العام'
    },
    {
      title: 'آداب طالب العلم',
      description: 'محاضرة تبين الآداب التي ينبغي لطالب العلم التحلي بها في طلبه للعلم الشرعي',
      type: 'مرئي' as const,
      date: '١٤٤٦/٤/٢٨',
      duration: '٦٢ دقيقة',
      views: '٣٤٠٠',
      category: 'طلب العلم'
    }
  ];

  return (
    <section id="latest" className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* العنوان */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-3">آخر الإضافات</h2>
          <p className="text-muted-foreground">أحدث المواد العلمية المضافة للموقع</p>
        </div>

        {/* البطاقات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestItems.map((item, index) => (
            <ContentCard key={index} {...item} />
          ))}
        </div>

        {/* زر عرض المزيد */}
        <div className="text-center mt-10">
          <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all shadow-md hover:shadow-lg font-medium">
            عرض جميع الإضافات
          </button>
        </div>
      </div>
    </section>
  );
}
