import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/feedback/States";
import { WarningState } from "@/components/feedback/States";
import { FormSelect, FormNumberInput } from "@/components/forms/FormFields";
import { useFinance } from "@/app/providers/FinanceProvider";
import { useToast } from "@/components/feedback/Toast";
import {
  budgetSchema,
  type BudgetFormData,
  monthOptions,
  yearOptions,
} from "../schemas/budgetSchema";
import { formatCurrency, monthLabel } from "@/utils/format";
import { budgetProgress } from "@/utils/budget";
import { CURRENT_MONTH, CURRENT_YEAR } from "@/constants";
import type { Budget, BudgetWithStatus } from "@/types";

export function BudgetsPage() {
  const {
    budgets,
    categories,
    currentMonthBudgets,
    addBudget,
    updateBudget,
    deleteBudget,
    budgetWithStatus,
  } = useFinance();
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editBudget, setEditBudget] = useState<Budget | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const expenseCategories = categories.filter((c) => c.type === "expense");

  const allBudgetsWithStatus: BudgetWithStatus[] =
    budgets.map(budgetWithStatus);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<BudgetFormData>({
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

  function openEdit(b: Budget) {
    setEditBudget(b);
    reset({
      categoryId: b.categoryId,
      amount: b.amount,
      month: b.month,
      year: b.year,
    });
    setModalOpen(true);
  }

  function onSubmit(data: BudgetFormData) {
    if (editBudget) {
      const ok = updateBudget(editBudget.id, data);
      if (!ok) {
        toast({
          title: "Budget already exists",
          description: "A budget for this category and month already exists.",
          variant: "error",
        });
        return;
      }
      toast({ title: "Budget updated", variant: "success" });
      setModalOpen(false);
    } else {
      const ok = addBudget(data);
      if (!ok) {
        toast({
          title: "Budget already exists",
          description: "A budget for this category and month already exists.",
          variant: "error",
        });
        return;
      }
      toast({ title: "Budget created", variant: "success" });
      setModalOpen(false);
    }
  }

  function handleDelete() {
    if (!deleteId) return;
    deleteBudget(deleteId);
    setDeleteId(null);
    toast({ title: "Budget deleted", variant: "info" });
  }

  const overspentCount = currentMonthBudgets.filter(
    (b) => b.status === "overspent",
  ).length;

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

      {allBudgetsWithStatus.length === 0 ? (
        <Card>
          <EmptyState
            title="No budgets yet"
            description="Create a budget to track your spending limits"
            action={
              <Button
                leftIcon={<Plus className="h-4 w-4" />}
                onClick={openCreate}
              >
                Add Budget
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {allBudgetsWithStatus.map((b) => (
            <Card key={b.id}>
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-slate-800">
                      {b.categoryName}
                    </p>
                    <p className="text-xs text-slate-400">
                      {monthLabel(b.month)} {b.year}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEdit(b)}
                      className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-brand-600"
                      aria-label="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeleteId(b.id)}
                      className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-slate-500">Budget</span>
                  <span className="font-semibold text-slate-800">
                    {formatCurrency(b.amount)}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between text-sm">
                  <span className="text-slate-500">Spent</span>
                  <span
                    className={`font-semibold ${b.status === "overspent" ? "text-red-600" : "text-slate-700"}`}
                  >
                    {formatCurrency(b.spent)}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between text-sm">
                  <span className="text-slate-500">Remaining</span>
                  <span
                    className={`font-semibold ${b.remaining < 0 ? "text-red-600" : "text-emerald-600"}`}
                  >
                    {formatCurrency(b.remaining)}
                  </span>
                </div>

                <div className="mt-3">
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

                <div className="mt-2 flex justify-between items-center">
                  <span className="text-xs text-slate-400">
                    {budgetProgress(b.spent, b.amount)}% used
                  </span>
                  {b.status === "overspent" && (
                    <Badge variant="error">Overspent</Badge>
                  )}
                  {b.status === "near-limit" && (
                    <Badge variant="warning">Near limit</Badge>
                  )}
                  {b.status === "normal" && (
                    <Badge variant="success">On track</Badge>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

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
            options={expenseCategories.map((c) => ({
              value: c.id,
              label: c.name,
            }))}
          />
          <FormNumberInput
            name="amount"
            control={control}
            label="Budget Amount"
            required
            placeholder="0.00"
            min={0}
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
            <Button type="submit" className="flex-1" loading={isSubmitting}>
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
