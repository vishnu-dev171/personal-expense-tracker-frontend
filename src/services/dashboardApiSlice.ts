import { apiSlice } from "./apiSlice";
import type { BackendDashboardResult } from "../types/api.types";

const DASHBOARD_API_ENDPOINT = "/dashboards";

export const dashboardApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboard: builder.query<BackendDashboardResult, void>({
      query: () => DASHBOARD_API_ENDPOINT,
      providesTags: ["Dashboard"],
    }),
  }),
});

export const { useGetDashboardQuery } = dashboardApiSlice;
