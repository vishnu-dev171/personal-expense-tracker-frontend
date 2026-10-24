import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Mutex } from "async-mutex";

const baseUrl = import.meta.env.VITE_API_BASE_URL;
const USER_API_ENDPOINT = "/users";
const mutex = new Mutex();

const rawBaseQuery = fetchBaseQuery({
  baseUrl,
  credentials: "include", // sends/receives HTTP-only cookies
});

const isAuthEndpoint = (url: string) =>
  ["/login", "/register", "/refresh", "/logout"].some((endpoint) =>
    url.includes(endpoint),
  );

let sessionRefreshFailed = false;

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const url = typeof args === "string" ? args : args.url;

  // Login, registration, refresh, and logout must not
  // recursively trigger another refresh.
  if (isAuthEndpoint(url)) {
    const result = await rawBaseQuery(args, api, extraOptions);

    // A successful login starts a new client session.
    if (url.includes("/login") && !result.error) {
      sessionRefreshFailed = false;
    }

    return result;
  }

  await mutex.waitForUnlock();

  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status !== 401) {
    return result;
  }

  if (sessionRefreshFailed) {
    return result;
  }

  // Another request may be refreshing the session.
  if (mutex.isLocked()) {
    await mutex.waitForUnlock();

    if (sessionRefreshFailed) {
      return result;
    }

    return await rawBaseQuery(args, api, extraOptions);
  }

  const release = await mutex.acquire();

  try {
    // Check again after acquiring the mutex.
    if (sessionRefreshFailed) {
      return result;
    }

    const refreshResult = await rawBaseQuery(
      {
        url: `${USER_API_ENDPOINT}/refresh`,
        method: "POST",
      },
      api,
      extraOptions,
    );

    if (!refreshResult.error) {
      // New access cookie should now be available.
      return await rawBaseQuery(args, api, extraOptions);
    }

    // Don't reset the API state or call logout here.
    // Let the original protected query return its error.
    sessionRefreshFailed = true;

    return result;
  } finally {
    release();
  }
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
