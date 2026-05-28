export type TrustLevel = "عالٍ" | "متوسط";
export type CompletionStatus = "مكتملة" | "غير مكتملة";

export type ScientificSeries = {
  id: number;
  title: string;
  channel: string;
  count: string;
  category: string;
  section: string;
  playlistId: string;
  url: string;
  trust: TrustLevel;
  status: CompletionStatus;
  note?: string;
};

export const scientificSeries: ScientificSeries[] = [
  {
    id: 1,
    title: "التعليق على الملخص الفقهي من كتاب القضاء",
    channel: "إبراهيم بن عبدالله الشرافي",
    count: "2 فيديو",
    category: "فقه / القضاء",
    section: "الشروح العلمية",
    playlistId: "PL28xdVEzaSCAH7OP2ObngNoUpJ1Mxl_eq",
    url: "https://www.youtube.com/playlist?list=PL28xdVEzaSCAH7OP2ObngNoUpJ1Mxl_eq",
    trust: "عالٍ",
    status: "مكتملة",
  },
  {
    id: 2,
    title: "التعليق على تفسير البغوي",
    channel: "إبراهيم بن عبدالله الشرافي",
    count: "غير محدد",
    category: "تفسير",
    section: "الشروح العلمية / التفسير",
    playlistId: "PL28xdVEzaSCA1wsUQ4uLmPWFZ7k-9cSrU",
    url: "https://m.youtube.com/playlist?list=PL28xdVEzaSCA1wsUQ4uLmPWFZ7k-9cSrU",
    trust: "عالٍ",
    status: "غير مكتملة",
    note: "ظهرت منها مقاطع في سورة يوسف.",
  },
  {
    id: 3,
    title: "شرح المحرر",
    channel: "قناة السنة الدعوية / الشيخ محمد بن مبارك الشرافي",
    count: "8 فيديو في نتيجة القائمة",
    category: "حديث",
    section: "الشروح العلمية / الحديث",
    playlistId: "PL_Q00zrSooq8waFXBQdY8NC-ov2bqlLTa",
    url: "https://m.youtube.com/playlist?list=PL_Q00zrSooq8waFXBQdY8NC-ov2bqlLTa",
    trust: "عالٍ",
    status: "غير مكتملة",
    note: "قد توجد حلقات أخرى منفردة خارج القائمة.",
  },
  {
    id: 4,
    title: "الشرح المختصر لكتاب عمدة الأحكام / الشيخ عبدالله الغلفيص",
    channel: "الشيخ محمد بن مبارك الشرافي",
    count: "غير محدد",
    category: "حديث / فقه",
    section: "الشروح العلمية / الحديث",
    playlistId: "PLWQYsha9_xM7Tja50Ohk1Frso9JDOK8fa",
    url: "https://www.youtube.com/playlist?list=PLWQYsha9_xM7Tja50Ohk1Frso9JDOK8fa",
    trust: "عالٍ",
    status: "غير مكتملة",
  },
  {
    id: 5,
    title: "التعليق على المنظومة الميمية للحافظ بن أحمد حكمي",
    channel: "عبدالله بن سعد آل غلفيص / الشيخ محمد الشرافي",
    count: "غير محدد",
    category: "آداب العلم / وصايا",
    section: "الشروح العلمية",
    playlistId: "PLGMk6zGE-urWamKf-gWF7nBAxa6EGe4Lx",
    url: "https://www.youtube.com/playlist?list=PLGMk6zGE-urWamKf-gWF7nBAxa6EGe4Lx",
    trust: "عالٍ",
    status: "غير مكتملة",
  },
  {
    id: 6,
    title: "التعليق على كتاب العلم",
    channel: "عبدالله بن سعد آل غلفيص",
    count: "7 فيديو",
    category: "آداب طلب العلم",
    section: "الشروح العلمية",
    playlistId: "PLGMk6zGE-urWquDwXCELU_mdcJEgn2MoK",
    url: "https://www.youtube.com/playlist?list=PLGMk6zGE-urWquDwXCELU_mdcJEgn2MoK",
    trust: "عالٍ",
    status: "مكتملة",
  },
  {
    id: 7,
    title: "التعليق على تفسير البغوي",
    channel: "عبدالله بن سعد آل غلفيص",
    count: "15 فيديو",
    category: "تفسير",
    section: "الشروح العلمية / التفسير",
    playlistId: "PLGMk6zGE-urVbxaRdViZaKhRvbNNLKGGa",
    url: "https://www.youtube.com/playlist?list=PLGMk6zGE-urVbxaRdViZaKhRvbNNLKGGa",
    trust: "عالٍ",
    status: "غير مكتملة",
  },
];
