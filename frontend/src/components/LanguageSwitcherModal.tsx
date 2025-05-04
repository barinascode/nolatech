
"use client";

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Globe } from 'lucide-react'; // Icon for languages

interface LanguageSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLanguage: (language: string) => void;
}

export const LanguageSwitcherModal: React.FC<LanguageSwitcherModalProps> = ({
  isOpen,
  onClose,
  onSelectLanguage,
}) => {
  // Add flag emojis to the languages array
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' }, // US flag for English
    { code: 'es', name: 'Español', flag: '🇪🇸' }, // Spain flag for Spanish
    // Add more languages as needed
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" /> Select Language
          </DialogTitle>
          <DialogDescription>
            Choose your preferred language for the application.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {languages.map((lang) => (
            <Button
              key={lang.code}
              variant="outline"
              onClick={() => onSelectLanguage(lang.name)}
              className="justify-start gap-2" // Align text to the left and add gap
            >
              <span role="img" aria-label={`${lang.name} flag`}>{lang.flag}</span> {/* Display flag */}
              {lang.name} {/* Display language name */}
            </Button>
          ))}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
