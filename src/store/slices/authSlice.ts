import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/types";

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateUser(state, action: PayloadAction<Partial<User>>) {
      if (state.user) state.user = { ...state.user, ...action.payload };
    },
  },
});

export const { updateUser } = authSlice.actions;

export default authSlice.reducer;
