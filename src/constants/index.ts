import type { PaymentMethod, TransactionType } from "@/types";

export const PAYMENT_METHODS: PaymentMethod[] = [
  "Cash",
  "UPI",
  "Credit Card",
  "Debit Card",
  "Bank Transfer",
  "Other",
];

export const TRANSACTION_TYPES: { value: TransactionType; label: string }[] = [
  { value: "expense", label: "Expense" },
  { value: "income", label: "Income" },
];

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const BUDGET_WARNING_THRESHOLD = 0.8;
export const CURRENT_YEAR = new Date().getFullYear();
export const CURRENT_MONTH = new Date().getMonth() + 1;

export const DEFAULT_CURRENCY = "INR";

export const CURRENCY_SYMBOLS: Record<string, string> = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
};

export const STORAGE_KEYS = {
  AUTH: "expense_tracker_auth",
};
