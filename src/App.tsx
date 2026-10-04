import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppProviders } from "@/app/providers/AppProviders";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { RegisterPage } from "@/features/auth/pages/RegisterPage";
import { DashboardPage } from "@/features/dashboard/pages/DashboardPage";
import { TransactionListPage } from "@/features/transactions/pages/TransactionListPage";
import { TransactionFormPage } from "@/features/transactions/pages/TransactionFormPage";
import { CategoriesPage } from "@/features/categories/pages/CategoriesPage";
import { BudgetsPage } from "@/features/budgets/pages/BudgetsPage";
import { ReportsPage } from "@/features/reports/pages/ReportsPage";
import { SettingsPage } from "@/features/settings/pages/SettingsPage";
import { NotFound } from "@/components/feedback/NotFound";

function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/transactions" element={<TransactionListPage />} />
            <Route path="/transactions/new" element={<TransactionFormPage />} />
            <Route
              path="/transactions/:id/edit"
              element={<TransactionFormPage />}
            />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/budgets" element={<BudgetsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AppProviders>
  );
}

export default App;
