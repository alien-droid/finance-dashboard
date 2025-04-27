import { useNewTransaction } from "@/hooks/transactions/use-new-transaction";
import { z } from "zod";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/Sheet";
import { transactionsInsertSchema } from "@/db/schema";
import { useCreateTransaction } from "@/hooks/transactions/api/use-create-transaction";
import { useCreateCategory } from "@/hooks/categories/api/use-create-category";
import { getCategories } from "@/hooks/categories/api/use-get-categories";
import { getAccounts } from "@/hooks/accounts/api/use-get-accounts";
import { useCreateAccount } from "@/hooks/accounts/api/use-create-account";
import { TransactionForm } from "./transaction-form";
import { Loader2 } from "lucide-react";

const formSchema = transactionsInsertSchema.omit({ id: true });
type formValues = z.input<typeof formSchema>;

export const NewTransactionSheet = () => {
  const { isOpen, onClose } = useNewTransaction();
  const createMutation = useCreateTransaction();

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
    createMutation.isPending ||
    categoryMutation.isPending ||
    accountMutation.isPending;

  const isLoading = categoryQuery.isLoading || accountsQuery.isLoading;

  const handleSubmit = (values: formValues) => {
    createMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>New Transaction</SheetTitle>
          <SheetDescription>
            Create a new transaction to track.
          </SheetDescription>
        </SheetHeader>
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="size-4 text-muted-foreground animate-spin" />
          </div>
        ) : (
          <TransactionForm
            onSubmit={handleSubmit}
            disabled={isPending}
            categoryOptions={categoriesOptions}
            onCreateCategory={onCreateCategory}
            accountOptions={accountOptions}
            onCreateAccount={onCreateAccount}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};
