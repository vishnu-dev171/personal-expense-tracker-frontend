import { useForm, useWatch } from "react-hook-form";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  FormDateInput,
  FormSelect,
} from "@/components/forms/FormFields";
import { Badge } from "@/components/ui/Badge";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/components/feedback/States";
import { formatCurrency, toISODate } from "@/utils/format";
import { TRANSACTION_TYPES } from "@/constants";
import { TrendingUp, TrendingDown, Scale } from "lucide-react";
import { useGetReportsQuery } from "@/services/reportApiSlice";
import { useGetCategoriesDropdownQuery } from "@/services/categoryApiSlice";
import type { ReportQueryParams } from "@/types/api.types";

interface ReportFilters {
  dateFrom: string;
  dateTo: string;
  type: ReportQueryParams["type"] | "";
  categoryId: string;
}

export function ReportsPage() {
  const defaultFilters: ReportFilters = {
    dateFrom: "",
    dateTo: "",
    type: "",
    categoryId: "",
  };
  const { control, reset } = useForm<ReportFilters>({
    defaultValues: defaultFilters,
  });
  const watchedFilters = useWatch({ control });
  const filters: ReportFilters = {
    dateFrom: watchedFilters.dateFrom ?? "",
    dateTo: watchedFilters.dateTo ?? "",
    type: watchedFilters.type ?? "",
    categoryId: watchedFilters.categoryId ?? "",
  };

  const categoryQuery = useGetCategoriesDropdownQuery();
  const categoryOptions = categoryQuery.data?.data ?? [];
  const hasInvalidDateRange =
    Boolean(filters.dateFrom && filters.dateTo) &&
    filters.dateFrom > filters.dateTo;
  const reportQuery: ReportQueryParams = {
    ...(filters.dateFrom && { startDate: filters.dateFrom }),
    ...(filters.dateTo && { endDate: filters.dateTo }),
    ...(filters.type && { type: filters.type }),
    ...(filters.categoryId && { categoryId: filters.categoryId }),
  };
  const {
    data: reportResponse,
    isLoading,
    isError,
    refetch,
  } = useGetReportsQuery(reportQuery, { skip: hasInvalidDateRange });

  const report = reportResponse?.data;

  const hasFilters = Object.values(filters).some((v) => v !== "");
  const hasReportData =
    report !== undefined &&
    (report.summary.totalIncome !== 0 || report.summary.totalExpense !== 0);

  function setToday() {
    const now = new Date();
    const first = new Date(now.getFullYear(), now.getMonth(), 1);
    reset({
      ...filters,
      dateFrom: toISODate(first),
      dateTo: toISODate(now),
    });
  }

  return (
    <div>
      <PageHeader
        title="Reports"
        description="Analyze your income and expenses over time"
      />

      <Card className="mb-4 p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <FormDateInput
            name="dateFrom"
            control={control}
            label="Start Date"
            max={filters.dateTo || undefined}
          />
          <FormDateInput
            name="dateTo"
            control={control}
            label="End Date"
            min={filters.dateFrom || undefined}
          />
          <FormSelect
            name="type"
            control={control}
            label="Type"
            placeholder="All Types"
            options={TRANSACTION_TYPES}
          />
          <FormSelect
            name="categoryId"
            control={control}
            label="Category"
            placeholder="All Categories"
            disabled={categoryQuery.isLoading || categoryQuery.isError}
            options={categoryOptions.map((category) => ({
              label: category.name,
              value: category.categoryId,
            }))}
          />
        </div>
        {categoryQuery.isError && (
          <div
            className="mt-3 flex items-center gap-2 text-sm text-red-600"
            role="alert"
          >
            <span>Could not load categories for filtering.</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => categoryQuery.refetch()}
            >
              Retry
            </Button>
          </div>
        )}
        <div className="mt-3 flex gap-2">
          <Button variant="ghost" size="sm" onClick={setToday}>
            This Month
          </Button>
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => reset(defaultFilters)}
            >
              Clear Filters
            </Button>
          )}
        </div>
      </Card>

      {hasInvalidDateRange ? (
        <Card>
          <EmptyState
            title="Invalid date range"
            description="The end date must be on or after the start date."
          />
        </Card>
      ) : isLoading ? (
        <Card>
          <LoadingState label="Loading report data..." />
        </Card>
      ) : isError || !report ? (
        <Card>
          <ErrorState message="Could not load report data. Please try again." />
          <div className="pb-6 text-center">
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        </Card>
      ) : !hasReportData ? (
        <Card>
          <EmptyState
            title="No data for selected filters"
            description="Try adjusting your date range or filters"
          />
        </Card>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardBody>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
                    <TrendingUp className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Total Income</p>
                    <p className="text-lg font-semibold text-emerald-600">
                      {formatCurrency(report.summary.totalIncome)}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50">
                    <TrendingDown className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Total Expense</p>
                    <p className="text-lg font-semibold text-red-600">
                      {formatCurrency(report.summary.totalExpense)}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50">
                    <Scale className="h-5 w-5 text-brand-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Net Balance</p>
                    <p
                      className={`text-lg font-semibold ${report.summary.net >= 0 ? "text-emerald-600" : "text-red-600"}`}
                    >
                      {formatCurrency(report.summary.net)}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Income vs Expense</CardTitle>
              </CardHeader>
              <CardBody>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={report.monthlyTrend}>
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
                <CardTitle>Monthly Trend</CardTitle>
              </CardHeader>
              <CardBody>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={report.monthlyTrend}>
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
                    <Line
                      type="monotone"
                      dataKey="income"
                      name="Income"
                      stroke="#10b981"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="expense"
                      name="Expense"
                      stroke="#ef4444"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardBody>
            </Card>
          </div>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Expense Breakdown by Category</CardTitle>
            </CardHeader>
            <CardBody>
              {report.expenseBreakdown.length === 0 ? (
                <p className="py-8 text-center text-sm text-slate-400">
                  No expense data for this period
                </p>
              ) : (
                <div className="space-y-3">
                  {report.expenseBreakdown.map((item) => {
                    const pct =
                      report.summary.totalExpense > 0
                        ? (item.value / report.summary.totalExpense) * 100
                        : 0;
                    return (
                      <div key={item.categoryId}>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-slate-700">
                            {item.name}
                          </span>
                          <span className="text-slate-500">
                            {formatCurrency(item.value)}{" "}
                            <Badge variant="neutral" className="ml-1">
                              {pct.toFixed(0)}%
                            </Badge>
                          </span>
                        </div>
                        <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-brand-500 transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardBody>
          </Card>
        </>
      )}
    </div>
  );
}
