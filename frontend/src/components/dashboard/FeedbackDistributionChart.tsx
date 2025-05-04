
"use client"

import * as React from "react"
import { Pie, PieChart, Cell } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"

// Static data for feedback distribution
const chartData = [
  { type: "Received", count: 120, fill: "var(--color-received)" },
  { type: "Pending", count: 45, fill: "var(--color-pending)" },
]

const chartConfig = {
  count: {
    label: "Count",
  },
  received: {
    label: "Received",
    color: "hsl(var(--chart-1))",
  },
  pending: {
    label: "Pending",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function FeedbackDistributionChart() {
  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[250px]" // Adjust size
    >
      <PieChart accessibilityLayer>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel indicator="dot" nameKey="type" />} // Use type as nameKey
        />
         <Pie
          data={chartData}
          dataKey="count"
          nameKey="type" // Important for legend and tooltip matching
          innerRadius={60} // Creates the donut hole
          outerRadius={80} // Size of the pie
          strokeWidth={1}
        >
           {/* Map colors from data */}
           {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <ChartLegend
          content={<ChartLegendContent nameKey="type" />} // Use type as nameKey
          verticalAlign="bottom"
          align="center"
          iconType="circle" // Match legend icon to chart type
        />
      </PieChart>
    </ChartContainer>
  )
}
