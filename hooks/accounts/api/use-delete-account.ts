import { toast } from "sonner"; // query hook to create an account

import { InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<
  (typeof client.api.accounts)[":id"]["$delete"]
>;

export const useDeleteAccount = (id?: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async (json) => {
      const response = await client.api.accounts[":id"].$delete({
        param: { id },
      }); // avoid using try catch here as it will be handled by the error handler
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Account deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["account", { id }] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: (error) => {
      toast.error("Failed to delete account");
    },
  });
  return mutation;
};
