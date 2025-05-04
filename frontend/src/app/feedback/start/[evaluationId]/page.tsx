
"use client";

import React, { useEffect, useState, useMemo } from 'react'; // Import useMemo
import { Layout } from '@/components/Layout';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PencilRuler, Frown, CheckCircle, Info, ChevronLeft, ChevronRight, BarChart3 } from 'lucide-react'; // Added BarChart3
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from 'lucide-react';
import { useAppSelector } from '@/hooks/useAppSelector';
import type { AppDispatch } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { fetchEvaluationDetails, clearDetailsError } from '@/redux/slices/evaluationsSlice';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { EvaluationQuestion } from '@/services/evaluations'; // Import question type
import { cn } from '@/lib/utils'; // Import cn utility
import { FeedbackCompetencyChart } from '@/components/feedback/FeedbackCompetencyChart'; // Import the new chart component

interface Answer {
    questionId: string;
    answerValue: string | number;
    questionText: string; // Keep text for summary
    questionType: 'open' | 'scale'; // Keep type for summary
    competency?: string; // Add competency for calculations
}

export default function StartFeedbackPage() {
    const params = useParams();
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const evaluationId = params.evaluationId as string;
    const { toast } = useToast();

    const { currentEvaluation, loadingDetails, detailsError } = useAppSelector(
        (state) => state.evaluations
    );

    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string | number>>({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    const totalQuestions = currentEvaluation?.questions?.length ?? 0;
    const currentQuestion = currentEvaluation?.questions?.[currentStep];

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

    // Calculate formatted answers at the top level using useMemo
    const formattedAnswers: Answer[] = useMemo(() => {
        return currentEvaluation?.questions.map(q => ({
            questionId: q._id || 'unknown',
            answerValue: answers[q._id || 'unknown'] ?? 'Not Answered',
            questionText: q.text,
            questionType: q.type,
            competency: q.competency
        })) || [];
    }, [currentEvaluation, answers]); // Depend on currentEvaluation and answers

    // Calculate average scores per competency at the top level using useMemo
    const competencyScores = useMemo(() => {
        const scores: Record<string, { sum: number; count: number }> = {};
        formattedAnswers.forEach(ans => {
            if (ans.questionType === 'scale' && ans.competency && typeof ans.answerValue === 'number') {
                if (!scores[ans.competency]) {
                    scores[ans.competency] = { sum: 0, count: 0 };
                }
                scores[ans.competency].sum += ans.answerValue;
                scores[ans.competency].count += 1;
            }
        });

        return Object.entries(scores).map(([competency, data]) => ({
            competency,
            averageScore: data.count > 0 ? parseFloat((data.sum / data.count).toFixed(1)) : 0,
        }));
    }, [formattedAnswers]); // Depend on formattedAnswers


    const handleGoBack = () => {
        router.push('/evaluations/assigned'); // Navigate back to the assigned evaluations list
    };

    // Helper to format dates
    const formatDate = (dateString: string | undefined): string => {
        if (!dateString) return 'N/A';
        try {
            return format(new Date(dateString), 'PPP'); // e.g., Sep 4, 2016
        } catch {
            return 'Invalid Date';
        }
    };

    const handleAnswerChange = (value: string | number) => {
        if (currentQuestion?._id) {
            setAnswers(prev => ({
                ...prev,
                [currentQuestion._id as string]: value
            }));
        }
    };

    const handleNext = () => {
        if (currentStep < totalQuestions - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = () => {
        // Placeholder for actual API submission
        console.log("Submitting feedback:", answers);
        setIsSubmitted(true);
        toast({
            title: "Feedback Submitted",
            description: `Your feedback for "${currentEvaluation?.name}" has been recorded.`,
            variant: "default", // Or "success" if you add that variant
        });
        // Potentially redirect or clear state after submission
        // router.push('/evaluations/assigned');
    };

     const isCurrentAnswerValid = (): boolean => {
        if (!currentQuestion?._id) return true; // If no question, it's "valid"
        const answer = answers[currentQuestion._id];
        return answer !== undefined && answer !== ''; // Basic check: must have an answer
    };

    const renderLoadingState = () => (
        <div className="space-y-6">
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-6" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-10 w-24 mt-4" />
        </div>
    );

    const renderErrorState = (errorMsg: string | null) => (
        <Alert variant="destructive" className="my-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error Loading Evaluation</AlertTitle>
            <AlertDescription>
                {errorMsg || 'An unexpected error occurred while loading the evaluation for feedback.'}
                <div className="mt-4">
                    <Button variant="secondary" size="sm" onClick={() => dispatch(fetchEvaluationDetails(evaluationId))}>Retry</Button>
                </div>
            </AlertDescription>
        </Alert>
    );

    // Renamed Card to a div for better layout control, apply card styles manually if needed
    const renderEvaluationInfo = () => (
        <div className="p-6 border rounded-lg bg-secondary/30 h-full">
            <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Info className="h-5 w-5 text-muted-foreground" />
                Evaluation Details
            </h2>
            <p className="text-sm text-muted-foreground mb-4">You are providing feedback for the following evaluation:</p>
            <div className="text-sm space-y-2">
                <p><strong className="font-medium text-muted-foreground">Name:</strong> {currentEvaluation?.name}</p>
                <p><strong className="font-medium text-muted-foreground">Description:</strong> {currentEvaluation?.description}</p>
                <p><strong className="font-medium text-muted-foreground">Evaluated Employee:</strong> {currentEvaluation?.evaluated_id?.first_name} {currentEvaluation?.evaluated_id?.last_name}</p>
                <p><strong className="font-medium text-muted-foreground">Period:</strong> {formatDate(currentEvaluation?.start_date)} - {formatDate(currentEvaluation?.end_date)}</p>
            </div>
        </div>
    );

    const renderQuestion = (question: EvaluationQuestion) => {
        const questionId = question._id as string;
        const answer = answers[questionId];

        return (
            <div className="space-y-4">
                <p className="text-lg font-medium">{question.text}</p>
                {question.type === 'open' && (
                    <Textarea
                        placeholder="Your response..."
                        rows={4}
                        value={(answer as string) || ''}
                        onChange={(e) => handleAnswerChange(e.target.value)}
                    />
                )}
                {question.type === 'scale' && (
                    <div className="space-y-2">
                     {question.competency && <p className="text-sm text-muted-foreground">Competency: {question.competency}</p>}
                      <RadioGroup
                        value={String(answer) || ''}
                        onValueChange={(value) => handleAnswerChange(Number(value))}
                        className="flex flex-wrap gap-4 pt-2" // Adjusted gap and wrapping
                      >
                        {[1, 2, 3, 4, 5].map((value) => (
                          <div key={value} className="flex items-center space-x-2">
                            <RadioGroupItem value={String(value)} id={`${questionId}-${value}`} />
                            <Label htmlFor={`${questionId}-${value}`} className="text-sm">{value}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                       <FormMessage /> {/* Placeholder for validation messages if needed */}
                    </div>
                )}
            </div>
        );
    };

      // Define FormMessage locally if not globally available or imported correctly
    const FormMessage = ({ message }: { message?: string }) => {
        if (!message) return null;
        return <p className="text-sm font-medium text-destructive">{message}</p>;
    };


    const renderWizard = () => (
        <Card className="h-full flex flex-col"> {/* Added flex flex-col h-full */}
            <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                     <PencilRuler className="h-6 w-6 text-primary" />
                    Provide Feedback
                </CardTitle>
                 <CardDescription>
                    Question {currentStep + 1} of {totalQuestions}
                </CardDescription>
                <Progress value={((currentStep + 1) / totalQuestions) * 100} className="w-full h-2 mt-2" />
            </CardHeader>
            <CardContent className="min-h-[200px] flex-grow"> {/* Added flex-grow */}
                {currentQuestion ? renderQuestion(currentQuestion) : <p>Loading question...</p>}
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4 mt-auto"> {/* Added mt-auto */}
                <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>
                     <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                </Button>
                {currentStep < totalQuestions - 1 ? (
                    <Button onClick={handleNext} disabled={!isCurrentAnswerValid()}>
                        Next <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                ) : (
                    <Button onClick={handleSubmit} disabled={!isCurrentAnswerValid()}>
                         <CheckCircle className="mr-2 h-4 w-4" /> Submit Feedback
                    </Button>
                )}
            </CardFooter>
        </Card>
    );

     // Moved useMemo calls to the top level of the component

     const renderSummary = () => {
        // Use the pre-calculated formattedAnswers and competencyScores
        return (
             <Card className="h-full flex flex-col"> {/* Added flex flex-col h-full */}
                <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                        Feedback Submitted Successfully!
                    </CardTitle>
                    <CardDescription>Thank you for providing feedback for "{currentEvaluation?.name}".</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-6"> {/* Grid for responses and chart */}
                     {/* Responses Section */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3">Your Responses:</h3>
                        <div className="space-y-4 max-h-96 overflow-y-auto border p-4 rounded-md bg-muted/50">
                            {formattedAnswers.map((ans, index) => (
                                <div key={ans.questionId} className="text-sm border-b pb-2 last:border-b-0">
                                    <p className="font-medium mb-1">{index + 1}. {ans.questionText}</p>
                                    {ans.questionType === 'open' ? (
                                        <p className="text-muted-foreground pl-4 italic">"{String(ans.answerValue)}"</p>
                                    ) : (
                                        <p className="text-muted-foreground pl-4">Score: <span className="font-semibold text-foreground">{String(ans.answerValue)}</span>/5</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Competency Score Chart Section */}
                    {competencyScores.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                <BarChart3 className="h-5 w-5 text-primary" />
                                Average Competency Scores
                            </h3>
                            <div className="h-80 border p-4 rounded-md bg-muted/50"> {/* Added height for chart */}
                                <FeedbackCompetencyChart data={competencyScores} />
                            </div>
                        </div>
                    )}
                </CardContent>
                 <CardFooter className="flex justify-end border-t pt-4 mt-auto"> {/* Added mt-auto */}
                     <Button variant="outline" onClick={handleGoBack}>Close</Button>
                 </CardFooter>
            </Card>
        );
     };


    return (
        <Layout>
            <div className="mb-4">
                <Button variant="outline" size="sm" onClick={handleGoBack} disabled={loadingDetails}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Assigned Evaluations
                </Button>
            </div>

            {/* Main container for side-by-side layout */}
            <div className="w-full max-w-6xl mx-auto"> {/* Increased max-width */}
                {loadingDetails && renderLoadingState()}
                {detailsError && !loadingDetails && renderErrorState(detailsError)}
                {!loadingDetails && !detailsError && !currentEvaluation && (
                     <Card className="w-full max-w-2xl mx-auto text-center">
                        <CardHeader>
                            <CardTitle>Evaluation Not Found</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Frown className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">The evaluation you are trying to provide feedback for (ID: {evaluationId}) could not be found or you may not have permission.</p>
                        </CardContent>
                    </Card>
                )}

                {!loadingDetails && !detailsError && currentEvaluation && (
                     // If status is not pending or in_progress, show a message (Allow 'in_progress' for feedback)
                     (currentEvaluation.status !== 'pending' && currentEvaluation.status !== 'in_progress') ? (
                         <Alert variant="default" className="my-4">
                           <Info className="h-4 w-4" />
                           <AlertTitle>Cannot Provide Feedback</AlertTitle>
                           <AlertDescription>
                             This evaluation is currently in status "{currentEvaluation.status}" and feedback cannot be submitted or modified at this time.
                           </AlertDescription>
                         </Alert>
                     ) : (
                        // If status is pending or in_progress, use Grid for side-by-side layout
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start"> {/* Use grid layout */}
                            {/* Column 1: Evaluation Details */}
                            <div className="md:col-span-1 h-full"> {/* Ensure full height */}
                                {renderEvaluationInfo()}
                            </div>

                            {/* Column 2: Wizard or Summary */}
                            <div className="md:col-span-2 h-full"> {/* Ensure full height */}
                                {isSubmitted ? renderSummary() : renderWizard()}
                            </div>
                        </div>
                    )
                )}
            </div>
        </Layout>
    );
}
