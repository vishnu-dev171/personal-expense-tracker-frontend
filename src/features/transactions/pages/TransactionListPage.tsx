import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Eye, Pencil, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Table } from "@/components/ui/Table";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/feedback/States";
import { useFinance } from "@/app/providers/FinanceProvider";
import { useToast } from "@/components/feedback/Toast";
import { formatCurrency, formatDate } from "@/utils/format";
import { TRANSACTION_TYPES, PAYMENT_METHODS } from "@/constants";
import type { Transaction } from "@/types";

interface Filters {
  search: string;
  type: string;
  categoryId: string;
  paymentMethod: string;
  dateFrom: string;
  dateTo: string;
}

const emptyFilters: Filters = {
  search: "",
  type: "",
  categoryId: "",
  paymentMethod: "",
  dateFrom: "",
  dateTo: "",
};

export function TransactionListPage() {
  const navigate = useNavigate();
  const { transactions, categories, deleteTransaction, getCategoryName } =
    useFinance();
  const { toast } = useToast();
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewId, setViewId] = useState<string | null>(null);
  const viewedTransaction = transactions.find(
    (transaction) => transaction.id === viewId,
  );

  const filtered = useMemo(() => {
    return transactions
      .filter((t) => {
        if (filters.search) {
          const q = filters.search.toLowerCase();
          if (
            !t.description.toLowerCase().includes(q) &&
            !getCategoryName(t.categoryId).toLowerCase().includes(q)
          )
            return false;
        }
        if (filters.type && t.type !== filters.type) return false;
        if (filters.categoryId && t.categoryId !== filters.categoryId)
          return false;
        if (filters.paymentMethod && t.paymentMethod !== filters.paymentMethod)
          return false;
        if (filters.dateFrom && t.date < filters.dateFrom) return false;
        if (filters.dateTo && t.date > filters.dateTo) return false;
        return true;
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [transactions, filters, getCategoryName]);

  const hasFilters = Object.values(filters).some((v) => v !== "");

  function handleDelete() {
    if (!deleteId) return;
    deleteTransaction(deleteId);
    setDeleteId(null);
    toast({ title: "Transaction deleted", variant: "info" });
  }

  return (
    <div>
      <PageHeader
        title="Transactions"
        description="View, edit, and manage all your transactions"
        actions={
          <Button
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => navigate("/transactions/new")}
          >
            Add Transaction
          </Button>
        }
      />

      <Card className="mb-4 p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search description or category..."
              value={filters.search}
              onChange={(e) =>
                setFilters((f) => ({ ...f, search: e.target.value }))
              }
              className="input-base pl-9"
            />
          </div>
          <select
            value={filters.type}
            onChange={(e) =>
              setFilters((f) => ({ ...f, type: e.target.value }))
            }
            className="input-base"
          >
            <option value="">All Types</option>
            {TRANSACTION_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          <select
            value={filters.categoryId}
            onChange={(e) =>
              setFilters((f) => ({ ...f, categoryId: e.target.value }))
            }
            className="input-base"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            value={filters.paymentMethod}
            onChange={(e) =>
              setFilters((f) => ({ ...f, paymentMethod: e.target.value }))
            }
            className="input-base"
          >
            <option value="">All Payment Methods</option>
            {PAYMENT_METHODS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) =>
              setFilters((f) => ({ ...f, dateFrom: e.target.value }))
            }
            className="input-base"
            aria-label="From date"
          />
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) =>
              setFilters((f) => ({ ...f, dateTo: e.target.value }))
            }
            className="input-base"
            aria-label="To date"
          />
        </div>
        {hasFilters && (
          <div className="mt-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilters(emptyFilters)}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </Card>

      <Card>
        {filtered.length === 0 ? (
          <EmptyState
            title="No transactions found"
            description={
              hasFilters
                ? "Try adjusting your filters"
                : "Add your first transaction to start tracking your expenses."
            }
            action={
              !hasFilters && (
                <Button
                  leftIcon={<Plus className="h-4 w-4" />}
                  onClick={() => navigate("/transactions/new")}
                >
                  Add Transaction
                </Button>
              )
            }
          />
        ) : (
          <Table<Transaction & Record<string, unknown>>
            columns={[
              {
                key: "date",
                header: "Date",
                render: (t) => (
                  <span className="text-slate-500">{formatDate(t.date)}</span>
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
                key: "paymentMethod",
                header: "Payment",
                render: (t) => t.paymentMethod,
                hideOnMobile: true,
              },
              {
                key: "type",
                header: "Type",
                render: (t) => (
                  <Badge variant={t.type === "income" ? "success" : "error"}>
                    {t.type === "income" ? "Income" : "Expense"}
                  </Badge>
                ),
              },
              {
                key: "amount",
                header: "Amount",
                render: (t) => (
                  <span
                    className={`font-semibold ${t.type === "income" ? "text-emerald-600" : "text-slate-700"}`}
                  >
                    {t.type === "income" ? "+" : "-"}
                    {formatCurrency(t.amount)}
                  </span>
                ),
              },
              {
                key: "actions",
                header: "Actions",
                render: (t) => (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setViewId(t.id)}
                      className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-brand-600"
                      aria-label="View"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => navigate(`/transactions/${t.id}/edit`)}
                      className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-brand-600"
                      aria-label="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeleteId(t.id)}
                      className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ),
              },
            ]}
            data={
              filtered as unknown as (Transaction & Record<string, unknown>)[]
            }
            rowKey={(t) => t.id}
          />
        )}
      </Card>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Transaction?"
        message="Are you sure you want to delete this transaction? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />

      <Modal
        open={!!viewedTransaction}
        onClose={() => setViewId(null)}
        title="Transaction Details"
      >
        {viewedTransaction && (
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            <dt className="text-slate-500">Description</dt>
            <dd className="font-medium text-slate-800">
              {viewedTransaction.description || "—"}
            </dd>
            <dt className="text-slate-500">Date</dt>
            <dd className="font-medium text-slate-800">
              {formatDate(viewedTransaction.date)}
            </dd>
            <dt className="text-slate-500">Category</dt>
            <dd className="font-medium text-slate-800">
              {getCategoryName(viewedTransaction.categoryId)}
            </dd>
            <dt className="text-slate-500">Payment Method</dt>
            <dd className="font-medium text-slate-800">
              {viewedTransaction.paymentMethod}
            </dd>
            <dt className="text-slate-500">Type</dt>
            <dd className="font-medium capitalize text-slate-800">
              {viewedTransaction.type}
            </dd>
            <dt className="text-slate-500">Amount</dt>
            <dd className="font-semibold text-slate-800">
              {formatCurrency(viewedTransaction.amount)}
            </dd>
            <dt className="text-slate-500">Notes</dt>
            <dd className="font-medium text-slate-800">
              {viewedTransaction.notes || "—"}
            </dd>
            <dt className="text-slate-500">Receipt</dt>
            <dd className="font-medium text-slate-800">
              {viewedTransaction.receiptName || "—"}
            </dd>
          </dl>
        )}
      </Modal>
    </div>
  );
}
