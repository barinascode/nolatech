
"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface FeedbackCompetencyChartProps {
  data: Array<{ competency: string; averageScore: number }>;
}

const chartConfig = {
  averageScore: {
    label: "Avg. Score",
    color: "hsl(var(--chart-3))", // Use a different color, e.g., chart-3
  },
} satisfies ChartConfig

export function FeedbackCompetencyChart({ data }: FeedbackCompetencyChartProps) {
  // Find the maximum score for the Y-axis domain, default to 5 if no data
  const maxScore = data.length > 0 ? Math.max(...data.map(d => d.averageScore), 5) : 5;

  return (
    <ChartContainer config={chartConfig} className="h-full w-full"> {/* Use h-full */}
      <BarChart
        accessibilityLayer
        data={data}
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
          // tickFormatter={(value) => value.substring(0, 6)}
           interval={0} // Show all labels if possible
        />
        <YAxis
          dataKey="averageScore"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          domain={[0, maxScore]} // Dynamically set Y-axis domain based on max score or 5
          width={30} // Adjust width to fit labels
        />
        <Tooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dot" />}
        />
         {/* Define color for the bars */}
        <Bar
          dataKey="averageScore"
          fill="var(--color-averageScore)" // Use the defined color
          radius={4}
        />
      </BarChart>
    </ChartContainer>
  )
}
