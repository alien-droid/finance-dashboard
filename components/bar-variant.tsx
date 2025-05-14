import { format } from "date-fns";

import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type BarVariantProps = {
  data: {
    date: string;
    income: number;
    expense: number;
  }[];
};

import { CTooltip } from "@/components/cTooltip";

export const BarVariant = ({ data }: BarVariantProps) => {
  return (
    <ResponsiveContainer width={"100%"} height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          axisLine={false}
          tickLine={false}
          dataKey={"date"}
          tickFormatter={(value) => format(value, "dd MMM")}
          style={{
            fontSize: "12px",
          }}
          tickMargin={16}
        />
        <Tooltip content={<CTooltip />} />
        <Bar dataKey="income" fill="#2284f3" className="drop-shadow-sm" />
        <Bar dataKey="expense" fill="#f66c5f" className="drop-shadow-sm" />
      </BarChart>
    </ResponsiveContainer>
  );
};
