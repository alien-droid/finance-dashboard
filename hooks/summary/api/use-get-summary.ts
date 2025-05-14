import { useQuery } from "@tanstack/react-query"; // query hook to fetch accounts
import { useSearchParams } from "next/navigation";
import { client } from "@/lib/hono";
import { formatAmount } from "@/lib/utils";

export const getSummary = () => {
  const params = useSearchParams();
  const from = params.get("from") || "";
  const to = params.get("to") || "";
  const accountId = params.get("accountId") || "";

  const query = useQuery({
    queryKey: ["summary", { from, to, accountId }],
    queryFn: async () => {
      const response = await client.api.summary.$get({
        query: {
          from,
          to,
          accountId,
        },
      }); // avoid using try catch here as it will be handled by the error handler

      if (!response.ok) {
        // if not there, then additionally need to handle below, throw an error (type-safe)
        throw new Error("Failed to fetch summary");
      }
      const { data } = await response.json();

      return {
        ...data,
        incomeAmount: formatAmount(data.incomeAmount),
        expensesAmount: formatAmount(data.expensesAmount),
        remainingAmount: formatAmount(data.remainingAmount),
        categories: data.categories.map((category) => ({
          ...category,
          value: formatAmount(category.value),
        })),
        days: data.days.map((day) => ({
          ...day,
          income: formatAmount(day.income),
          expense: formatAmount(day.expense),
        })),
      };
    },
  });
  return query;
};
