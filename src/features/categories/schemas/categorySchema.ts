import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  type: z.enum(["income", "expense"], { error: "Select a type" }),
  color: z.string().optional(),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
