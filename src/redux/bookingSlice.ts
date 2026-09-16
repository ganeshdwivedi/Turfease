import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Court, LocationType } from "../Types/Court";
import type { Dayjs } from "dayjs";

export interface InitiatePaymentResponse {

    order: {
      id: string;
      amount: number;
      amount_due: number;
      amount_paid: number;
      currency: string;
      status: string;
    };

    totalAmount: number;

    court: {
      id: string;
      name: string;
      address: string;

      location: {
        state?: string;
        city?: string;
        postal_code?: string;
        latitude?: string | number;
        longitude?: string | number;
      };

      pricePerHour: number;
    };

    booking: {
      date: string;
      startTime: string;
      endTime: string;
    };
  };


interface BookingState {
  isOpen: boolean;
  data: InitiatePaymentResponse | null;
}

const initialState: BookingState = {
  isOpen: false,
  data: null,
};
export const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    openBookingModal: (state, action: PayloadAction<InitiatePaymentResponse>) => {
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
