import { useOpenCategory } from "@/hooks/categories/use-open-category";
import { useOpenTransaction } from "@/hooks/transactions/use-open-transaction";
import { cn } from "@/lib/utils";
import { TriangleAlert } from "lucide-react";

type categoryColumnProps = {
  id: string;
  category: string | null;
  categoryId: string | null;
};

export const CategoryColumn = ({
  id,
  category,
  categoryId,
}: categoryColumnProps) => {
  const { onOpen: openCategory } = useOpenCategory();
  const { onOpen: openTransaction } = useOpenTransaction();
  const handleClick = () =>
    categoryId ? openCategory(categoryId) : openTransaction(id);

  return (
    <div
      onClick={handleClick}
      className={cn(
        "flex items-center cursor-pointer hover:underline",
        !category && "text-rose-500"
      )}
    >
      {!category && <TriangleAlert className="mr-2 h-4 w-4 shrink-0" />}
      {category || "Uncategorized"}
    </div>
  );
};
