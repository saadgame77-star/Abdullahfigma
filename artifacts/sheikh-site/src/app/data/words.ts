export type TrustLevel = "عالٍ" | "متوسط";
export type PublishStatus = "منشور" | "مخفي" | "مسودة";

export type WordItem = {
  id: number;
  title: string;
  wordType: "كلمة توجيهية" | "موعظة" | "توجيه" | "فائدة دعوية";
  knowledgeArea: string;
  subCategory: string;
  category: string;
  duration: string;
  durationSeconds?: number;
  dateHijri?: string;
  dateGregorian?: string;
  channel: string;
  videoId?: string;
  url: string;
  trust: TrustLevel;
  publishStatus: PublishStatus;
  tags: string[];
  displayOrder: number;
  description: string;
  note?: string;
};

const wordItems: WordItem[] = [
  {
    id: 1,
    title: "كلمة توجيهية بعد صلاة العصر بعنوان: فضل الذكر",
    wordType: "كلمة توجيهية",
    knowledgeArea: "الرقائق والآداب",
    subCategory: "المواعظ",
    category: "الذكر والدعاء",
    duration: "15:20",
    durationSeconds: 920,
    dateHijri: "1445/09/10",
    channel: "غير محدد",
    url: "#",
    trust: "متوسط",
    publishStatus: "مسودة",
    tags: ["الذكر", "الدعاء", "موعظة", "كلمة توجيهية", "تزكية"],
    displayOrder: 1,
    description:
      "كلمة دعوية موجزة في فضل الذكر وأثره على القلب، مناسبة للإلقاء بعد الصلوات أو في اللقاءات العامة.",
    note: "بيانات تجريبية إلى حين إضافة الرابط والمصدر النهائي.",
  },
];

export const words: WordItem[] = [...wordItems].sort(
  (a, b) => a.displayOrder - b.displayOrder,
);