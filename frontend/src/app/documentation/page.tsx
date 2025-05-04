
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { List, ListItem } from '@/components/ui/list'; // Assuming List/ListItem components exist or using basic ul/li

export default function DocumentationPage() {
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-semibold mb-2">Technical Documentation</h1>
        <p className="text-muted-foreground">Overview of the Nolatech360 Project.</p>
      </div>

      <div className="space-y-8">
        {/* Project Purpose */}
        <Card>
          <CardHeader>
            <CardTitle>Project Purpose</CardTitle>
            <CardDescription>Context and objective of this application.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>
              This application, Nolatech360, has been developed as a technical assessment for{' '}
              <strong className="text-foreground">NOLATECH</strong>. The project was undertaken by{' '}
              <strong className="text-foreground">Leonardo Tapia</strong> to demonstrate proficiency
              in modern web development practices and technologies.
            </p>
            <p className="mt-2">
              The primary goal is to build a functional 360-degree feedback and evaluation platform,
              showcasing skills in full-stack development, UI/UX design, state management, and API integration.
            </p>
          </CardContent>
        </Card>

        <Separator />

        {/* Technologies Used */}
        <Card>
          <CardHeader>
            <CardTitle>Technologies Used</CardTitle>
            <CardDescription>Core technologies and libraries powering the application.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li><strong>Framework:</strong> Next.js (App Router, Server Components, Server Actions)</li>
              <li><strong>Language:</strong> TypeScript</li>
              <li><strong>Styling:</strong> Tailwind CSS, ShadCN/UI</li>
              <li><strong>State Management:</strong> Redux Toolkit, Redux Persist</li>
              <li><strong>Form Handling:</strong> React Hook Form, Zod (for validation)</li>
              <li><strong>API Communication:</strong> Fetch API</li>
              <li><strong>UI Components:</strong> ShadCN/UI, Lucide React (Icons)</li>
              <li><strong>Charting:</strong> Recharts (integrated via ShadCN)</li>
              <li><strong>Animation:</strong> Framer Motion</li>
              <li><strong>Linting/Formatting:</strong> ESLint, Prettier (implicit via Next.js defaults)</li>
              <li><strong>Deployment/Hosting:</strong> (Presumed target: Firebase Hosting or similar)</li>
            </ul>
          </CardContent>
        </Card>

        <Separator />

        {/* Architecture */}
        <Card>
          <CardHeader>
            <CardTitle>Architecture</CardTitle>
            <CardDescription>High-level structure of the application.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>The application follows a standard Next.js App Router structure:</p>
            <ul className="list-disc list-inside space-y-1 pl-4 text-muted-foreground">
              <li><strong>`/app` Directory:</strong> Contains all routes, layouts, and UI components specific to routes.</li>
              <li><strong>Server Components:</strong> Used by default for improved performance and reduced client-side JS.</li>
              <li><strong>Client Components:</strong> Opted-in using `"use client"` directive for interactivity (e.g., forms, stateful UI).</li>
              <li><strong>`/components` Directory:</strong> Reusable UI components (e.g., Layout, Sidebar, ShadCN UI).</li>
              <li><strong>`/services` Directory:</strong> Contains API interaction logic (Repositories like `authRepository`, `evaluationsRepository`). Defines interfaces for API requests/responses.</li>
              <li><strong>`/redux` Directory:</strong> Manages global application state using Redux Toolkit (slices for session, auth, evaluations). Includes persistence setup.</li>
              <li><strong>`/hooks` Directory:</strong> Custom React hooks (e.g., `useSession`, `useAppSelector`, `useToast`).</li>
              <li><strong>`/lib` Directory:</strong> Utility functions (e.g., `cn` for class merging).</li>
              <li><strong>API Layer (External):</strong> Assumed REST API backend handling data persistence and business logic (endpoints provided in requirements).</li>
            </ul>
          </CardContent>
        </Card>

        <Separator />

        {/* User Experience (UX) */}
        <Card>
          <CardHeader>
            <CardTitle>User Experience (UX)</CardTitle>
            <CardDescription>Focus on usability and interaction design.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li><strong>Intuitive Navigation:</strong> Clear sidebar menu for accessing main sections.</li>
              <li><strong>Responsive Design:</strong> Adapts to different screen sizes (though detailed mobile testing might be needed).</li>
              <li><strong>Feedback Mechanisms:</strong> Loading states, error messages, and success notifications (toasts) guide the user.</li>
              <li><strong>Clear Forms:</strong> Uses standard form elements with validation and clear error indications.</li>
              <li><strong>Visual Consistency:</strong> Leverages ShadCN/UI for a cohesive look and feel.</li>
              <li><strong>State Persistence:</strong> User session is persisted across browser sessions using Redux Persist.</li>
            </ul>
          </CardContent>
        </Card>

        <Separator />

        {/* UI Design */}
        <Card>
          <CardHeader>
            <CardTitle>UI Design</CardTitle>
            <CardDescription>Visual styling and component choices.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
             <ul className="list-disc list-inside space-y-1 text-muted-foreground">
               <li><strong>Component Library:</strong> Primarily uses ShadCN/UI components, ensuring accessibility and modern aesthetics.</li>
               <li><strong>Styling Engine:</strong> Tailwind CSS for utility-first styling.</li>
               <li><strong>Theming:</strong> CSS variables defined in `globals.css` for background, foreground, primary, secondary, accent, etc., allowing for easy theme adjustments (including dark mode support).</li>
               <li><strong>Layout:</strong> Consistent layout structure using `Layout.tsx`, `Sidebar.tsx`, and `TopBar.tsx`.</li>
               <li><strong>Visual Elements:</strong> Use of icons (Lucide React), badges, charts (Recharts), and subtle animations (Framer Motion) to enhance the UI.</li>
               <li><strong>Branding:</strong> Nolatech logo and color hints incorporated into the design.</li>
            </ul>
          </CardContent>
        </Card>

      </div>
    </Layout>
  );
}
