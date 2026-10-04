import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import {
  FormInput,
  FormNumberInput,
  FormSelect,
  FormTextarea,
  FormDateInput,
  FormFileUpload,
} from "@/components/forms/FormFields";
import { Button } from "@/components/ui/Button";
import { TRANSACTION_TYPES, PAYMENT_METHODS } from "@/constants";
import type { Transaction, TransactionType } from "@/types";
import {
  transactionSchema,
  type TransactionFormData,
} from "../schemas/transactionSchema";
import { useFinance } from "@/app/providers/FinanceProvider";
import { useToast } from "@/components/feedback/Toast";
import { toISODate } from "@/utils/format";

interface TransactionFormProps {
  initialData?: Transaction;
}

export function TransactionForm({ initialData }: TransactionFormProps) {
  const navigate = useNavigate();
  const { categories, addTransaction, updateTransaction } = useFinance();
  const { toast } = useToast();
  const isEdit = !!initialData;

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: initialData
      ? {
          type: initialData.type,
          amount: initialData.amount,
          categoryId: initialData.categoryId,
          description: initialData.description,
          date: initialData.date,
          paymentMethod: initialData.paymentMethod,
          notes: initialData.notes,
          receiptName: initialData.receiptName,
        }
      : {
          type: "expense",
          amount: undefined,
          categoryId: "",
          description: "",
          date: toISODate(new Date()),
          paymentMethod: "UPI" as Transaction["paymentMethod"],
          notes: "",
          receiptName: "",
        },
  });

  const selectedType = watch("type");
  const availableCategories = categories.filter(
    (c) => c.type === selectedType && c.status === "active",
  );

  function onSubmit(data: TransactionFormData) {
    const payload: Omit<Transaction, "id"> = {
      amount: data.amount,
      type: data.type,
      categoryId: data.categoryId,
      description: data.description ?? "",
      date: data.date,
      paymentMethod: data.paymentMethod as Transaction["paymentMethod"],
      notes: data.notes,
      receiptName: data.receiptName,
    };
    if (isEdit && initialData) {
      updateTransaction(initialData.id, payload);
      toast({ title: "Transaction updated", variant: "success" });
    } else {
      addTransaction(payload);
      toast({ title: "Transaction created", variant: "success" });
    }
    navigate("/transactions");
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
                  {...control.register("type")}
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
          />
          <FormDateInput name="date" control={control} label="Date" required />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormSelect
            name="categoryId"
            control={control}
            label="Category"
            required
            placeholder="Select category"
            options={availableCategories.map((c) => ({
              value: c.id,
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

        <FormFileUpload
          name="receiptName"
          control={control}
          label="Receipt"
          helperText="Upload a receipt image or document (UI only, no real upload)"
        />
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/transactions")}
        >
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {isEdit ? "Update Transaction" : "Create Transaction"}
        </Button>
      </div>
    </form>
  );
}
