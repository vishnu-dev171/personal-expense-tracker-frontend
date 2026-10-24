import { apiSlice } from "./apiSlice";
import {
  User,
  LoginRequest,
  RegisterRequest,
  Profile,
  UpdateProfileRequest,
  BackendMessageResult,
} from "../types/api.types";

const USER_API_ENDPOINT = "/users";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    registerUser: builder.mutation<User, RegisterRequest>({
      query: (userData) => ({
        url: `${USER_API_ENDPOINT}/register`,
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),
    loginUser: builder.mutation<User, LoginRequest>({
      query: (credentials) => ({
        url: `${USER_API_ENDPOINT}/login`,
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),
    logoutUser: builder.mutation<void, void>({
      query: () => ({
        url: `${USER_API_ENDPOINT}/logout`,
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),
    getUserProfile: builder.query<Profile, void>({
      query: () => `${USER_API_ENDPOINT}/profile`,
      providesTags: ["User"],
    }),
    updateProfile: builder.mutation<BackendMessageResult, UpdateProfileRequest>(
      {
        query: (profile) => ({
          url: `${USER_API_ENDPOINT}/updateProfile`,
          method: "PATCH",
          body: profile,
        }),
        invalidatesTags: ["User"],
      },
    ),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useGetUserProfileQuery,
  useUpdateProfileMutation,
} = userApiSlice;
