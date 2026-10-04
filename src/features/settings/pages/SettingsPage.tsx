import { useToast } from "@/components/feedback/Toast";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { CURRENCY_SYMBOLS, TRANSACTION_TYPES } from "@/constants";
import { useAppDispatch } from "@/hooks/useRedux";
import {
  useGetUserProfileQuery,
  useLogoutUserMutation,
} from "@/services/userApiSlice";
import { updateUser } from "@/store/slices/authSlice";
import { LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function SettingsPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data, isLoading } = useGetUserProfileQuery();
  const [logoutUser, { isLoading: isLoggingOut }] = useLogoutUserMutation();
  const user = data?.user;

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [currency, setCurrency] = useState(user?.currency ?? "INR");
  const [defaultType, setDefaultType] = useState(
    user?.defaultTransactionType ?? "expense",
  );

  function handleSave() {
    if (!user) return;
    dispatch(
      updateUser({
        name,
        email,
        currency,
        defaultTransactionType: defaultType,
      }),
    );
    toast({ title: "Settings saved", variant: "success" });
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

      <div className="max-w-2xl space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardBody className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-base mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-base mt-1"
              />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
          </CardHeader>
          <CardBody className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="input-base mt-1"
              >
                {Object.keys(CURRENCY_SYMBOLS).map((c) => (
                  <option key={c} value={c}>
                    {c} ({CURRENCY_SYMBOLS[c]})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">
                Default Transaction Type
              </label>
              <select
                value={defaultType}
                onChange={(e) =>
                  setDefaultType(e.target.value as "income" | "expense")
                }
                className="input-base mt-1"
              >
                {TRANSACTION_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <Button onClick={handleSave}>Save Changes</Button>
          </CardBody>
        </Card>

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
    </div>
  );
}
