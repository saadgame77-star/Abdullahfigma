import { Calendar, Clock, Eye, Play, Share2, ThumbsUp } from 'lucide-react';

interface VideoCardProps {
  title: string;
  description?: string;
  thumbnail: string;
  duration: string;
  views: string;
  date: string;
  category?: string;
  likes?: string;
  featured?: boolean;
}

export function VideoCard({
  title,
  description,
  thumbnail,
  duration,
  views,
  date,
  category,
  likes,
  featured = false
}: VideoCardProps) {
  return (
    <div className={`bg-card rounded-xl shadow-md border border-border hover:shadow-xl transition-all hover:border-primary/30 group overflow-hidden ${featured ? 'lg:col-span-2 lg:row-span-2' : ''}`}>
      {/* الصورة المصغرة */}
      <div className="relative overflow-hidden bg-muted aspect-video">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:opacity-90 transition-opacity">
          <div className="w-16 h-16 bg-primary/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
            <Play className="w-8 h-8 text-primary-foreground mr-1" fill="currentColor" />
          </div>
        </div>

        {/* مدة الفيديو */}
        <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/80 text-white text-xs rounded font-medium">
          {duration}
        </div>

        {/* علامة المميز */}
        {featured && (
          <div className="absolute top-3 right-3 px-3 py-1 bg-accent text-accent-foreground text-xs rounded-full font-medium shadow-md">
            مميز
          </div>
        )}
      </div>

      {/* المحتوى */}
      <div className="p-5">
        {/* التصنيف */}
        {category && (
          <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs rounded-lg mb-3 border border-primary/20">
            {category}
          </span>
        )}

        {/* العنوان */}
        <h3 className={`font-semibold text-foreground mb-2 group-hover:text-primary transition-colors leading-relaxed ${featured ? 'text-xl' : 'text-base'} line-clamp-2`}>
          {title}
        </h3>

        {/* الوصف */}
        {description && (
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-2">
            {description}
          </p>
        )}

        {/* الإحصائيات */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-3 border-t border-border/50">
          <div className="flex items-center gap-1.5">
            <Eye className="w-4 h-4" />
            <span>{views}</span>
          </div>
          {likes && (
            <div className="flex items-center gap-1.5">
              <ThumbsUp className="w-4 h-4" />
              <span>{likes}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span>{date}</span>
          </div>
        </div>

        {/* أزرار التفاعل */}
        <div className="flex items-center gap-2 mt-4">
          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all shadow-sm font-medium text-sm">
            <Play className="w-4 h-4" />
            <span>مشاهدة الآن</span>
          </button>
          <button className="p-2.5 bg-muted hover:bg-muted/80 rounded-lg transition-all" aria-label="مشاركة">
            <Share2 className="w-4 h-4 text-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
}
