
"use client";

import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form'; // Import FormDescription
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea'; // Import Textarea
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox"; // Import Checkbox
import { employeesRepository } from '@/services/employeesRepository';
import type { Employee } from '@/services/employees';
import { useSession } from '@/hooks/useSession';
import { evaluationsRepository } from '@/services/evaluationsRepository';
import type { CreateEvaluationRequest } from '@/services/evaluations';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/redux/store';
import { fetchEvaluations } from '@/redux/slices/evaluationsSlice'; // Import fetchEvaluations thunk
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton
import { useToast } from "@/hooks/use-toast"; // Import useToast


// Zod schema for a single question
const questionSchema = z.object({
  type: z.enum(['open', 'scale']),
  text: z.string().min(1, "Question text is required"),
  competency: z.string().optional(), // Optional for scale questions
}).refine(data => data.type !== 'scale' || (data.type === 'scale' && data.competency && data.competency.length > 0), {
  message: "Competency is required for scale questions",
  path: ["competency"],
});

// Zod schema for the entire evaluation form
const evaluationSchema = z.object({
  name: z.string().min(1, "Evaluation name is required"),
  description: z.string().min(1, "Description is required"),
  evaluator_ids: z.array(z.string()).min(1, "At least one evaluator must be selected"),
  start_date: z.date({ required_error: "Start date is required." }),
  end_date: z.date({ required_error: "End date is required." }),
  evaluated_id: z.string({ required_error: "Evaluated employee is required." }).min(1, "Evaluated employee is required"),
  questions: z.array(questionSchema).min(1, "At least one question is required"),
}).refine((data) => data.start_date < data.end_date, {
    message: "End date must be after start date",
    path: ["end_date"],
});


export default function CreateEvaluationPage() {
  const router = useRouter();
  const { token, employee: currentEmployee } = useSession();
  const dispatch = useDispatch<AppDispatch>();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(true);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [errorEmployees, setErrorEmployees] = useState<string | null>(null);
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
      questions: [{ type: 'open', text: '', competency: '' }], // Start with one empty open question
    },
  });

   const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  useEffect(() => {
    const loadEmployees = async () => {
      if (!token) {
          setErrorEmployees("Authentication token not found.");
          setIsLoadingEmployees(false);
          return;
      }
      setIsLoadingEmployees(true);
      setErrorEmployees(null);
      try {
        const response = await employeesRepository.fetchEmployees(token);
        setEmployees(response.employees);
      } catch (error: any) {
        setErrorEmployees(error.message || "Failed to load employees.");
         console.error("Error loading employees:", error);
      } finally {
        setIsLoadingEmployees(false);
      }
    };

    loadEmployees();
  }, [token]);

  const handleGoBack = () => {
    router.back();
  };

 const onSubmit = async (values: z.infer<typeof evaluationSchema>) => {
     if (!token || !currentEmployee?._id) {
         toast({ // Show error toast for session issue
            variant: "destructive",
            title: "Error",
            description: "User session is invalid. Cannot create evaluation.",
         });
         form.setError("root", { message: "User session is invalid. Cannot create evaluation." });
         return;
     }
     setIsLoadingSubmit(true);
     form.clearErrors("root");

     const requestData: CreateEvaluationRequest = {
         ...values,
         employee_id: currentEmployee._id, // Add creator ID
         start_date: values.start_date.toISOString(), // Format dates to ISO string
         end_date: values.end_date.toISOString(),
         // Ensure questions only include relevant fields based on type
         questions: values.questions.map(q => ({
             type: q.type,
             text: q.text,
             ...(q.type === 'scale' && { competency: q.competency }) // Only include competency if type is scale
         })),
     };

     try {
         console.log("Submitting evaluation data:", requestData);
         const createdEvaluation = await evaluationsRepository.createEvaluation(requestData, token);
         toast({ // Show success toast
             title: "Evaluation Created",
             description: `Evaluation "${createdEvaluation.name}" saved successfully.`,
         });
         console.log("Evaluation created successfully!");
         dispatch(fetchEvaluations()); // Refresh the evaluations list in Redux state
         router.push('/evaluations'); // Navigate back to the list page
     } catch (error: any) {
         const errorMessage = error.message || "Failed to create evaluation. Please try again.";
         console.error("Error creating evaluation:", error);
          toast({ // Show error toast
            variant: "destructive",
            title: "Creation Failed",
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
          <CardTitle>Create New Evaluation</CardTitle>
          <CardDescription>
            Define the details and questions for your new evaluation form.
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                      <Input placeholder="e.g., Q3 Performance Review" {...field} disabled={isLoadingSubmit} />
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
                      <Textarea placeholder="Briefly describe the purpose of this evaluation..." {...field} disabled={isLoadingSubmit} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Employee Selection */}
               {isLoadingEmployees && (
                   <div className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                   </div>
               )}
               {errorEmployees && (
                   <p className="text-sm font-medium text-destructive">{errorEmployees}</p>
               )}
               {!isLoadingEmployees && !errorEmployees && employees.length > 0 && (
                <>
                   <FormField
                    control={form.control}
                    name="evaluated_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Employee Being Evaluated</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingSubmit}>
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
                                            disabled={isLoadingSubmit}
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
               {!isLoadingEmployees && !errorEmployees && employees.length === 0 && (
                    <p className="text-sm text-muted-foreground">No employees available to select.</p>
               )}

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
                                disabled={isLoadingSubmit}
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
                                disabled={(date) =>
                                    date < new Date(new Date().setHours(0, 0, 0, 0)) // Disable past dates
                                }
                                initialFocus
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
                                disabled={isLoadingSubmit || !form.watch('start_date')} // Disable if start date not selected
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
                                    const startDate = form.watch('start_date');
                                    // Disable dates before start date or today
                                    return date < (startDate || new Date(new Date().setHours(0, 0, 0, 0)));
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
                                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingSubmit}>
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
                                    <Textarea placeholder="Enter the question..." {...field} disabled={isLoadingSubmit} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            {/* Conditionally render competency input for 'scale' type */}
                            {form.watch(`questions.${index}.type`) === 'scale' && (
                                <FormField
                                control={form.control}
                                name={`questions.${index}.competency`}
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Competency</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Communication, Teamwork" {...field} disabled={isLoadingSubmit} />
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
                                disabled={isLoadingSubmit}
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
                    disabled={isLoadingSubmit}
                    className="mt-2"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Open Question
                  </Button>
                   <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addQuestion('scale')}
                    disabled={isLoadingSubmit}
                    className="mt-2 ml-2"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Scale Question
                  </Button>
                  {/* Display error message if no questions */}
                    {form.formState.errors.questions && !form.formState.errors.questions.root && (
                        <p className="text-sm font-medium text-destructive">{form.formState.errors.questions.message}</p>
                    )}
                    {/* Display root error message for questions array itself */}
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
                <Button type="submit" disabled={isLoadingSubmit}>
                  {isLoadingSubmit ? 'Saving...' : 'Save Evaluation'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </Layout>
  );
}
