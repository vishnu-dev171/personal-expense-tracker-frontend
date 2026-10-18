import { apiSlice } from "./apiSlice";
import type {
  BackendMessageResult,
  BackendTransactionResult,
  BackendTransactionsResult,
  TransactionQueryParams,
  TransactionRequest,
  UpdateTransactionRequest,
} from "../types/api.types";

const TRANSACTION_API_ENDPOINT = import.meta.env.VITE_TRANSACTION_API_ENDPOINT;

function toRequestBody(body: TransactionRequest | UpdateTransactionRequest) {
  const { attachments = [], ...fields } = body;
  if (attachments.length === 0) return fields;

  const formData = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      for (const item of value) formData.append(`${key}[]`, String(item));
    } else {
      formData.append(key, String(value));
    }
  }
  for (const attachment of attachments) {
    formData.append("attachments", attachment);
  }
  return formData;
}

export const transactionApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllTransactions: builder.query<
      BackendTransactionsResult,
      TransactionQueryParams
    >({
      query: (params) => ({
        url: `${TRANSACTION_API_ENDPOINT}/getAllTransactions`,
        params,
      }),
      providesTags: (result) => [
        { type: "Transaction", id: "LIST" },
        ...(result?.data?.transactions.map(({ transactionId }) => ({
          type: "Transaction" as const,
          id: transactionId,
        })) ?? []),
      ],
    }),
    getTransactionById: builder.query<BackendTransactionResult, string>({
      query: (transactionId) =>
        `${TRANSACTION_API_ENDPOINT}/getTransactionById/${transactionId}`,
      providesTags: (_result, _error, transactionId) => [
        { type: "Transaction", id: transactionId },
      ],
    }),
    createTransaction: builder.mutation<
      BackendTransactionResult,
      TransactionRequest
    >({
      query: (body) => ({
        url: `${TRANSACTION_API_ENDPOINT}/createTransaction`,
        method: "POST",
        body: toRequestBody(body),
      }),
      invalidatesTags: [
        { type: "Transaction", id: "LIST" },
        "Dashboard",
        "Reports",
      ],
    }),
    updateTransaction: builder.mutation<
      BackendTransactionResult,
      UpdateTransactionRequest
    >({
      query: (body) => ({
        url: `${TRANSACTION_API_ENDPOINT}/updateTransaction`,
        method: "PUT",
        body: toRequestBody(body),
      }),
      invalidatesTags: (_result, _error, { transactionId }) => [
        { type: "Transaction", id: transactionId },
        { type: "Transaction", id: "LIST" },
        "Dashboard",
        "Reports",
      ],
    }),
    deleteTransaction: builder.mutation<BackendMessageResult, string>({
      query: (transactionId) => ({
        url: `${TRANSACTION_API_ENDPOINT}/deleteTransaction/${transactionId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, transactionId) => [
        { type: "Transaction", id: transactionId },
        { type: "Transaction", id: "LIST" },
        "Dashboard",
        "Reports",
      ],
    }),
  }),
});

export const {
  useGetAllTransactionsQuery,
  useGetTransactionByIdQuery,
  useCreateTransactionMutation,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
} = transactionApiSlice;
