export type TransactionType = 'income' | 'expense';

export type PaymentMethod = 'Cash' | 'UPI' | 'Credit Card' | 'Debit Card' | 'Bank Transfer' | 'Other';

export interface User {
  id: string;
  name: string;
  email: string;
  currency: string;
  defaultTransactionType: TransactionType;
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  status: 'active' | 'inactive';
  color?: string;
}

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  description: string;
  date: string;
  paymentMethod: PaymentMethod;
  notes?: string;
  receiptName?: string;
}

export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  month: number;
  year: number;
}

export type BudgetStatus = 'normal' | 'near-limit' | 'overspent';

export interface BudgetWithStatus extends Budget {
  spent: number;
  remaining: number;
  status: BudgetStatus;
  categoryName: string;
}

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant: 'success' | 'error' | 'info';
}
