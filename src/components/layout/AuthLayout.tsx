import { BarChart3, ShieldCheck, Wallet } from "lucide-react";
import type { ReactNode } from "react";

export interface AuthLayoutProps {
  title: string;
  subtitle: string;
  error?: ReactNode;
  children: ReactNode;
  footer: ReactNode;
}

const Logo = ({ className = "h-12 w-12" }: { className?: string }) => (
  <img
    src="/assets/main-logo.png"
    alt="app-logo"
    className={`${className} rounded-xl object-contain shadow-md shadow-brand-600/20`}
  />
);

export function AuthLayout({
  title,
  subtitle,
  error,
  children,
  footer,
}: AuthLayoutProps) {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10"
      style={{
        backgroundImage:
          "radial-gradient(circle, rgb(203 213 225) 1px, transparent 1px)",
        backgroundSize: "22px 22px",
      }}
    >
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl shadow-slate-900/10 ring-1 ring-slate-200">
        <div className="h-1.5 bg-gradient-to-r from-brand-700 via-brand-600 to-sky-400" />
        <div className="p-8">
          <div className="mb-7 flex items-center gap-4">
            <Logo className="h-12 w-12 shrink-0" />
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                {title}
              </h1>
              <p className="text-sm text-slate-500">{subtitle}</p>
            </div>
          </div>
          {error}
          {children}
          <div className="mt-6 border-t border-slate-100 pt-5 text-center text-sm text-slate-500">
            {footer}
          </div>
        </div>
      </div>
    </div>
  );
}
