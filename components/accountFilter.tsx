"use client";

import qs from "query-string";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAccounts } from "@/hooks/accounts/api/use-get-accounts";
import { getSummary } from "@/hooks/summary/api/use-get-summary";


export const AccountFilter = () => {
  const router = useRouter();
  const pathname = usePathname();

  const params = useSearchParams();
  const accountId = params.get("accountId") || "all";
  const from = params.get("from") || "";
  const to = params.get("to") || "";

  const { data: accounts, isLoading } = getAccounts();
  const { isLoading: isSummaryLoading } = getSummary();

  const onChange = (value: string) => {
    const query = {
      accountId: value,
      from,
      to,
    };
    if (value === "all") {
      query.accountId = "";
    }
    const url = qs.stringifyUrl(
      { url: pathname, query },
      { skipNull: true, skipEmptyString: true }
    );

    router.push(url);
  };

  return (
    <Select value={accountId} onValueChange={onChange} disabled={isLoading || isSummaryLoading}>
      <SelectTrigger className="lg:w-auto w-full h-9 rounded-md px-3 font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus:ring-offset-0 focus:ring-transparent outline-none text-white focus:bg-white/30 transition">
        <SelectValue placeholder="Select Account"></SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Accounts</SelectItem>
        {accounts?.map((account) => (
          <SelectItem key={account.id} value={account.id}>
            {account.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
