import React from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, currentPage, onPageChange }) => {
  return (
    <div className="h-screen flex bg-gray-50 dark:bg-gray-900">
      <AdminSidebar currentPage={currentPage} onPageChange={onPageChange} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};