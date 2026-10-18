import { z } from "zod";
import { CURRENT_YEAR, MONTHS } from "@/constants";

export const budgetSchema = z.object({
  categoryId: z.string().min(1, "Category is required"),
  amount: z
    .number({ error: "Amount is required" })
    .positive("Amount must be greater than 0"),
  month: z.coerce.number({ error: "Month is required" }).int().min(1).max(12),
  year: z.coerce.number({ error: "Year is required" }).int().min(1),
});

export type BudgetFormData = z.infer<typeof budgetSchema>;
export type BudgetFormInput = z.input<typeof budgetSchema>;

export const monthOptions = MONTHS.map((label, i) => ({
  value: String(i + 1),
  label,
}));
export const yearOptions = [CURRENT_YEAR, CURRENT_YEAR - 1, CURRENT_YEAR - 2].map(
  (year) => ({
    value: String(year),
    label: String(year),
  }),
);
