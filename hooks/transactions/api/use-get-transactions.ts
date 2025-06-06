'use client';
import { useQuery } from "@tanstack/react-query"; // query hook to fetch accounts
import { useSearchParams } from "next/navigation";
import { client } from "@/lib/hono";

export const getTransactions = () => {
  const params = useSearchParams();
  const from = params?.get("from") || "";
  const to = params?.get("to") || "";
  const accountId = params?.get("accountId") || "";

  const query = useQuery({
    queryKey: ["transactions", { from, to, accountId }],
    queryFn: async () => {
      const response = await client.api.transactions.$get({
        query: {
          from,
          to,
          accountId,
        },
      }); // avoid using try catch here as it will be handled by the error handler

      if (!response.ok) {
        // if not there, then additionally need to handle below, throw an error (type-safe)
        throw new Error("Failed to fetch transactions");
      }
      const { data } = await response.json();

      return data;
    },
  });
  return query;
};
