import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Table } from "@/components/ui/Table";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/components/feedback/States";
import { FormInput, FormSelect } from "@/components/forms/FormFields";
import { useFinance } from "@/app/providers/FinanceProvider";
import { useToast } from "@/components/feedback/Toast";
import {
  useActivateCategoryMutation,
  useCreateCategoryMutation,
  useDeactivateCategoryMutation,
  useGetAllCategoriesQuery,
  useUpdateCategoryMutation,
} from "@/services/categoryApiSlice";
import {
  categorySchema,
  type CategoryFormData,
} from "../schemas/categorySchema";
import { TRANSACTION_TYPES } from "@/constants";
import type { BackendCategoryResponse } from "@/types/api.types";

interface CategoryFilters {
  search: string;
}

const colorPalette = [
  "#f97316",
  "#0ea5e9",
  "#ec4899",
  "#8b5cf6",
  "#f59e0b",
  "#ef4444",
  "#14b8a6",
  "#64748b",
  "#10b981",
  "#22c55e",
  "#16a34a",
];

export function CategoriesPage() {
  const { transactions } = useFinance();
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editCategory, setEditCategory] =
    useState<BackendCategoryResponse | null>(null);
  const [categoryToToggle, setCategoryToToggle] =
    useState<BackendCategoryResponse | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { control: filterControl } = useForm<CategoryFilters>({
    defaultValues: { search: "" },
  });
  const searchInput = useWatch({ control: filterControl, name: "search" }) ?? "";
  const [search, setSearch] = useState("");
  const {
    data: categoryResponse,
    isLoading,
    isError,
    error,
  } = useGetAllCategoriesQuery({ page, limit, search: search || undefined });
  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();
  const [activateCategory] = useActivateCategoryMutation();
  const [deactivateCategory] = useDeactivateCategoryMutation();
  const categories = categoryResponse?.data?.categories ?? [];

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setPage(1);
      setSearch(searchInput.trim());
    }, 300);
    return () => window.clearTimeout(timeout);
  }, [searchInput]);

  const txnCount = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of transactions) {
      map.set(t.categoryId, (map.get(t.categoryId) ?? 0) + 1);
    }
    return map;
  }, [transactions]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "", type: "expense" },
  });

  function openCreate() {
    setEditCategory(null);
    reset({ name: "", type: "expense" });
    setModalOpen(true);
  }

  function openEdit(cat: BackendCategoryResponse) {
    setEditCategory(cat);
    reset({
      name: cat.name,
      type: cat.type === "INCOME" ? "income" : "expense",
    });
    setModalOpen(true);
  }

  async function onSubmit(data: CategoryFormData) {
    try {
      if (editCategory) {
        await updateCategory({
          name: data.name,
          type: data.type,
          categoryId: editCategory.categoryId,
        }).unwrap();
        toast({ title: "Category updated", variant: "success" });
      } else {
        await createCategory({ name: data.name, type: data.type }).unwrap();
        toast({ title: "Category created", variant: "success" });
      }
      setModalOpen(false);
    } catch {
      toast({ title: "Unable to save category", variant: "error" });
    }
  }

  async function handleToggle() {
    if (!categoryToToggle) return;
    try {
      if (categoryToToggle.status === "ACTIVE") {
        await deactivateCategory(categoryToToggle.categoryId).unwrap();
      } else {
        await activateCategory(categoryToToggle.categoryId).unwrap();
      }
      setCategoryToToggle(null);
      toast({ title: "Category status updated", variant: "info" });
    } catch {
      toast({ title: "Unable to update category status", variant: "error" });
    }
  }

  return (
    <div>
      <PageHeader
        title="Categories"
        description="Manage your income and expense categories"
        actions={
          <Button leftIcon={<Plus className="h-4 w-4" />} onClick={openCreate}>
            Add Category
          </Button>
        }
      />

      <Card>
        <div className="border-b border-slate-100 p-4">
          <div className="max-w-sm">
            <FormInput
              name="search"
              control={filterControl}
              label="Search"
              placeholder="Search categories"
            />
          </div>
        </div>
        {isLoading ? (
          <LoadingState label="Loading categories..." />
        ) : isError ? (
          <ErrorState
            message={
              error && "data" in error && typeof error.data === "string"
                ? error.data
                : "Could not load categories. Please try again."
            }
          />
        ) : categories.length === 0 ? (
          <EmptyState
            title={search ? "No matching categories" : "No categories yet"}
            description={
              search
                ? "Try a different search term"
                : "Create your first category to organize transactions"
            }
            action={
              <Button
                leftIcon={<Plus className="h-4 w-4" />}
                onClick={openCreate}
              >
                Add Category
              </Button>
            }
          />
        ) : (
          <Table<BackendCategoryResponse & Record<string, unknown>>
            columns={[
              {
                key: "name",
                header: "Category",
                render: (c) => (
                  <div className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{
                        backgroundColor:
                          colorPalette[
                            ((page - 1) * limit + categories.indexOf(c)) %
                              colorPalette.length
                          ],
                      }}
                    />
                    <span className="font-medium text-slate-700">{c.name}</span>
                  </div>
                ),
              },
              {
                key: "type",
                header: "Type",
                render: (c) => (
                  <Badge variant={c.type === "INCOME" ? "success" : "error"}>
                    {c.type}
                  </Badge>
                ),
              },
              {
                key: "status",
                header: "Status",
                render: (c) => (
                  <Badge
                    variant={c.status === "ACTIVE" ? "success" : "neutral"}
                  >
                    {c.status === "ACTIVE" ? "Active" : "Inactive"}
                  </Badge>
                ),
              },
              {
                key: "count",
                header: "Transactions",
                render: (c) => (
                  <span className="text-slate-500">
                    {txnCount.get(c.categoryId) ?? 0}
                  </span>
                ),
                hideOnMobile: true,
              },
              {
                key: "actions",
                header: "Actions",
                render: (c) => (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEdit(c)}
                      className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-brand-600"
                      aria-label="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setCategoryToToggle(c)}
                      className={`rounded-md px-2 py-1 text-xs font-medium ${
                        c.status === "ACTIVE"
                          ? "text-slate-400 hover:bg-amber-50 hover:text-amber-600"
                          : "text-slate-400 hover:bg-emerald-50 hover:text-emerald-600"
                      }`}
                    >
                      {c.status === "ACTIVE" ? "Deactivate" : "Activate"}
                    </button>
                  </div>
                ),
              },
            ]}
            data={
              categories as (BackendCategoryResponse &
                Record<string, unknown>)[]
            }
            rowKey={(c) => c.categoryId}
            pagination={
              categoryResponse
                ? {
                    page: categoryResponse?.data?.page ?? 1,
                    pageSize: categoryResponse?.data?.limit ?? 10,
                    totalItems: categoryResponse?.data?.totalRecords ?? 0,
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

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editCategory ? "Edit Category" : "Add Category"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            name="name"
            control={control}
            label="Category Name"
            required
            placeholder="e.g. Groceries"
          />
          <FormSelect
            name="type"
            control={control}
            label="Category Type"
            required
            options={TRANSACTION_TYPES.map((t) => ({
              value: t.value,
              label: t.label,
            }))}
          />
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
              {editCategory ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!categoryToToggle}
        title="Change Category Status?"
        message="This will activate or deactivate this category. Historical transactions will remain visible."
        confirmLabel="Confirm"
        variant="primary"
        onConfirm={handleToggle}
        onCancel={() => setCategoryToToggle(null)}
      />
    </div>
  );
}
