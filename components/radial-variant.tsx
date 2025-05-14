import {
  ResponsiveContainer,
  RadialBar,
  RadialBarChart,
  Legend,   
} from "recharts";

import { formatAmountToCurrency } from "@/lib/utils";
import { CategoryTooltip } from "./category-tooltip";

const COLORS = ["#86f1f3", "#f66c5f", "#2284f3", "#f3a9f1"];

type RadialVariantProps = {
  data: {
    name: string;
    value: number;
  }[];
};

export const RadialVariant = ({ data }: RadialVariantProps) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <RadialBarChart
        cx="50%"
        cy="30%"
        innerRadius="90%"
        outerRadius="40%"
        barSize={10}
        data={data.map((item, index) => ({
          ...item,
          fill: COLORS[index % COLORS.length],
        }))}
      >
        <RadialBar
          label={{
            position: "insideStart",
            fill: "#fff",
            fontSize: 12,
          }}
          background
          dataKey={"value"}
        />

        <Legend
          layout="horizontal"
          verticalAlign="bottom"
          iconType="circle"
          align="right"
          content={({ payload }: any) => {
            return (
              <ul className="flex flex-col space-y-2">
                {payload.map((entry: any, index: number) => (
                  <li
                    key={`item-${index}`}
                    className="flex items-center space-x-2"
                  >
                    <span
                      className="size-2 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    ></span>
                    <div className="space-x-1">
                      <span className="text-sm text-muted-foreground">
                        {entry.value}
                      </span>
                      <span className="text-sm">
                        {formatAmountToCurrency(entry.payload.value)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            );
          }}
        />
      </RadialBarChart>
    </ResponsiveContainer>
  );
};
