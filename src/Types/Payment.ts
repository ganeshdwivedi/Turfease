export interface Payment {
  totalAmount: number;
  Paymentstatus?: string; // optional if backend adds it later
  remainingAmount?: number; // optional if backend adds it later
  discount?: number; // optional if backend adds it later
}
