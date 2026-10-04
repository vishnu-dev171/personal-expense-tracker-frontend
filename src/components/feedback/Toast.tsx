import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";
import type { Toast } from "@/types";
import { generateId } from "@/utils/format";

interface ToastContextValue {
  toast: (t: Omit<Toast, "id">) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

const variantConfig = {
  success: {
    icon: CheckCircle2,
    classes: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  error: { icon: XCircle, classes: "border-red-200 bg-red-50 text-red-700" },
  info: { icon: Info, classes: "border-brand-200 bg-brand-50 text-brand-700" },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (t: Omit<Toast, "id">) => {
      const id = generateId("toast");
      setToasts((prev) => [...prev, { ...t, id }]);
      setTimeout(() => dismiss(id), 4000);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2">
        {toasts.map((t) => {
          const config = variantConfig[t.variant];
          const Icon = config.icon;
          return (
            <div
              key={t.id}
              className={`flex items-start gap-3 rounded-lg border px-4 py-3 shadow-md ${config.classes} animate-in slide-in-from-bottom`}
            >
              <Icon className="mt-0.5 h-5 w-5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium">{t.title}</p>
                {t.description && (
                  <p className="text-xs opacity-80">{t.description}</p>
                )}
              </div>
              <button
                onClick={() => dismiss(t.id)}
                className="shrink-0 opacity-60 hover:opacity-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
