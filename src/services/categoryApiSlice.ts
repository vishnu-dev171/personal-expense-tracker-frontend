import { apiSlice } from "./apiSlice";
import type {
  BackendCategoriesResult,
  BackendCategoriesDropdownResult,
  BackendCategoryResponse,
  CategoryQueryParams,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "../types/api.types";

const CATEGORY_API_ENDPOINT = "/categories";

export const categoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategoriesDropdown: builder.query<BackendCategoriesDropdownResult, void>(
      {
        query: () => `${CATEGORY_API_ENDPOINT}/getCategoriesDropdown`,
        providesTags: [{ type: "Category", id: "LIST" }],
      },
    ),
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
      invalidatesTags: [
        { type: "Category", id: "LIST" },
        "Dashboard",
        "Reports",
      ],
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
        "Dashboard",
        "Reports",
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
        "Dashboard",
        "Reports",
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
        "Dashboard",
        "Reports",
      ],
    }),
  }),
});

export const {
  useGetCategoriesDropdownQuery,
  useGetAllCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useActivateCategoryMutation,
  useDeactivateCategoryMutation,
} = categoryApiSlice;
