"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useCallback, useState } from "react";
import { useConfirm } from "@/hooks/modals/use-confirm";
import { useOpenTransaction } from "@/hooks/transactions/use-open-transaction";
import { useDeleteTransaction } from "@/hooks/transactions/api/use-delete-transaction";

export function Actions({ id }: { id: string }) {
  const { onOpen } = useOpenTransaction();
  const deleteMutation = useDeleteTransaction(id);
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this transaction. This action cannot be undone."
  );
  const [isOpen, setIsOpen] = useState(false);

  // Handler for edit click with proper dropdown closing
  const handleEditClick = useCallback(() => {
    setIsOpen(false); // Close dropdown first
    // Add delay to ensure dropdown is fully closed
    setTimeout(() => {
      onOpen(id);
    }, 150);
  }, [onOpen, id]);

  // Handler for delete with proper dropdown closing
  const handleDelete = useCallback(async () => {
    setIsOpen(false); // Close dropdown first
    // Add delay to ensure dropdown is fully closed
    setTimeout(async () => {
      const ok = await confirm();
      if (ok) {
        deleteMutation.mutate();
      }
    }, 150);
  }, [confirm, deleteMutation]);

  return (
    <>
      <ConfirmDialog />
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="size-8 p-0"
            aria-label="More options"
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={handleEditClick}
            disabled={deleteMutation.isPending}
            onSelect={(e) => {
              // Prevent the automatic closing to use our controlled closing
              e.preventDefault();
            }}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            onSelect={(e) => {
              // Prevent the automatic closing to use our controlled closing
              e.preventDefault();
            }}
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
