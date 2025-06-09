"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { ReactElement, SVGProps } from "react"

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
      const sentiment = value > 0 ? "Positive" : "Negative"

      return (
        <div className="bg-white dark:bg-[#1a1a1a] p-2 border rounded shadow-sm text-sm">
          <p className="font-medium">{`Time: ${label}`}</p>
          <p className={`${value > 0 ? "text-green-500" : "text-red-500"}`}>
            {`Sentiment: ${sentiment}`}
          </p>
        </div>
      )
    }

    return null
  }

  // Custom dot as a valid React SVGElement
  const CustomDot = (props: any): ReactElement<SVGElement> => {
    const { cx, cy, payload, index } = props
    const color = payload.value > 0 ? "#22c55e" : "#ef4444"

    return (
      <circle
        key={`dot-${index}`} // Esta línea corrige el error
        cx={cx}
        cy={cy}
        r={6}
        stroke={color}
        strokeWidth={2.5}
        fill="#fff"
      />
    )
  }

  return (
    <div className="h-[400px] w-full max-w-full overflow-x-auto">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 40, right: 30, left: 10, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
          <XAxis dataKey="time" tick={{ fontSize: 14 }} />
          <YAxis
            domain={[-100, 100]}
            ticks={[-100, -75, -50, -25, 0, 25, 50, 75, 100]}
            tick={{ fontSize: 14 }}
            tickFormatter={(value: number, _index: number): string => {
              return value === 0 ? "" : Math.abs(value).toString()
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#0170CE"
            strokeWidth={3}
            dot={CustomDot}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}