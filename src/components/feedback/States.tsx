import type { ReactNode } from "react";
import { AlertTriangle, Inbox, Loader2, AlertCircle } from "lucide-react";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Inbox className="mb-3 h-10 w-10 text-slate-300" />
      <p className="text-sm font-medium text-slate-600">{title}</p>
      {description && (
        <p className="mt-1 text-sm text-slate-400">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function LoadingState({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-16 text-center">
      <Loader2 className="mb-2 h-8 w-8 animate-spin text-brand-500" />
      <p className="text-sm text-slate-400">{label}</p>
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <AlertCircle className="mb-3 h-10 w-10 text-red-400" />
      <p className="text-sm font-medium text-slate-600">Something went wrong</p>
      <p className="mt-1 text-sm text-slate-400">{message}</p>
    </div>
  );
}

export function WarningState({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-700">
      <AlertTriangle className="h-4 w-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
