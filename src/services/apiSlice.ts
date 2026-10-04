import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: "include", // Required for HTTP-only cookies
  }),
  tagTypes: ["User", "Category"],
  endpoints: () => ({}), // Endpoints will be injected via separate files
});
