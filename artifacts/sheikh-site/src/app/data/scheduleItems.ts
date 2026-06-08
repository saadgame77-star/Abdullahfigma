export type PublishStatus = "منشور" | "مخفي" | "مسودة";

export type ScheduleStatus = "قائم" | "متوقف" | "مؤجل" | "ملغي";

export type ScheduleKind = "درس" | "محاضرة" | "برنامج" | "لقاء";

export type RecurrenceType = "غير متكرر" | "أسبوعي" | "شهري" | "مخصص";

export type ScheduleItem = {
  id: number;
  title: string;
  scheduleKind: ScheduleKind;
  knowledgeArea: string;
  subCategory: string;
  day?: string;
  time?: string;
  dateHijri?: string;
  dateGregorian?: string;
  location?: string;
  onlineUrl?: string;
  isRecurring: boolean;
  recurrenceType: RecurrenceType;
  recurrenceDetails?: string;
  status: ScheduleStatus;
  publishStatus: PublishStatus;
  tags: string[];
  displayOrder: number;
  description: string;
  note?: string;
};

const scheduleItemEntries: ScheduleItem[] = [
  {
    id: 1,
    title: "التعليق على تفسير البغوي",
    scheduleKind: "درس",
    knowledgeArea: "التفسير وعلوم القرآن",
    subCategory: "شروح كتب التفسير",
    day: "الأحد",
    time: "بعد صلاة المغرب",
    dateHijri: "",
    dateGregorian: "",
    location: "يحدد لاحقًا",
    onlineUrl: "",
    isRecurring: true,
    recurrenceType: "أسبوعي",
    recurrenceDetails: "يتكرر أسبوعيًا ما لم يعلن عن توقفه أو تأجيله.",
    status: "قائم",
    publishStatus: "منشور",
    tags: ["درس", "تفسير", "البغوي", "جدول", "درس أسبوعي"],
    displayOrder: 1,
    description:
      "درس علمي أسبوعي في التعليق على تفسير البغوي، ويظهر في نافذة النشاط القادم وفي جدول المحاضرات والدروس.",
    note: "موعد منشور مؤقت للتجربة، ويمكن تعديله أو تحويله إلى مسودة بعد اعتماد الجدول النهائي.",
  },
  {
    id: 2,
    title: "درس أسبوعي تجريبي",
    scheduleKind: "درس",
    knowledgeArea: "العقيدة",
    subCategory: "التوحيد",
    day: "الأحد",
    time: "بعد صلاة المغرب",
    dateHijri: "",
    dateGregorian: "",
    location: "يحدد لاحقًا",
    onlineUrl: "",
    isRecurring: true,
    recurrenceType: "أسبوعي",
    recurrenceDetails: "يتكرر أسبوعيًا ما لم يعلن عن توقفه أو تأجيله.",
    status: "قائم",
    publishStatus: "مسودة",
    tags: ["درس", "جدول", "العقيدة", "التوحيد"],
    displayOrder: 2,
    description:
      "موعد تجريبي لدرس أسبوعي، لا يظهر في الصفحة العامة لأنه محفوظ كمسودة إلى حين اعتماد بيانات الجدول النهائية.",
    note: "بيانات تجريبية إلى حين إضافة الجدول الرسمي.",
  },
];

export const scheduleItems: ScheduleItem[] = [...scheduleItemEntries].sort(
  (a, b) => a.displayOrder - b.displayOrder,
);