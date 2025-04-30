import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { cn } from "@/lib/utils";

type ImportTableProps = {
  headers: string[];
  rows: string[][];
  selectedCols: Record<string, string | null>;
  onTableSelectChange: (columnIndex: number, value: string | null) => void;
};

type TableHeadSelectProps = {
  columnIndex: number;
  selectedCols: Record<string, string | null>;
  onChange: (columnIndex: number, value: string | null) => void;
};

const options = ["amount", "date", "payee"];

const TableHeadSelect = ({
  columnIndex,
  selectedCols,
  onChange,
}: TableHeadSelectProps) => {
  const currentSelect = selectedCols[`column_${columnIndex}`];
  return (
    <Select
      value={currentSelect || ""}
      onValueChange={(value) => onChange(columnIndex, value)}
    >
      <SelectTrigger
        className={cn(
          "focus:ring-offset-0 focus:ring-transparent outline-none border-none bg-transparent capitalize",
          currentSelect && "text-blue-300"
        )}
      >
        <SelectValue placeholder="Skip" />
        <SelectContent>
          <SelectItem value="skip">Skip</SelectItem>
          {options.map((option, index) => {
            // Disable options that are already selected in other columns
            const disabled =
              Object.values(selectedCols).includes(option) &&
              selectedCols[`column_${columnIndex}`] !== option;

            return (
              <SelectItem
                key={index}
                value={option}
                disabled={disabled}
                className="capitalize"
              >
                {option}
              </SelectItem>
            );
          })}
        </SelectContent>
      </SelectTrigger>
    </Select>
  );
};

export const ImportTable = ({
  headers,
  rows,
  selectedCols,
  onTableSelectChange,
}: ImportTableProps) => {
  return (
    <div className="overflow-hidden border rounded-md">
      <Table>
        <TableHeader className="bg-muted">
          <TableRow>
            {headers.map((_item, index) => (
              <TableHead key={index}>
                <TableHeadSelect
                  columnIndex={index}
                  selectedCols={selectedCols}
                  onChange={onTableSelectChange}
                />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row: string[], index) => (
            <TableRow key={index}>
              {row.map((item, index) => (
                <TableCell key={index}>{item}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
