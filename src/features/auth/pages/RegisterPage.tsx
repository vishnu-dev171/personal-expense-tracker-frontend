import { FormInput, FormPasswordInput } from "@/components/forms/FormFields";
import { Button } from "@/components/ui/Button";
import { useRegisterUserMutation } from "@/services/userApiSlice";
import { getErrorMessage } from "@/utils/helper";
import { zodResolver } from "@hookform/resolvers/zod";
import { Receipt } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import {
  registerFormDefaultValues,
  registerSchema,
  type RegisterFormData,
} from "../schemas/registerSchema";

export function RegisterPage() {
  const navigate = useNavigate();
  const [registerUser, { isLoading, error }] = useRegisterUserMutation();

  const { control, handleSubmit } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: registerFormDefaultValues,
  });

  async function onSubmit(data: RegisterFormData) {
    try {
      await registerUser(data).unwrap();
      navigate("/dashboard");
    } catch (err) {
      console.error("Registration failed:", err);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-white">
            <Receipt className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-semibold text-slate-800">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Start tracking your expenses today
          </p>
        </div>

        <div className="card-surface p-6">
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {getErrorMessage(error)}
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormInput
              name="name"
              control={control}
              label="Full Name"
              required
              placeholder="Enter Name"
            />
            <FormInput
              name="email"
              control={control}
              label="Email"
              required
              placeholder="you@example.com"
              type="email"
            />
            <FormPasswordInput
              name="password"
              control={control}
              label="Password"
              required
              placeholder="At least 6 characters"
            />
            <FormPasswordInput
              name="confirmPassword"
              control={control}
              label="Confirm Password"
              required
              placeholder="Re-enter password"
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              Create Account
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-brand-600 hover:text-brand-700"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
