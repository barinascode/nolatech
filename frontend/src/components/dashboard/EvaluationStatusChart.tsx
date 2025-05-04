
"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"

// Static data for evaluation status
const chartData = [
  { status: "Pending", count: 15, fill: "var(--color-pending)" },
  { status: "In Progress", count: 25, fill: "var(--color-inProgress)" },
  { status: "Completed", count: 50, fill: "var(--color-completed)" },
  { status: "Cancelled", count: 5, fill: "var(--color-cancelled)" },
]

const chartConfig = {
  count: {
    label: "Count",
  },
  pending: {
    label: "Pending",
    color: "hsl(var(--chart-1))",
  },
  inProgress: {
    label: "In Progress",
    color: "hsl(var(--chart-2))",
  },
  completed: {
    label: "Completed",
    color: "hsl(var(--chart-3))",
  },
   cancelled: {
    label: "Cancelled",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig

export function EvaluationStatusChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart
        accessibilityLayer // Improve accessibility
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
          dataKey="status"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.substring(0, 3)} // Abbreviate labels if needed
        />
        <YAxis
          dataKey="count"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          width={30} // Adjust width to fit labels
         />
        <Tooltip
           cursor={false} // Disable cursor line on hover
           content={<ChartTooltipContent indicator="dot" />}
        />
        <Bar dataKey="count" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}
