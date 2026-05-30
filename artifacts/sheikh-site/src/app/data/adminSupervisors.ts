import type { PermissionKey } from "./adminPermissions";

export type Supervisor = {
  id: number;
  name: string;
  email: string;
  permissions: PermissionKey[];
  status: "نشط" | "موقوف";
};

export const adminSupervisors: Supervisor[] = [
  {
    id: 1,
    name: "المشرف العام",
    email: "admin@example.com",
    status: "نشط",
    permissions: [
      "manageSeries",
      "manageShorts",
      "manageLectures",
      "manageWords",
      "manageSchedule",
      "manageKnowledge",
      "manageTags",
      "publishContent",
      "hideContent",
      "deleteContent",
      "manageSupervisors",
      "editSettings",
    ],
  },
  {
    id: 2,
    name: "مشرف إدخال المحتوى",
    email: "content@example.com",
    status: "نشط",
    permissions: ["manageSeries", "manageShorts", "manageTags"],
  },
];
