import React from 'react';
import { useState, useEffect, lazy, Suspense } from 'react';
import { LandingPage } from './pages/LandingPage';
import { useThemeController } from './controllers/themeController';
import { ToastContainer } from './components/ui/ToastContainer';

// Module imports
import { 
  AdminLoginForm, 
  AdminLayout, 
  AdminDashboard, 
  UserManagement,
  AdminUIShowcase,
  useAdminAuthController 
} from './modules/admin';
import { 
  GameLoginForm, 
  GameLayout, 
  GameDashboard, 
  Leaderboard,
  useGameAuthController 
} from './modules/game';

type AppState = 'landing' | 'admin-login' | 'admin-app' | 'game-login' | 'game-app';
type AdminPage = 'dashboard' | 'users' | 'settings' | 'analytics' | 'security' | 'showcase' | 'flows';
type GamePage = 'dashboard' | 'leaderboard' | 'achievements' | 'tournaments' | 'profile' | 'store';

// Lazy load AdminFlowManager
const LazyAdminFlowManager = lazy(() =>
  import('./modules/admin/pages/AdminFlowManager').then(module => ({ default: module.AdminFlowManager }))
);

const AdminApp: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<AdminPage>('dashboard');
  
  const renderAdminPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'users':
        return <UserManagement />;
      case 'settings':
        return <div className="text-center py-8"><h2 className="text-2xl font-bold text-gray-900 dark:text-white">System Settings</h2><p className="text-gray-600 dark:text-gray-400">Settings page coming soon</p></div>;
      case 'analytics':
        return <div className="text-center py-8"><h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h2><p className="text-gray-600 dark:text-gray-400">Analytics page coming soon</p></div>;
      case 'security':
        return <div className="text-center py-8"><h2 className="text-2xl font-bold text-gray-900 dark:text-white">Security</h2><p className="text-gray-600 dark:text-gray-400">Security page coming soon</p></div>;
      case 'showcase':
        return <AdminUIShowcase />;
      case 'flows':
        return (
          <Suspense fallback={<div className="flex items-center justify-center py-8"><div className="text-gray-600 dark:text-gray-400">Loading...</div></div>}>
            <LazyAdminFlowManager />
          </Suspense>
        );
      default:
        return <AdminDashboard />;
    }
  };

  const handlePageChange = (page: string) => {
    setCurrentPage(page as AdminPage);
  };

  return (
    <AdminLayout currentPage={currentPage} onPageChange={handlePageChange}>
      {renderAdminPage()}
    </AdminLayout>
  );
};

const GameApp: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<GamePage>('dashboard');
  
  const renderGamePage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <GameDashboard />;
      case 'leaderboard':
        return <Leaderboard />;
      case 'achievements':
        return <div className="text-center py-8"><h2 className="text-2xl font-bold text-gray-900 dark:text-white">Achievements</h2><p className="text-gray-600 dark:text-gray-400">Achievements page coming soon</p></div>;
      case 'tournaments':
        return <div className="text-center py-8"><h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tournaments</h2><p className="text-gray-600 dark:text-gray-400">Tournaments page coming soon</p></div>;
      case 'profile':
        return <div className="text-center py-8"><h2 className="text-2xl font-bold text-gray-900 dark:text-white">Player Profile</h2><p className="text-gray-600 dark:text-gray-400">Profile page coming soon</p></div>;
      case 'store':
        return <div className="text-center py-8"><h2 className="text-2xl font-bold text-gray-900 dark:text-white">Game Store</h2><p className="text-gray-600 dark:text-gray-400">Store page coming soon</p></div>;
      default:
        return <GameDashboard />;
    }
  };

  const handleGamePageChange = (page: string) => {
    setCurrentPage(page as GamePage);
  };

  return (
    <GameLayout currentPage={currentPage} onPageChange={handleGamePageChange}>
      {renderGamePage()}
    </GameLayout>
  );
};

function App() {
  const [appState, setAppState] = useState<AppState>('landing');
  const { theme } = useThemeController();
  
  // Module auth controllers
  const { isAuthenticated: isAdminAuthenticated, checkAuthStatus: checkAdminAuth } = useAdminAuthController();
  const { isAuthenticated: isGameAuthenticated, checkAuthStatus: checkGameAuth } = useGameAuthController();

  useEffect(() => {
    // Apply theme
    if (theme.mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Check auth status for both modules
    checkAdminAuth();
    checkGameAuth();
  }, [theme.mode, checkAdminAuth, checkGameAuth]);

  // Handle authentication state changes
  useEffect(() => {
    if (isAdminAuthenticated && appState === 'admin-login') {
      setAppState('admin-app');
    }
    if (isGameAuthenticated && appState === 'game-login') {
      setAppState('game-app');
    }
  }, [isAdminAuthenticated, isGameAuthenticated, appState]);

  const handleModuleSelect = (moduleId: string) => {
    switch (moduleId) {
      case 'admin':
        setAppState(isAdminAuthenticated ? 'admin-app' : 'admin-login');
        break;
      case 'game':
        setAppState(isGameAuthenticated ? 'game-app' : 'game-login');
        break;
      default:
        console.warn(`Unknown module: ${moduleId}`);
    }
  };

  const handleGetStarted = () => {
    // For now, just show a message or redirect to a specific module
    setAppState('admin-login'); // Default to admin for "Get Started"
  };

  const handleBackToLanding = () => {
    setAppState('landing');
  };

  // Render based on app state
  switch (appState) {
    case 'landing':
      return (
        <LandingPage 
          onModuleSelect={handleModuleSelect}
          onGetStarted={handleGetStarted}
        />
      );
    
    case 'admin-login':
      return (
        <>
          <AdminLoginForm onBack={handleBackToLanding} />
          <ToastContainer />
        </>
      );
    
    case 'admin-app':
      return (
        <>
          <AdminApp />
          <ToastContainer />
        </>
      );
    
    case 'game-login':
      return (
        <>
          <GameLoginForm onBack={handleBackToLanding} />
          <ToastContainer />
        </>
      );
    
    case 'game-app':
      return (
        <>
          <GameApp />
          <ToastContainer />
        </>
      );
    
    default:
      return (
        <LandingPage 
          onModuleSelect={handleModuleSelect}
          onGetStarted={handleGetStarted}
        />
      );
  }
}

export default App;