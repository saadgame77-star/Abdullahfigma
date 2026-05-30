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

export const scheduleItems: ScheduleItem[] = [
  {
    id: 1,
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
    displayOrder: 1,
    description:
      "موعد تجريبي لدرس أسبوعي، لا يظهر في الصفحة العامة لأنه محفوظ كمسودة إلى حين اعتماد بيانات الجدول النهائية.",
    note: "بيانات تجريبية إلى حين إضافة الجدول الرسمي.",
  },
].sort((a, b) => a.displayOrder - b.displayOrder);
