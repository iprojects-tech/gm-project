
"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { LegendProps } from "recharts";

interface SentimentChartProps {
  positive: number
  negative: number
  neutral: number
}

export default function SentimentChart({ positive, negative, neutral }: SentimentChartProps) {
  const chartData = [
  { name: "Positivo", value: positive },
  { name: "Negativo", value: negative },
  { name: "Neutral", value: neutral },
  ]

  const COLORS = ["#22c55e", "#ef4444", "#facc15"] // verde, rojo, amarillo

  const CustomLegend = (props: LegendProps) => {
  return (
    <div className="mt-2 flex justify-center">
      <ul className="flex gap-4 flex-wrap text-sm">
        {props.payload?.map((entry, index) => (
          <li key={`item-${index}`} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span>{entry.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

  return (
    <div className="h-[220px] w-full md:h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number, name: string) => [`${value}%`, name]} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
