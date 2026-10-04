import type { Budget } from '@/types';
import { CURRENT_MONTH, CURRENT_YEAR } from '@/constants';

export const mockBudgets: Budget[] = [
  { id: 'bud_1', categoryId: 'cat_food', amount: 10000, month: CURRENT_MONTH, year: CURRENT_YEAR },
  { id: 'bud_2', categoryId: 'cat_transport', amount: 5000, month: CURRENT_MONTH, year: CURRENT_YEAR },
  { id: 'bud_3', categoryId: 'cat_shopping', amount: 8000, month: CURRENT_MONTH, year: CURRENT_YEAR },
  { id: 'bud_4', categoryId: 'cat_bills', amount: 6000, month: CURRENT_MONTH, year: CURRENT_YEAR },
  { id: 'bud_5', categoryId: 'cat_entertainment', amount: 4000, month: CURRENT_MONTH, year: CURRENT_YEAR },
];
