import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../services/apiSlice";

// Import injected API slices so their endpoints are loaded into the store
import "../services/userApiSlice";
import "../services/transactionApiSlice";
import "../services/dashboardApiSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
