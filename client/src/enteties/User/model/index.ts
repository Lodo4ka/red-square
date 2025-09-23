import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface LoginPayload {
  name: string;
  password: string;
}

export type User = {
  name: string;
  role: string;
};

const initialState: { user: User | null } = {
  user: null,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
  },
})

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
