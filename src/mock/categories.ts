import type { Category } from '@/types';

export const mockCategories: Category[] = [
  { id: 'cat_food', name: 'Food', type: 'expense', status: 'active', color: '#f97316' },
  { id: 'cat_transport', name: 'Transport', type: 'expense', status: 'active', color: '#0ea5e9' },
  { id: 'cat_shopping', name: 'Shopping', type: 'expense', status: 'active', color: '#ec4899' },
  { id: 'cat_bills', name: 'Bills', type: 'expense', status: 'active', color: '#8b5cf6' },
  { id: 'cat_entertainment', name: 'Entertainment', type: 'expense', status: 'active', color: '#f59e0b' },
  { id: 'cat_health', name: 'Health', type: 'expense', status: 'active', color: '#ef4444' },
  { id: 'cat_education', name: 'Education', type: 'expense', status: 'active', color: '#14b8a6' },
  { id: 'cat_other_exp', name: 'Other', type: 'expense', status: 'active', color: '#64748b' },
  { id: 'cat_salary', name: 'Salary', type: 'income', status: 'active', color: '#10b981' },
  { id: 'cat_freelance', name: 'Freelance', type: 'income', status: 'active', color: '#22c55e' },
  { id: 'cat_investment', name: 'Investment', type: 'income', status: 'inactive', color: '#16a34a' },
];
