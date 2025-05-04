
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";
import { Home, User, ClipboardCheck, FileText, Smile } from 'lucide-react'; // Added FileText and Smile
import { useEffect, useState } from 'react';
import Image from 'next/image'; // Import next/image
import { useAppSelector } from '@/hooks/useAppSelector'; // Import useAppSelector
import { Badge } from '@/components/ui/badge'; // Import Badge

const sidebarItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/evaluations', label: 'My Evaluations', icon: User }, // Renamed from Evaluations
  { href: '/evaluations/assigned', label: 'Assigned Evaluations', icon: ClipboardCheck }, // New item
  { href: '/documentation', label: 'Documentation', icon: FileText }, // Added Documentation link
  { href: '/author', label: 'Author', icon: Smile }, // Added Author link
];

export const Sidebar = () => {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
   // Access evaluations state
  const { evaluations, loading } = useAppSelector((state) => state.evaluations);
  // Access assigned evaluations state
  const { assignedEvaluations, loadingAssigned } = useAppSelector((state) => state.evaluations);


  useEffect(() => {
    setIsMounted(true);
  }, []);

   // Calculate pending "My Evaluations" count
   const pendingMyEvaluationsCount = evaluations.filter(
    (evaluation) => evaluation.status === 'pending'
   ).length;

  // Calculate pending "Assigned Evaluations" count
  const pendingAssignedEvaluationsCount = assignedEvaluations.filter(
    (evaluation) => evaluation.status === 'pending'
  ).length;


  if (!isMounted) {
    // Avoid rendering mismatch during hydration
    return <div className="w-64 bg-sidebar border-r border-sidebar-border flex-shrink-0 animate-pulse"></div>; // Or a skeleton loader
  }

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border flex-shrink-0">
      {/* Container for logo and title */}
      <div className="p-4 flex flex-col items-start space-y-2"> {/* Changed items-center to items-start */}
        {/* Logo */}
         <Image
            src="https://nolatech.ai/assets/img/Nolatech_Blue.png"
            alt="Nolatech360 Logo"
            width={50} // Adjust width as needed
            height={50} // Adjust height as needed
            className="h-auto w-auto" // Maintain aspect ratio, adjust size via width/height props
          />
         {/* Title */}
        <h1 className="text-2xl font-bold text-sidebar-primary">Nolatech360</h1>
      </div>
      <nav className="py-6">
        {sidebarItems.map((item) => {
            const isMyEvaluations = item.href === '/evaluations';
            const isAssignedEvaluations = item.href === '/evaluations/assigned';

            // Determine if the link is active
            let isActive = false;
            if (isMyEvaluations) {
                // Active if on /evaluations, /evaluations/create, /evaluations/edit/*, /evaluations/[id]
                // Exclude /evaluations/assigned and /evaluations/assigned/*
                 isActive = pathname === '/evaluations' ||
                           pathname === '/evaluations/create' ||
                           pathname.startsWith('/evaluations/edit/') ||
                           (pathname.startsWith('/evaluations/') && !pathname.startsWith('/evaluations/assigned') && !pathname.startsWith('/evaluations/create') && !pathname.startsWith('/evaluations/edit'));

            } else if (isAssignedEvaluations) {
                 // Active if on /evaluations/assigned or /feedback/start/* (which comes from assigned)
                 isActive = pathname === '/evaluations/assigned' || pathname.startsWith('/feedback/start/');
            } else {
                // Default check for other items (including Documentation and Author)
                isActive = pathname === item.href;
            }

             // Determine count and loading state for the badge
            let count = 0;
            let isLoadingBadge = false;
            if (isMyEvaluations) {
                count = pendingMyEvaluationsCount;
                isLoadingBadge = loading;
            } else if (isAssignedEvaluations) {
                count = pendingAssignedEvaluationsCount;
                isLoadingBadge = loadingAssigned;
            }


             return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between space-x-2 px-4 py-2 mx-2 rounded-md transition-colors duration-200",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground" // Active state using sidebar theme
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" // Inactive and hover states
                )}
                 aria-current={isActive ? 'page' : undefined} // Improve accessibility
              >
                <div className="flex items-center space-x-2"> {/* Group icon and label */}
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </div>
                {/* Conditionally render badge */}
                {(isMyEvaluations || isAssignedEvaluations) && !isLoadingBadge && count > 0 && (
                  <Badge variant="secondary" className="h-5 w-5 p-0 flex items-center justify-center text-xs rounded-full">
                    {count}
                  </Badge>
                )}
                 {/* Skeleton for badge while loading */}
                 {(isMyEvaluations || isAssignedEvaluations) && isLoadingBadge && (
                     <Badge variant="secondary" className="h-5 w-5 p-0 flex items-center justify-center text-xs rounded-full animate-pulse">
                       ...
                    </Badge>
                 )}
              </Link>
             );
        })}
      </nav>
    </div>
  );
};


