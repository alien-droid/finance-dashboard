import { z } from "zod";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/Sheet";
import { CategoryForm } from "@/components/categories/category-form";
import { categoriesInsertSchema } from "@/db/schema";
import { useEditCategory } from "@/hooks/categories/api/use-edit-category";
import { useDeleteCategory } from "@/hooks/categories/api/use-delete-category";

import { useOpenCategory } from "@/hooks/categories/use-open-category";
import { getCategory } from "@/hooks/categories/api/use-get-category";
import { Loader2 } from "lucide-react";
import { useConfirm } from "@/hooks/modals/use-confirm";

const formSchema = categoriesInsertSchema.pick({ name: true });
type formValues = z.input<typeof formSchema>;

export const EditCategorySheet = () => {
  const { isOpen, onClose, id } = useOpenCategory();
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this Category. This action cannot be undone."
  );

  const CategoryQuery = getCategory(id);
  const editMutation = useEditCategory(id);
  const deleteMutation = useDeleteCategory(id);

  const isPending = editMutation.isPending || deleteMutation.isPending;

  const isLoading = CategoryQuery.isLoading;

  const handleSubmit = (values: formValues) => {
    editMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const onDelete = async () => {
    const ok = await confirm();
    if (ok) {
      deleteMutation.mutate(undefined, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  const defaultValues = CategoryQuery.data
    ? { name: CategoryQuery.data.name }
    : { name: "" };

  return (
    <>
      <ConfirmDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Edit Category</SheetTitle>
            <SheetDescription>
              Edit the details of your Category
            </SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-6 w-6 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <CategoryForm
              onSubmit={handleSubmit}
              disabled={isPending}
              defaultValues={defaultValues}
              id={id}
              onDelete={onDelete}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
