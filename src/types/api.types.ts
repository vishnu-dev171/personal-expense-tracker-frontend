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
