
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useDispatch } from 'react-redux';
import { setSession } from '@/redux/slices/sessionSlice';
import { authRepository } from '@/services/authRepository';
import { Eye, EyeOff, Send } from 'lucide-react'; // Import icons
import Image from 'next/image'; // Import Image component
import { useToast } from "@/hooks/use-toast"; // Import useToast hook

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
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const LOGIN_TITLE = "Login to Nolatech360";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [displayTitle, setDisplayTitle] = useState(""); // State for typewriter effect
  const router = useRouter();
  const dispatch = useDispatch();
  const { toast } = useToast(); // Initialize useToast

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

    // Typewriter effect for title
  useEffect(() => {
    let i = 0;
    setDisplayTitle(""); // Reset title on mount/re-render before effect
    const timer = setInterval(() => {
      if (i < LOGIN_TITLE.length) {
        setDisplayTitle((prev) => prev + LOGIN_TITLE.charAt(i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 100); // Adjust speed as needed

    return () => clearInterval(timer); // Cleanup on unmount
  }, []);


  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true);
    try {
      const response = await authRepository.login(values);
      dispatch(setSession({ token: response.token, employee: response.employee }));
      toast({ // Show success toast
        title: "Login Successful",
        description: `Welcome back, ${response.employee.first_name}!`,
      });
      router.push('/dashboard');
    } catch (error: any) {
       toast({ // Show error toast
        variant: "destructive",
        title: "Login Failed",
        description: error.message || "An unexpected error occurred.",
      });
      form.setError("root", { message: error.message });
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
           {/* Apply min-height to prevent layout shift during typing */}
          <CardTitle className="text-2xl min-h-[32px]">
            {displayTitle}
            <span className="animate-pulse">|</span> {/* Blinking cursor */}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              {form.formState.errors.root && (
                <p className="text-sm font-medium text-destructive">{form.formState.errors.root.message}</p>
              )}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Loading..." : "Login"}
                {!isLoading && <Send className="ml-2 h-4 w-4" />}
              </Button>
            </form>
          </Form>
          <p className="text-sm text-muted-foreground text-center">
            Don't have an account? <Link href="/auth/register" className="text-primary hover:underline">Register</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
