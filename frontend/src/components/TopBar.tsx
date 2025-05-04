
"use client";

import React, { useState } from 'react'; // Import useState
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/useSession";
import { clearSession } from "@/redux/slices/sessionSlice";
import { clearAuthState } from "@/redux/slices/authSlice"; // Import clearAuthState
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import type { AppDispatch } from "@/redux/store"; // Import AppDispatch type
import { LogOut, UserCircle, Languages } from 'lucide-react'; // Import LogOut icon, UserCircle for Role, and Languages icon
import { LanguageSwitcherModal } from './LanguageSwitcherModal'; // Import the new modal component

export const TopBar = () => {
  const { employee } = useSession();
  const dispatch = useDispatch<AppDispatch>(); // Use AppDispatch type for dispatch
  const router = useRouter();
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false); // State for modal

  const handleLogout = () => {
    dispatch(clearSession());
    dispatch(clearAuthState()); // Clear auth state on logout
    router.push('/auth/login');
  };

  const handleLanguageToggle = () => {
    // Open the language switcher modal
    setIsLanguageModalOpen(true);
  };

  const handleLanguageSelect = (language: string) => {
    // Placeholder for language selection logic
    alert(`Selected language: ${language}`);
    setIsLanguageModalOpen(false); // Close modal after selection
    // In a real app, dispatch an action to change the language state
  };


  // Handle case where employee might be null initially or after logout before redirect
  const fallbackInitial = employee?.first_name ? employee.first_name[0].toUpperCase() : '?';
  const fullName = employee ? `${employee.first_name} ${employee.last_name}` : 'Loading...';
  const role = employee ? employee.role : '';


  return (
    <>
      <div className="flex items-center justify-between h-16 bg-background border-b border-border px-4"> {/* Use theme background */}
        <div className="flex items-center space-x-4">
          <Avatar>
            {/* Use a placeholder image */}
            <AvatarImage src="https://picsum.photos/40/40" alt={`${fullName}'s avatar`} data-ai-hint="avatar user" />
            {/* Use bg-secondary for better contrast */}
            <AvatarFallback className="bg-secondary">{fallbackInitial}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium leading-none">{fullName}</p>
            {/* Display Role instead of Email */}
            {role && (
               <p className="flex items-center text-xs text-muted-foreground"> {/* Smaller text, icon */}
                 <UserCircle className="mr-1 h-3 w-3" /> {/* Role icon */}
                 {role}
               </p>
            )}
          </div>
        </div>
        {/* Group language toggle and logout buttons */}
        <div className="flex items-center space-x-2">
           <Button size="sm" variant="outline" onClick={handleLanguageToggle} aria-label="Toggle language">
              <Languages className="h-4 w-4" />
              {/* Optionally add text like "EN/ES" or remove icon text */}
           </Button>
           <Button size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
           </Button>
        </div>
      </div>

      {/* Render the modal */}
      <LanguageSwitcherModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
        onSelectLanguage={handleLanguageSelect}
      />
    </>
  );
};

