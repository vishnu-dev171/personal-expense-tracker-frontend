import { z } from "zod";
import { MONTHS } from "@/constants";

export const budgetSchema = z.object({
  categoryId: z.string().min(1, "Category is required"),
  amount: z
    .number({ error: "Amount is required" })
    .positive("Amount must be greater than 0"),
  month: z.number({ error: "Month is required" }).min(1).max(12),
  year: z.number({ error: "Year is required" }).min(2020).max(2100),
});

export type BudgetFormData = z.infer<typeof budgetSchema>;

export const monthOptions = MONTHS.map((label, i) => ({
  value: String(i + 1),
  label,
}));
export const yearOptions = [2024, 2025, 2026].map((y) => ({
  value: String(y),
  label: String(y),
}));
