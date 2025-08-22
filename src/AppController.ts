import { useState, useEffect } from 'react';
import { useThemeController } from './controllers/themeController';
import { useAdminAuthController } from './modules/admin';
import { useGameAuthController } from './modules/game';
import { useAdminAuthController as useAdminMainAuthController } from './modules/adminMain';

export type AppState =
  | 'landing'
  | 'admin-login'
  | 'admin-app'
  | 'admin-main-login'
  | 'admin-main-app'
  | 'game-login'
  | 'game-app';

export const useAppController = () => {
  const [appState, setAppState] = useState<AppState>('landing');
  const { theme } = useThemeController();
  
  // Auth controllers
  const { isAuthenticated: isAdminAuthenticated, checkAuthStatus: checkAdminAuth } = useAdminAuthController();
  const { isAuthenticated: isAdminMainAuthenticated, checkAuthStatus: checkAdminAuthMain } = useAdminMainAuthController();
  const { isAuthenticated: isGameAuthenticated, checkAuthStatus: checkGameAuth } = useGameAuthController();

  // Apply theme + check auth
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme.mode === 'dark');
    checkAdminAuth();
    checkAdminAuthMain();
    checkGameAuth();
  }, [theme.mode, checkAdminAuth, checkAdminAuthMain, checkGameAuth]);

  // Handle auth state changes
  useEffect(() => {
    if (isAdminAuthenticated && appState === 'admin-login') {
      setAppState('admin-app');
    }
    if (isAdminMainAuthenticated && appState === 'admin-main-login') {
      setAppState('admin-main-app');
    }
    if (isGameAuthenticated && appState === 'game-login') {
      setAppState('game-app');
    }
  }, [isAdminAuthenticated, isAdminMainAuthenticated, isGameAuthenticated, appState]);

  // Actions
  const handleModuleSelect = (moduleId: string) => {
    switch (moduleId) {
      case 'admin':
        setAppState(isAdminAuthenticated ? 'admin-app' : 'admin-login');
        break;
      case 'adminMain':
        setAppState(isAdminMainAuthenticated ? 'admin-main-app' : 'admin-main-login');
        break;
      case 'game':
        setAppState(isGameAuthenticated ? 'game-app' : 'game-login');
        break;
      default:
        console.warn(`Unknown module: ${moduleId}`);
    }
  };

  const handleGetStarted = () => {
    setAppState('admin-login'); // default for now
  };

  const handleBackToLanding = () => {
    setAppState('landing');
  };

  return {
    appState,
    handleModuleSelect,
    handleGetStarted,
    handleBackToLanding,
  };
};
