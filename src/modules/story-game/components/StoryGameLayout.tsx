import React from 'react';
import { StoryGameHeader } from './StoryGameHeader';

interface StoryGameLayoutProps {
  children: React.ReactNode;
  onBackToHome: () => void;
}

export const StoryGameLayout: React.FC<StoryGameLayoutProps> = ({ children, onBackToHome }) => {
  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-900 dark:via-teal-900 dark:to-cyan-900">
      <StoryGameHeader onBackToHome={onBackToHome} />
      
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};