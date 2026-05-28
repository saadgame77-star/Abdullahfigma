export type TrustLevel = "عالٍ" | "متوسط";

export type ShortClip = {
  id: number;
  title: string;
  channel: string;
  duration: string;
  category: string;
  videoId: string;
  url: string;
  trust: TrustLevel;
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
    category: "آداب وأخلاق",
    videoId: "nDgdrFm6Pg0",
    url: "https://www.youtube.com/watch?v=nDgdrFm6Pg0",
    trust: "عالٍ",
  },
  {
    id: 2,
    title: "مفهوم خاطئ عند بعض الناس في كتابة الوصية",
    channel: "إبراهيم بن عبدالله الشرافي",
    duration: "01:37",
    category: "فقه وآداب",
    videoId: "mA9374Uljw8",
    url: "https://www.youtube.com/watch?v=mA9374Uljw8",
    trust: "عالٍ",
  },
  {
    id: 3,
    title: "عدم التعنت والتكبر وقبول الحق ممن جاء به",
    channel: "إبراهيم بن عبدالله الشرافي",
    duration: "00:47",
    category: "آداب وأخلاق",
    videoId: "Wmo931Fe2-w",
    url: "https://www.youtube.com/watch?v=Wmo931Fe2-w",
    trust: "عالٍ",
  },
  {
    id: 4,
    title: "من ثمار طلب العلم: خشية الله",
    channel: "إبراهيم بن عبدالله الشرافي",
    duration: "00:33",
    category: "آداب العلم",
    videoId: "-hbpphutj0g",
    url: "https://www.youtube.com/watch?v=-hbpphutj0g",
    trust: "عالٍ",
  },
  {
    id: 5,
    title: "لا تمن على الناس",
    channel: "إبراهيم بن عبدالله الشرافي",
    duration: "00:43",
    category: "آداب وأخلاق",
    videoId: "vXsPrUIinF8",
    url: "https://www.youtube.com/watch?v=vXsPrUIinF8",
    trust: "عالٍ",
  },
  {
    id: 6,
    title: "تفسير قوله تعالى: فمنهم شقي وسعيد",
    channel: "إبراهيم بن عبدالله الشرافي",
    duration: "02:59",
    category: "تفسير وفوائد",
    videoId: "oO8jyYikty4",
    url: "https://www.youtube.com/watch?v=oO8jyYikty4",
    trust: "عالٍ",
  },
  {
    id: 7,
    title: "حسن الخلق",
    channel: "إبراهيم بن عبدالله الشرافي",
    duration: "01:46",
    category: "آداب وأخلاق",
    videoId: "ySwFY7usx58",
    url: "https://www.youtube.com/watch?v=ySwFY7usx58",
    trust: "عالٍ",
  },
  {
    id: 8,
    title: "تسوية الصفوف",
    channel: "إبراهيم بن عبدالله الشرافي",
    duration: "01:34",
    category: "فقه وآداب",
    videoId: "biDL-7eXE-Y",
    url: "https://www.youtube.com/watch?v=biDL-7eXE-Y",
    trust: "عالٍ",
  },
];
