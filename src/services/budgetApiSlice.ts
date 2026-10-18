import { apiSlice } from "./apiSlice";
import type {
  BackendBudgetResult,
  BackendBudgetsResult,
  BackendMessageResult,
  BudgetQueryParams,
  CreateBudgetRequest,
  UpdateBudgetRequest,
} from "../types/api.types";

const BUDGET_API_ENDPOINT = import.meta.env.VITE_BUDGET_API_ENDPOINT;

export const budgetApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllBudgets: builder.query<BackendBudgetsResult, BudgetQueryParams>({
      query: (params) => ({
        url: `${BUDGET_API_ENDPOINT}/getAllBudgets`,
        params,
      }),
      providesTags: (result) => [
        { type: "Budget", id: "LIST" },
        ...(result?.data?.budgets.map(({ budgetId }) => ({
          type: "Budget" as const,
          id: budgetId,
        })) ?? []),
      ],
    }),
    getBudgetById: builder.query<BackendBudgetResult, string>({
      query: (budgetId) =>
        `${BUDGET_API_ENDPOINT}/getBudgetById/${budgetId}`,
      providesTags: (_result, _error, budgetId) => [
        { type: "Budget", id: budgetId },
      ],
    }),
    createBudget: builder.mutation<BackendBudgetResult, CreateBudgetRequest>({
      query: (body) => ({
        url: `${BUDGET_API_ENDPOINT}/createBudget`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Budget", id: "LIST" }, "Dashboard"],
    }),
    updateBudget: builder.mutation<BackendBudgetResult, UpdateBudgetRequest>({
      query: (body) => ({
        url: `${BUDGET_API_ENDPOINT}/updateBudget`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { budgetId }) => [
        { type: "Budget", id: budgetId },
        { type: "Budget", id: "LIST" },
        "Dashboard",
      ],
    }),
    deleteBudget: builder.mutation<BackendMessageResult, string>({
      query: (budgetId) => ({
        url: `${BUDGET_API_ENDPOINT}/deleteBudget/${budgetId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, budgetId) => [
        { type: "Budget", id: budgetId },
        { type: "Budget", id: "LIST" },
        "Dashboard",
      ],
    }),
  }),
});

export const {
  useGetAllBudgetsQuery,
  useGetBudgetByIdQuery,
  useCreateBudgetMutation,
  useUpdateBudgetMutation,
  useDeleteBudgetMutation,
} = budgetApiSlice;
