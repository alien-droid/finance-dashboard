import { JSX, useRef, useState } from "react"; // useful-hook for dialog box - confirmation of delete

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { getAccounts } from "./api/use-get-accounts";
import { useCreateAccount } from "./api/use-create-account";
import { Select } from "@/components/select";

export const useSelectAccount = (): [
  () => JSX.Element,
  () => Promise<unknown>
] => {
  const accountQuery = getAccounts();
  const accountMutation = useCreateAccount();
  const onCreateAccount = (name: string) => {
    accountMutation.mutate({ name });
  };

  const accountOptions = (accountQuery.data ?? []).map((account) => ({
    label: account.name,
    value: account.id,
  }));

  const [promise, setPromise] = useState<{
    resolve: (value: string | undefined) => void;
  } | null>(null);

  const selectValue = useRef<string>();

  const confirm = () =>
    new Promise((resolve, reject) => {
      setPromise({ resolve });
    });

  const handleClose = () => {
    setPromise(null);
  };

  const handleConfirm = () => {
    if (promise) {
      promise.resolve(selectValue.current);
      handleClose();
    }
  };

  const handleCancel = () => {
    if (promise) {
      promise.resolve(undefined);
      handleClose();
    }
  };

  const ConfirmationDialog = () => (
    <Dialog open={promise !== null}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Account</DialogTitle>
          <DialogDescription>Please select an account</DialogDescription>
        </DialogHeader>
        <Select
          placeholder="Select an Account"
          options={accountOptions}
          onChange={(value) => (selectValue.current = value)}
          onCreate={onCreateAccount}
          disabled={accountQuery.isLoading || accountMutation.isPending}
        />

        <DialogFooter className="pt-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
  return [ConfirmationDialog, confirm];
};
