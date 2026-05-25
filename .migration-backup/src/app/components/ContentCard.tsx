import { BookOpen, Calendar, Clock, Eye } from 'lucide-react';

interface ContentCardProps {
  title: string;
  description?: string;
  type: 'درس' | 'خطبة' | 'مقال' | 'كتاب' | 'فتوى' | 'صوتي' | 'مرئي';
  date?: string;
  duration?: string;
  views?: string;
  category?: string;
}

export function ContentCard({
  title,
  description,
  type,
  date,
  duration,
  views,
  category
}: ContentCardProps) {
  const typeColors: Record<string, string> = {
    'درس': 'bg-primary/10 text-primary border-primary/20',
    'خطبة': 'bg-accent/10 text-accent-foreground border-accent/20',
    'مقال': 'bg-secondary/10 text-secondary-foreground border-secondary/20',
    'كتاب': 'bg-primary/20 text-primary border-primary/30',
    'فتوى': 'bg-muted text-muted-foreground border-border',
    'صوتي': 'bg-accent/5 text-foreground border-accent/10',
    'مرئي': 'bg-primary/5 text-foreground border-primary/10',
  };

  return (
    <div className="bg-card rounded-xl shadow-sm border border-border hover:shadow-md transition-all hover:border-primary/30 group overflow-hidden">
      <div className="p-6">
        {/* النوع والتصنيف */}
        <div className="flex items-center justify-between mb-3">
          <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${typeColors[type]}`}>
            {type}
          </span>
          {category && (
            <span className="text-xs text-muted-foreground">{category}</span>
          )}
        </div>

        {/* العنوان */}
        <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors leading-relaxed">
          {title}
        </h3>

        {/* الوصف */}
        {description && (
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-2">
            {description}
          </p>
        )}

        {/* المعلومات الإضافية */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-3 border-t border-border/50">
          {date && (
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{date}</span>
            </div>
          )}
          {duration && (
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{duration}</span>
            </div>
          )}
          {views && (
            <div className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              <span>{views}</span>
            </div>
          )}
        </div>
      </div>

      {/* شريط سفلي للتفاعل */}
      <div className="px-6 py-3 bg-muted/30 border-t border-border/50">
        <button className="text-sm text-primary hover:text-primary/80 font-medium transition-colors flex items-center gap-2">
          <BookOpen className="w-4 h-4" />
          <span>عرض التفاصيل</span>
        </button>
      </div>
    </div>
  );
}
