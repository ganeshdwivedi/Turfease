export interface workingHours {
  start: string;
  end: string;
}

export const CourtStatus = {
  AVAILABLE: "Available",
  UNAVAILABLE: "Unavailable",
  MAINTENANCE: "Maintenance",
} as const;

export type CourtStatus = (typeof CourtStatus)[keyof typeof CourtStatus];

export interface ICourt {
  _id?: string;
  courtName: string;
  contactNumber: string;
  address: string;
  location: { state: string; city: string };
  ownedBy: string;
  pricePerHour: string;
  sportsAvailable: string[];
  workingHours: { start: string; end: string };
  profile_img: string;
  profile_url: any;
  other_img: string[];
  other_url: any[];
  status: CourtStatus;
}

export interface Court {
  courtName: string;
  contactNumber: string;
  _id: string;
  address: string;
  location: { city: string; state: string };
  ownedBy: string;
  pricePerHour: string;
  other_img: string[];
  sportsAvailable: string[];
  workingHours: workingHours;
  profile_img: string;
  status: CourtStatus;
}

export interface CourtAdminView {
  _id: string;
  courtName: string;
  address: string;
  location: Location;
  contactNumber: string;
  profile_img: string;
  pricePerHour: number;
  sportsAvailable: string[];
  workingHours: { start: string; end: string };
}
