import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CourtState {
  court_id: string;
  courtName: string;
  courtAddress: string;
  courtProfile: string;
  isOpen: boolean;
}

const initialState: CourtState = {
  court_id: "",
  courtName: "",
  courtAddress: "",
  courtProfile: "",
  isOpen: false,
};

export const courtSlice = createSlice({
  name: "court",
  initialState,
  reducers: {
    selectCourt: (state, action: PayloadAction<Omit<CourtState, "isOpen">>) => {
      return { ...state, ...action.payload, isOpen: true };
    },
    openModal: (state) => {
      state.isOpen = true;
    },
    closeModal: (state) => {
      state.isOpen = false;
    },
  },
});

export const { selectCourt, openModal, closeModal } = courtSlice.actions;

export default courtSlice.reducer;
