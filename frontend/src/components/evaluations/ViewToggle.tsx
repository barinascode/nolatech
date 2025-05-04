
"use client";

import { List, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ViewMode = 'list' | 'card';

interface ViewToggleProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ currentView, onViewChange }) => {
  return (
    <div className="flex items-center gap-1 bg-muted p-0.5 rounded-md"> {/* Group buttons visually */}
      <Button
        variant="ghost" // Use ghost variant for inactive state
        size="icon"
        onClick={() => onViewChange('list')}
        aria-label="Switch to list view"
        aria-pressed={currentView === 'list'} // Indicate current state
        className={cn(
          'h-8 w-8',
           // Apply active styles when currentView is 'list'
          currentView === 'list'
             ? 'bg-background text-foreground shadow-sm' // More prominent active state
             : 'text-muted-foreground hover:text-foreground' // Subtle inactive state
        )}
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
         variant="ghost" // Use ghost variant for inactive state
        size="icon"
        onClick={() => onViewChange('card')}
        aria-label="Switch to card view"
        aria-pressed={currentView === 'card'} // Indicate current state
        className={cn(
          'h-8 w-8',
          // Apply active styles when currentView is 'card'
          currentView === 'card'
            ? 'bg-background text-foreground shadow-sm' // More prominent active state
            : 'text-muted-foreground hover:text-foreground' // Subtle inactive state
        )}
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
    </div>
  );
};
