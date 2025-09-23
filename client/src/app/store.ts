import { configureStore } from "@reduxjs/toolkit";
import userReducer from '@/enteties/User/model';
import { emptySplitApi } from '@/shared/api/base';

export const store = configureStore({
  reducer: {
    [emptySplitApi.reducerPath]: emptySplitApi.reducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(emptySplitApi.middleware),
})
