import {
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarAngleAxis,
  PolarRadiusAxis,
  PolarGrid,
} from "recharts";

type RadarVariantProps = {
  data: {
    name: string;
    value: number;
  }[];
};

export const RadarVariant = ({ data }: RadarVariantProps) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <RadarChart data={data} cx="50%" cy="50%" outerRadius="60%">
        <PolarGrid />
        <PolarAngleAxis dataKey="name" stroke="#8884d8" fontSize={12}/>
        <PolarRadiusAxis fontSize={12} />
        <Radar
          dataKey="value"
          stroke="#2284f3"
          fill="#2284f3"
          fillOpacity={0.6}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
};
