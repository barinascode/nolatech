# Nolatech360 Technical Documentation

This document provides an overview of the Nolatech360 project, developed as a technical assessment for NOLATECH by Leonardo Tapia.

## Project Purpose

This application, Nolatech360, has been developed as a technical assessment for **NOLATECH**. The project was undertaken by **Leonardo Tapia** to demonstrate proficiency in modern web development practices and technologies.

The primary goal is to build a functional 360-degree feedback and evaluation platform, showcasing skills in full-stack development, UI/UX design, state management, and API integration.

## Technologies Used

Core technologies and libraries powering the application:

*   **Framework:** Next.js (App Router, Server Components, Server Actions)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS, ShadCN/UI
*   **State Management:** Redux Toolkit, Redux Persist
*   **Form Handling:** React Hook Form, Zod (for validation)
*   **API Communication:** Fetch API
*   **UI Components:** ShadCN/UI, Lucide React (Icons)
*   **Charting:** Recharts (integrated via ShadCN)
*   **Animation:** Framer Motion
*   **Linting/Formatting:** ESLint, Prettier (implicit via Next.js defaults)
*   **Deployment/Hosting:** (Presumed target: Firebase Hosting or similar)

## Architecture

The application follows a standard Next.js App Router structure:

*   **`/app` Directory:** Contains all routes, layouts, and UI components specific to routes.
*   **Server Components:** Used by default for improved performance and reduced client-side JS.
*   **Client Components:** Opted-in using `"use client"` directive for interactivity (e.g., forms, stateful UI).
*   **`/components` Directory:** Reusable UI components (e.g., Layout, Sidebar, ShadCN UI).
*   **`/services` Directory:** Contains API interaction logic (Repositories like `authRepository`, `evaluationsRepository`). Defines interfaces for API requests/responses.
*   **`/redux` Directory:** Manages global application state using Redux Toolkit (slices for session, auth, evaluations). Includes persistence setup.
*   **`/hooks` Directory:** Custom React hooks (e.g., `useSession`, `useAppSelector`, `useToast`).
*   **`/lib` Directory:** Utility functions (e.g., `cn` for class merging).
*   **API Layer (External):** Assumed REST API backend handling data persistence and business logic (endpoints provided in requirements).

## User Experience (UX)

Focus on usability and interaction design:

*   **Intuitive Navigation:** Clear sidebar menu for accessing main sections.
*   **Responsive Design:** Adapts to different screen sizes (though detailed mobile testing might be needed).
*   **Feedback Mechanisms:** Loading states, error messages, and success notifications (toasts) guide the user.
*   **Clear Forms:** Uses standard form elements with validation and clear error indications.
*   **Visual Consistency:** Leverages ShadCN/UI for a cohesive look and feel.
*   **State Persistence:** User session is persisted across browser sessions using Redux Persist.

## UI Design

Visual styling and component choices:

*   **Component Library:** Primarily uses ShadCN/UI components, ensuring accessibility and modern aesthetics.
*   **Styling Engine:** Tailwind CSS for utility-first styling.
*   **Theming:** CSS variables defined in `globals.css` for background, foreground, primary, secondary, accent, etc., allowing for easy theme adjustments (including dark mode support).
*   **Layout:** Consistent layout structure using `Layout.tsx`, `Sidebar.tsx`, and `TopBar.tsx`.
*   **Visual Elements:** Use of icons (Lucide React), badges, charts (Recharts), and subtle animations (Framer Motion) to enhance the UI.
*   **Branding:** Nolatech logo and color hints incorporated into the design.
