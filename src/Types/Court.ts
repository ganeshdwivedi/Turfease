export interface workingHours {
  start: string;
  end: string;
}

enum CourtStatus {
  AVAILABLE = "Available",
  UNAVAILABLE = "Unavailable",
  MAINTENANCE = "Maintenance",
}

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
  profile_url: string;
  other_img: string[];
  other_url: string[];
  status: CourtStatus;
}

export interface Court {
  courtName: string;
  _id: string;
  address: string;
  location: { city: string; state: string };
  ownedBy: string;
  pricePerHour: string;
  sportsAvailable: string[];
  workingHours: workingHours;
  profile_img: string;
  status: CourtStatus;
}
