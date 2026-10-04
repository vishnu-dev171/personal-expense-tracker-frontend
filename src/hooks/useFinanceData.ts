import { useState, useCallback, useMemo } from "react";
import type { Transaction, Category, Budget, BudgetWithStatus } from "@/types";
import { mockTransactions } from "@/mock/transactions";
import { mockCategories } from "@/mock/categories";
import { mockBudgets } from "@/mock/budgets";
import { CURRENT_MONTH, CURRENT_YEAR } from "@/constants";
import { generateId } from "@/utils/format";
import { computeBudgetStatus } from "@/utils/budget";

export interface FinanceData {
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  addTransaction: (t: Omit<Transaction, "id">) => void;
  updateTransaction: (id: string, t: Omit<Transaction, "id">) => void;
  deleteTransaction: (id: string) => void;
  addCategory: (c: Omit<Category, "id">) => void;
  updateCategory: (id: string, c: Omit<Category, "id">) => void;
  toggleCategoryStatus: (id: string) => void;
  addBudget: (b: Omit<Budget, "id">) => boolean;
  updateBudget: (id: string, b: Omit<Budget, "id">) => boolean;
  deleteBudget: (id: string) => void;
  getCategoryName: (id: string) => string;
  getCategory: (id: string) => Category | undefined;
  categoryExpenseInMonth: (
    categoryId: string,
    month: number,
    year: number,
  ) => number;
  budgetWithStatus: (budget: Budget) => BudgetWithStatus;
  currentMonthBudgets: BudgetWithStatus[];
}

export function useFinanceData(): FinanceData {
  const [transactions, setTransactions] =
    useState<Transaction[]>(mockTransactions);
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [budgets, setBudgets] = useState<Budget[]>(mockBudgets);

  const addTransaction = useCallback((t: Omit<Transaction, "id">) => {
    setTransactions((prev) => [{ ...t, id: generateId("txn") }, ...prev]);
  }, []);

  const updateTransaction = useCallback(
    (id: string, t: Omit<Transaction, "id">) => {
      setTransactions((prev) =>
        prev.map((tx) => (tx.id === id ? { ...t, id } : tx)),
      );
    },
    [],
  );

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
  }, []);

  const addCategory = useCallback((c: Omit<Category, "id">) => {
    setCategories((prev) => [...prev, { ...c, id: generateId("cat") }]);
  }, []);

  const updateCategory = useCallback((id: string, c: Omit<Category, "id">) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...c, id } : cat)),
    );
  }, []);

  const toggleCategoryStatus = useCallback((id: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === id
          ? { ...cat, status: cat.status === "active" ? "inactive" : "active" }
          : cat,
      ),
    );
  }, []);

  const addBudget = useCallback((b: Omit<Budget, "id">) => {
    let success = false;
    setBudgets((prev) => {
      const exists = prev.some(
        (bud) =>
          bud.categoryId === b.categoryId &&
          bud.month === b.month &&
          bud.year === b.year,
      );
      if (exists) return prev;
      success = true;
      return [...prev, { ...b, id: generateId("bud") }];
    });
    return success;
  }, []);

  const updateBudget = useCallback((id: string, b: Omit<Budget, "id">) => {
    let success = false;
    setBudgets((prev) => {
      const exists = prev.some(
        (bud) =>
          bud.id !== id &&
          bud.categoryId === b.categoryId &&
          bud.month === b.month &&
          bud.year === b.year,
      );
      if (exists) return prev;
      success = true;
      return prev.map((bud) => (bud.id === id ? { ...b, id } : bud));
    });
    return success;
  }, []);

  const deleteBudget = useCallback((id: string) => {
    setBudgets((prev) => prev.filter((bud) => bud.id !== id));
  }, []);

  const getCategory = useCallback(
    (id: string) => categories.find((c) => c.id === id),
    [categories],
  );

  const getCategoryName = useCallback(
    (id: string) =>
      categories.find((c) => c.id === id)?.name ?? "Uncategorized",
    [categories],
  );

  const categoryExpenseInMonth = useCallback(
    (categoryId: string, month: number, year: number) => {
      return transactions
        .filter((t) => {
          const d = new Date(t.date);
          return (
            t.categoryId === categoryId &&
            t.type === "expense" &&
            d.getMonth() + 1 === month &&
            d.getFullYear() === year
          );
        })
        .reduce((sum, t) => sum + t.amount, 0);
    },
    [transactions],
  );

  const budgetWithStatus = useCallback(
    (budget: Budget): BudgetWithStatus => {
      const spent = categoryExpenseInMonth(
        budget.categoryId,
        budget.month,
        budget.year,
      );
      return {
        ...budget,
        spent,
        remaining: budget.amount - spent,
        status: computeBudgetStatus(spent, budget.amount),
        categoryName: getCategoryName(budget.categoryId),
      };
    },
    [categoryExpenseInMonth, getCategoryName],
  );

  const currentMonthBudgets = useMemo(
    () =>
      budgets
        .filter((b) => b.month === CURRENT_MONTH && b.year === CURRENT_YEAR)
        .map(budgetWithStatus),
    [budgets, budgetWithStatus],
  );

  return {
    transactions,
    categories,
    budgets,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCategory,
    updateCategory,
    toggleCategoryStatus,
    addBudget,
    updateBudget,
    deleteBudget,
    getCategoryName,
    getCategory,
    categoryExpenseInMonth,
    budgetWithStatus,
    currentMonthBudgets,
  };
}
