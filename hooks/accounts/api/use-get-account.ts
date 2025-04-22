import { useQuery } from "@tanstack/react-query"; // query hook to fetch account by id

import { client } from "@/lib/hono";

export const getAccount = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["accounts", { id }],
    queryFn: async () => {
      const response = await client.api.accounts[":id"].$get({ param: { id } }); // avoid using try catch here as it will be handled by the error handler

      if (!response.ok) {
        // if not there, then additionally need to handle below, throw an error (type-safe)
        throw new Error("Failed to fetch account");
      }
      const { data } = await response.json();

      return data;
    },
  });
  return query;
};
