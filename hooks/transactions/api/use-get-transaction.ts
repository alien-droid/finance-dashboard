import { useQuery } from "@tanstack/react-query"; // query hook to fetch account by id

import { client } from "@/lib/hono";
import { formatAmount } from "@/lib/utils";

export const getTransaction = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["transaction", { id }],
    queryFn: async () => {
      const response = await client.api.transactions[":id"].$get({
        param: { id },
      }); // avoid using try catch here as it will be handled by the error handler

      if (!response.ok) {
        // if not there, then additionally need to handle below, throw an error (type-safe)
        throw new Error("Failed to fetch transaction");
      }
      const { data } = await response.json();

      return { ...data, amount: formatAmount(data.amount) };
    },
  });
  return query;
};
