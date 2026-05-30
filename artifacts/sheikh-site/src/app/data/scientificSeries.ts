export type TrustLevel = "عالٍ" | "متوسط";
export type CompletionStatus = "مكتملة" | "غير مكتملة";
export type PublishStatus = "منشور" | "مخفي" | "مسودة";

export type ScientificSeries = {
  id: number;
  title: string;
  bookTitle?: string;
  channel: string;
  count: string;
  videoCount?: number;
  category: string;
  knowledgeArea: string;
  subCategory: string;
  section: string;
  playlistId: string;
  url: string;
  trust: TrustLevel;
  status: CompletionStatus;
  statusLabel: "مكتملة" | "قيد الاكتمال";
  publishStatus: PublishStatus;
  tags: string[];
  displayOrder: number;
  description: string;
  note?: string;
};

export const scientificSeries: ScientificSeries[] = [
  {
    id: 1,
    title: "التعليق على الملخص الفقهي من كتاب القضاء",
    bookTitle: "الملخص الفقهي",
    channel: "إبراهيم بن عبدالله الشرافي",
    count: "2 فيديو",
    videoCount: 2,
    category: "فقه / القضاء",
    knowledgeArea: "الفقه",
    subCategory: "القضاء",
    section: "الشروح العلمية",
    playlistId: "PL28xdVEzaSCAH7OP2ObngNoUpJ1Mxl_eq",
    url: "https://www.youtube.com/playlist?list=PL28xdVEzaSCAH7OP2ObngNoUpJ1Mxl_eq",
    trust: "عالٍ",
    status: "مكتملة",
    statusLabel: "مكتملة",
    publishStatus: "منشور",
    tags: ["فقه", "القضاء", "الملخص الفقهي", "شرح كتاب", "سلسلة علمية"],
    displayOrder: 1,
    description:
      "سلسلة علمية في التعليق على باب القضاء من كتاب الملخص الفقهي، ضمن الشروح الفقهية المختصرة.",
  },
  {
    id: 2,
    title: "التعليق على تفسير البغوي",
    bookTitle: "تفسير البغوي",
    channel: "إبراهيم بن عبدالله الشرافي",
    count: "غير محدد",
    category: "تفسير",
    knowledgeArea: "التفسير وعلوم القرآن",
    subCategory: "شروح كتب التفسير",
    section: "الشروح العلمية / التفسير",
    playlistId: "PL28xdVEzaSCA1wsUQ4uLmPWFZ7k-9cSrU",
    url: "https://m.youtube.com/playlist?list=PL28xdVEzaSCA1wsUQ4uLmPWFZ7k-9cSrU",
    trust: "عالٍ",
    status: "غير مكتملة",
    statusLabel: "قيد الاكتمال",
    publishStatus: "منشور",
    tags: ["تفسير", "البغوي", "القرآن", "سورة يوسف", "شرح كتاب"],
    displayOrder: 2,
    description:
      "تعليقات علمية على تفسير البغوي، وتندرج ضمن سلاسل التفسير وعلوم القرآن.",
    note: "ظهرت منها مقاطع في سورة يوسف.",
  },
  {
    id: 3,
    title: "شرح المحرر",
    bookTitle: "المحرر",
    channel: "قناة السنة الدعوية / الشيخ محمد بن مبارك الشرافي",
    count: "8 فيديو في نتيجة القائمة",
    videoCount: 8,
    category: "حديث",
    knowledgeArea: "الحديث وعلومه",
    subCategory: "شروح كتب الحديث",
    section: "الشروح العلمية / الحديث",
    playlistId: "PL_Q00zrSooq8waFXBQdY8NC-ov2bqlLTa",
    url: "https://m.youtube.com/playlist?list=PL_Q00zrSooq8waFXBQdY8NC-ov2bqlLTa",
    trust: "عالٍ",
    status: "غير مكتملة",
    statusLabel: "قيد الاكتمال",
    publishStatus: "منشور",
    tags: ["حديث", "المحرر", "شرح كتاب", "أحاديث الأحكام", "سلسلة علمية"],
    displayOrder: 3,
    description:
      "سلسلة في شرح كتاب المحرر، وتندرج ضمن شروح كتب الحديث وأحاديث الأحكام.",
    note: "قد توجد حلقات أخرى منفردة خارج القائمة.",
  },
  {
    id: 4,
    title: "الشرح المختصر لكتاب عمدة الأحكام / الشيخ عبدالله الغلفيص",
    bookTitle: "عمدة الأحكام",
    channel: "الشيخ محمد بن مبارك الشرافي",
    count: "غير محدد",
    category: "حديث / فقه",
    knowledgeArea: "الحديث وعلومه",
    subCategory: "أحاديث الأحكام",
    section: "الشروح العلمية / الحديث",
    playlistId: "PLWQYsha9_xM7Tja50Ohk1Frso9JDOK8fa",
    url: "https://www.youtube.com/playlist?list=PLWQYsha9_xM7Tja50Ohk1Frso9JDOK8fa",
    trust: "عالٍ",
    status: "غير مكتملة",
    statusLabel: "قيد الاكتمال",
    publishStatus: "منشور",
    tags: ["حديث", "فقه", "عمدة الأحكام", "أحاديث الأحكام", "شرح كتاب"],
    displayOrder: 4,
    description:
      "شرح مختصر لكتاب عمدة الأحكام، يجمع بين جانب الحديث والفقه المستنبط من أحاديث الأحكام.",
  },
  {
    id: 5,
    title: "التعليق على المنظومة الميمية للحافظ بن أحمد حكمي",
    bookTitle: "المنظومة الميمية",
    channel: "عبدالله بن سعد آل غلفيص / الشيخ محمد الشرافي",
    count: "غير محدد",
    category: "آداب العلم / وصايا",
    knowledgeArea: "آداب العلم والتربية",
    subCategory: "آداب طالب العلم",
    section: "الشروح العلمية",
    playlistId: "PLGMk6zGE-urWamKf-gWF7nBAxa6EGe4Lx",
    url: "https://www.youtube.com/playlist?list=PLGMk6zGE-urWamKf-gWF7nBAxa6EGe4Lx",
    trust: "عالٍ",
    status: "غير مكتملة",
    statusLabel: "قيد الاكتمال",
    publishStatus: "منشور",
    tags: [
      "آداب العلم",
      "طلب العلم",
      "المنظومة الميمية",
      "وصايا",
      "شرح منظومة",
    ],
    displayOrder: 5,
    description:
      "تعليق على المنظومة الميمية للحافظ بن أحمد حكمي، وفيها توجيهات وآداب لطالب العلم.",
  },
  {
    id: 6,
    title: "التعليق على كتاب العلم",
    bookTitle: "كتاب العلم",
    channel: "عبدالله بن سعد آل غلفيص",
    count: "7 فيديو",
    videoCount: 7,
    category: "آداب طلب العلم",
    knowledgeArea: "آداب العلم والتربية",
    subCategory: "طلب العلم",
    section: "الشروح العلمية",
    playlistId: "PLGMk6zGE-urWquDwXCELU_mdcJEgn2MoK",
    url: "https://www.youtube.com/playlist?list=PLGMk6zGE-urWquDwXCELU_mdcJEgn2MoK",
    trust: "عالٍ",
    status: "مكتملة",
    statusLabel: "مكتملة",
    publishStatus: "منشور",
    tags: ["العلم", "طلب العلم", "آداب العلم", "شرح كتاب", "سلسلة مكتملة"],
    displayOrder: 6,
    description:
      "سلسلة مكتملة في التعليق على كتاب العلم، تعنى بفضائل العلم وآدابه ومسالك تحصيله.",
  },
  {
    id: 7,
    title: "التعليق على تفسير البغوي",
    bookTitle: "تفسير البغوي",
    channel: "عبدالله بن سعد آل غلفيص",
    count: "15 فيديو",
    videoCount: 15,
    category: "تفسير",
    knowledgeArea: "التفسير وعلوم القرآن",
    subCategory: "شروح كتب التفسير",
    section: "الشروح العلمية / التفسير",
    playlistId: "PLGMk6zGE-urVbxaRdViZaKhRvbNNLKGGa",
    url: "https://www.youtube.com/playlist?list=PLGMk6zGE-urVbxaRdViZaKhRvbNNLKGGa",
    trust: "عالٍ",
    status: "غير مكتملة",
    statusLabel: "قيد الاكتمال",
    publishStatus: "منشور",
    tags: ["تفسير", "البغوي", "القرآن", "شرح كتاب", "سلسلة علمية"],
    displayOrder: 7,
    description:
      "سلسلة في التعليق على تفسير البغوي، وهي من السلاسل العلمية في باب التفسير وعلوم القرآن.",
  },
].sort((a, b) => a.displayOrder - b.displayOrder);
