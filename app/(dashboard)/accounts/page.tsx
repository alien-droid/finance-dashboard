"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNewAccount } from "@/hooks/accounts/use-new-account";
import { Payment, columns } from "./columns";
import { DataTable } from "@/components/data-table";

const data: Payment[] = [
  {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "m@example.com",
  },
  {
    id: "728ed56f",
    amount: 2000,
    status: "success",
    email: "x@domain.com",
  },
];

const page = () => {
  const newAccount = useNewAccount();

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
            data={data}
            columns={columns}
            filterKey="email"
            onDelete={() => {}}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
