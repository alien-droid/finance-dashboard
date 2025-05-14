"use client";

import { useState } from "react";
import { format, subDays } from "date-fns";
import { type DateRange } from "react-day-picker"

import { ChevronDown } from "lucide-react";

import qs from "query-string";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { getSummary } from "@/hooks/summary/api/use-get-summary";

import { cn, getDateRange } from "@/lib/utils";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";  
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";

export const DateFilter = () => {
  const router = useRouter();
  const pathname = usePathname();

  const params = useSearchParams();
  const accountId = params.get("accountId");
  const from = params.get("from") || "";
  const to = params.get("to") || "";

  const defaultTo = new Date();
  const defaultFrom = subDays(defaultTo, 30);

  const paramState = {
    from: from ? new Date(from) : defaultFrom,
    to: to ? new Date(to) : defaultTo,
  };

  const [date, setDate] = useState<DateRange | undefined>(paramState);

  const pushURL = (dateRange: DateRange | undefined) => {
    const query = {
      from: format(dateRange?.from || defaultFrom, "yyyy-MM-dd"),
      to: format(dateRange?.to || defaultTo, "yyyy-MM-dd"),
      accountId
    };
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query,
      },
      { skipNull: true, skipEmptyString: true }
    );
    router.push(url);
  };

  const onReset = () => {
    setDate(undefined);
    pushURL(undefined);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          disabled={false}
          variant={"outline"}
          size="sm"
          className="lg:w-auto w-full h-9 rounded-md px-3 font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus:ring-offset-0 focus:ring-transparent outline-none text-white focus:bg-white/30 transition"
        >
          <span>{getDateRange(paramState)}</span>
          <ChevronDown className="ml-2 size-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="lg:w-auto w-full p-0" align="start">
        <Calendar
          disabled={false}
          mode="range"
          defaultMonth={date?.from}
          selected={date}
          onSelect={setDate}
          autoFocus
          numberOfMonths={2}
        />
        <div className="p-4 w-full flex flex-col sm:flex-row gap-2">
          <PopoverClose asChild>
            <Button
              onClick={onReset}
              disabled={!date?.from || !date?.to}
              className="flex-1 h-9 flex items-center justify-center rounded-md"
              variant={"outline"}
            >
              Reset
            </Button>
          </PopoverClose>
          <PopoverClose asChild>
            <Button
              onClick={() => pushURL(date)}
              disabled={!date?.from || !date?.to}
              className="flex-1 h-9 flex items-center justify-center rounded-md"
            >
              Apply
            </Button>
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  );
};
