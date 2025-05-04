
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from '@/components/ui/separator';
import { Badge } from "@/components/ui/badge";
import { Code, Star, Briefcase } from 'lucide-react';

export default function AuthorPage() {
  const skills = [
    "Next.js (App Router)",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "ShadCN/UI",
    "Redux Toolkit",
    "Redux Persist",
    "React Hook Form",
    "Zod",
    "REST API Integration",
    "Responsive Design",
    "Framer Motion",
    "Recharts",
    "Lucide Icons",
  ];

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-semibold mb-2">About the Author</h1>
        <p className="text-muted-foreground">Information about the developer of this application.</p>
      </div>

      <div className="space-y-8">
        {/* Profile Section */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="https://picsum.photos/100/100" alt="Leonardo Tapia Avatar" data-ai-hint="developer portrait" />
              <AvatarFallback className="text-xl bg-primary text-primary-foreground">LT</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">Leonardo Tapia</CardTitle>
              <CardDescription>Frontend Developer</CardDescription>
            </div>
          </CardHeader>
        </Card>

        <Separator />

        {/* Cover Letter Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Briefcase className="h-5 w-5 text-primary" /> Presentation Letter for NOLATECH</CardTitle>
            <CardDescription>A brief introduction regarding this technical assessment.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-3">
            <p>
              Dear NOLATECH Team,
            </p>
            <p>
              I am pleased to present the Nolatech360 application, developed as part of the technical assessment process. This project demonstrates my ability to build a modern, full-stack web application using the latest technologies and best practices in the JavaScript ecosystem.
            </p>
            <p>
              My focus was on creating a clean, maintainable, and performant application that meets the specified requirements for a 360-degree feedback platform. I leveraged the power of Next.js with its App Router, Server Components, and Server Actions, combined with TypeScript for robust type safety. The UI was built using Tailwind CSS and the excellent ShadCN/UI component library for a consistent and professional look and feel. State management is handled efficiently with Redux Toolkit and Redux Persist.
            </p>
            <p>
              I believe this project effectively showcases my skills in frontend development, UI/UX considerations, state management, and API integration. I am eager to discuss how my abilities can contribute to the success of NOLATECH.
            </p>
            <p>
              Thank you for this opportunity.
            </p>
            <p>
              Sincerely,<br />
              <strong className="text-foreground">Leonardo Tapia</strong>
            </p>
          </CardContent>
        </Card>

        <Separator />

        {/* Skills Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Code className="h-5 w-5 text-primary" /> Key Skills Demonstrated</CardTitle>
            <CardDescription>Technologies and concepts applied in this project.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-yellow-500" />
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
