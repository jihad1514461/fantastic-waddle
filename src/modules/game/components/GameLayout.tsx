import React from 'react';
import { GameSidebar } from './GameSidebar';
import { GameHeader } from './GameHeader';

interface GameLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

export const GameLayout: React.FC<GameLayoutProps> = ({ children, currentPage, onPageChange }) => {
  return (
    <div className="h-screen flex bg-gray-50 dark:bg-gray-900">
      <GameSidebar currentPage={currentPage} onPageChange={onPageChange} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <GameHeader />
        
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};