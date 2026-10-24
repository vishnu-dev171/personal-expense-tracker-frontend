import { useToast } from "@/components/feedback/Toast";
import { ErrorState, LoadingState } from "@/components/feedback/States";
import { FormInput, FormSelect } from "@/components/forms/FormFields";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { CURRENCY_SYMBOLS, TRANSACTION_TYPES } from "@/constants";
import {
  useGetUserProfileQuery,
  useLogoutUserMutation,
  useUpdateProfileMutation,
} from "@/services/userApiSlice";
import { LogOut } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { SettingsFormData, settingsSchema } from "../schemas/settingsSchema";

export function SettingsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data, isLoading, isError, refetch } = useGetUserProfileQuery();
  const [logoutUser, { isLoading: isLoggingOut }] = useLogoutUserMutation();
  const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation();
  const user = data?.user;
  const { control, handleSubmit, reset } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: "",
      email: "",
      currency: "INR",
      defaultTransactionType: "expense",
    },
  });

  useEffect(() => {
    if (!user) return;
    reset({
      name: user.name,
      email: user.email,
      currency: user.currency ?? "INR",
      defaultTransactionType:
        user.defaultTransactionType === "INCOME" ? "income" : "expense",
    });
  }, [user, reset]);

  async function handleSave(values: SettingsFormData) {
    if (!user) return;
    try {
      await updateProfile({
        name: values.name,
        email: values.email,
        currency: values.currency,
        defaultTransactionType:
          values.defaultTransactionType === "income" ? "INCOME" : "EXPENSE",
      }).unwrap();
      toast({ title: "Settings saved", variant: "success" });
    } catch {
      toast({ title: "Unable to save settings", variant: "error" });
    }
  }

  async function handleLogout() {
    try {
      await logoutUser().unwrap();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  }

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Manage your profile and preferences"
      />

      {isLoading ? (
        <Card className="max-w-2xl">
          <LoadingState label="Loading settings..." />
        </Card>
      ) : isError || !user ? (
        <Card className="max-w-2xl">
          <ErrorState message="Could not load your settings. Please try again." />
          <div className="pb-6 text-center">
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        </Card>
      ) : (
        <div className="max-w-2xl space-y-4">
          <form onSubmit={handleSubmit(handleSave)} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
              </CardHeader>
              <CardBody className="space-y-4">
                <FormInput
                  name="name"
                  control={control}
                  label="Name"
                  required
                />
                <FormInput
                  name="email"
                  control={control}
                  label="Email"
                  type="email"
                  required
                />
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
              </CardHeader>
              <CardBody className="space-y-4">
                <FormSelect
                  name="currency"
                  control={control}
                  label="Currency"
                  options={Object.keys(CURRENCY_SYMBOLS).map((currency) => ({
                    value: currency,
                    label: `${currency} (${CURRENCY_SYMBOLS[currency]})`,
                  }))}
                />
                <FormSelect
                  name="defaultTransactionType"
                  control={control}
                  label="Default Transaction Type"
                  options={TRANSACTION_TYPES}
                />
                <Button type="submit" loading={isSaving}>
                  Save Changes
                </Button>
              </CardBody>
            </Card>
          </form>

          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
            </CardHeader>
            <CardBody>
              <Button
                variant="danger"
                leftIcon={<LogOut className="h-4 w-4" />}
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                Logout
              </Button>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}
