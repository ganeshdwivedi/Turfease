export interface Customer {
  _id: string;
  phone_number: number;
  email: string;
  name: string;
  profile: string;
}

export interface User {
  _id: string;
  phone_number: number;
  email: string;
  name: string;
  profile: string;
  role: string;
}

export interface BECustomerUpdate {
  phone_number?: string;
  email?: string;
  name?: string;
  profile?: string | Blob;
}
