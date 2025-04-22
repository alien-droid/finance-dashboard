import { toast } from "sonner"; // query hook to create an account 

import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.accounts["bulk-delete"]["$post"]>;
type RequestType = InferRequestType<typeof client.api.accounts["bulk-delete"]["$post"]>["json"];

export const useBulkDeleteAccounts = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.accounts["bulk-delete"].$post({ json });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Accounts deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      // TODO: invalidate summary query
    },
    onError: (error) => {
      toast.error("Failed to delete accounts");
    },
  });
  return mutation;
};
