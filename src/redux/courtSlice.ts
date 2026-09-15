import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Court } from "../Types/Court";

// mode -->  update | view | create
interface CourtState {
  court: Court | null;
  isOpen: boolean;
  mode: string;
}

const initialState: CourtState = {
  court: null,
  mode: "view",
  isOpen: false,
};

export const courtSlice = createSlice({
  name: "court",
  initialState,
  reducers: {
    selectCourt: (state, action: PayloadAction<Partial<CourtState>>) => {
      if (action.payload.court !== undefined)
        state.court = action.payload.court;
      if (action.payload.mode !== undefined) state.mode = action.payload.mode;
      state.isOpen = true;
    },
    unSelectCourt: (state, action: PayloadAction<Partial<CourtState>>) => {
      if (action.payload.court !== undefined)
        state.court = action.payload.court;
      if (action.payload.mode !== undefined) state.mode = action.payload.mode;
      state.isOpen = false;
    },
    openModal: (state, action: PayloadAction<Partial<CourtState>>) => {
      state.isOpen = true;
      state.mode = action.payload.mode || "create";
    },
    closeModal: (state) => {
      state.isOpen = false;
    },
  },
});

export const { selectCourt, openModal, closeModal, unSelectCourt } =
  courtSlice.actions;

export default courtSlice.reducer;
