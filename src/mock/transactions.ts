import type { Transaction } from '@/types';

function dateStr(day: number, month: number, year: number): string {
  const d = new Date(year, month - 1, day);
  return d.toISOString().split('T')[0];
}

const Y = new Date().getFullYear();
const M = new Date().getMonth() + 1;

export const mockTransactions: Transaction[] = [
  // Current month
  { id: 'txn_1', amount: 75000, type: 'income', categoryId: 'cat_salary', description: 'Monthly salary', date: dateStr(1, M, Y), paymentMethod: 'Bank Transfer', notes: 'September salary' },
  { id: 'txn_2', amount: 1250, type: 'expense', categoryId: 'cat_food', description: 'Grocery shopping', date: dateStr(2, M, Y), paymentMethod: 'UPI' },
  { id: 'txn_3', amount: 480, type: 'expense', categoryId: 'cat_transport', description: 'Cab to office', date: dateStr(3, M, Y), paymentMethod: 'UPI' },
  { id: 'txn_4', amount: 3200, type: 'expense', categoryId: 'cat_bills', description: 'Electricity bill', date: dateStr(5, M, Y), paymentMethod: 'Credit Card' },
  { id: 'txn_5', amount: 1500, type: 'expense', categoryId: 'cat_entertainment', description: 'Movie night', date: dateStr(7, M, Y), paymentMethod: 'Debit Card' },
  { id: 'txn_6', amount: 8200, type: 'expense', categoryId: 'cat_shopping', description: 'New shoes', date: dateStr(9, M, Y), paymentMethod: 'Credit Card' },
  { id: 'txn_7', amount: 600, type: 'expense', categoryId: 'cat_food', description: 'Lunch with team', date: dateStr(10, M, Y), paymentMethod: 'Cash' },
  { id: 'txn_8', amount: 15000, type: 'income', categoryId: 'cat_freelance', description: 'Freelance project payment', date: dateStr(12, M, Y), paymentMethod: 'Bank Transfer' },
  { id: 'txn_9', amount: 2100, type: 'expense', categoryId: 'cat_health', description: 'Pharmacy', date: dateStr(14, M, Y), paymentMethod: 'UPI' },
  { id: 'txn_10', amount: 3400, type: 'expense', categoryId: 'cat_education', description: 'Online course', date: dateStr(16, M, Y), paymentMethod: 'Credit Card' },
  { id: 'txn_11', amount: 950, type: 'expense', categoryId: 'cat_transport', description: 'Metro card recharge', date: dateStr(18, M, Y), paymentMethod: 'UPI' },
  { id: 'txn_12', amount: 1800, type: 'expense', categoryId: 'cat_food', description: 'Dinner with family', date: dateStr(19, M, Y), paymentMethod: 'Debit Card' },

  // Previous month
  { id: 'txn_13', amount: 75000, type: 'income', categoryId: 'cat_salary', description: 'Monthly salary', date: dateStr(1, M - 1, Y), paymentMethod: 'Bank Transfer' },
  { id: 'txn_14', amount: 4200, type: 'expense', categoryId: 'cat_food', description: 'Monthly groceries', date: dateStr(3, M - 1, Y), paymentMethod: 'UPI' },
  { id: 'txn_15', amount: 1800, type: 'expense', categoryId: 'cat_transport', description: 'Fuel', date: dateStr(5, M - 1, Y), paymentMethod: 'Credit Card' },
  { id: 'txn_16', amount: 5600, type: 'expense', categoryId: 'cat_shopping', description: 'Clothes shopping', date: dateStr(8, M - 1, Y), paymentMethod: 'Credit Card' },
  { id: 'txn_17', amount: 2800, type: 'expense', categoryId: 'cat_bills', description: 'Internet bill', date: dateStr(10, M - 1, Y), paymentMethod: 'Debit Card' },
  { id: 'txn_18', amount: 9000, type: 'income', categoryId: 'cat_freelance', description: 'Design gig', date: dateStr(15, M - 1, Y), paymentMethod: 'Bank Transfer' },
  { id: 'txn_19', amount: 3200, type: 'expense', categoryId: 'cat_entertainment', description: 'Concert tickets', date: dateStr(18, M - 1, Y), paymentMethod: 'UPI' },
  { id: 'txn_20', amount: 1500, type: 'expense', categoryId: 'cat_health', description: 'Doctor visit', date: dateStr(22, M - 1, Y), paymentMethod: 'Cash' },

  // Two months ago
  { id: 'txn_21', amount: 75000, type: 'income', categoryId: 'cat_salary', description: 'Monthly salary', date: dateStr(1, M - 2, Y), paymentMethod: 'Bank Transfer' },
  { id: 'txn_22', amount: 3800, type: 'expense', categoryId: 'cat_food', description: 'Groceries', date: dateStr(4, M - 2, Y), paymentMethod: 'UPI' },
  { id: 'txn_23', amount: 2400, type: 'expense', categoryId: 'cat_transport', description: 'Fuel and cab', date: dateStr(6, M - 2, Y), paymentMethod: 'Credit Card' },
  { id: 'txn_24', amount: 6700, type: 'expense', categoryId: 'cat_shopping', description: 'Home decor', date: dateStr(11, M - 2, Y), paymentMethod: 'Debit Card' },
  { id: 'txn_25', amount: 3400, type: 'expense', categoryId: 'cat_bills', description: 'Electricity bill', date: dateStr(14, M - 2, Y), paymentMethod: 'Credit Card' },
  { id: 'txn_26', amount: 12000, type: 'income', categoryId: 'cat_freelance', description: 'Consulting fee', date: dateStr(20, M - 2, Y), paymentMethod: 'Bank Transfer' },
  { id: 'txn_27', amount: 2200, type: 'expense', categoryId: 'cat_other_exp', description: 'Miscellaneous', date: dateStr(25, M - 2, Y), paymentMethod: 'Cash' },
  { id: 'txn_28', amount: 4500, type: 'expense', categoryId: 'cat_education', description: 'Books', date: dateStr(27, M - 2, Y), paymentMethod: 'UPI' },
];
