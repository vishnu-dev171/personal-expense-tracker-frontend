import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import {
  FormInput,
  FormNumberInput,
  FormSelect,
  FormTextarea,
  FormDateInput,
} from "@/components/forms/FormFields";
import { Button } from "@/components/ui/Button";
import {
  CURRENCY_SYMBOLS,
  TRANSACTION_TYPES,
  PAYMENT_METHODS,
} from "@/constants";
import type { BackendTransactionResponse } from "@/types/api.types";
import {
  useCreateTransactionMutation,
  useUpdateTransactionMutation,
} from "@/services/transactionApiSlice";
import { useGetCategoriesDropdownQuery } from "@/services/categoryApiSlice";
import { ErrorState, LoadingState } from "@/components/feedback/States";
import {
  transactionSchema,
  type TransactionFormData,
} from "../schemas/transactionSchema";
import { useToast } from "@/components/feedback/Toast";
import { toISODate } from "@/utils/format";
import { useUserPreferences } from "@/hooks/useUserPreferences";

interface TransactionFormProps {
  initialData?: BackendTransactionResponse;
}

export function TransactionForm({ initialData }: TransactionFormProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currency, defaultTransactionType, profileLoaded } =
    useUserPreferences();
  const [attachments, setAttachments] = useState<File[]>([]);
  const {
    data: categoryResponse,
    isLoading: isLoadingCategories,
    isError: isCategoryError,
  } = useGetCategoriesDropdownQuery();
  const [createTransaction, { isLoading: isCreating }] =
    useCreateTransactionMutation();
  const [updateTransaction, { isLoading: isUpdating }] =
    useUpdateTransactionMutation();
  const categories = categoryResponse?.data ?? [];
  const isEdit = !!initialData;

  const {
    control,
    handleSubmit,
    register,
    watch,
    setValue,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: initialData
      ? {
          type: initialData.type === "INCOME" ? "income" : "expense",
          amount: Number(initialData.amount),
          categoryId: initialData.categoryId,
          description: initialData.description ?? "",
          transactionDate: initialData.transactionDate.slice(0, 10),
          paymentMethod: initialData.paymentMethod,
          notes: initialData.notes ?? "",
        }
      : {
          type: defaultTransactionType,
          amount: undefined,
          categoryId: "",
          description: "",
          transactionDate: toISODate(new Date()),
          paymentMethod: "UPI",
          notes: "",
        },
  });

  useEffect(() => {
    if (!isEdit && profileLoaded && !dirtyFields.type) {
      setValue("type", defaultTransactionType);
    }
  }, [
    defaultTransactionType,
    dirtyFields.type,
    isEdit,
    profileLoaded,
    setValue,
  ]);

  const selectedType = watch("type");
  const availableCategories = categories.filter(
    (category) =>
      category.type === (selectedType === "income" ? "INCOME" : "EXPENSE") &&
      category.status === "ACTIVE",
  );

  async function onSubmit(data: TransactionFormData) {
    const payload = {
      type: data.type,
      amount: data.amount,
      categoryId: data.categoryId,
      description: data.description,
      transactionDate: data.transactionDate,
      paymentMethod: data.paymentMethod,
      notes: data.notes,
      attachments,
    };

    try {
      if (isEdit && initialData) {
        await updateTransaction({
          ...payload,
          transactionId: initialData.transactionId,
        }).unwrap();
        toast({ title: "Transaction updated", variant: "success" });
      } else {
        await createTransaction(payload).unwrap();
        toast({ title: "Transaction created", variant: "success" });
      }
      navigate("/transactions");
    } catch {
      toast({ title: "Unable to save transaction", variant: "error" });
    }
  }

  if (isLoadingCategories) {
    return <LoadingState label="Loading categories..." />;
  }

  if (isCategoryError) {
    return (
      <ErrorState message="Could not load categories. Please try again." />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="card-surface p-5 space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-700">
            Transaction Type <span className="text-red-500">*</span>
          </label>
          <div className="mt-2 flex gap-3">
            {TRANSACTION_TYPES.map((t) => (
              <label
                key={t.value}
                className={`flex flex-1 cursor-pointer items-center justify-center rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                  selectedType === t.value
                    ? t.value === "expense"
                      ? "border-red-300 bg-red-50 text-red-700"
                      : "border-emerald-300 bg-emerald-50 text-emerald-700"
                    : "border-slate-200 text-slate-500 hover:bg-slate-50"
                }`}
              >
                <input
                  type="radio"
                  value={t.value}
                  {...register("type")}
                  className="sr-only"
                />
                {t.label}
              </label>
            ))}
          </div>
          {errors.type && (
            <p className="mt-1 text-xs text-red-500">{errors.type.message}</p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormNumberInput
            name="amount"
            control={control}
            label="Amount"
            required
            placeholder="0.00"
            min={0}
            prefix={CURRENCY_SYMBOLS[currency]}
          />
          <FormDateInput
            name="transactionDate"
            control={control}
            label="Date"
            required
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormSelect
            name="categoryId"
            control={control}
            label="Category"
            required
            placeholder="Select category"
            options={availableCategories.map((c) => ({
              value: c.categoryId,
              label: c.name,
            }))}
          />
          <FormSelect
            name="paymentMethod"
            control={control}
            label="Payment Method"
            required
            placeholder="Select payment method"
            options={PAYMENT_METHODS.map((m) => ({ value: m, label: m }))}
          />
        </div>

        <FormInput
          name="description"
          control={control}
          label="Description"
          placeholder="What was this transaction for?"
        />

        <FormTextarea
          name="notes"
          control={control}
          label="Notes"
          placeholder="Additional notes (optional)"
          rows={3}
        />

        <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
          Receipt attachments
          <input
            type="file"
            multiple
            accept="image/*,application/pdf"
            disabled={isCreating || isUpdating}
            onChange={(event) => {
              const selectedFiles = Array.from(event.target.files ?? []);
              if (selectedFiles.length > 5) {
                toast({
                  title: "You can attach up to 5 files",
                  variant: "error",
                });
                event.target.value = "";
                setAttachments([]);
                return;
              }
              setAttachments(selectedFiles);
            }}
            className="block w-full text-sm text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-brand-700 hover:file:bg-brand-100"
          />
          <span className="text-xs font-normal text-slate-400">
            Up to 5 images or PDF files.
          </span>
          {initialData?.files.map((file) => (
            <span
              key={file.fileId}
              className="text-xs font-normal text-slate-500"
            >
              Existing: {file.originalName}
            </span>
          ))}
          {attachments.map((file) => (
            <span
              key={`${file.name}-${file.lastModified}`}
              className="text-xs font-normal text-slate-500"
            >
              Selected: {file.name}
            </span>
          ))}
        </label>
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/transactions")}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={isSubmitting || isCreating || isUpdating}
        >
          {isEdit ? "Update Transaction" : "Create Transaction"}
        </Button>
      </div>
    </form>
  );
}
