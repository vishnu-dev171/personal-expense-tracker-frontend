import { FormInput, FormPasswordInput } from "@/components/forms/FormFields";
import { Button } from "@/components/ui/Button";
import { useLoginUserMutation } from "@/services/userApiSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { Receipt } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { loginSchema, type LoginFormData } from "../schemas/loginSchema";
import { getErrorMessage } from "@/utils/helper";

export function LoginPage() {
  const navigate = useNavigate();
  const [loginUser, { isLoading, error }] = useLoginUserMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await loginUser(data).unwrap();
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-white">
            <Receipt className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-semibold text-slate-800">
            Personal Expense Tracker
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Sign in to manage your finances
          </p>
        </div>

        <div className="card-surface p-6">
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {getErrorMessage(error)}
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="relative">
              <FormInput
                name="email"
                control={control}
                label="Email"
                required
                placeholder="you@example.com"
                type="email"
              />
            </div>
            <FormPasswordInput
              name="password"
              control={control}
              label="Password"
              required
              placeholder="Enter your password"
            />
            <Button type="submit" className="w-full" loading={isLoading}>
              Sign In
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-brand-600 hover:text-brand-700"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
