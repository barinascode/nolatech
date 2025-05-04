
"use client";

import React, { useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Users, CalendarDays, HelpCircle, MessageSquare, ClipboardList, Pencil } from 'lucide-react'; // Added Pencil
import { useAppSelector } from '@/hooks/useAppSelector';
import type { AppDispatch } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { fetchEvaluationDetails, clearDetailsError } from '@/redux/slices/evaluationsSlice';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";


export default function EvaluationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const evaluationId = params.evaluationId as string;

  const { currentEvaluation, loadingDetails, detailsError } = useAppSelector(
    (state) => state.evaluations
  );

  useEffect(() => {
    if (evaluationId) {
      dispatch(clearDetailsError()); // Clear previous errors
      dispatch(fetchEvaluationDetails(evaluationId));
    }
     // Cleanup function to clear error on unmount
    return () => {
      dispatch(clearDetailsError());
    };
  }, [evaluationId, dispatch]);

  const handleGoBack = () => {
    router.push('/evaluations'); // Navigate back to the main evaluations list
  };

  const handleEdit = () => {
    router.push(`/evaluations/edit/${evaluationId}`);
  }

  // Helper to format dates
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'PPP p'); // e.g., Sep 4, 2016 11:59 AM
    } catch {
      return 'Invalid Date';
    }
  };


  const renderLoadingState = () => (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <Skeleton className="h-8 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent className="space-y-6">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Separator />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
         <Skeleton className="h-20 w-full" />
         <Skeleton className="h-32 w-full" />
         <Skeleton className="h-24 w-full" />
         <div className="flex justify-end gap-2 mt-6">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
        </div>
      </CardContent>
    </Card>
  );

 const renderErrorState = () => (
    <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
            <CardTitle>Error Loading Evaluation</CardTitle>
            <CardDescription>Could not fetch details for ID: {evaluationId}</CardDescription>
        </CardHeader>
        <CardContent>
            <Alert variant="destructive" className="my-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Fetch Error</AlertTitle>
                <AlertDescription>
                    {detailsError || 'An unexpected error occurred.'}
                    <div className="mt-4">
                        <Button variant="secondary" size="sm" onClick={() => dispatch(fetchEvaluationDetails(evaluationId))}>Retry</Button>
                    </div>
                </AlertDescription>
            </Alert>
        </CardContent>
    </Card>
 );


  const renderEvaluationDetails = () => {
    if (!currentEvaluation) return <p>No evaluation data available.</p>;

    const feedbackCount = currentEvaluation.feedback_ids?.length || 0;
    const evaluatorCount = currentEvaluation.evaluator_ids?.length || 0;
    const isCompleted = currentEvaluation.status === 'completed';

    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-start gap-4">
             <div>
                <CardTitle className="text-2xl mb-1">{currentEvaluation.name}</CardTitle>
                <CardDescription>{currentEvaluation.description}</CardDescription>
             </div>
             <Badge variant={isCompleted ? 'default' : currentEvaluation.status === 'pending' ? 'secondary' : 'outline'} className="capitalize text-sm px-3 py-1 h-fit">
               {currentEvaluation.status}
             </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">

          {/* Basic Information Section */}
          <section>
             <h3 className="text-lg font-semibold mb-3 flex items-center"><ClipboardList className="mr-2 h-5 w-5 text-primary"/>Basic Information</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <div><strong className="font-medium text-muted-foreground">Created By:</strong> {currentEvaluation.employee_id.first_name} {currentEvaluation.employee_id.last_name}</div>
                <div><strong className="font-medium text-muted-foreground">Evaluated Employee:</strong> {currentEvaluation.evaluated_id.first_name} {currentEvaluation.evaluated_id.last_name}</div>
                <div className="flex items-center"><CalendarDays className="mr-1.5 h-4 w-4 text-muted-foreground"/><strong className="font-medium text-muted-foreground mr-1">Start Date:</strong> {formatDate(currentEvaluation.start_date)}</div>
                <div className="flex items-center"><CalendarDays className="mr-1.5 h-4 w-4 text-muted-foreground"/><strong className="font-medium text-muted-foreground mr-1">End Date:</strong> {formatDate(currentEvaluation.end_date)}</div>
            </div>
          </section>

          <Separator />

          {/* Evaluators Section */}
          <section>
             <h3 className="text-lg font-semibold mb-3 flex items-center"><Users className="mr-2 h-5 w-5 text-primary"/>Assigned Evaluators ({evaluatorCount})</h3>
             {evaluatorCount > 0 ? (
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground pl-2">
                  {currentEvaluation.evaluator_ids.map(emp => (
                    <li key={emp._id}>{emp.first_name} {emp.last_name}</li>
                  ))}
                </ul>
             ) : (
                <p className="text-sm text-muted-foreground">No evaluators assigned.</p>
             )}
          </section>

          <Separator />

          {/* Questions Section */}
          <section>
             <h3 className="text-lg font-semibold mb-3 flex items-center"><HelpCircle className="mr-2 h-5 w-5 text-primary"/>Evaluation Questions ({currentEvaluation.questions?.length || 0})</h3>
              {currentEvaluation.questions && currentEvaluation.questions.length > 0 ? (
                 <Accordion type="single" collapsible className="w-full">
                    {currentEvaluation.questions.map((q, index) => (
                        <AccordionItem value={`item-${index}`} key={q._id || index}>
                        <AccordionTrigger className="text-sm hover:no-underline">
                           <span className="flex-1 text-left mr-4">{index + 1}. {q.text}</span>
                           <Badge variant="outline" className="text-xs capitalize">{q.type}{q.type === 'scale' ? ` (${q.competency})` : ''}</Badge>
                        </AccordionTrigger>
                        <AccordionContent className="text-xs text-muted-foreground pl-4">
                            {q.type === 'open' ? 'Open text response expected.' : `Scale response (1-5) expected for competency: ${q.competency || 'N/A'}.`}
                        </AccordionContent>
                        </AccordionItem>
                    ))}
                 </Accordion>
              ) : (
                 <p className="text-sm text-muted-foreground">No questions defined for this evaluation.</p>
              )}
          </section>

          <Separator />

          {/* Feedback Summary Section */}
          <section>
              <h3 className="text-lg font-semibold mb-3 flex items-center"><MessageSquare className="mr-2 h-5 w-5 text-primary"/>Feedback Summary</h3>
               <p className="text-sm text-muted-foreground">
                <strong className="font-semibold text-foreground">{feedbackCount}</strong> out of <strong className="font-semibold text-foreground">{evaluatorCount}</strong> assigned evaluators have submitted feedback.
              </p>
               {/* Placeholder for listing feedback - More detailed view can be a separate feature */}
               {feedbackCount > 0 && (
                 <div className="mt-3">
                   <Button variant="outline" size="sm" disabled>View Detailed Feedback (Coming Soon)</Button>
                 </div>
               )}
          </section>


          {/* Action Buttons */}
          <div className="flex justify-end gap-2 mt-8 border-t pt-6">
            <Button variant="outline" onClick={handleGoBack}>Close</Button>
            {!isCompleted && (
                <Button onClick={handleEdit}>
                    <Pencil className="mr-2 h-4 w-4" /> Edit Evaluation
                </Button>
            )}
             {/* Potential: Add button to "Start Feedback" if user is an evaluator */}
          </div>

        </CardContent>
      </Card>
    );
  };


  return (
    <Layout>
       <div className="mb-4">
        <Button variant="outline" size="sm" onClick={handleGoBack} disabled={loadingDetails}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Evaluations
        </Button>
      </div>

       {loadingDetails && renderLoadingState()}
       {detailsError && !loadingDetails && renderErrorState()}
       {!loadingDetails && !detailsError && currentEvaluation && renderEvaluationDetails()}
       {!loadingDetails && !detailsError && !currentEvaluation && (
            // Handle case where loading finished but no data (might happen if ID was invalid but didn't trigger 404)
            <Card className="w-full max-w-4xl mx-auto">
                 <CardHeader>
                    <CardTitle>Evaluation Not Found</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">The evaluation with ID "{evaluationId}" could not be loaded or does not exist.</p>
                 </CardContent>
            </Card>
       )}

    </Layout>
  );
}
