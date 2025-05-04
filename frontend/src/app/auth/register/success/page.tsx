
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function RegisterSuccessPage() {
  return (
    <div className="flex items-center justify-center h-screen bg-secondary">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl">Registration Successful!</CardTitle>
          <CardDescription>Your account has been created.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>You can now log in using your credentials.</p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href="/auth/login">Go to Login</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
