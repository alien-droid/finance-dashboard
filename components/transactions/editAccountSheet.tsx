import { z } from "zod";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/Sheet";
import { AccountForm } from "@/components/accounts/account-form";
import { accountsInsertSchema } from "@/db/schema";
import { useEditAccount } from "@/hooks/accounts/api/use-edit-account";
import { useDeleteAccount } from "@/hooks/accounts/api/use-delete-account";

import { useOpenAccount } from "@/hooks/accounts/use-open-account";
import { getAccount } from "@/hooks/accounts/api/use-get-account";
import { Loader2 } from "lucide-react";
import { useConfirm } from "@/hooks/modals/use-confirm";

const formSchema = accountsInsertSchema.pick({ name: true });
type formValues = z.input<typeof formSchema>;
 
export const EditAccountSheet = () => {
  const { isOpen, onClose, id } = useOpenAccount();
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this account. This action cannot be undone."
  );

  const accountQuery = getAccount(id);
  const editMutation = useEditAccount(id);
  const deleteMutation = useDeleteAccount(id);

  const isPending = editMutation.isPending || deleteMutation.isPending;

  const isLoading = accountQuery.isLoading;

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
      deleteMutation.mutate(undefined,{
        onSuccess: () => {
          onClose();
        },
      });
    }
  }

  const defaultValues = accountQuery.data
    ? { name: accountQuery.data.name }
    : { name: "" };

  return (
    <>
    <ConfirmDialog />
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>Edit Account</SheetTitle>
          <SheetDescription>Edit the details of your account</SheetDescription>
        </SheetHeader>
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-6 w-6 text-muted-foreground animate-spin" />
          </div>
        ) : (
          <AccountForm
            onSubmit={handleSubmit}
            disabled={isPending}
            defaultValues={defaultValues}
            id={id}
            onDelete={onDelete}
          />
        )}
      </SheetContent>
    </Sheet>
    </>
  );
};
