import { format } from "date-fns";

import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type LineVariantProps = {
  data: {
    date: string;
    income: number;
    expense: number;
  }[];
};

import { CTooltip } from "@/components/cTooltip";

export const LineVariant = ({ data }: LineVariantProps) => {
  return (
    <ResponsiveContainer width={"100%"} height={350}>
      <LineChart data={data}>
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
        <Line dot={false} dataKey="income" stroke="#2284f3" strokeWidth={2} className="drop-shadow-sm" />
        <Line dot={false} dataKey="expense" stroke="#f66c5f" strokeWidth={2} className="drop-shadow-sm" />
      </LineChart>
    </ResponsiveContainer>
  );
};
