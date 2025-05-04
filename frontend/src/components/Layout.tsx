
import React from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { MotivationalSlider } from './MotivationalSlider'; // Import the new component

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen bg-background text-foreground"> {/* Use theme variables */}
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <MotivationalSlider /> {/* Add the slider component here */}
         {/* Ensure main content area uses the standard background */}
         {/* Adjust padding-top to account for TopBar + Slider height if necessary, or let flex handle it */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-4">
          {children}
        </main>
      </div>
    </div>
  );
};
