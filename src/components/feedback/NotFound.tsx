import { ArrowLeft, SearchX } from "lucide-react";
import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
          <SearchX aria-hidden="true" className="h-8 w-8" />
        </div>
        <p className="mt-8 text-sm font-semibold uppercase tracking-wider text-brand-600">
          Error 404
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
          Page not found
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          We couldn&apos;t find the page you were looking for. It may have moved
          or the address may be incorrect.
        </p>
        <Link
          to="/dashboard"
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-200"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          Back to dashboard
        </Link>
      </div>
    </main>
  );
}
