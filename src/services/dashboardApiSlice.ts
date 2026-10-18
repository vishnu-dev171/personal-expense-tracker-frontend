import { apiSlice } from "./apiSlice";
import type { BackendDashboardResult } from "../types/api.types";

const DASHBOARD_API_ENDPOINT = import.meta.env.VITE_DASHBOARD_API_ENDPOINT;

export const dashboardApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboard: builder.query<BackendDashboardResult, void>({
      query: () => DASHBOARD_API_ENDPOINT,
      providesTags: ["Dashboard"],
    }),
  }),
});

export const { useGetDashboardQuery } = dashboardApiSlice;
