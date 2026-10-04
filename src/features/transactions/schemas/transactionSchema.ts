import { z } from "zod";
import { PAYMENT_METHODS } from "@/constants";

export const transactionSchema = z.object({
  type: z.enum(["expense", "income"], {
    error: "Select a type",
  }),
  amount: z
    .number({ error: "Amount is required" })
    .positive("Amount must be greater than 0"),
  categoryId: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  paymentMethod: z.enum(PAYMENT_METHODS as [string, ...string[]], {
    error: "Select a payment method",
  }),
  notes: z.string().optional(),
  receiptName: z.string().optional(),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;
