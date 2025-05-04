
import type { Evaluation } from '@/services/evaluations';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { Users, CalendarDays } from 'lucide-react'; // Import Calendar icon
import { cn } from "@/lib/utils"; // Import cn for conditional classes

interface EvaluationCardProps {
  evaluation: Evaluation;
  targetRoutePrefix?: string; // Optional prefix for the navigation route
}

export const EvaluationCard: React.FC<EvaluationCardProps> = ({
    evaluation,
    targetRoutePrefix = '/evaluations' // Default to evaluations detail page
}) => {
  const router = useRouter();
  const isClickable = targetRoutePrefix === '/feedback/start' && evaluation.status === 'pending';
  const isViewableDetail = targetRoutePrefix === '/evaluations'; // Always allow viewing details

  const handleCardClick = () => {
     // Only navigate if the target is feedback and status is pending, OR if the target is detail view
    if (isClickable || isViewableDetail) {
      router.push(`${targetRoutePrefix}/${evaluation._id}`);
    }
    // Otherwise, do nothing on click
  };

  // Calculate feedback progress
  const feedbackCount = evaluation.feedback_ids?.length || 0;
  const evaluatorCount = evaluation.evaluator_ids?.length || 0;
  const feedbackProgress = `${feedbackCount}/${evaluatorCount}`;
  const progressTitle = `${feedbackCount} out of ${evaluatorCount} assigned evaluators have provided feedback.`;


  // Format dates or show placeholder
  const formatDate = (dateString: string): string => {
    try {
      return format(new Date(dateString), 'PP');
    } catch {
      return 'Invalid Date';
    }
  };

   const cardAriaLabel = isClickable || isViewableDetail
      ? `View details for evaluation: ${evaluation.name}`
      : `Cannot provide feedback for evaluation: ${evaluation.name} (Status: ${evaluation.status})`;

  return (
    <Card
      className={cn(
        "transition-shadow flex flex-col h-full",
        (isClickable || isViewableDetail)
          ? 'hover:shadow-lg cursor-pointer'
          : 'cursor-not-allowed bg-muted/50 opacity-75' // Apply disabled styles
        )}
      onClick={handleCardClick}
       role="button" // Improve accessibility
       aria-label={cardAriaLabel}
       aria-disabled={!(isClickable || isViewableDetail)} // Set aria-disabled
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start mb-2 gap-2">
           {/* Use CardTitle for the name */}
          <CardTitle className="text-lg leading-tight font-semibold flex-1 min-w-0 truncate" title={evaluation.name}>
            {evaluation.name}
          </CardTitle>
           {/* Status Badge */}
          <Badge
            variant={evaluation.status === 'completed' ? 'default' : evaluation.status === 'pending' ? 'secondary' : 'outline'}
            className="capitalize flex-shrink-0" // Prevent shrinking too much
          >
            {evaluation.status}
          </Badge>
        </div>
         {/* Use CardDescription for the description */}
        <CardDescription className="text-sm text-muted-foreground line-clamp-2" title={evaluation.description}>
          {evaluation.description || 'No description provided.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-end pt-2">
        {/* Dates Section */}
        <div className="text-xs text-muted-foreground mb-3 space-y-1">
           <p className="flex items-center" title={`Starts on ${formatDate(evaluation.start_date)}`}>
              <CalendarDays className="h-3 w-3 mr-1" />
              Start: {formatDate(evaluation.start_date)}
            </p>
           <p className="flex items-center" title={`Ends on ${formatDate(evaluation.end_date)}`}>
              <CalendarDays className="h-3 w-3 mr-1" />
              End: {formatDate(evaluation.end_date)}
           </p>
        </div>
         {/* Feedback Progress Section */}
         <div className="flex items-center text-sm text-muted-foreground mt-auto pt-2 border-t border-border" title={progressTitle}>
            <Users className="h-4 w-4 mr-1.5" />
            <span>Feedback: {feedbackProgress}</span>
          </div>
      </CardContent>
    </Card>
  );
};
