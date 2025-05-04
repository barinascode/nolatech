
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { EvaluationStatusChart } from '@/components/dashboard/EvaluationStatusChart';
import { CompletionRateChart } from '@/components/dashboard/CompletionRateChart';
import { FeedbackDistributionChart } from '@/components/dashboard/FeedbackDistributionChart';
import { AverageCompetencyChart } from '@/components/dashboard/AverageCompetencyChart';
import { RoleDisplay } from '@/components/dashboard/RoleDisplay'; // Import the new component

export default function DashboardPage() {
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of evaluation statistics.</p>
      </div>

      {/* Display Role and Placeholder Message */}
      <RoleDisplay />

       {/* Grid for charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {/* Chart 1: Evaluation Status */}
        <Card>
          <CardHeader>
            <CardTitle>Evaluation Status</CardTitle>
            <CardDescription>Distribution of evaluations by current status.</CardDescription>
          </CardHeader>
          <CardContent>
            <EvaluationStatusChart />
          </CardContent>
        </Card>

        {/* Chart 2: Completion Rate Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Completion Rate</CardTitle>
            <CardDescription>Percentage of evaluations completed over the last 6 months.</CardDescription>
          </CardHeader>
          <CardContent>
             <CompletionRateChart />
          </CardContent>
        </Card>

        {/* Chart 3: Feedback Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Feedback Distribution</CardTitle>
            <CardDescription>Breakdown of feedback received vs. pending.</CardDescription>
          </CardHeader>
          <CardContent>
            <FeedbackDistributionChart />
          </CardContent>
        </Card>

        {/* Chart 4: Average Competency Scores */}
        <Card>
          <CardHeader>
            <CardTitle>Average Competency Scores</CardTitle>
            <CardDescription>Average scores across key competencies (Scale 1-5).</CardDescription>
          </CardHeader>
          <CardContent>
            <AverageCompetencyChart />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
