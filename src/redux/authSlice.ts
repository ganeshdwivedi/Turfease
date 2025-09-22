import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface initialState {
  isLoggedIn: boolean;
  user: any | null;
}
const initialState = {
  isLoggedIn: false,
  user: null,
};
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateAuthState: (state: any, action: PayloadAction<initialState>) => {
      state.isLoggedIn = action.payload.isLoggedIn;
      state.user = { ...action.payload.user };
    },
  },
});

export const { updateAuthState } = authSlice.actions;

export default authSlice.reducer;
