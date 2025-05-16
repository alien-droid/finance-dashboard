import { z } from "zod";
import { Trash } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { accountsInsertSchema } from "@/db/schema";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const formSchema = accountsInsertSchema.pick({ name: true });

type formValues = z.input<typeof formSchema>;

type formProps = {
  id?: string;
  defaultValues?: formValues;
  onSubmit: (values: formValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
};

export const AccountForm = ({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
}: formProps) => {
  const form = useForm<formValues>({
    defaultValues,
    resolver: zodResolver(formSchema),
  });

  const handleSubmit = (values: formValues) => {
    onSubmit(values);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault(); // prevent form submission
    e.stopPropagation();
    console.log("delete");
    onDelete?.();
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 pt-4"
      >
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="e.g Cash, Credit, Debit Card"
                  disabled={disabled}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button className="w-full" disabled={disabled} type="submit">
          {id ? "Save Changes" : "Create Account"}
        </Button>
        {!!id && (
          <Button
            onClick={handleDelete}
            disabled={disabled}
            className="w-full"
            variant={"outline"}
            type="button" // prevent form submission
          >
            <Trash className="h-4 w-4 mr-1" />
            Delete Account
          </Button>
        )}
      </form>
    </Form>
  );
};
