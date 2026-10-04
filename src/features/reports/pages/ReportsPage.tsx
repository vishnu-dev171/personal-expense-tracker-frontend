import { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  LineChart, Line,
} from 'recharts';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/feedback/States';
import { useFinance } from '@/app/providers/FinanceProvider';
import { formatCurrency, monthLabel, toISODate } from '@/utils/format';
import { TRANSACTION_TYPES } from '@/constants';
import { TrendingUp, TrendingDown, Scale } from 'lucide-react';

interface ReportFilters {
  dateFrom: string;
  dateTo: string;
  type: string;
  categoryId: string;
}

export function ReportsPage() {
  const { transactions, categories, getCategoryName } = useFinance();
  const [filters, setFilters] = useState<ReportFilters>({
    dateFrom: '',
    dateTo: '',
    type: '',
    categoryId: '',
  });

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      if (filters.dateFrom && t.date < filters.dateFrom) return false;
      if (filters.dateTo && t.date > filters.dateTo) return false;
      if (filters.type && t.type !== filters.type) return false;
      if (filters.categoryId && t.categoryId !== filters.categoryId) return false;
      return true;
    });
  }, [transactions, filters]);

  const summary = useMemo(() => {
    let income = 0;
    let expense = 0;
    for (const t of filtered) {
      if (t.type === 'income') income += t.amount;
      else expense += t.amount;
    }
    return { income, expense, net: income - expense };
  }, [filtered]);

  const expenseBreakdown = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of filtered) {
      if (t.type !== 'expense') continue;
      const name = getCategoryName(t.categoryId);
      map.set(name, (map.get(name) ?? 0) + t.amount);
    }
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filtered, getCategoryName]);

  const monthlyTrend = useMemo(() => {
    const map = new Map<string, { month: string; income: number; expense: number }>();
    for (const t of filtered) {
      const d = new Date(t.date);
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
      const label = `${monthLabel(d.getMonth() + 1).slice(0, 3)} ${d.getFullYear().toString().slice(2)}`;
      const entry = map.get(key) ?? { month: label, income: 0, expense: 0 };
      if (t.type === 'income') entry.income += t.amount;
      else entry.expense += t.amount;
      map.set(key, entry);
    }
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, v]) => v);
  }, [filtered]);

  const hasFilters = Object.values(filters).some((v) => v !== '');

  function setToday() {
    const now = new Date();
    const first = new Date(now.getFullYear(), now.getMonth(), 1);
    setFilters((f) => ({ ...f, dateFrom: toISODate(first), dateTo: toISODate(now) }));
  }

  return (
    <div>
      <PageHeader
        title="Reports"
        description="Analyze your income and expenses over time"
      />

      <Card className="mb-4 p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="text-xs font-medium text-slate-500">Start Date</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters((f) => ({ ...f, dateFrom: e.target.value }))}
              className="input-base mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500">End Date</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters((f) => ({ ...f, dateTo: e.target.value }))}
              className="input-base mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500">Type</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
              className="input-base mt-1"
            >
              <option value="">All Types</option>
              {TRANSACTION_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500">Category</label>
            <select
              value={filters.categoryId}
              onChange={(e) => setFilters((f) => ({ ...f, categoryId: e.target.value }))}
              className="input-base mt-1"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          <Button variant="ghost" size="sm" onClick={setToday}>This Month</Button>
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={() => setFilters({ dateFrom: '', dateTo: '', type: '', categoryId: '' })}>
              Clear Filters
            </Button>
          )}
        </div>
      </Card>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState title="No data for selected filters" description="Try adjusting your date range or filters" />
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
                    <p className="text-lg font-semibold text-emerald-600">{formatCurrency(summary.income)}</p>
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
                    <p className="text-lg font-semibold text-red-600">{formatCurrency(summary.expense)}</p>
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
                    <p className={`text-lg font-semibold ${summary.net >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {formatCurrency(summary.net)}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>Income vs Expense</CardTitle></CardHeader>
              <CardBody>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} />
                    <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                    <Tooltip formatter={(v: number) => formatCurrency(v)} />
                    <Legend />
                    <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardBody>
            </Card>

            <Card>
              <CardHeader><CardTitle>Monthly Trend</CardTitle></CardHeader>
              <CardBody>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} />
                    <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                    <Tooltip formatter={(v: number) => formatCurrency(v)} />
                    <Legend />
                    <Line type="monotone" dataKey="income" name="Income" stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" dataKey="expense" name="Expense" stroke="#ef4444" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardBody>
            </Card>
          </div>

          <Card className="mt-4">
            <CardHeader><CardTitle>Expense Breakdown by Category</CardTitle></CardHeader>
            <CardBody>
              {expenseBreakdown.length === 0 ? (
                <p className="py-8 text-center text-sm text-slate-400">No expense data for this period</p>
              ) : (
                <div className="space-y-3">
                  {expenseBreakdown.map((item) => {
                    const pct = summary.expense > 0 ? (item.value / summary.expense) * 100 : 0;
                    return (
                      <div key={item.name}>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-slate-700">{item.name}</span>
                          <span className="text-slate-500">
                            {formatCurrency(item.value)} <Badge variant="neutral" className="ml-1">{pct.toFixed(0)}%</Badge>
                          </span>
                        </div>
                        <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                          <div className="h-full rounded-full bg-brand-500 transition-all" style={{ width: `${pct}%` }} />
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
