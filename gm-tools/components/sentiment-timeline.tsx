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
  const chartData = data.map((item) => {
    let valor = item.value
    if (item.sentiment === "negative") valor = -valor
    else if (item.sentiment === "neutral") valor = 0
    return {
      time: item.time,
      value: valor,
      sentiment: item.sentiment,
    }
  })

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const val = payload[0].value
      let sentiment = "Neutral"
      if (val  >= 66) sentiment = "Positive"
      else if (val <= 33) sentiment = "Negative"

      const color =
        sentiment === "Positive" ? "text-green-500" :
        sentiment === "Negative" ? "text-red-500" :
        "text-yellow-500"

      return (
        <div className="bg-white dark:bg-[#1a1a1a] p-2 border rounded shadow-sm text-sm">
          <p className="font-medium">{`Time: ${label}`}</p>
          <p className={`${color}`}>{`Sentiment: ${sentiment}`}</p>
        </div>
      )
    }

    return null
  }

  // Custom dot
  const CustomDot = (props: any): ReactElement<SVGElement> => {
    const { cx, cy, payload, index } = props
    let color = "#facc15" // amarillo para neutral
    if (payload.value >= 66) color = "#22c55e"
    else if (payload.value <= 33) color = "#ef4444"

    return (
      <circle
        key={`dot-${index}`}
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
            domain={[0, 100]}
            ticks={[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100]}
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