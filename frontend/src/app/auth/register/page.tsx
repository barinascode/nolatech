
"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';
import { authRepository } from '@/services/authRepository';
import { Eye, EyeOff, Send } from 'lucide-react'; // Import icons
import Image from 'next/image'; // Import Image component

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { setRegisteredUser, setRegistrationError } from '@/redux/slices/authSlice'; // Import Redux actions
import { useDispatch } from 'react-redux';

const registerSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"], // path of error
});

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for confirm password visibility
  const router = useRouter();
  const dispatch = useDispatch(); // Initialize useDispatch

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    setIsLoading(true);
    form.clearErrors("root"); // Clear previous root errors
    try {
      // Omit confirmPassword before sending to API
      const { confirmPassword, ...registerData } = values;
      const response = await authRepository.register(registerData);
      dispatch(setRegisteredUser(response)); // Dispatch action to store registered user data
      router.push('/auth/register/success'); // Redirect to success page
    } catch (error: any) {
        const errorMessage = error.message || "Registration failed. Please try again.";
        dispatch(setRegistrationError(errorMessage)); // Dispatch action to store error
        form.setError("root", { message: errorMessage });
    } finally {
        setIsLoading(false);
    }
  }

  return (
    // Apply background image styles to the outermost div
    <div
      className="flex items-center justify-center h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('https://nolatech.ai/assets/img/bg-header.jpg')" }}
    >
      <Card className="w-full max-w-md bg-card/90 backdrop-blur-sm"> {/* Add slight transparency and blur */}
        <CardHeader className="space-y-1 text-center">
           {/* Nolatech Logo */}
           <div className="flex justify-center mb-4">
            <Image
                src="https://nolatech.ai/assets/img/Nolatech_Blue.png"
                alt="Nolatech360 Logo"
                width={60} // Adjust size as needed
                height={60}
                className="h-auto w-auto"
            />
           </div>
          <CardTitle className="text-2xl">Register for Nolatech360</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
               {/* First Name and Last Name on the same line */}
              <div className="grid grid-cols-2 gap-4">
                 <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="mail@example.com" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          className="pr-10" // Add padding for the icon
                          disabled={isLoading}
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Confirm Password */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                     <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          className="pr-10" // Add padding for the icon
                          disabled={isLoading}
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground"
                           aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                        >
                          {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               {form.formState.errors.root && (
                <p className="text-sm font-medium text-destructive">{form.formState.errors.root.message}</p>
              )}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Registering..." : "Register"}
                 {!isLoading && <Send className="ml-2 h-4 w-4" />}
              </Button>
            </form>
          </Form>
          <p className="text-sm text-muted-foreground text-center">
            Already have an account? <Link href="/auth/login" className="text-primary hover:underline">Login</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
