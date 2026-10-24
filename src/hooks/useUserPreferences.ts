import { DEFAULT_CURRENCY } from "@/constants";
import { useGetUserProfileQuery } from "@/services/userApiSlice";
import type { TransactionType } from "@/types";
import type { User } from "@/types/api.types";

type Currency = NonNullable<User["currency"]>;

export function useUserPreferences(): {
  currency: Currency;
  defaultTransactionType: TransactionType;
  profileLoaded: boolean;
} {
  const { data, isSuccess } = useGetUserProfileQuery();
  const user = data?.user;

  return {
    currency: user?.currency ?? DEFAULT_CURRENCY,
    defaultTransactionType:
      user?.defaultTransactionType === "INCOME" ? "income" : "expense",
    profileLoaded: isSuccess,
  };
}
