import { configureStore } from "@reduxjs/toolkit";
import { kasierApi } from "./api/kasierApi";

export const store = configureStore({
  reducer: {
    [kasierApi.reducerPath]: kasierApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(kasierApi.middleware),
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
