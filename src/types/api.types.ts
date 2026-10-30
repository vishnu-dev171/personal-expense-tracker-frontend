export interface User {
  id: string;
  name: string;
  email: string;
  currency?: "INR" | "USD" | "EUR";
  defaultTransactionType?: "INCOME" | "EXPENSE";
}

export interface UpdateProfileRequest {
  name: string;
  email: string;
  currency?: "INR" | "USD" | "EUR";
  defaultTransactionType?: NonNullable<User["defaultTransactionType"]>;
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
  data?: Pick<
    BackendCategoryResponse,
    "categoryId" | "name" | "type" | "status"
  >[];
}

export interface BackendBudgetResponse {
  budgetId: string;
  userId: string;
  categoryId: string;
  amount: number;
  month: number;
  year: number;
  createdAt: string;
  updatedAt: string;
  categoryName: string;
  spent: number;
  remaining: number;
  percentageUsed: number;
}

export interface BackendBudgetsResult {
  success: boolean;
  message: string;
  data?: {
    budgets: BackendBudgetResponse[];
    page: number;
    limit: number;
    totalRecords: number;
  };
}

export interface BackendBudgetResult {
  success: boolean;
  message: string;
  data?: BackendBudgetResponse;
}

export interface BackendDashboardSummary {
  month: number;
  year: number;
  totalIncome: number;
  totalExpense: number;
  balance: number;
  totalBudget: number;
}

export interface BackendDashboardMonthlyTrend {
  month: string;
  income: number;
  expense: number;
}

export interface BackendDashboardExpenseCategory {
  categoryId: string;
  name: string;
  value: number;
}

export interface BackendDashboardResponse {
  summary: BackendDashboardSummary;
  monthlyTrend: BackendDashboardMonthlyTrend[];
  expenseByCategory: BackendDashboardExpenseCategory[];
}

export interface BackendDashboardResult {
  success: boolean;
  message: string;
  data?: BackendDashboardResponse;
}

export interface BackendReportSummary {
  totalIncome: number;
  totalExpense: number;
  net: number;
}

export interface BackendReportMonthlyTrend {
  month: string;
  income: number;
  expense: number;
}

export interface BackendReportExpenseCategory {
  categoryId: string;
  name: string;
  value: number;
}

export interface BackendReportResponse {
  summary: BackendReportSummary;
  monthlyTrend: BackendReportMonthlyTrend[];
  expenseBreakdown: BackendReportExpenseCategory[];
}

export interface BackendReportsResult {
  success: boolean;
  message: string;
  data: BackendReportResponse;
}

export interface ReportQueryParams {
  startDate?: string;
  endDate?: string;
  type?: "income" | "expense";
  categoryId?: string;
}

export interface BudgetQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  month?: number;
  year?: number;
  categoryId?: string;
}

export interface CreateBudgetRequest {
  categoryId: string;
  amount: number;
  month: number;
  year: number;
}

export interface UpdateBudgetRequest extends CreateBudgetRequest {
  budgetId: string;
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
  signedUrl?: string;
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
