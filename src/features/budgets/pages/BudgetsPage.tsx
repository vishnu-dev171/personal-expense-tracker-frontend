import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Table } from "@/components/ui/Table";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import {
  EmptyState,
  ErrorState,
  LoadingState,
  WarningState,
} from "@/components/feedback/States";
import {
  FormInput,
  FormSelect,
  FormNumberInput,
} from "@/components/forms/FormFields";
import { useToast } from "@/components/feedback/Toast";
import {
  useCreateBudgetMutation,
  useDeleteBudgetMutation,
  useGetAllBudgetsQuery,
  useUpdateBudgetMutation,
} from "@/services/budgetApiSlice";
import { useGetCategoriesDropdownQuery } from "@/services/categoryApiSlice";
import {
  budgetSchema,
  type BudgetFormData,
  type BudgetFormInput,
  monthOptions,
  yearOptions,
} from "../schemas/budgetSchema";
import { formatCurrency, monthLabel } from "@/utils/format";
import { budgetProgress, computeBudgetStatus } from "@/utils/budget";
import { CURRENT_MONTH, CURRENT_YEAR } from "@/constants";
import type {
  BackendBudgetResponse,
  BudgetQueryParams,
} from "@/types/api.types";
import { CURRENCY_SYMBOLS } from "@/constants";
import { useUserPreferences } from "@/hooks/useUserPreferences";

interface BudgetFilters {
  month: string;
  year: string;
  categoryId: string;
  search: string;
}

const initialFilters: BudgetFilters = {
  month: "",
  year: "",
  categoryId: "",
  search: "",
};

export function BudgetsPage() {
  const { toast } = useToast();
  const { currency } = useUserPreferences();
  const [modalOpen, setModalOpen] = useState(false);
  const [editBudget, setEditBudget] = useState<BackendBudgetResponse | null>(
    null,
  );
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const { control: filterControl } = useForm<BudgetFilters>({
    defaultValues: initialFilters,
  });
  const watchedFilters = useWatch({ control: filterControl });
  const filters: BudgetFilters = {
    month: watchedFilters.month ?? "",
    year: watchedFilters.year ?? "",
    categoryId: watchedFilters.categoryId ?? "",
    search: watchedFilters.search ?? "",
  };
  const queryParams: BudgetQueryParams = {
    page,
    limit,
    search: search || undefined,
    month: filters.month ? Number(filters.month) : undefined,
    year: filters.year ? Number(filters.year) : undefined,
    categoryId: filters.categoryId || undefined,
  };
  const {
    data: budgetResponse,
    isLoading,
    isError,
  } = useGetAllBudgetsQuery(queryParams);
  const { data: currentMonthResponse } = useGetAllBudgetsQuery({
    page: 1,
    limit: 100,
    month: CURRENT_MONTH,
    year: CURRENT_YEAR,
  });
  const { data: categoryResponse, isError: isCategoryError } =
    useGetCategoriesDropdownQuery();
  const [createBudget, { isLoading: isCreating }] = useCreateBudgetMutation();
  const [updateBudget, { isLoading: isUpdating }] = useUpdateBudgetMutation();
  const [deleteBudget] = useDeleteBudgetMutation();
  const budgets = budgetResponse?.data?.budgets ?? [];
  const expenseCategories =
    categoryResponse?.data?.filter((category) => category.type === "EXPENSE") ??
    [];
  const currentMonthBudgets = currentMonthResponse?.data?.budgets ?? [];
  const overspentCount = currentMonthBudgets.filter(
    (budget) =>
      computeBudgetStatus(budget.spent, budget.amount) === "overspent",
  ).length;

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setPage(1);
      setSearch(filters.search.trim());
    }, 300);
    return () => window.clearTimeout(timeout);
  }, [filters.search]);

  useEffect(() => {
    setPage(1);
  }, [filters.month, filters.year, filters.categoryId]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<BudgetFormInput, unknown, BudgetFormData>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      categoryId: "",
      amount: undefined,
      month: CURRENT_MONTH,
      year: CURRENT_YEAR,
    },
  });

  function openCreate() {
    setEditBudget(null);
    reset({
      categoryId: "",
      amount: undefined,
      month: CURRENT_MONTH,
      year: CURRENT_YEAR,
    });
    setModalOpen(true);
  }

  function openEdit(budget: BackendBudgetResponse) {
    setEditBudget(budget);
    reset({
      categoryId: budget.categoryId,
      amount: budget.amount,
      month: budget.month,
      year: budget.year,
    });
    setModalOpen(true);
  }

  async function onSubmit(data: BudgetFormData) {
    try {
      if (editBudget) {
        await updateBudget({ ...data, budgetId: editBudget.budgetId }).unwrap();
        toast({ title: "Budget updated", variant: "success" });
      } else {
        await createBudget(data).unwrap();
        toast({ title: "Budget created", variant: "success" });
      }
      setModalOpen(false);
    } catch {
      toast({ title: "Unable to save budget", variant: "error" });
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      await deleteBudget(deleteId).unwrap();
      setDeleteId(null);
      toast({ title: "Budget deleted", variant: "info" });
    } catch {
      toast({ title: "Unable to delete budget", variant: "error" });
    }
  }

  const tableData = budgets as (BackendBudgetResponse &
    Record<string, unknown>)[];

  return (
    <div>
      <PageHeader
        title="Budgets"
        description={`Monthly budgets for ${monthLabel(CURRENT_MONTH)} ${CURRENT_YEAR}`}
        actions={
          <Button leftIcon={<Plus className="h-4 w-4" />} onClick={openCreate}>
            Add Budget
          </Button>
        }
      />

      {overspentCount > 0 && (
        <div className="mb-4">
          <WarningState
            message={`You have ${overspentCount} categor${overspentCount > 1 ? "ies" : "y"} overspent this month.`}
          />
        </div>
      )}

      <Card>
        <div className="grid gap-3 border-b border-slate-100 p-4 sm:grid-cols-2 lg:grid-cols-4">
          <FormInput
            name="search"
            control={filterControl}
            label="Search"
            placeholder="Search categories"
          />
          <FormSelect
            name="month"
            control={filterControl}
            label="Month"
            placeholder="All months"
            options={monthOptions}
          />
          <FormSelect
            name="year"
            control={filterControl}
            label="Year"
            placeholder="All years"
            options={yearOptions}
          />
          <FormSelect
            name="categoryId"
            control={filterControl}
            label="Category"
            placeholder="All categories"
            options={expenseCategories.map((category) => ({
              label: category.name,
              value: category.categoryId,
            }))}
          />
        </div>

        {isLoading ? (
          <LoadingState label="Loading budgets..." />
        ) : isError ? (
          <ErrorState message="Could not load budgets. Please try again." />
        ) : budgets.length === 0 ? (
          <EmptyState
            title={
              search || filters.month || filters.year || filters.categoryId
                ? "No matching budgets"
                : "No budgets yet"
            }
            description={
              search || filters.month || filters.year || filters.categoryId
                ? "Try changing your search or filters"
                : "Create a budget to track your spending limits"
            }
            action={
              <Button
                leftIcon={<Plus className="h-4 w-4" />}
                onClick={openCreate}
              >
                Add Budget
              </Button>
            }
          />
        ) : (
          <Table<BackendBudgetResponse & Record<string, unknown>>
            wrapperClassName="p-4"
            columns={[
              {
                key: "categoryName",
                header: "Category",
                render: (budget) => (
                  <span className="font-medium text-slate-700">
                    {budget.categoryName}
                  </span>
                ),
              },
              {
                key: "period",
                header: "Period",
                render: (budget) => (
                  <span>
                    {monthLabel(budget.month)} {budget.year}
                  </span>
                ),
              },
              {
                key: "amount",
                header: "Budget",
                render: (budget) => formatCurrency(budget.amount, currency),
              },
              {
                key: "spent",
                header: "Spent",
                render: (budget) => formatCurrency(budget.spent, currency),
              },
              {
                key: "remaining",
                header: "Remaining",
                render: (budget) => (
                  <span
                    className={
                      budget.remaining < 0
                        ? "font-medium text-red-600"
                        : "font-medium text-emerald-600"
                    }
                  >
                    {formatCurrency(budget.remaining, currency)}
                  </span>
                ),
              },
              {
                key: "usage",
                header: "Usage",
                render: (budget) => {
                  const status = computeBudgetStatus(
                    budget.spent,
                    budget.amount,
                  );
                  return (
                    <div className="min-w-28">
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
                      <div className="mt-1 flex items-center justify-between gap-2">
                        <span className="text-xs text-slate-400">
                          {Math.round(budget.percentageUsed)}%
                        </span>
                        <Badge
                          variant={
                            status === "overspent"
                              ? "error"
                              : status === "near-limit"
                                ? "warning"
                                : "success"
                          }
                        >
                          {status === "overspent"
                            ? "Overspent"
                            : status === "near-limit"
                              ? "Near limit"
                              : "On track"}
                        </Badge>
                      </div>
                    </div>
                  );
                },
              },
              {
                key: "actions",
                header: "Actions",
                render: (budget) => (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEdit(budget)}
                      className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-brand-600"
                      aria-label={`Edit ${budget.categoryName} budget`}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeleteId(budget.budgetId)}
                      className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500"
                      aria-label={`Delete ${budget.categoryName} budget`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ),
              },
            ]}
            data={tableData}
            rowKey={(budget) => budget.budgetId}
            pagination={{
              page: budgetResponse?.data?.page ?? page,
              pageSize: budgetResponse?.data?.limit ?? limit,
              totalItems: budgetResponse?.data?.totalRecords ?? 0,
              onPageChange: setPage,
              onPageSizeChange: (newLimit) => {
                setPage(1);
                setLimit(newLimit);
              },
            }}
          />
        )}
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editBudget ? "Edit Budget" : "Add Budget"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormSelect
            name="categoryId"
            control={control}
            label="Category"
            required
            placeholder="Select expense category"
            options={expenseCategories.map((category) => ({
              value: category.categoryId,
              label: category.name,
            }))}
          />
          {isCategoryError && (
            <p className="text-sm text-red-600">
              Could not load categories. Please try again.
            </p>
          )}
          <FormNumberInput
            name="amount"
            control={control}
            label="Budget Amount"
            required
            placeholder="0.00"
            min={0}
            prefix={CURRENCY_SYMBOLS[currency]}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormSelect
              name="month"
              control={control}
              label="Month"
              required
              options={monthOptions}
            />
            <FormSelect
              name="year"
              control={control}
              label="Year"
              required
              options={yearOptions}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              loading={isSubmitting || isCreating || isUpdating}
            >
              {editBudget ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Budget?"
        message="Are you sure you want to delete this budget? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
