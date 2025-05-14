"use client";

import { getSummary } from "@/hooks/summary/api/use-get-summary";
import { getDateRange } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { FaPiggyBank } from "react-icons/fa";
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";
import { DataCard, DataCardSkeleton } from "@/components/data-card";

export const DataGrid = () => {
  const { data, isLoading } = getSummary();
  const params = useSearchParams();
  const from = params.get("from") || undefined;
  const to = params.get("to") || undefined;

  const dataRangeLabel = getDateRange({ from, to });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8">
        <DataCardSkeleton />
        <DataCardSkeleton />
        <DataCardSkeleton />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8">
      <DataCard
        title="Remaining"
        value={data?.remainingAmount}
        percentageChange={data?.balanceChange}
        icon={FaPiggyBank}
        variant="default"
        dataRangeLabel={dataRangeLabel}
      />
      <DataCard
        title="Income"
        value={data?.incomeAmount}
        percentageChange={data?.incomeChange}
        icon={FaArrowTrendUp}
        variant="default"
        dataRangeLabel={dataRangeLabel}
      />
      <DataCard
        title="Expenses"
        value={data?.expensesAmount}
        percentageChange={data?.expensesChange}
        icon={FaArrowTrendDown}
        variant="default"
        dataRangeLabel={dataRangeLabel}
      />
    </div>
  );
};
