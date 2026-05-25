import { Award, Clock, ThumbsUp, Users } from 'lucide-react';

export function ChannelStats() {
  const stats = [
    {
      icon: Users,
      value: '٢٥٠,٠٠٠+',
      label: 'مشترك',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      icon: ThumbsUp,
      value: '٥٠,٠٠٠+',
      label: 'إعجاب',
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    },
    {
      icon: Clock,
      value: '١٠,٠٠٠+',
      label: 'ساعة محتوى',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10'
    },
    {
      icon: Award,
      value: '٤.٩/٥',
      label: 'تقييم المستخدمين',
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    }
  ];

  return (
    <section className="py-12 bg-gradient-to-b from-primary/5 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-card rounded-2xl shadow-lg border border-border p-8 sm:p-12">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-3">
              محتوى علمي موثوق يثق به الآلاف
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              انضم إلى مئات الآلاف من طلاب العلم حول العالم في رحلة التعلم الشرعي
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center group"
              >
                <div className={`w-16 h-16 sm:w-20 sm:h-20 ${stat.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <stat.icon className={`w-8 h-8 sm:w-10 sm:h-10 ${stat.color}`} strokeWidth={1.5} />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* زر الاشتراك */}
          <div className="text-center mt-10 pt-8 border-t border-border">
            <button className="px-8 py-4 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-xl hover:shadow-lg transition-all font-medium text-lg flex items-center justify-center gap-2 mx-auto">
              <Users className="w-5 h-5" />
              <span>اشترك في القناة مجاناً</span>
            </button>
            <p className="text-sm text-muted-foreground mt-3">
              احصل على تنبيهات فورية عند نشر محتوى جديد
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
