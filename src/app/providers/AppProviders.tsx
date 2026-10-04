import type { ReactNode } from "react";
import { ToastProvider } from "@/components/feedback/Toast";
import { FinanceProvider } from "./FinanceProvider";
import { StoreProvider } from "./StoreProvider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <StoreProvider>
      <FinanceProvider>
        <ToastProvider>{children}</ToastProvider>
      </FinanceProvider>
    </StoreProvider>
  );
}
