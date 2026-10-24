import { z } from "zod";

export const settingsSchema = z.object({
  name: z.string().min(1, "name is required"),
  email: z.email({ message: "Invalid email address format" }),
  defaultTransactionType: z
    .enum(["income", "expense"])
    .default("expense")
    .optional(),
  currency: z.enum(["INR", "USD", "EUR"]).default("INR").optional(),
});

export type SettingsFormData = z.infer<typeof settingsSchema>;
