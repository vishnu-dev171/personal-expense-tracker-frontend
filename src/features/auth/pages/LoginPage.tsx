import { FormInput, FormPasswordInput } from "@/components/forms/FormFields";
import { Button } from "@/components/ui/Button";
import { useLoginUserMutation } from "@/services/userApiSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { Receipt } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { loginSchema, type LoginFormData } from "../schemas/loginSchema";
import { getErrorMessage } from "@/utils/helper";
import { AuthLayout } from "@/components/layout/AuthLayout";

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
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to manage your finances"
      error={
        error && (
          <div className="mb-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {getErrorMessage(error)}
          </div>
        )
      }
      footer={
        <p>
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-brand-600 hover:text-brand-700"
          >
            Register
          </Link>
        </p>
      }
    >
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
    </AuthLayout>
  );
}
