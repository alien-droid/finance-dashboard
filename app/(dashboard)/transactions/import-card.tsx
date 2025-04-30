import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImportTable } from "./import-table";
import { formatCurrency } from "@/lib/utils";
import { format, parse } from "date-fns";

// Date format constants for parsing and formatting dates
const dateFormat = "yyyy-MM-dd HH:mm:ss";
const databaseDateFormat = "yyyy-MM-dd";

// Required columns for the import process
const optionsRequired = ["amount", "date", "payee"];

// Interface for tracking selected columns and their mappings
interface SelectedColState {
  [key: string]: string | null;
}

// Props for the ImportCard component
type ImportCardProps = {
  data: string[][]; // 2D array representing the imported data (headers + rows)
  onCancel: () => void; // Callback for canceling the import process
  onSubmit: (data: any) => void; // Callback for submitting the processed data
};

const ImportCard = ({ data, onCancel, onSubmit }: ImportCardProps) => {
  // Extract headers (first row) and rows (remaining data) from the input data
  const headers = data[0];
  const rows = data.slice(1);

  // State to track selected column mappings
  const [selectedCols, setSelectedCols] = React.useState<SelectedColState>({});

  // Function to handle changes in column selection
  const onTableSelectChange = (columnIndex: number, value: string | null) => {
    setSelectedCols((prev) => {
      const newSelectedCols = { ...prev };

      // Ensure no duplicate mappings by clearing existing selections
      for (const key in newSelectedCols) {
        if (selectedCols[key] === value) {
          selectedCols[key] = null;
        }
      }

      // Treat "skip" as null (no mapping)
      if (value === "skip") {
        value = null;
      }

      // Update the selected column mapping
      newSelectedCols[`column_${columnIndex}`] = value;
      return newSelectedCols;
    });
  };

  // Calculate progress based on the number of required columns that are mapped
  const progress = Object.values(selectedCols).filter(Boolean).length;

  // Function to handle the "Continue" button click
  const onContinue = () => {
    // Helper function to extract column index from the mapping key
    const getColumnIndex = (colName: string) => {
      return colName.split("_")[1];
    };

    // Structure the data based on selected column mappings
    const structuredData = {
      headers: headers.map((_header, index) => {
        const colIndex = getColumnIndex(`column_${index}`);
        return selectedCols[`column_${colIndex}`] || null;
      }),
      body: rows
        .map((row) => {
          const structuredRow = row.map((cell, index) => {
            const colIndex = getColumnIndex(`column_${index}`);
            return selectedCols[`column_${colIndex}`] ? cell : null;
          });

          // Exclude rows where all cells are null
          return structuredRow.every((cell) => cell === null)
            ? []
            : structuredRow;
        })
        .filter((row) => row.length > 0), // Remove empty rows
    };

    // Convert structured data into an array of objects
    const DataArray = structuredData.body.map((row) => {
      return row.reduce((acc: any, cell, index) => {
        const header = structuredData.headers[index];
        if (header !== null) {
          acc[header] = cell;
        }
        return acc;
      }, {});
    });

    // Format the data (e.g., currency and date formatting)
    const formattedData = DataArray.map((row) => ({
      ...row,
      amount: formatCurrency(parseFloat(row.amount)), // Format amount as currency
      date: format(parse(row.date, dateFormat, new Date()), databaseDateFormat), // Format date
    }));

    // Submit the formatted data
    onSubmit(formattedData);
  };

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-32">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 flex flex-col lg:flex-row lg:items-center lg:justify-between">
          {/* Card title */}
          <CardTitle className="text-xl line-clamp-1">
            Import Transaction
          </CardTitle>

          {/* Action buttons */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-end gap-2 w-full">
            <Button size="sm" onClick={onCancel} className="w-full lg:w-auto">
              Cancel
            </Button>
            <Button
              disabled={progress < optionsRequired.length} // Disable until all required columns are mapped
              size="sm"
              onClick={onContinue}
              className="w-full lg:w-auto"
            >
              Continue ({progress}/{optionsRequired.length})
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {/* ImportTable component for displaying and selecting column mappings */}
          <ImportTable
            headers={headers}
            rows={rows}
            selectedCols={selectedCols}
            onTableSelectChange={onTableSelectChange}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ImportCard;