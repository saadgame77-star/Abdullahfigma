export type TrustLevel = "عالٍ" | "متوسط";
export type PublishStatus = "منشور" | "مخفي" | "مسودة";

export type ShortDisplayMode = "landscape" | "portrait" | "square";
export type ShortCropMode = "contain" | "fill";

export type ShortClip = {
  id: number;
  title: string;
  channel: string;
  duration: string;
  durationSeconds: number;
  category: string;
  knowledgeArea: string;
  subCategory: string;
  videoId: string;
  url: string;
  trust: TrustLevel;
  publishStatus: PublishStatus;
  tags: string[];
  displayOrder: number;
  description: string;

  /**
   * اختياري:
   * إذا لم يُحدّد، فالنظام يعرض المقطع كفيديو أفقي 16:9.
   * لاحقًا في لوحة التحكم يمكن اختيار:
   * landscape = أفقي
   * portrait = عمودي
   * square = مربع
   */
  displayMode?: ShortDisplayMode;

  /**
   * اختياري:
   * contain = إظهار كامل الفيديو كما هو
   * fill = ملء الإطار وتقليل الحدود السوداء
   */
  cropMode?: ShortCropMode;

  /**
   * اختياري:
   * يستخدم لاحقًا للمقاطع التي تحتاج ضبطًا خاصًا.
   * مثال: 1.05 أو 1.12 أو 1.22
   */
  playerScale?: number;

  /**
   * اختياري:
   * يستخدم لنسبة مخصصة مثل:
   * "4 / 5" أو "3 / 4"
   */
  aspectRatio?: string;

  note?: string;
  sourceTitle?: string;
  sourceUrl?: string;
};

export const shortClips: ShortClip[] = [
  {
    id: 1,
    title: "تعليم الناس بالتلطف واللين",
    channel: "إبراهيم بن عبدالله الشرافي",
    duration: "02:42",
    durationSeconds: 162,
    category: "آداب وأخلاق",
    knowledgeArea: "الرقائق والآداب",
    subCategory: "حسن التعامل",
    videoId: "nDgdrFm6Pg0",
    url: "https://www.youtube.com/watch?v=nDgdrFm6Pg0",
    trust: "عالٍ",
    publishStatus: "منشور",
    tags: ["التلطف", "اللين", "الدعوة", "آداب", "أخلاق"],
    displayOrder: 1,
    description: "فائدة مختصرة في أهمية الرفق واللين عند تعليم الناس وتوجيههم.",
  },
  {
    id: 2,
    title: "مفهوم خاطئ عند بعض الناس في كتابة الوصية",
    channel: "إبراهيم بن عبدالله الشرافي",
    duration: "01:37",
    durationSeconds: 97,
    category: "فقه وآداب",
    knowledgeArea: "الفقه",
    subCategory: "الوصايا",
    videoId: "mA9374Uljw8",
    url: "https://www.youtube.com/watch?v=mA9374Uljw8",
    trust: "عالٍ",
    publishStatus: "منشور",
    tags: ["الوصية", "فقه", "تنبيه", "حقوق", "آداب"],
    displayOrder: 2,
    description: "تنبيه مختصر إلى خطأ شائع في فهم كتابة الوصية وما يتعلق بها.",
  },
  {
    id: 3,
    title: "عدم التعنت والتكبر وقبول الحق ممن جاء به",
    channel: "إبراهيم بن عبدالله الشرافي",
    duration: "00:47",
    durationSeconds: 47,
    category: "آداب وأخلاق",
    knowledgeArea: "الرقائق والآداب",
    subCategory: "قبول الحق",
    videoId: "Wmo931Fe2-w",
    url: "https://www.youtube.com/watch?v=Wmo931Fe2-w",
    trust: "عالٍ",
    publishStatus: "منشور",
    tags: ["قبول الحق", "التواضع", "الكبر", "آداب", "أخلاق"],
    displayOrder: 3,
    description:
      "فائدة قصيرة في ترك التعنت والكبر، والحث على قبول الحق ممن جاء به.",
  },
  {
    id: 4,
    title: "من ثمار طلب العلم: خشية الله",
    channel: "إبراهيم بن عبدالله الشرافي",
    duration: "00:33",
    durationSeconds: 33,
    category: "آداب العلم",
    knowledgeArea: "آداب العلم والتربية",
    subCategory: "ثمرات العلم",
    videoId: "-hbpphutj0g",
    url: "https://www.youtube.com/watch?v=-hbpphutj0g",
    trust: "عالٍ",
    publishStatus: "منشور",
    tags: ["طلب العلم", "خشية الله", "ثمرات العلم", "آداب العلم"],
    displayOrder: 4,
    description: "فائدة موجزة في أن من أعظم ثمار العلم خشية الله تعالى.",
  },
  {
    id: 5,
    title: "لا تمن على الناس",
    channel: "إبراهيم بن عبدالله الشرافي",
    duration: "00:43",
    durationSeconds: 43,
    category: "آداب وأخلاق",
    knowledgeArea: "الرقائق والآداب",
    subCategory: "تهذيب النفس",
    videoId: "vXsPrUIinF8",
    url: "https://www.youtube.com/watch?v=vXsPrUIinF8",
    trust: "عالٍ",
    publishStatus: "منشور",
    tags: ["المن", "الإحسان", "تهذيب النفس", "أخلاق"],
    displayOrder: 5,
    description:
      "توجيه مختصر في ترك المن على الناس وحفظ العمل من الأذى والرياء.",
  },
  {
    id: 6,
    title: "تفسير قوله تعالى: فمنهم شقي وسعيد",
    channel: "إبراهيم بن عبدالله الشرافي",
    duration: "02:59",
    durationSeconds: 179,
    category: "تفسير وفوائد",
    knowledgeArea: "التفسير وعلوم القرآن",
    subCategory: "فوائد تفسيرية",
    videoId: "oO8jyYikty4",
    url: "https://www.youtube.com/watch?v=oO8jyYikty4",
    trust: "عالٍ",
    publishStatus: "منشور",
    tags: ["تفسير", "فوائد قرآنية", "شقي وسعيد", "القرآن"],
    displayOrder: 6,
    description: "فائدة تفسيرية مختصرة حول قوله تعالى: فمنهم شقي وسعيد.",
  },
  {
    id: 7,
    title: "حسن الخلق",
    channel: "إبراهيم بن عبدالله الشرافي",
    duration: "01:46",
    durationSeconds: 106,
    category: "آداب وأخلاق",
    knowledgeArea: "الرقائق والآداب",
    subCategory: "حسن الخلق",
    videoId: "ySwFY7usx58",
    url: "https://www.youtube.com/watch?v=ySwFY7usx58",
    trust: "عالٍ",
    publishStatus: "منشور",
    tags: ["حسن الخلق", "آداب", "أخلاق", "تزكية"],
    displayOrder: 7,
    description: "مقطع قصير في فضل حسن الخلق وأثره في تعامل المسلم مع الناس.",
  },
  {
    id: 8,
    title: "تسوية الصفوف",
    channel: "إبراهيم بن عبدالله الشرافي",
    duration: "01:34",
    durationSeconds: 94,
    category: "فقه وآداب",
    knowledgeArea: "الفقه",
    subCategory: "فقه الصلاة",
    videoId: "biDL-7eXE-Y",
    url: "https://www.youtube.com/watch?v=biDL-7eXE-Y",
    trust: "عالٍ",
    publishStatus: "منشور",
    tags: ["الصلاة", "تسوية الصفوف", "فقه الصلاة", "آداب المسجد"],
    displayOrder: 8,
    description: "تنبيه فقهي مختصر في شأن تسوية الصفوف وأهميتها في الصلاة.",
  },
].sort((a, b) => a.displayOrder - b.displayOrder);
