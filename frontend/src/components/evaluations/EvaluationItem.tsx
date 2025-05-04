
import type { Evaluation } from '@/services/evaluations';
import { Card, CardContent } from '@/components/ui/card'; // Use CardContent for padding
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button'; // Import Button
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { Users, CalendarDays, Pencil } from 'lucide-react'; // Import Pencil icon
import { cn } from "@/lib/utils"; // Import cn for conditional classes

interface EvaluationItemProps {
  evaluation: Evaluation;
  showEditButton?: boolean; // Optional prop to control edit button visibility
  targetRoutePrefix?: string; // Optional prefix for the navigation route
}

export const EvaluationItem: React.FC<EvaluationItemProps> = ({
    evaluation,
    showEditButton = true,
    targetRoutePrefix = '/evaluations' // Default to evaluations detail page
}) => {
  const router = useRouter();
  const isClickable = targetRoutePrefix === '/feedback/start' && evaluation.status === 'pending';
  const isViewableDetail = targetRoutePrefix === '/evaluations'; // Always allow viewing details

  const handleItemClick = () => {
    // Only navigate if the target is feedback and status is pending, OR if the target is detail view
    if (isClickable || isViewableDetail) {
      router.push(`${targetRoutePrefix}/${evaluation._id}`);
    }
    // Otherwise, do nothing on click
  };

  const handleEditClick = (e: React.MouseEvent) => {
     e.stopPropagation(); // Prevent triggering handleItemClick
     // Navigate to the evaluation edit page
     router.push(`/evaluations/edit/${evaluation._id}`);
     console.log(`Edit evaluation ${evaluation._id}`);
  };

  // Calculate feedback progress: number of feedbacks / number of assigned evaluators
  const feedbackCount = evaluation.feedback_ids?.length || 0;
  const evaluatorCount = evaluation.evaluator_ids?.length || 0;
  const feedbackProgress = `${feedbackCount}/${evaluatorCount}`;
  const progressTitle = `${feedbackCount} out of ${evaluatorCount} assigned evaluators have provided feedback.`;

  // Format dates or show placeholder if invalid
  const formatDate = (dateString: string): string => {
    try {
      return format(new Date(dateString), 'PP'); // 'PP' format: Sep 4, 2016
    } catch {
      return 'Invalid Date';
    }
  };

  const cardAriaLabel = isClickable || isViewableDetail
      ? `View details for evaluation: ${evaluation.name}`
      : `Cannot provide feedback for evaluation: ${evaluation.name} (Status: ${evaluation.status})`;

  return (
     // Wrap Card and Button in a flex container
     <div className="flex items-center gap-2 mb-4">
      <Card
        className={cn(
          "flex-1 transition-shadow overflow-hidden",
          (isClickable || isViewableDetail)
            ? 'hover:shadow-md cursor-pointer'
            : 'cursor-not-allowed bg-muted/50 opacity-75' // Apply disabled styles if not clickable
        )}
        onClick={handleItemClick}
        role="button" // Improve accessibility
        aria-label={cardAriaLabel}
        aria-disabled={!(isClickable || isViewableDetail)} // Set aria-disabled based on clickability
      >
        <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Left Section: Name, Description, Dates */}
          <div className="flex-1 min-w-0"> {/* Ensure text truncates */}
            <h3 className="text-lg font-semibold mb-1 truncate" title={evaluation.name}>
              {evaluation.name}
            </h3>
            <p className="text-sm text-muted-foreground mb-2 line-clamp-2" title={evaluation.description}>
              {evaluation.description || 'No description provided.'}
            </p>
            <div className="flex items-center text-xs text-muted-foreground space-x-3">
              <span className="flex items-center" title={`Starts on ${formatDate(evaluation.start_date)}`}>
                  <CalendarDays className="h-3 w-3 mr-1" />
                  Start: {formatDate(evaluation.start_date)}
              </span>
              <span className="flex items-center" title={`Ends on ${formatDate(evaluation.end_date)}`}>
                  <CalendarDays className="h-3 w-3 mr-1" />
                  End: {formatDate(evaluation.end_date)}
              </span>
            </div>
          </div>

          {/* Right Section: Status Badge, Feedback Progress */}
          <div className="flex flex-col items-start sm:items-end space-y-2 flex-shrink-0">
            {/* Status Badge */}
            <Badge
              variant={evaluation.status === 'completed' ? 'default' : evaluation.status === 'pending' ? 'secondary' : 'outline'}
              className="capitalize" // Ensure consistent capitalization
            >
              {evaluation.status}
            </Badge>
            {/* Feedback Progress */}
            <div className="flex items-center text-sm text-muted-foreground" title={progressTitle}>
              <Users className="h-4 w-4 mr-1" />
              <span>{feedbackProgress}</span>
            </div>
          </div>
        </CardContent>
      </Card>
       {/* Conditionally render Edit Button */}
       {showEditButton && (
            <Button
             variant="outline"
             size="icon"
             onClick={handleEditClick}
             aria-label={`Edit evaluation ${evaluation.name}`}
             className="flex-shrink-0" // Prevent button from shrinking
             // Disable edit button if evaluation is completed
             disabled={evaluation.status === 'completed'}
             title={evaluation.status === 'completed' ? 'Cannot edit completed evaluation' : `Edit evaluation ${evaluation.name}`}
           >
             <Pencil className="h-4 w-4" />
           </Button>
       )}
     </div>
  );
};
