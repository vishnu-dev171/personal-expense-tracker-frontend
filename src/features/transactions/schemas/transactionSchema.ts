import { z } from "zod";
import { PAYMENT_METHODS } from "@/constants";
import type { PaymentMethod } from "@/types/api.types";

export const transactionSchema = z.object({
  type: z.enum(["expense", "income"], {
    error: "Select a type",
  }),
  amount: z
    .number({ error: "Amount is required" })
    .positive("Amount must be greater than 0"),
  categoryId: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  transactionDate: z
    .string()
    .min(1, "Date is required")
    .refine((value) => !Number.isNaN(Date.parse(value)), {
      message: "Invalid transaction date",
    }),
  paymentMethod: z.enum(
    PAYMENT_METHODS as [PaymentMethod, ...PaymentMethod[]],
    {
      error: "Select a payment method",
    },
  ),
  notes: z.string().optional(),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;
