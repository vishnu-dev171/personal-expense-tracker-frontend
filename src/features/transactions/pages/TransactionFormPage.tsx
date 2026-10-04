import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/components/ui/PageHeader";
import { TransactionForm } from "../components/TransactionForm";
import { useFinance } from "@/app/providers/FinanceProvider";
import { ErrorState } from "@/components/feedback/States";

export function TransactionFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { transactions } = useFinance();
  const isEdit = !!id;
  const transaction = isEdit
    ? transactions.find((t) => t.id === id)
    : undefined;

  if (isEdit && !transaction) {
    return (
      <div>
        <ErrorState message="This transaction could not be found." />
        <div className="text-center">
          <button
            onClick={() => navigate("/transactions")}
            className="text-sm text-brand-600"
          >
            Back to transactions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={isEdit ? "Edit Transaction" : "New Transaction"}
        description={
          isEdit
            ? "Update the details of your transaction"
            : "Record a new income or expense"
        }
      />
      <TransactionForm initialData={transaction} />
    </div>
  );
}
