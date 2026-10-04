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
import { useFinance } from "@/app/providers/FinanceProvider";
import { formatCurrency, formatDate, monthLabel } from "@/utils/format";
import { budgetProgress } from "@/utils/budget";
import { CURRENT_MONTH, CURRENT_YEAR } from "@/constants";
import type { Transaction, BudgetWithStatus } from "@/types";

export function DashboardPage() {
  const navigate = useNavigate();
  const { transactions, categories, getCategoryName, currentMonthBudgets } =
    useFinance();

  const totals = useMemo(() => {
    let income = 0;
    let expense = 0;
    for (const t of transactions) {
      if (t.type === "income") income += t.amount;
      else expense += t.amount;
    }
    return { income, expense, balance: income - expense };
  }, [transactions]);

  const totalBudget = useMemo(
    () => currentMonthBudgets.reduce((sum, b) => sum + b.amount, 0),
    [currentMonthBudgets],
  );

  const monthlyTrend = useMemo(() => {
    const map = new Map<
      string,
      { month: string; income: number; expense: number }
    >();
    for (const t of transactions) {
      const d = new Date(t.date);
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
      const label = `${monthLabel(d.getMonth() + 1).slice(0, 3)} ${d.getFullYear().toString().slice(2)}`;
      const entry = map.get(key) ?? { month: label, income: 0, expense: 0 };
      if (t.type === "income") entry.income += t.amount;
      else entry.expense += t.amount;
      map.set(key, entry);
    }
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, v]) => v);
  }, [transactions]);

  const expenseByCategory = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of transactions) {
      if (t.type !== "expense") continue;
      const name = getCategoryName(t.categoryId);
      map.set(name, (map.get(name) ?? 0) + t.amount);
    }
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions, getCategoryName]);

  const recentTransactions = useMemo(
    () =>
      [...transactions]
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 8),
    [transactions],
  );

  const categoryColors = useMemo(() => {
    const colors: Record<string, string> = {};
    for (const c of categories) colors[c.name] = c.color ?? "#64748b";
    return colors;
  }, [categories]);

  const summaryCards = [
    {
      label: "Total Income",
      value: totals.income,
      icon: ArrowDownLeft,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Total Expense",
      value: totals.expense,
      icon: ArrowUpRight,
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      label: "Balance",
      value: totals.balance,
      icon: Wallet,
      color: "text-brand-600",
      bg: "bg-brand-50",
    },
    {
      label: `${monthLabel(CURRENT_MONTH)} Budget`,
      value: totalBudget,
      icon: PiggyBank,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description={`Financial overview for ${monthLabel(CURRENT_MONTH)} ${CURRENT_YEAR}`}
        actions={
          <Button
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => navigate("/transactions/new")}
          >
            Add Transaction
          </Button>
        }
      />

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
                No expense data yet
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
                        key={entry.name}
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
          <Table<Transaction & Record<string, unknown>>
            columns={[
              {
                key: "date",
                header: "Date",
                render: (t) => (
                  <span className="text-slate-500 text-xs">
                    {formatDate(t.date)}
                  </span>
                ),
              },
              {
                key: "description",
                header: "Description",
                render: (t) => t.description || "—",
              },
              {
                key: "categoryId",
                header: "Category",
                render: (t) => (
                  <Badge variant="neutral">
                    {getCategoryName(t.categoryId)}
                  </Badge>
                ),
                hideOnMobile: true,
              },
              {
                key: "amount",
                header: "Amount",
                render: (t) => (
                  <span
                    className={`font-semibold text-sm ${t.type === "income" ? "text-emerald-600" : "text-slate-700"}`}
                  >
                    {t.type === "income" ? "+" : "-"}
                    {formatCurrency(t.amount)}
                  </span>
                ),
              },
            ]}
            data={
              recentTransactions as unknown as (Transaction &
                Record<string, unknown>)[]
            }
            rowKey={(t) => t.id}
            empty="No transactions yet"
          />
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Budget Overview</CardTitle>
          </CardHeader>
          <CardBody className="space-y-4">
            {currentMonthBudgets.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-400">
                No budgets set for this month
              </p>
            ) : (
              currentMonthBudgets.map((b: BudgetWithStatus) => (
                <div key={b.id}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">
                      {b.categoryName}
                    </span>
                    <span className="text-slate-500">
                      {formatCurrency(b.spent)} / {formatCurrency(b.amount)}
                    </span>
                  </div>
                  <div className="mt-1.5">
                    <ProgressBar
                      value={budgetProgress(b.spent, b.amount)}
                      variant={
                        b.status === "overspent"
                          ? "danger"
                          : b.status === "near-limit"
                            ? "warning"
                            : "default"
                      }
                    />
                  </div>
                  <div className="mt-1 flex justify-between text-xs">
                    <span className="text-slate-400">
                      {b.remaining >= 0
                        ? `${formatCurrency(b.remaining)} left`
                        : `${formatCurrency(Math.abs(b.remaining))} over`}
                    </span>
                    {b.status === "overspent" && (
                      <Badge variant="error">Overspent</Badge>
                    )}
                    {b.status === "near-limit" && (
                      <Badge variant="warning">Near limit</Badge>
                    )}
                  </div>
                </div>
              ))
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
