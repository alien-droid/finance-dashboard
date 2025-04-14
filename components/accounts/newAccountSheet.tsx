import { useNewAccount } from "@/hooks/accounts/use-new-account";
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
import { useCreateAccount } from "@/hooks/accounts/use-create-account";

const formSchema = accountsInsertSchema.pick({ name: true });
type formValues = z.input<typeof formSchema>;

export const NewAccountSheet = () => {
  const { isOpen, onClose } = useNewAccount();
  const mutation = useCreateAccount();

  const handleSubmit = (values: formValues) => {
    mutation.mutate(values, {
        onSuccess: () => {
          onClose();
        },
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>New Account</SheetTitle>
          <SheetDescription>
            Create a new account to track your transactions and budgets.
          </SheetDescription>
        </SheetHeader>
        <AccountForm
          onSubmit={handleSubmit}
          disabled={mutation.isPending}
          defaultValues={{ name: "" }}
        />
      </SheetContent>
    </Sheet>
  );
};
