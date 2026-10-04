import { apiSlice } from "./apiSlice";
import type {
  BackendCategoriesResult,
  BackendCategoryResponse,
  CategoryQueryParams,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "../types/api.types";

const CATEGORY_API_ENDPOINT = import.meta.env.VITE_CATEGORY_API_ENDPOINT;

export const categoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllCategories: builder.query<
      BackendCategoriesResult,
      CategoryQueryParams
    >({
      query: (params) => ({
        url: `${CATEGORY_API_ENDPOINT}/getAllCategories`,
        params,
      }),
      providesTags: (result) => [
        { type: "Category", id: "LIST" },
        ...(result?.data?.categories.map(({ categoryId }) => ({
          type: "Category" as const,
          id: categoryId,
        })) ?? []),
      ],
    }),
    getCategoryById: builder.query<BackendCategoryResponse, string>({
      query: (categoryId) =>
        `${CATEGORY_API_ENDPOINT}/getCategoryById/${categoryId}`,
      providesTags: (_result, _error, categoryId) => [
        { type: "Category", id: categoryId },
      ],
    }),
    createCategory: builder.mutation<
      BackendCategoryResponse,
      CreateCategoryRequest
    >({
      query: (body) => ({
        url: `${CATEGORY_API_ENDPOINT}/createCategory`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Category", id: "LIST" }],
    }),
    updateCategory: builder.mutation<
      BackendCategoryResponse,
      UpdateCategoryRequest
    >({
      query: (body) => ({
        url: `${CATEGORY_API_ENDPOINT}/updateCategory`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { categoryId }) => [
        { type: "Category", id: categoryId },
        { type: "Category", id: "LIST" },
      ],
    }),
    activateCategory: builder.mutation<BackendCategoriesResult, string>({
      query: (categoryId) => ({
        url: `${CATEGORY_API_ENDPOINT}/activateCategory/${categoryId}`,
        method: "PUT",
      }),
      invalidatesTags: (_result, _error, categoryId) => [
        { type: "Category", id: categoryId },
        { type: "Category", id: "LIST" },
      ],
    }),
    deactivateCategory: builder.mutation<BackendCategoriesResult, string>({
      query: (categoryId) => ({
        url: `${CATEGORY_API_ENDPOINT}/deactivateCategory/${categoryId}`,
        method: "PUT",
      }),
      invalidatesTags: (_result, _error, categoryId) => [
        { type: "Category", id: categoryId },
        { type: "Category", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useActivateCategoryMutation,
  useDeactivateCategoryMutation,
} = categoryApiSlice;
