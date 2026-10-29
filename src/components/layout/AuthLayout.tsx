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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-blue-50 via-slate-50 to-white px-4 py-10">
      <div className="pointer-events-none absolute -left-24 top-0 h-96 w-96 rounded-full bg-brand-600/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-sky-400/20 blur-3xl" />

      {/* floating chips (desktop only) */}
      <div className="absolute left-[10%] top-[22%] hidden items-center gap-2 rounded-xl border border-white bg-white/80 px-4 py-3 shadow-lg backdrop-blur xl:flex">
        <BarChart3 size={18} className="text-brand-600" />
        <span className="text-sm font-medium text-slate-700">
          Monthly report ready
        </span>
      </div>
      <div className="absolute bottom-[20%] right-[10%] hidden items-center gap-2 rounded-xl border border-white bg-white/80 px-4 py-3 shadow-lg backdrop-blur xl:flex">
        <Wallet size={18} className="text-emerald-600" />
        <span className="text-sm font-medium text-slate-700">
          Saved 18% this month
        </span>
      </div>

      <div className="relative w-full max-w-md">
        <div className="mb-6 flex flex-col items-center text-center">
          <Logo className="mb-4 h-14 w-14" />
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {title}
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">{subtitle}</p>
        </div>
        <div className="rounded-2xl border border-white/70 bg-white/80 p-7 shadow-xl shadow-slate-900/5 ring-1 ring-slate-900/5 backdrop-blur-xl">
          {error}
          {children}
          <div className="mt-6 text-center text-sm text-slate-500">
            {footer}
          </div>
        </div>
        <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-slate-400">
          <ShieldCheck size={14} /> Secured with encryption
        </p>
      </div>
    </div>
  );
}
