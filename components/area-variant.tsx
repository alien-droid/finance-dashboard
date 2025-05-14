import {
  Tooltip,
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  CartesianGrid,
} from "recharts";

import { format } from "date-fns";
import { CTooltip } from "@/components/cTooltip";

type AreaVariantProps = {
  data: {
    date: string;
    income: number;
    expense: number;
  }[];
};

export const AreaVariant = ({ data }: AreaVariantProps) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <defs>
          <linearGradient id="income" x1="0" y1="0" x2="0" y2="1">
            <stop offset="2%" stopColor="#2284f3" stopOpacity={0.8} />
            <stop offset="98%" stopColor="#2284f3" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="expense" x1="0" y1="0" x2="0" y2="1">
            <stop offset="2%" stopColor="#f66c5f" stopOpacity={0.8} />
            <stop offset="98%" stopColor="#f66c5f" stopOpacity={0} />
          </linearGradient>
        </defs>
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
        <Area
          type="monotone"
          dataKey="income"
          stackId={"income"}
          strokeWidth={2}
          stroke="#2284f3"
          fill="url(#income)"
          className="drop-shadow-sm"
        />
        <Area
          type="monotone"
          dataKey="expense"
          stackId={"expense"}
          strokeWidth={2}
          stroke="#f66c5f"
          fill="url(#expense)"
          className="drop-shadow-sm"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
