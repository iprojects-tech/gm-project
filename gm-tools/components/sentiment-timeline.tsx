"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface TimelineData {
  time: string
  sentiment: string
  value: number
}

interface SentimentTimelineProps {
  data: TimelineData[]
}

export default function SentimentTimeline({ data }: SentimentTimelineProps) {
  // Transform data for the chart
  const chartData = data.map((item) => ({
    time: item.time,
    value: item.sentiment === "negative" ? -item.value : item.value,
    sentiment: item.sentiment,
  }))

  // Custom tooltip to show sentiment type
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value
      const sentiment = value > 0 ? (value > 50 ? "Positive" : "Neutral") : "Negative"

      return (
        <div className="bg-white dark:bg-[#1a1a1a] p-2 border rounded shadow-sm text-sm">
          <p className="font-medium">{`Time: ${label}`}</p>
          <p className={`${value > 50 ? "text-green-500" : value < 0 ? "text-red-500" : "text-gm-blue"}`}>
            {`Sentiment: ${sentiment}`}
          </p>
        </div>
      )
    }

    return null
  }

  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
          <XAxis dataKey="time" />
          <YAxis
            domain={[-100, 100]}
            ticks={[-75, -50, -25, 0, 25, 50, 75]}
            tickFormatter={(value) => {
              if (value === 0) return "Neutral"
              return Math.abs(value)
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#0170CE" // GM Blue
            strokeWidth={2}
            dot={{
              stroke: (entry) => (entry.value > 50 ? "#22c55e" : entry.value < 0 ? "#ef4444" : "#0170CE"),
              strokeWidth: 2,
              r: 4,
              fill: "#fff",
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
