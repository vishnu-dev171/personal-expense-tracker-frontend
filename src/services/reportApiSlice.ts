import { apiSlice } from "./apiSlice";
import type {
  BackendReportsResult,
  ReportQueryParams,
} from "../types/api.types";

const REPORT_API_ENDPOINT = import.meta.env.VITE_REPORT_API_ENDPOINT;

export const reportApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getReports: builder.query<BackendReportsResult, ReportQueryParams>({
      query: (params) => ({
        url: REPORT_API_ENDPOINT,
        params,
      }),
      providesTags: ["Reports"],
    }),
  }),
});

export const { useGetReportsQuery } = reportApiSlice;
