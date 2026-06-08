export type TrustLevel = "عالٍ" | "متوسط";
export type PublishStatus = "منشور" | "مخفي" | "مسودة";

export type Lecture = {
  id: number;
  title: string;
  lectureType: "محاضرة عامة" | "لقاء علمي" | "كلمة مطولة" | "برنامج";
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

const lectureItems: Lecture[] = [
  {
    id: 1,
    title: "كيف نستقبل شهر رمضان المبارك",
    lectureType: "محاضرة عامة",
    knowledgeArea: "الرقائق والآداب",
    subCategory: "المواعظ",
    category: "مواسم الطاعات",
    duration: "1:20:00",
    durationSeconds: 4800,
    dateHijri: "1445/08/25",
    channel: "غير محدد",
    url: "#",
    trust: "متوسط",
    publishStatus: "مسودة",
    tags: ["رمضان", "مواسم الطاعات", "مواعظ", "محاضرة عامة"],
    displayOrder: 1,
    description:
      "محاضرة عامة في التهيئة الإيمانية لاستقبال شهر رمضان، واغتنام موسمه بالطاعة والعمل الصالح.",
    note: "بيانات تجريبية إلى حين إضافة الرابط والمصدر النهائي.",
  },
];

export const lectures: Lecture[] = [...lectureItems].sort(
  (a, b) => a.displayOrder - b.displayOrder,
);
