import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Eye, Pencil, Trash2 } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader } from "@/components/ui/Card";
import { Table } from "@/components/ui/Table";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Modal } from "@/components/ui/Modal";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/components/feedback/States";
import {
  FormDateInput,
  FormInput,
  FormSelect,
} from "@/components/forms/FormFields";
import { useToast } from "@/components/feedback/Toast";
import { formatCurrency, formatDate } from "@/utils/format";
import { TRANSACTION_TYPES, PAYMENT_METHODS } from "@/constants";
import type { BackendTransactionResponse } from "@/types/api.types";
import type { PaymentMethod } from "@/types/api.types";
import {
  useDeleteTransactionMutation,
  useGetAllTransactionsQuery,
} from "@/services/transactionApiSlice";
import { useGetCategoriesDropdownQuery } from "@/services/categoryApiSlice";
import { useUserPreferences } from "@/hooks/useUserPreferences";

interface Filters {
  search: string;
  type: "" | "income" | "expense";
  categoryId: string;
  paymentMethod: PaymentMethod | "";
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
  const { toast } = useToast();
  const { currency } = useUserPreferences();
  const { control, reset } = useForm<Filters>({ defaultValues: emptyFilters });
  const watchedFilters = useWatch({ control });
  const filters: Filters = {
    search: watchedFilters.search ?? "",
    type: watchedFilters.type ?? "",
    categoryId: watchedFilters.categoryId ?? "",
    paymentMethod: watchedFilters.paymentMethod ?? "",
    dateFrom: watchedFilters.dateFrom ?? "",
    dateTo: watchedFilters.dateTo ?? "",
  };
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewId, setViewId] = useState<string | null>(null);
  const {
    data: transactionResponse,
    isLoading,
    isError,
  } = useGetAllTransactionsQuery({
    page,
    limit,
    search: search || undefined,
    startDate: filters.dateFrom || undefined,
    endDate: filters.dateTo || undefined,
    type: filters.type || undefined,
    categoryId: filters.categoryId || undefined,
    paymentMethod: filters.paymentMethod || undefined,
  });
  const { data: categoryResponse } = useGetCategoriesDropdownQuery();
  const [deleteTransaction] = useDeleteTransactionMutation();
  const transactions = transactionResponse?.data?.transactions ?? [];
  const categories = categoryResponse?.data ?? [];
  const viewedTransaction = transactions.find(
    (transaction) => transaction.transactionId === viewId,
  );
  const hasFilters = Object.values(filters).some((value) => value !== "");

  useEffect(() => {
    setPage(1);
  }, [
    filters.search,
    filters.type,
    filters.categoryId,
    filters.paymentMethod,
    filters.dateFrom,
    filters.dateTo,
  ]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setSearch(filters.search.trim());
    }, 300);
    return () => window.clearTimeout(timeout);
  }, [filters.search]);

  async function handleDelete() {
    if (!deleteId) return;
    try {
      await deleteTransaction(deleteId).unwrap();
      setDeleteId(null);
      toast({ title: "Transaction deleted", variant: "info" });
    } catch {
      toast({ title: "Unable to delete transaction", variant: "error" });
    }
  }

  function clearFilters() {
    reset(emptyFilters);
    setSearch("");
    setPage(1);
  }

  return (
    <div className="min-w-0">
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
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <FormInput
            name="search"
            control={control}
            label="Search"
            placeholder="Search description or category..."
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
            options={categories.map((category) => ({
              label: category.name,
              value: category.categoryId,
            }))}
          />
          <FormSelect
            name="paymentMethod"
            control={control}
            label="Payment Method"
            placeholder="All Payment Methods"
            options={PAYMENT_METHODS.map((method) => ({
              label: method,
              value: method,
            }))}
          />
          <FormDateInput name="dateFrom" control={control} label="From date" />
          <FormDateInput name="dateTo" control={control} label="To date" />
        </div>
        {hasFilters && (
          <div className="mt-3">
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        )}
      </Card>

      <Card>
        <CardHeader className="font-semibold">Transaction Lists</CardHeader>
        {isLoading ? (
          <LoadingState label="Loading transactions..." />
        ) : isError ? (
          <ErrorState message="Could not load transactions. Please try again." />
        ) : transactions.length === 0 ? (
          <EmptyState
            title={hasFilters ? "No transactions found" : "No transactions yet"}
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
          <Table<BackendTransactionResponse & Record<string, unknown>>
            wrapperClassName="min-w-0 p-4"
            columns={[
              {
                key: "transactionDate",
                header: "Date",
                render: (transaction) => (
                  <span className="text-slate-500">
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
                key: "paymentMethod",
                header: "Payment",
                render: (transaction) => transaction.paymentMethod,
                hideOnMobile: true,
              },
              {
                key: "type",
                header: "Type",
                render: (transaction) => (
                  <Badge
                    variant={
                      transaction.type === "INCOME" ? "success" : "error"
                    }
                  >
                    {transaction.type === "INCOME" ? "Income" : "Expense"}
                  </Badge>
                ),
              },
              {
                key: "amount",
                header: "Amount",
                render: (transaction) => (
                  <span
                    className={`font-semibold ${transaction.type === "INCOME" ? "text-emerald-600" : "text-slate-700"}`}
                  >
                    {transaction.type === "INCOME" ? "+" : "-"}
                    {formatCurrency(transaction.amount, currency)}
                  </span>
                ),
              },
              {
                key: "actions",
                header: "Actions",
                render: (transaction) => (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setViewId(transaction.transactionId)}
                      className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-brand-600"
                      aria-label="View"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() =>
                        navigate(
                          `/transactions/${transaction.transactionId}/edit`,
                        )
                      }
                      className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-brand-600"
                      aria-label="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeleteId(transaction.transactionId)}
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
              transactions as (BackendTransactionResponse &
                Record<string, unknown>)[]
            }
            rowKey={(transaction) => transaction.transactionId}
            pagination={
              transactionResponse?.data
                ? {
                    page: transactionResponse.data.page,
                    pageSize: transactionResponse.data.limit,
                    totalItems: transactionResponse.data.totalRecords,
                    onPageChange: setPage,
                    onPageSizeChange: (newLimit) => {
                      setPage(1);
                      setLimit(newLimit);
                    },
                  }
                : undefined
            }
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
              {formatDate(viewedTransaction.transactionDate)}
            </dd>
            <dt className="text-slate-500">Category</dt>
            <dd className="font-medium text-slate-800">
              {viewedTransaction.categoryName}
            </dd>
            <dt className="text-slate-500">Payment Method</dt>
            <dd className="font-medium text-slate-800">
              {viewedTransaction.paymentMethod}
            </dd>
            <dt className="text-slate-500">Type</dt>
            <dd className="font-medium capitalize text-slate-800">
              {viewedTransaction.type.toLowerCase()}
            </dd>
            <dt className="text-slate-500">Amount</dt>
            <dd className="font-semibold text-slate-800">
              {formatCurrency(viewedTransaction.amount, currency)}
            </dd>
            <dt className="text-slate-500">Notes</dt>
            <dd className="font-medium text-slate-800">
              {viewedTransaction.notes || "—"}
            </dd>
            <dt className="text-slate-500">Attachments</dt>
            <dd className="font-medium text-slate-800">
              {viewedTransaction.files
                .map((file) => file.originalName)
                .join(", ") || "—"}
            </dd>
          </dl>
        )}
      </Modal>
    </div>
  );
}
