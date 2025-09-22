import type { Customer } from "./Customer";
import type { Payment } from "./Payment";

interface court {
  _id: string;
  courtName: string;
}

interface payment {
  Paymentstatus: string;
  discount: number;
  remainingAmount: number;
  totalAmount: number;
}

export interface user {
  name: string;
  email: string;
  _id: string;
}

export interface Booking {
  IsApproved: boolean;
  bookingDate: Date;
  endTime: string;
  isCanceled: boolean;
  startTime: string;
  customer: Customer;
  payment: payment;
  court: court;
  sport: string;
  _id: string;
}

export interface ICreateBooking {
  sport: string;
  customer: string;
  court: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  payment: Payment;
  isCanceled?: boolean;
  IsApproved?: boolean;
}
