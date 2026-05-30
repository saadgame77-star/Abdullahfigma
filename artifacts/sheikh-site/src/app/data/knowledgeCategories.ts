export type KnowledgeCategory = {
  id: string;
  name: string;
  children: string[];
};

export const knowledgeCategories: KnowledgeCategory[] = [
  {
    id: "tafsir",
    name: "التفسير وعلوم القرآن",
    children: ["تفسير القرآن", "شروح كتب التفسير", "فوائد تفسيرية"],
  },
  {
    id: "hadith",
    name: "الحديث وعلومه",
    children: ["شروح كتب الحديث", "أحاديث الأحكام", "مصطلح الحديث"],
  },
  {
    id: "fiqh",
    name: "الفقه",
    children: ["العبادات", "المعاملات", "الأسرة", "القضاء"],
  },
  {
    id: "aqidah",
    name: "العقيدة",
    children: ["التوحيد", "الإيمان", "الردود العلمية"],
  },
  {
    id: "adab",
    name: "آداب العلم والتربية",
    children: ["طلب العلم", "آداب المتعلم", "الوصايا"],
  },
  {
    id: "raqaiq",
    name: "الرقائق والآداب",
    children: ["المواعظ", "حسن الخلق", "تزكية النفس"],
  },
];
