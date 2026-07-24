"use client";

import { SubHeading } from "@/components/ui/headings";
import { formatTagLabel } from "@/lib/format";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

type SensoryChartProps = {
  tasteAxes: Record<string, number>;
  textureAxes: Record<string, number>;
};

function toChartData(axes: Record<string, number>) {
  return Object.entries(axes)
    .filter(([key, value]) => value > 0 && key !== "unknown")
    .sort(([, a], [, b]) => b - a)
    .map(([name, value]) => ({
      name: formatTagLabel(name),
      value,
    }));
}

function SensoryBarChart({
  title,
  data,
  color,
}: {
  title: string;
  data: { name: string; value: number }[];
  color: string;
}) {
  if (data.length === 0) return null;

  return (
    <div>
      <SubHeading as="h4">{title}</SubHeading>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 72, right: 12, bottom: 20 }}>
            <XAxis
              type="number"
              domain={[0, 5]}
              tick={{ fontSize: 10 }}
              label={{
                value: "Intensity (0–5)",
                position: "insideBottom",
                offset: -4,
                fontSize: 11,
                fill: "#18181b",
              }}
            />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={68} />
            <Bar dataKey="value" fill={color} radius={[0, 4, 4, 0]} barSize={10} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function SensoryChart({ tasteAxes, textureAxes }: SensoryChartProps) {
  const tasteData = toChartData(tasteAxes);
  const textureData = toChartData(textureAxes);

  if (tasteData.length === 0 && textureData.length === 0) {
    return <p className="text-sm text-black">No quantified sensory data available.</p>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <SensoryBarChart title="Taste Axes" data={tasteData} color="#2563eb" />
      <SensoryBarChart title="Texture Axes" data={textureData} color="#059669" />
    </div>
  );
}
