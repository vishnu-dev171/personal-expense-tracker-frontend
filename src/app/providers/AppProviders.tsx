import type { ReactNode } from "react";
import { ToastProvider } from "@/components/feedback/Toast";
import { StoreProvider } from "./StoreProvider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <StoreProvider>
      <ToastProvider>{children}</ToastProvider>
    </StoreProvider>
  );
}
