
"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"

// Static data for average competency scores
const chartData = [
  { competency: "Communication", score: 4.2 },
  { competency: "Teamwork", score: 4.5 },
  { competency: "Problem Solving", score: 3.8 },
  { competency: "Leadership", score: 4.0 },
  { competency: "Adaptability", score: 4.1 },
]

const chartConfig = {
  score: {
    label: "Avg. Score",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function AverageCompetencyChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <AreaChart
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
          dataKey="competency"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
           // Optional: Abbreviate labels if they become too long
          // tickFormatter={(value) => value.substring(0, 3)}
        />
         <YAxis
          dataKey="score"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          domain={[1, 5]} // Set Y-axis domain from 1 to 5
          width={30} // Adjust width to fit labels
        />
        <Tooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
        <defs>
          <linearGradient id="fillScore" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-score)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-score)"
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
        <Area
          dataKey="score"
          type="natural" // Use natural curve for smoother look
          fill="url(#fillScore)"
          fillOpacity={0.4}
          stroke="var(--color-score)"
          strokeWidth={2}
          stackId="a" // Needed for Area chart
        />
      </AreaChart>
    </ChartContainer>
  )
}
