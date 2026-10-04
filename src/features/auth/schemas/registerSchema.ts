import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.email("Enter a valid email address").min(1, "Email is required"),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" })
      .regex(/[0-9]/, { message: "Password must include at least one number" })
      .regex(/[^A-Za-z0-9]/, {
        message: "Password must include at least one special character",
      }),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

export const registerFormDefaultValues: RegisterFormData = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};
