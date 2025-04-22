import { useQuery } from "@tanstack/react-query"; // query hook to fetch accounts

import { client } from "@/lib/hono";

export const getCategories = () => {
  const query = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await client.api.categories.$get(); // avoid using try catch here as it will be handled by the error handler

      if (!response.ok) { // if not there, then additionally need to handle below, throw an error (type-safe)
        throw new Error("Failed to fetch categories");
      }
      const { data } = await response.json();

      return data;
    },
  });
  return query;
};
