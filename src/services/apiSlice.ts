import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Mutex } from "async-mutex";
import { useLogoutUserMutation } from "./userApiSlice";

const baseUrl = import.meta.env.VITE_API_BASE_URL;
const USER_API_ENDPOINT = import.meta.env.VITE_USER_API_ENDPOINT;
const mutex = new Mutex();

const rawBaseQuery = fetchBaseQuery({
  baseUrl,
  credentials: "include", // sends/receives HTTP-only cookies
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // Wait if a refresh is already in progress
  await mutex.waitForUnlock();

  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Don't try to refresh for the auth endpoints themselves
    const url = typeof args === "string" ? args : args.url;
    if (url.includes("/login") || url.includes("/refresh")) {
      return result;
    }

    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refreshResult = await rawBaseQuery(
          { url: `${USER_API_ENDPOINT}/refresh`, method: "POST" },
          api,
          extraOptions,
        );

        if (refreshResult.data) {
          // New access cookie is set by the server, retry original request
          result = await rawBaseQuery(args, api, extraOptions);
        } else {
          // Refresh token expired/invalid
          await rawBaseQuery(
            { url: `${USER_API_ENDPOINT}/logout`, method: "POST" },
            api,
            extraOptions,
          );
          api.dispatch(apiSlice.util.resetApiState());
        }
      } finally {
        release();
      }
    } else {
      // Another request is refreshing; wait, then retry
      await mutex.waitForUnlock();
      result = await rawBaseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "User",
    "Category",
    "Transaction",
    "Budget",
    "Dashboard",
    "Reports",
  ],
  endpoints: () => ({}),
});
