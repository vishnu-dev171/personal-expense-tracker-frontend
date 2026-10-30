import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/components/ui/PageHeader";
import { TransactionForm } from "../components/TransactionForm";
import { ErrorState, LoadingState } from "@/components/feedback/States";
import { useGetTransactionByIdQuery } from "@/services/transactionApiSlice";

export function TransactionFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;
  const {
    data: transactionResponse,
    isLoading,
    isError,
  } = useGetTransactionByIdQuery(id ?? "", { skip: !id });
  const transaction = transactionResponse?.data;

  if (isEdit && isLoading) {
    return <LoadingState label="Loading transaction..." />;
  }

  if (isEdit && (isError || !transaction)) {
    return (
      <div>
        <ErrorState
          message={
            isError
              ? "Could not load this transaction. Please try again."
              : "This transaction could not be found."
          }
        />
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
        isBackButton={true}
      />
      <TransactionForm initialData={transaction} />
    </div>
  );
}
