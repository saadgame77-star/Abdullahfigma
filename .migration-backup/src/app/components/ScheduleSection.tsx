import { Calendar, Clock, MapPin } from 'lucide-react';

export function ScheduleSection() {
  const schedule = [
    {
      day: 'الأحد',
      lessons: [
        { title: 'شرح كتاب التوحيد', time: 'بعد صلاة المغرب', location: 'المسجد الكبير' },
        { title: 'شرح صحيح البخاري', time: 'بعد صلاة العشاء', location: 'المسجد الكبير' },
      ]
    },
    {
      day: 'الاثنين',
      lessons: [
        { title: 'شرح العقيدة الواسطية', time: 'بعد صلاة المغرب', location: 'المسجد الكبير' },
      ]
    },
    {
      day: 'الثلاثاء',
      lessons: [
        { title: 'شرح بلوغ المرام', time: 'بعد صلاة المغرب', location: 'المسجد الكبير' },
        { title: 'التفسير الميسر', time: 'بعد صلاة العشاء', location: 'المسجد الكبير' },
      ]
    },
    {
      day: 'الأربعاء',
      lessons: [
        { title: 'شرح الأربعين النووية', time: 'بعد صلاة المغرب', location: 'المسجد الكبير' },
      ]
    },
    {
      day: 'الخميس',
      lessons: [
        { title: 'فقه الصلاة', time: 'بعد صلاة المغرب', location: 'المسجد الكبير' },
        { title: 'آداب طالب العلم', time: 'بعد صلاة العشاء', location: 'المسجد الكبير' },
      ]
    },
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* العنوان */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-3">جدول الدروس</h2>
          <p className="text-muted-foreground">المواعيد الأسبوعية للدروس والمحاضرات العلمية</p>
        </div>

        {/* الجدول */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {schedule.map((day, index) => (
            <div
              key={index}
              className="bg-card rounded-xl shadow-sm border border-border overflow-hidden hover:shadow-md transition-all"
            >
              {/* اليوم */}
              <div className="bg-primary/10 px-6 py-4 border-b border-border flex items-center gap-3">
                <Calendar className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-primary">{day.day}</h3>
              </div>

              {/* الدروس */}
              <div className="p-6 space-y-4">
                {day.lessons.map((lesson, lessonIndex) => (
                  <div
                    key={lessonIndex}
                    className="pb-4 border-b border-border last:border-0 last:pb-0"
                  >
                    <h4 className="font-semibold text-foreground mb-3 leading-relaxed">
                      {lesson.title}
                    </h4>
                    <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{lesson.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{lesson.location}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ملاحظة */}
        <div className="mt-8 p-6 bg-accent/10 border border-accent/30 rounded-xl text-center">
          <p className="text-sm text-foreground/80 leading-relaxed">
            <span className="font-semibold text-primary">ملاحظة:</span> للاستفسار عن المواعيد أو أي تغييرات، يرجى التواصل عبر قنوات التواصل الرسمية
          </p>
        </div>
      </div>
    </section>
  );
}
