import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  Wallet,
  PiggyBank,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Table } from "@/components/ui/Table";
import { ErrorState, LoadingState } from "@/components/feedback/States";
import { useFinance } from "@/app/providers/FinanceProvider";
import { formatCurrency, formatDate, monthLabel } from "@/utils/format";
import { budgetProgress, computeBudgetStatus } from "@/utils/budget";
import { CURRENT_MONTH, CURRENT_YEAR } from "@/constants";
import type {
  BackendBudgetResponse,
  BackendTransactionResponse,
} from "@/types/api.types";
import { useGetDashboardQuery } from "@/services/dashboardApiSlice";
import { useGetAllTransactionsQuery } from "@/services/transactionApiSlice";
import { useGetAllBudgetsQuery } from "@/services/budgetApiSlice";

export function DashboardPage() {
  const navigate = useNavigate();
  const { categories } = useFinance();
  const {
    data: dashboardResponse,
    isLoading,
    isError,
    refetch,
  } = useGetDashboardQuery();
  const dashboard = dashboardResponse?.data;
  const monthlyTrend = dashboard?.monthlyTrend ?? [];
  const expenseByCategory = dashboard?.expenseByCategory ?? [];
  const {
    data: transactionResponse,
    isLoading: isLoadingTransactions,
    isError: isTransactionsError,
  } = useGetAllTransactionsQuery({ page: 1, limit: 10 });
  const {
    data: budgetResponse,
    isLoading: isLoadingBudgets,
    isError: isBudgetsError,
  } = useGetAllBudgetsQuery({ page: 1, limit: 10 });
  const recentTransactions = transactionResponse?.data?.transactions ?? [];
  const recentBudgets = budgetResponse?.data?.budgets ?? [];

  const categoryColors = useMemo(() => {
    const colors: Record<string, string> = {};
    for (const c of categories) colors[c.name] = c.color ?? "#64748b";
    return colors;
  }, [categories]);

  const summaryCards = dashboard
    ? [
        {
          label: "Total Income",
          value: dashboard.summary.totalIncome,
          icon: ArrowDownLeft,
          color: "text-emerald-600",
          bg: "bg-emerald-50",
        },
        {
          label: "Total Expense",
          value: dashboard.summary.totalExpense,
          icon: ArrowUpRight,
          color: "text-red-600",
          bg: "bg-red-50",
        },
        {
          label: "Balance",
          value: dashboard.summary.balance,
          icon: Wallet,
          color: "text-brand-600",
          bg: "bg-brand-50",
        },
        {
          label: `${monthLabel(dashboard.summary.month)} Budget`,
          value: dashboard.summary.totalBudget,
          icon: PiggyBank,
          color: "text-amber-600",
          bg: "bg-amber-50",
        },
      ]
    : [];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description={`Financial overview for ${monthLabel(dashboard?.summary.month ?? CURRENT_MONTH)} ${dashboard?.summary.year ?? CURRENT_YEAR}`}
        actions={
          <Button
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => navigate("/transactions/new")}
          >
            Add Transaction
          </Button>
        }
      />

      {isLoading && (
        <p className="mb-4 text-sm text-slate-500" role="status">
          Loading dashboard data...
        </p>
      )}
      {isError && (
        <div
          className="mb-4 flex items-center justify-between gap-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          role="alert"
        >
          <span>Dashboard data could not be loaded.</span>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      )}

      {dashboard && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {summaryCards.map((card) => (
            <Card key={card.label}>
              <CardBody>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-400">
                      {card.label}
                    </p>
                    <p className="mt-1 text-xl font-semibold text-slate-800">
                      {formatCurrency(card.value)}
                    </p>
                  </div>
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.bg}`}
                  >
                    <card.icon className={`h-5 w-5 ${card.color}`} />
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Income vs Expense Trend</CardTitle>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: "#64748b" }}
                />
                <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
                <Tooltip
                  formatter={(v) =>
                    typeof v === "number" ? formatCurrency(v) : v
                  }
                />
                <Legend />
                <Bar
                  dataKey="income"
                  name="Income"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="expense"
                  name="Expense"
                  fill="#ef4444"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expense by Category</CardTitle>
          </CardHeader>
          <CardBody>
            {expenseByCategory.length === 0 ? (
              <p className="py-16 text-center text-sm text-slate-400">
                {dashboard
                  ? "No expense data yet"
                  : "Dashboard data unavailable"}
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={expenseByCategory}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    innerRadius={50}
                  >
                    {expenseByCategory.map((entry) => (
                      <Cell
                        key={entry.categoryId}
                        fill={categoryColors[entry.name] ?? "#64748b"}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v) =>
                      typeof v === "number" ? formatCurrency(v) : v
                    }
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardBody>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Transactions</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/transactions")}
              >
                View All
              </Button>
            </div>
          </CardHeader>
          {isLoadingTransactions ? (
            <LoadingState label="Loading recent transactions..." />
          ) : isTransactionsError ? (
            <ErrorState message="Could not load recent transactions. Please try again." />
          ) : (
            <Table<BackendTransactionResponse & Record<string, unknown>>
              columns={[
                {
                  key: "transactionDate",
                  header: "Date",
                  render: (transaction) => (
                    <span className="text-slate-500 text-xs">
                      {formatDate(transaction.transactionDate)}
                    </span>
                  ),
                },
                {
                  key: "description",
                  header: "Description",
                  render: (transaction) => transaction.description || "—",
                },
                {
                  key: "categoryName",
                  header: "Category",
                  render: (transaction) => (
                    <Badge variant="neutral">{transaction.categoryName}</Badge>
                  ),
                  hideOnMobile: true,
                },
                {
                  key: "amount",
                  header: "Amount",
                  render: (transaction) => (
                    <span
                      className={`font-semibold text-sm ${transaction.type === "INCOME" ? "text-emerald-600" : "text-slate-700"}`}
                    >
                      {transaction.type === "INCOME" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </span>
                  ),
                },
              ]}
              data={
                recentTransactions as (BackendTransactionResponse &
                  Record<string, unknown>)[]
              }
              rowKey={(transaction) => transaction.transactionId}
              empty="No transactions yet"
            />
          )}
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Budget Overview</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/budgets")}
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            {isLoadingBudgets ? (
              <LoadingState label="Loading recent budgets..." />
            ) : isBudgetsError ? (
              <ErrorState message="Could not load recent budgets. Please try again." />
            ) : recentBudgets.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-400">
                No budgets yet
              </p>
            ) : (
              recentBudgets.map((budget: BackendBudgetResponse) => {
                const status = computeBudgetStatus(budget.spent, budget.amount);
                return (
                  <div key={budget.budgetId}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-700">
                        {budget.categoryName}
                      </span>
                      <span className="text-right text-slate-500">
                        <span className="block">
                          {formatCurrency(budget.spent)} /{" "}
                          {formatCurrency(budget.amount)}
                        </span>
                        <span className="block text-xs text-slate-400">
                          {monthLabel(budget.month)} {budget.year}
                        </span>
                      </span>
                    </div>
                    <div className="mt-1.5">
                      <ProgressBar
                        value={budgetProgress(budget.spent, budget.amount)}
                        variant={
                          status === "overspent"
                            ? "danger"
                            : status === "near-limit"
                              ? "warning"
                              : "default"
                        }
                      />
                    </div>
                    <div className="mt-1 flex justify-between text-xs">
                      <span className="text-slate-400">
                        {budget.remaining >= 0
                          ? `${formatCurrency(budget.remaining)} left`
                          : `${formatCurrency(Math.abs(budget.remaining))} over`}
                      </span>
                      {status === "overspent" && (
                        <Badge variant="error">Overspent</Badge>
                      )}
                      {status === "near-limit" && (
                        <Badge variant="warning">Near limit</Badge>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
