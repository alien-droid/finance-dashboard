"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { useNewAccount } from "@/hooks/accounts/use-new-account";
import { columns } from "./columns";
import { DataTable } from "@/components/data-table";
import { getAccounts } from "@/hooks/accounts/api/use-get-accounts";
import { Skeleton } from "@/components/ui/skeleton";
import { useBulkDeleteAccounts } from "@/hooks/accounts/api/use-bulk-delete";

const AccountsPage = () => {
  const newAccount = useNewAccount();
  const accountsQuery = getAccounts();
  const accounts = accountsQuery.data || [];

  const deleteAccounts = useBulkDeleteAccounts();

  const isDisabled = accountsQuery.isLoading || deleteAccounts.isPending;

  if (accountsQuery.isLoading) {
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

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-32">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">Accounts</CardTitle>
          <Button size="sm" onClick={newAccount.onOpen}>
            <Plus className="size-4 mr-2" />
            Add new
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            data={accounts}
            columns={columns}
            filterKey="name"
            onDelete={(row) => {
              const ids = row.map((row) => row.original.id);
              deleteAccounts.mutate({ ids });
            }}
            disabled={isDisabled}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountsPage;
