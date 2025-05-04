
"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"

// Static data for completion rate over time
const chartData = [
  { month: "Jan", rate: 65 },
  { month: "Feb", rate: 70 },
  { month: "Mar", rate: 75 },
  { month: "Apr", rate: 80 },
  { month: "May", rate: 85 },
  { month: "Jun", rate: 90 },
]

const chartConfig = {
  rate: {
    label: "Completion Rate (%)",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function CompletionRateChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <LineChart
        accessibilityLayer
        data={chartData}
        margin={{
          top: 5,
          right: 10,
          left: -10, // Adjust left margin for YAxis labels
          bottom: 5,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
         <YAxis
          dataKey="rate"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          domain={[0, 100]} // Set Y-axis domain from 0 to 100 for percentage
          tickFormatter={(value) => `${value}%`}
          width={40} // Adjust width to fit labels like "100%"
        />
        <Tooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <Line
          dataKey="rate"
          type="monotone"
          stroke="var(--color-rate)"
          strokeWidth={2}
          dot={true} // Show dots on the line
        />
      </LineChart>
    </ChartContainer>
  )
}
