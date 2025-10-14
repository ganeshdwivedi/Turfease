import type { CourtAdminView } from "./Court";

export interface AdminTypes {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone_number: number;
  profile: string;
  status?: string;
}

export interface IGetAdmin {
  _id: string;
  name: string;
  email: string;
  profile: string;
  phone_number: string | null;
  turf: CourtAdminView[];
  status: string;
}

export interface ISidebarItem {
  key: string;
  path: string;
  icon: React.ReactNode;
  label: string;
}
