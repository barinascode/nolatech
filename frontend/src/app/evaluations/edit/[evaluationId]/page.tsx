
"use client";

import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react'; // Add Save icon
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { employeesRepository } from '@/services/employeesRepository';
import type { Employee } from '@/services/employees';
import { useSession } from '@/hooks/useSession';
import { evaluationsRepository } from '@/services/evaluationsRepository';
import type { Evaluation, UpdateEvaluationRequest } from '@/services/evaluations'; // Import Evaluation and Update types
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/redux/store';
import { fetchEvaluations } from '@/redux/slices/evaluationsSlice';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"; // Import useToast


// Zod schema for a single question (allow existing _id for updates)
const questionSchema = z.object({
  _id: z.string().optional(), // Existing ID for updates
  type: z.enum(['open', 'scale']),
  text: z.string().min(1, "Question text is required"),
  competency: z.string().optional(), // Optional for scale questions
}).refine(data => data.type !== 'scale' || (data.type === 'scale' && data.competency && data.competency.length > 0), {
  message: "Competency is required for scale questions",
  path: ["competency"],
});

// Zod schema for the entire evaluation form (similar to create, but status is needed)
const evaluationSchema = z.object({
  name: z.string().min(1, "Evaluation name is required"),
  description: z.string().min(1, "Description is required"),
  evaluator_ids: z.array(z.string()).min(1, "At least one evaluator must be selected"),
  start_date: z.date({ required_error: "Start date is required." }),
  end_date: z.date({ required_error: "End date is required." }),
  evaluated_id: z.string({ required_error: "Evaluated employee is required." }).min(1, "Evaluated employee is required"),
  status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']), // Add status field
  questions: z.array(questionSchema).min(1, "At least one question is required"),
}).refine((data) => data.start_date < data.end_date, {
    message: "End date must be after start date",
    path: ["end_date"],
});


export default function EditEvaluationPage() {
  const params = useParams();
  const router = useRouter();
  const evaluationId = params.evaluationId as string;
  const { token, employee: currentEmployee } = useSession();
  const dispatch = useDispatch<AppDispatch>();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(true);
  const [isLoadingEvaluation, setIsLoadingEvaluation] = useState(true);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [errorLoading, setErrorLoading] = useState<string | null>(null); // Combined loading error
  const { toast } = useToast(); // Initialize useToast


  const form = useForm<z.infer<typeof evaluationSchema>>({
    resolver: zodResolver(evaluationSchema),
    defaultValues: {
      name: "",
      description: "",
      evaluator_ids: [],
      start_date: undefined,
      end_date: undefined,
      evaluated_id: "",
      status: 'pending', // Default status
      questions: [], // Start empty, will be populated from fetch
    },
  });

   const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "questions",
  });

   // Watch the status field
   const status = form.watch('status');
   const isCompleted = status === 'completed';
   const isDisabled = isLoadingSubmit || isCompleted || isLoadingEvaluation || isLoadingEmployees; // Combine loading and completed state


  // Fetch Employees
  useEffect(() => {
    const loadEmployees = async () => {
      if (!token) {
          setErrorLoading("Authentication token not found.");
          setIsLoadingEmployees(false);
          return;
      }
      setIsLoadingEmployees(true);
      setErrorLoading(null);
      try {
        const response = await employeesRepository.fetchEmployees(token);
        setEmployees(response.employees);
      } catch (error: any) {
        setErrorLoading(error.message || "Failed to load employees.");
        console.error("Error loading employees:", error);
      } finally {
        setIsLoadingEmployees(false);
      }
    };

    loadEmployees();
  }, [token]);

  // Fetch Evaluation Details
  useEffect(() => {
    const loadEvaluation = async () => {
      if (!evaluationId || !token) {
        setErrorLoading("Evaluation ID or token missing.");
        setIsLoadingEvaluation(false);
        return;
      }
      setIsLoadingEvaluation(true);
      setErrorLoading(null);
      try {
        const evaluationData = await evaluationsRepository.fetchEvaluationById(evaluationId, token);
        // Populate form with fetched data
        form.reset({
          name: evaluationData.name,
          description: evaluationData.description,
          evaluator_ids: evaluationData.evaluator_ids.map(emp => emp._id),
          start_date: new Date(evaluationData.start_date), // Convert string to Date
          end_date: new Date(evaluationData.end_date),     // Convert string to Date
          evaluated_id: evaluationData.evaluated_id._id,
          status: evaluationData.status,
          // Map questions, ensuring competency is empty string if not present
          questions: evaluationData.questions.map(q => ({
            _id: q._id,
            type: q.type,
            text: q.text,
            competency: q.competency || '',
          })),
        });
         if(evaluationData.status === 'completed') {
             toast({
                variant: "default",
                title: "Read Only",
                description: "This evaluation is completed and cannot be modified.",
            });
        }
      } catch (error: any) {
        const loadErrorMsg = error.message || "Failed to load evaluation details.";
         toast({ // Show error toast for loading
            variant: "destructive",
            title: "Loading Error",
            description: loadErrorMsg,
         });
        setErrorLoading(loadErrorMsg);
        console.error("Error loading evaluation:", error);
      } finally {
        setIsLoadingEvaluation(false);
      }
    };

    loadEvaluation();
  }, [evaluationId, token, form, toast]); // Include form and toast in dependencies

  const handleGoBack = () => {
    router.push('/evaluations');
  };

  const onSubmit = async (values: z.infer<typeof evaluationSchema>) => {
     if (!token || !evaluationId || isCompleted) { // Prevent submission if completed
         const message = isCompleted ? "Cannot update a completed evaluation." : "Session or Evaluation ID is invalid. Cannot update evaluation.";
         toast({ // Show error toast
            variant: "destructive",
            title: "Update Error",
            description: message,
         });
         form.setError("root", { message: message });
         return;
     }
     setIsLoadingSubmit(true);
     form.clearErrors("root");

     const requestData: UpdateEvaluationRequest = {
         ...values,
         start_date: values.start_date.toISOString(),
         end_date: values.end_date.toISOString(),
         questions: values.questions.map(q => ({
             _id: q._id, // Include existing _id if present
             type: q.type,
             text: q.text,
             ...(q.type === 'scale' && { competency: q.competency })
         })),
         // employee_id is usually not sent in update, confirm with API docs if needed
     };

     try {
         console.log("Submitting updated evaluation data:", requestData);
         const updatedEvaluation = await evaluationsRepository.updateEvaluation(evaluationId, requestData, token);
         toast({ // Show success toast
             title: "Evaluation Updated",
             description: `Changes to "${updatedEvaluation.name}" saved successfully.`,
         });
         console.log("Evaluation updated successfully!");
         dispatch(fetchEvaluations()); // Refresh the evaluations list
         router.push('/evaluations');
     } catch (error: any) {
         const errorMessage = error.message || "Failed to update evaluation. Please try again.";
         console.error("Error updating evaluation:", error);
          toast({ // Show error toast
            variant: "destructive",
            title: "Update Failed",
            description: errorMessage,
          });
         form.setError("root", { message: errorMessage });
     } finally {
         setIsLoadingSubmit(false);
     }
 };


  // Function to add a new question
  const addQuestion = (type: 'open' | 'scale' = 'open') => {
    append({ type, text: '', competency: '' });
  };

  const isLoading = isLoadingEmployees || isLoadingEvaluation;

  return (
    <Layout>
      <div className="mb-4">
        <Button variant="outline" size="sm" onClick={handleGoBack} disabled={isLoadingSubmit}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Evaluations
        </Button>
      </div>
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Evaluation</CardTitle>
          <CardDescription>
            {isLoading ? 'Loading evaluation details...' : `Editing evaluation: ${form.getValues('name') || evaluationId}`}
             {isCompleted && <span className="text-destructive font-medium ml-2">(Completed - Read Only)</span>}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="space-y-6 p-8">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-40 w-full" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-40 w-full" />
              <div className="flex justify-end gap-2">
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          )}
          {errorLoading && !isLoading && (
             <Alert variant="destructive" className="my-4">
               <AlertTriangle className="h-4 w-4" />
               <AlertTitle>Error Loading Data</AlertTitle>
               <AlertDescription>
                 {errorLoading} Please try refreshing the page or go back.
                 <div className="mt-2">
                    <Button variant="secondary" size="sm" onClick={() => window.location.reload()}>Refresh</Button>
                 </div>
               </AlertDescription>
             </Alert>
          )}
          {!isLoading && !errorLoading && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Info */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Evaluation Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Q3 Performance Review" {...field} disabled={isDisabled} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Briefly describe the purpose of this evaluation..." {...field} disabled={isDisabled} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Employee Selection */}
                 {isLoadingEmployees && !isLoadingEvaluation && ( // Show employee loading only if eval loaded
                     <div className="space-y-4">
                          <Skeleton className="h-10 w-full" />
                          <Skeleton className="h-10 w-full" />
                     </div>
                 )}
                 {/* Error handled by general errorLoading state */}
                 {!isLoadingEmployees && employees.length > 0 && (
                  <>
                     <FormField
                      control={form.control}
                      name="evaluated_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Employee Being Evaluated</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value} disabled={isDisabled}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select employee..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {employees.map((emp) => (
                                <SelectItem key={emp._id} value={emp._id}>
                                  {emp.first_name} {emp.last_name} ({emp.email})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Multiple Evaluator Selection */}
                    <FormField
                      control={form.control}
                      name="evaluator_ids"
                      render={() => (
                         <FormItem>
                          <div className="mb-4">
                             <FormLabel className="text-base">Evaluators</FormLabel>
                             <FormDescription>
                                  Select one or more employees who will provide feedback.
                             </FormDescription>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-60 overflow-y-auto border p-4 rounded-md">
                             {employees.map((emp) => (
                                 <FormField
                                  key={emp._id}
                                  control={form.control}
                                  name="evaluator_ids"
                                  render={({ field }) => {
                                      return (
                                      <FormItem
                                          key={emp._id}
                                          className="flex flex-row items-start space-x-3 space-y-0"
                                      >
                                          <FormControl>
                                          <Checkbox
                                              checked={field.value?.includes(emp._id)}
                                              onCheckedChange={(checked) => {
                                              return checked
                                                  ? field.onChange([...(field.value || []), emp._id])
                                                  : field.onChange(
                                                      (field.value || []).filter(
                                                      (value) => value !== emp._id
                                                      )
                                                  )
                                              }}
                                              disabled={isDisabled}
                                          />
                                          </FormControl>
                                          <FormLabel className="text-sm font-normal">
                                              {emp.first_name} {emp.last_name}
                                          </FormLabel>
                                      </FormItem>
                                      )
                                  }}
                                  />
                              ))}
                           </div>
                           <FormMessage />
                         </FormItem>
                      )}
                    />

                   </>
                 )}
                 {!isLoadingEmployees && employees.length === 0 && (
                      <p className="text-sm text-muted-foreground">No employees available to select.</p>
                 )}

                 {/* Status Selection */}
                 <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} disabled={isDisabled}>
                          <FormControl>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />


                 {/* Dates */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                      control={form.control}
                      name="start_date"
                      render={({ field }) => (
                          <FormItem className="flex flex-col">
                          <FormLabel>Start Date</FormLabel>
                          <Popover>
                              <PopoverTrigger asChild>
                              <FormControl>
                                  <Button
                                  variant={"outline"}
                                  className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                  )}
                                  disabled={isDisabled}
                                  >
                                  {field.value ? (
                                      format(field.value, "PPP")
                                  ) : (
                                      <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                              </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  initialFocus
                                  disabled={isDisabled} // Disable calendar if form is disabled
                                  // Consider allowing past dates for editing if needed
                              />
                              </PopoverContent>
                          </Popover>
                          <FormMessage />
                          </FormItem>
                      )}
                      />
                      <FormField
                      control={form.control}
                      name="end_date"
                      render={({ field }) => (
                          <FormItem className="flex flex-col">
                          <FormLabel>End Date</FormLabel>
                           <Popover>
                              <PopoverTrigger asChild>
                              <FormControl>
                                  <Button
                                  variant={"outline"}
                                  className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                  )}
                                  disabled={isDisabled || !form.watch('start_date')}
                                  >
                                  {field.value ? (
                                      format(field.value, "PPP")
                                  ) : (
                                      <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                              </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) => {
                                      if (isDisabled) return true; // Disable all if form is disabled
                                      const startDate = form.watch('start_date');
                                      // Disable dates before start date
                                      return !!startDate && date < startDate;
                                  }}
                                  initialFocus
                              />
                              </PopoverContent>
                          </Popover>
                          <FormMessage />
                          </FormItem>
                      )}
                      />
                 </div>

                {/* Dynamic Questions Section */}
                <div className="space-y-4">
                   <FormLabel>Questions</FormLabel>
                   {fields.map((item, index) => (
                      <Card key={item.id} className="p-4 relative">
                          <div className="grid grid-cols-1 gap-4">
                               <FormField
                                  control={form.control}
                                  name={`questions.${index}.type`}
                                  render={({ field }) => (
                                  <FormItem>
                                      <FormLabel>Question Type</FormLabel>
                                      <Select onValueChange={field.onChange} value={field.value} disabled={isDisabled}>
                                      <FormControl>
                                          <SelectTrigger className="w-[180px]">
                                          <SelectValue placeholder="Select type" />
                                          </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                          <SelectItem value="open">Open Text</SelectItem>
                                          <SelectItem value="scale">Scale (1-5)</SelectItem>
                                      </SelectContent>
                                      </Select>
                                      <FormMessage />
                                  </FormItem>
                                  )}
                              />
                               <FormField
                                  control={form.control}
                                  name={`questions.${index}.text`}
                                  render={({ field }) => (
                                  <FormItem>
                                      <FormLabel>Question Text</FormLabel>
                                      <FormControl>
                                      <Textarea placeholder="Enter the question..." {...field} disabled={isDisabled} />
                                      </FormControl>
                                      <FormMessage />
                                  </FormItem>
                                  )}
                              />
                              {/* Conditionally render competency input */}
                              {form.watch(`questions.${index}.type`) === 'scale' && (
                                  <FormField
                                  control={form.control}
                                  name={`questions.${index}.competency`}
                                  render={({ field }) => (
                                      <FormItem>
                                      <FormLabel>Competency</FormLabel>
                                      <FormControl>
                                          <Input placeholder="e.g., Communication, Teamwork" {...field} value={field.value || ''} disabled={isDisabled} />
                                      </FormControl>
                                      <FormMessage />
                                      </FormItem>
                                  )}
                                  />
                              )}
                          </div>
                           {/* Remove Question Button */}
                           {fields.length > 1 && (
                               <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  className="absolute top-2 right-2 h-6 w-6"
                                  onClick={() => remove(index)}
                                  disabled={isDisabled} // Disable if form is disabled
                                  aria-label="Remove question"
                              >
                                  <Trash2 className="h-4 w-4" />
                              </Button>
                           )}
                      </Card>
                   ))}
                   <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addQuestion('open')}
                      disabled={isDisabled} // Disable if form is disabled
                      className="mt-2"
                    >
                      <Plus className="mr-2 h-4 w-4" /> Add Open Question
                    </Button>
                     <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addQuestion('scale')}
                      disabled={isDisabled} // Disable if form is disabled
                      className="mt-2 ml-2"
                    >
                      <Plus className="mr-2 h-4 w-4" /> Add Scale Question
                    </Button>
                    {/* Question array errors */}
                      {form.formState.errors.questions && !form.formState.errors.questions.root && (
                          <p className="text-sm font-medium text-destructive">{form.formState.errors.questions.message}</p>
                      )}
                      {form.formState.errors.questions?.root && (
                          <p className="text-sm font-medium text-destructive">{form.formState.errors.questions.root.message}</p>
                      )}
                </div>

                 {/* Root Form Error */}
                  {form.formState.errors.root && (
                      <p className="text-sm font-medium text-destructive text-center">{form.formState.errors.root.message}</p>
                  )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-2 mt-6">
                  <Button type="button" variant="outline" onClick={handleGoBack} disabled={isLoadingSubmit}>Cancel</Button>
                  <Button type="submit" disabled={isDisabled}>
                    {isLoadingSubmit ? 'Saving...' : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </Layout>
  );
}
