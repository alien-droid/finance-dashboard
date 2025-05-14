"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { useNewTransaction } from "@/hooks/transactions/use-new-transaction";
import { columns } from "./columns";
import { DataTable } from "@/components/data-table";
import { Skeleton } from "@/components/ui/skeleton";

import { transactions as transactionsSchema } from "@/db/schema";
import { getTransactions } from "@/hooks/transactions/api/use-get-transactions";
import { useBulkDeleteTrsansactions } from "@/hooks/transactions/api/use-bulk-delete";
import { useState } from "react";
import { UploadButton } from "./upload-button";
import ImportCard from "./import-card";
import { useSelectAccount } from "@/hooks/accounts/use-select-account";
import { toast } from "sonner";
import { useBulkCreateTrsansactions } from "@/hooks/transactions/api/use-bulk-create-transactions";
import { on } from "events";

enum VARIANTS {
  LIST = "LIST",
  IMPORT = "IMPORT",
}

const IMPORT_RESULTS = {
  data: [],
  errors: [],
  meta: {},
};

const Page = () => {
  const [AccountDialog, confirm] = useSelectAccount();
  const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST);
  const [importResults, setImportResults] = useState(IMPORT_RESULTS);

  const onUpload = (results: typeof IMPORT_RESULTS) => {
    console.log({ results });
    setImportResults(results);
    setVariant(VARIANTS.IMPORT);
  };

  const onCancelImport = () => {
    setVariant(VARIANTS.LIST);
    setImportResults(IMPORT_RESULTS);
  };

  const newTransaction = useNewTransaction();
  const createTransactions = useBulkCreateTrsansactions();
  const transactionsQuery = getTransactions();
  const transactions = transactionsQuery.data || [];

  const deleteTransactions = useBulkDeleteTrsansactions();

  const isDisabled =
    transactionsQuery.isLoading || deleteTransactions.isPending;

  const onSubmitImport = async (
    values: (typeof transactionsSchema.$inferInsert)[]
  ) => {
    const accountId = await confirm();
    if (!accountId) {
      return toast.error("Please select an account to import transactions.");
    }
    const data = values.map((value) => ({
      ...value,
      accountId: accountId as string,
    }));
    console.log({ data });

    createTransactions.mutate(data, {
      onSuccess: () => {
        onCancelImport();
      },
    });
  };

  if (transactionsQuery.isLoading) {
    return (
      <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-32">
        <Card className="border-none drop-shadow-sm">
          <CardHeader>
            <Skeleton className="w-50 h-8" />
          </CardHeader>
          <CardContent>
            <div className="w-full h-[500px] flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (variant === VARIANTS.IMPORT) {
    return (
      <>
        <AccountDialog />
        <ImportCard
          data={importResults.data}
          onCancel={onCancelImport}
          onSubmit={onSubmitImport}
        />
      </>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-32">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">
            Transaction History
          </CardTitle>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-end gap-2 w-full">
            <Button
              size="sm"
              onClick={newTransaction.onOpen}
              className="w-full lg:w-auto"
            >
              <Plus className="size-4 mr-2" />
              Add new
            </Button>
            <UploadButton onUpload={onUpload} />
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            data={transactions}
            columns={columns}
            filterKey="payee"
            onDelete={(row) => {
              const ids = row.map((row) => row.original.id);
              deleteTransactions.mutate({ ids });
            }}
            disabled={isDisabled}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
