import type { BudgetStatus } from '@/types';
import { BUDGET_WARNING_THRESHOLD } from '@/constants';

export function computeBudgetStatus(spent: number, budget: number): BudgetStatus {
  if (spent > budget) return 'overspent';
  if (budget > 0 && spent / budget >= BUDGET_WARNING_THRESHOLD) return 'near-limit';
  return 'normal';
}

export function budgetProgress(spent: number, budget: number): number {
  if (budget <= 0) return 0;
  return Math.min(100, Math.round((spent / budget) * 100));
}
