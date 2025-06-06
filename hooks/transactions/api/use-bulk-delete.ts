import { toast } from "sonner"; // query hook to create an transaction 

import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.transactions["bulk-delete"]["$post"]>;
type RequestType = InferRequestType<typeof client.api.transactions["bulk-delete"]["$post"]>["json"];

export const useBulkDeleteTrsansactions = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.transactions["bulk-delete"].$post({ json });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Transactions deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
      // TODO: invalidate summary query
    },
    onError: (error) => {
      toast.error("Failed to delete Transactions");
    },
  });
  return mutation;
};
