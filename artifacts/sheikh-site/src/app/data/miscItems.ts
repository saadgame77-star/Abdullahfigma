export type PublishStatus = "منشور" | "مخفي" | "مسودة";
export type TrustLevel = "عالٍ" | "متوسط";

export type MiscItemKind =
  | "تلاوة"
  | "خطبة"
  | "كتاب إلكتروني"
  | "مقال"
  | "صوتية"
  | "مرئية"
  | "ملف";

export type MiscItemSection = {
  id: number;
  title: string;
  slug: string;
  description: string;
  icon: "mic" | "book" | "file" | "video" | "audio";
  publishStatus: PublishStatus;
  displayOrder: number;
};

export type MiscItem = {
  id: number;
  title: string;
  kind: MiscItemKind;
  sectionSlug: string;
  category: string;
  knowledgeArea?: string;
  subCategory?: string;
  duration?: string;
  dateHijri?: string;
  dateGregorian?: string;
  audioUrl?: string;
  videoId?: string;
  fileUrl?: string;
  externalUrl?: string;
  thumbnailUrl?: string;
  downloadLabel?: string;
  trust: TrustLevel;
  publishStatus: PublishStatus;
  tags: string[];
  displayOrder: number;
  description: string;
  note?: string;
};

export const miscSections: MiscItemSection[] = [
  {
    id: 1,
    title: "التلاوات",
    slug: "recitations",
    description: "تلاوات قرآنية مختارة من الصلوات والمناسبات.",
    icon: "mic",
    publishStatus: "منشور",
    displayOrder: 1,
  },
  {
    id: 2,
    title: "الخطب",
    slug: "khutbahs",
    description: "خطب ودروس عامة قابلة للإضافة لاحقًا.",
    icon: "audio",
    publishStatus: "منشور",
    displayOrder: 2,
  },
  {
    id: 3,
    title: "الكتب الإلكترونية",
    slug: "ebooks",
    description: "كتب وملفات إلكترونية قابلة للتحميل أو القراءة.",
    icon: "book",
    publishStatus: "منشور",
    displayOrder: 3,
  },
  {
    id: 4,
    title: "ملفات ومواد أخرى",
    slug: "files",
    description: "مواد متفرقة يمكن تصنيفها وإدارتها لاحقًا.",
    icon: "file",
    publishStatus: "منشور",
    displayOrder: 4,
  },
].sort((a, b) => a.displayOrder - b.displayOrder);

export const miscItems: MiscItem[] = [
  {
    id: 1,
    title: "سورة الفاتحة",
    kind: "تلاوة",
    sectionSlug: "recitations",
    category: "تراويح",
    knowledgeArea: "القرآن الكريم",
    subCategory: "تلاوات الصلاة",
    duration: "01:20",
    audioUrl: "",
    fileUrl: "",
    trust: "عالٍ",
    publishStatus: "مسودة",
    tags: ["تلاوة", "الفاتحة", "تراويح"],
    displayOrder: 1,
    description:
      "تلاوة تجريبية من صلوات التراويح. لا تظهر للزائر حتى تُنشر من لوحة التحكم لاحقًا.",
  },
  {
    id: 2,
    title: "سورة البقرة - مقطع",
    kind: "تلاوة",
    sectionSlug: "recitations",
    category: "تراويح",
    knowledgeArea: "القرآن الكريم",
    subCategory: "تلاوات الصلاة",
    duration: "15:45",
    audioUrl: "",
    fileUrl: "",
    trust: "عالٍ",
    publishStatus: "مسودة",
    tags: ["تلاوة", "البقرة", "تراويح"],
    displayOrder: 2,
    description:
      "مادة تجريبية قابلة للاستبدال بالتلاوة المعتمدة عند توفر رابط الصوت أو الملف.",
  },
].sort((a, b) => a.displayOrder - b.displayOrder);
