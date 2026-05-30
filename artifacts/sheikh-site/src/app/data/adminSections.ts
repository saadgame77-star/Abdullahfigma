export type AdminSection =
  | "overview"
  | "series"
  | "shorts"
  | "lectures"
  | "words"
  | "schedule"
  | "knowledge"
  | "tags"
  | "supervisors"
  | "settings";

export type AdminSectionItem = {
  key: AdminSection;
  title: string;
  description: string;
};

export const adminSections: AdminSectionItem[] = [
  {
    key: "overview",
    title: "نظرة عامة",
    description: "ملخص سريع عن محتوى الموقع وحالته.",
  },
  {
    key: "series",
    title: "السلاسل العلمية",
    description: "إدارة السلاسل العلمية المكتملة وقيد الاكتمال.",
  },
  {
    key: "shorts",
    title: "المقاطع القصيرة",
    description: "فوائد مختصرة لا تتجاوز ثلاث دقائق.",
  },
  {
    key: "lectures",
    title: "المحاضرات",
    description: "المحاضرات العامة واللقاءات العلمية.",
  },
  {
    key: "words",
    title: "الكلمات الدعوية",
    description: "الكلمات والمواعظ والتوجيهات العامة.",
  },
  {
    key: "schedule",
    title: "الجدول",
    description: "مواعيد الدروس والمحاضرات والبرامج.",
  },
  {
    key: "knowledge",
    title: "أبواب العلم",
    description: "تصنيفات علمية منهجية قابلة للتعديل.",
  },
  {
    key: "tags",
    title: "الوسوم",
    description: "وسوم تساعد البحث والربط بين المواد.",
  },
  {
    key: "supervisors",
    title: "المشرفون والصلاحيات",
    description: "منح كل مشرف مهام وصلاحيات مخصصة.",
  },
  {
    key: "settings",
    title: "الإعدادات",
    description: "إعدادات الموقع العامة.",
  },
];
