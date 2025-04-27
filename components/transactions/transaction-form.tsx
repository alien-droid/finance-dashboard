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
  FormMessage,
} from "@/components/ui/form";
import { accountsInsertSchema, transactionsInsertSchema } from "@/db/schema";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Select } from "../select";
import { DatePicker } from "../date-picker";
import { Textarea } from "../ui/textarea";
import { AmountInput } from "../amount-input";
import { formatCurrency } from "@/lib/utils";

const formSchema = z.object({
  date: z.coerce.date(),
  accountId: z.string(),
  categoryId: z.string().nullable().optional(),
  payee: z.string(),
  amount: z.string(),
  notes: z.string().optional().nullable(),
});

const apiSchema = transactionsInsertSchema.omit({ id: true });

type formValues = z.input<typeof formSchema>;
type apiValues = z.input<typeof apiSchema>;

type formProps = {
  id?: string;
  defaultValues?: formValues;
  onSubmit: (values: apiValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
  accountOptions: { label: string; value: string }[];
  categoryOptions: { label: string; value: string }[];
  onCreateAccount: (name: string) => void;
  onCreateCategory: (name: string) => void;
};

export const TransactionForm = ({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
  accountOptions,
  categoryOptions,
  onCreateAccount,
  onCreateCategory,
}: formProps) => {
  const form = useForm<formValues>({
    defaultValues,
    resolver: zodResolver(formSchema),
  });

  const handleSubmit = (values: formValues) => {
    //onSubmit(values);
    console.log({ values });
    const amtMiliUnits = formatCurrency(parseFloat(values.amount));
    onSubmit({
      ...values,
      amount: amtMiliUnits,
    });
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
          name="date"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <DatePicker
                  value={field.value}
                  onChange={field.onChange}
                  disbaled={disabled}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="accountId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account</FormLabel>
              <FormControl>
                <Select
                  placeholder="Select an account"
                  options={accountOptions}
                  onCreate={onCreateAccount}
                  value={field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="categoryId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Select
                  placeholder="Select a category"
                  options={categoryOptions}
                  onCreate={onCreateCategory}
                  value={field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="payee"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payee</FormLabel>
              <FormControl>
                <Input
                  disabled={disabled}
                  placeholder="Add a payee"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="amount"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <AmountInput
                  {...field}
                  disabled={disabled}
                  placeholder="0.00"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="notes"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  disabled={disabled}
                  value={field.value ?? ""}
                  placeholder="Add notes (Optional)"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button className="w-full" disabled={disabled} type="submit">
          {id ? "Save Changes" : "Create transaction"}
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
            Delete Transaction
          </Button>
        )}
      </form>
    </Form>
  );
};
