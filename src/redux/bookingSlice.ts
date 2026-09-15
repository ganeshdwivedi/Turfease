import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Court, LocationType } from "../Types/Court";
import type { Dayjs } from "dayjs";

export interface IPaymentInitResponse {
  court?: {
    id: string;
    pricePerHour: number;
    name: string;
    address: string;
    location: LocationType;
  };
  booking?: {
    date: string; // ISO date string, e.g., "2025-10-11"
    startTime: string; // "HH:mm:ss"
    endTime: string; // "HH:mm:ss"
    duration: number; // in hours
  };
  pricing?: {
    basePrice: number; // price before discount
    discount: number; // discount amount applied
    totalAmount: number; // final payable amount
  };
}

interface BookingState {
  isOpen: boolean;
  data: IPaymentInitResponse | null; // grouped booking data for cleaner access
}

const initialState: BookingState = {
  isOpen: false,
  data: null,
};
export const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    openBookingModal: (state, action: PayloadAction<IPaymentInitResponse>) => {
      state.isOpen = true;
      state.data = action.payload;
    },
    closeBookingModal: (state) => {
      state.isOpen = false;
      state.data = null;
    },
  },
});

export const { closeBookingModal, openBookingModal } = bookingSlice.actions;
export default bookingSlice.reducer;
