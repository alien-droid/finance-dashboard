import { z } from "zod";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/Sheet";
import { transactionsInsertSchema } from "@/db/schema";

import { Loader2 } from "lucide-react";
import { useConfirm } from "@/hooks/modals/use-confirm";
import { useOpenTransaction } from "@/hooks/transactions/use-open-transaction";
import { getTransaction } from "@/hooks/transactions/api/use-get-transaction";
import { useEditTransaction } from "@/hooks/transactions/api/use-edit-transaction";
import { useDeleteTransaction } from "@/hooks/transactions/api/use-delete-transaction";
import { TransactionForm } from "./transaction-form";
import { getCategories } from "@/hooks/categories/api/use-get-categories";
import { useCreateCategory } from "@/hooks/categories/api/use-create-category";
import { getAccounts } from "@/hooks/accounts/api/use-get-accounts";
import { useCreateAccount } from "@/hooks/accounts/api/use-create-account";

const formSchema = transactionsInsertSchema.omit({ id: true });
type formValues = z.input<typeof formSchema>;

export const EditTransactionSheet = () => {
  const { isOpen, onClose, id } = useOpenTransaction();
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this transaction. This action cannot be undone."
  );

  const transactionQuery = getTransaction(id);
  const editMutation = useEditTransaction(id);
  const deleteMutation = useDeleteTransaction(id);

  const categoryQuery = getCategories();
  const categoryMutation = useCreateCategory();
  const onCreateCategory = (name: string) => {
    categoryMutation.mutate({ name });
  };

  const categoriesOptions = (categoryQuery.data ?? []).map((c) => ({
    label: c.name,
    value: c.id,
  }));

  const accountsQuery = getAccounts();
  const accountMutation = useCreateAccount();
  const onCreateAccount = (name: string) => {
    accountMutation.mutate({ name });
  };

  const accountOptions = (accountsQuery.data ?? []).map((a) => ({
    label: a.name,
    value: a.id,
  }));

  const isPending =
    editMutation.isPending ||
    deleteMutation.isPending ||
    categoryMutation.isPending ||
    accountMutation.isPending;

  const isLoading =
    transactionQuery.isLoading ||
    categoryQuery.isLoading ||
    accountsQuery.isLoading;

  const handleSubmit = (values: formValues) => {
    editMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const onDelete = async () => {
    const ok = await confirm();
    if (ok) {
      deleteMutation.mutate(undefined, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  const defaultValues = transactionQuery.data
    ? {
        accountId: transactionQuery.data.accountId,
        categoryId: transactionQuery.data.categoryId,
        amount: transactionQuery.data.amount.toString(),
        date: transactionQuery.data.date
          ? new Date(transactionQuery.data.date)
          : new Date(),
        payee: transactionQuery.data.payee,
        notes: transactionQuery.data.notes,
      }
    : {
        accountId: "",
        categoryId: "",
        amount: "",
        date: new Date(),
        payee: "",
        notes: "",
      };

  return (
    <>
      <ConfirmDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Edit Transaction</SheetTitle>
            <SheetDescription>
              Edit the details of your transaction
            </SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-6 w-6 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <TransactionForm
              id={id}
              onSubmit={handleSubmit}
              disabled={isPending}
              categoryOptions={categoriesOptions}
              onCreateCategory={onCreateCategory}
              accountOptions={accountOptions}
              onCreateAccount={onCreateAccount}
              defaultValues={defaultValues}
              onDelete={onDelete}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
