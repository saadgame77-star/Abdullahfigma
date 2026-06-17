export type PermissionKey =
  | "manageSeries"
  | "manageShorts"
  | "manageLectures"
  | "manageWords"
  | "manageSchedule"
  | "manageMisc"
  | "manageKnowledge"
  | "manageTags"
  | "publishContent"
  | "hideContent"
  | "deleteContent"
  | "manageSupervisors"
  | "editSettings";

export type PermissionGroup = {
  title: string;
  permissions: Array<{
    key: PermissionKey;
    label: string;
  }>;
};

export const permissionGroups: PermissionGroup[] = [
  {
    title: "إدارة المحتوى",
    permissions: [
      { key: "manageSeries", label: "إدارة السلاسل العلمية" },
      { key: "manageShorts", label: "إدارة المقاطع القصيرة" },
      { key: "manageLectures", label: "إدارة المحاضرات" },
      { key: "manageWords", label: "إدارة الكلمات الدعوية" },
      { key: "manageSchedule", label: "إدارة الجدول" },
      { key: "manageMisc", label: "إدارة المتفرقات" },
    ],
  },
  {
    title: "التصنيف والبحث",
    permissions: [
      { key: "manageKnowledge", label: "إدارة أبواب العلم" },
      { key: "manageTags", label: "إدارة الوسوم" },
    ],
  },
  {
    title: "النشر والتحكم",
    permissions: [
      { key: "publishContent", label: "نشر المحتوى" },
      { key: "hideContent", label: "إخفاء المحتوى" },
      { key: "deleteContent", label: "حذف المحتوى" },
    ],
  },
  {
    title: "الإدارة العليا",
    permissions: [
      { key: "manageSupervisors", label: "إدارة المشرفين" },
      { key: "editSettings", label: "تعديل إعدادات الموقع" },
    ],
  },
];

export function getPermissionLabel(permission: PermissionKey) {
  for (const group of permissionGroups) {
    const found = group.permissions.find((item) => item.key === permission);
    if (found) return found.label;
  }

  return permission;
}
