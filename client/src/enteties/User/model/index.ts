import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { LoginResponse } from "../type";

export interface LoginPayload {
  name: string;
  password: string;
}

export type UserStore = {
  name: string;
  role: string;
  id: number;
  isAdmin: boolean;
};

const initialState: { user: UserStore | null } = {
  user: null,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<LoginResponse>) => {
      state.user = { ...action.payload, isAdmin: action.payload.name.toLowerCase() === 'admin' };
    },
  },
})

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
