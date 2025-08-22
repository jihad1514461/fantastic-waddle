import React, { useState, lazy, Suspense } from 'react';
import { AdminLayout, AdminDashboard, UserManagement, AdminUIShowcase, StoryManagement } from './modules/adminMain';

type AdminPage = 'dashboard' | 'users' | 'settings' | 'analytics' | 'security' | 'showcase' | 'flows' | 'storyManager';

const LazyAdminFlowManager = lazy(() =>
  import('./modules/adminMain/pages/AdminMainFlowManager').then(module => ({ default: module.AdminFlowManager }))
);

export const AdminApp: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<AdminPage>('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <AdminDashboard />;
      case 'users': return <UserManagement />;
      case 'settings': return <Placeholder title="System Settings" />;
      case 'analytics': return <Placeholder title="Analytics" />;
      case 'security': return <Placeholder title="Security" />;
      case 'showcase': return <AdminUIShowcase />;
      case 'flows':
        return (
          <Suspense fallback={<Loading />}>
            <LazyAdminFlowManager />
          </Suspense>
        );
      case 'storyManager': return <StoryManagement />;
      default: return <AdminDashboard />;
    }
  };

  return (
    <AdminLayout currentPage={currentPage} onPageChange={(p) => setCurrentPage(p as AdminPage)}>
      {renderPage()}
    </AdminLayout>
  );
};

const Placeholder = ({ title }: { title: string }) => (
  <div className="text-center py-8">
    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
    <p className="text-gray-600 dark:text-gray-400">{title} page coming soon</p>
  </div>
);

const Loading = () => (
  <div className="flex items-center justify-center py-8">
    <div className="text-gray-600 dark:text-gray-400">Loading...</div>
  </div>
);
