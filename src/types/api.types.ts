export interface User {
  id: string;
  name: string;
  email: string;
  currency?: string;
  defaultTransactionType?: "income" | "expense";
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends LoginRequest {
  name: string;
}

export interface Profile {
  authenticated: boolean;
  user: User;
}

export interface BackendCategoryResponse {
  categoryId: string;
  name: string;
  type: "INCOME" | "EXPENSE";
  status: "ACTIVE" | "INACTIVE";
}

export interface BackendCategoriesResult {
  success: boolean;
  message: string;
  data?: BackendCategoriesResponse;
}

export interface BackendCategoriesResponse {
  categories: BackendCategoryResponse[];
  page: number;
  limit: number;
  totalRecords: number;
}

export interface BackendCategoriesDropdownResult {
  success: boolean;
  message: string;
  data?: Pick<BackendCategoryResponse, "categoryId" | "name" | "type" | "status">[];
}

export type CategoryType = "income" | "expense";

export interface CategoryQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface CreateCategoryRequest {
  name: string;
  type: CategoryType;
}

export interface UpdateCategoryRequest extends CreateCategoryRequest {
  categoryId: string;
}

export type BackendTransactionType = "INCOME" | "EXPENSE";

export type PaymentMethod =
  | "Cash"
  | "UPI"
  | "Credit Card"
  | "Debit Card"
  | "Bank Transfer"
  | "Other";

export interface BackendTransactionFile {
  fileId: string;
  originalName: string;
  fileName: string;
  filePath: string;
  mimeType: string;
  fileSize: number;
}

export interface BackendTransactionResponse {
  transactionId: string;
  amount: number;
  type: BackendTransactionType;
  categoryId: string;
  categoryName: string;
  description: string | null;
  transactionDate: string;
  paymentMethod: PaymentMethod;
  notes: string | null;
  files: BackendTransactionFile[];
}

export interface BackendTransactionsResult {
  success: boolean;
  message: string;
  data?: {
    transactions: BackendTransactionResponse[];
    page: number;
    limit: number;
    totalRecords: number;
  };
}

export interface BackendTransactionResult {
  success: boolean;
  message: string;
  data?: BackendTransactionResponse;
}

export interface BackendMessageResult {
  success: boolean;
  message: string;
}

export interface TransactionQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  startDate?: string;
  endDate?: string;
  type?: "income" | "expense";
  categoryId?: string;
  paymentMethod?: PaymentMethod;
}

export interface TransactionRequest {
  type: "income" | "expense";
  amount: number;
  categoryId: string;
  description?: string;
  transactionDate: string;
  paymentMethod: PaymentMethod;
  notes?: string;
  attachments?: File[];
}

export interface UpdateTransactionRequest extends TransactionRequest {
  transactionId: string;
  deleteFileIds?: string[];
}

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  categoryId: string;
  date: string;
}

export interface Category {
  id: string;
  name: string;
  type: "income" | "expense";
}

export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
  statusCode?: number;
}
