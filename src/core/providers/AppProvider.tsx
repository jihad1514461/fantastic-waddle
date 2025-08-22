import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppState, AppTheme } from '../types';
import { moduleService } from '../services/ModuleService';
import { eventService, APP_EVENTS } from '../services/EventService';
import { APP_CONFIG } from '../../config/app.config';

interface AppContextValue extends AppState {
  setCurrentModule: (moduleId: string | null) => void;
  setTheme: (theme: Partial<AppTheme>) => void;
  initialize: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    isInitialized: false,
    currentModule: null,
    loadedModules: new Set(),
    theme: {
      mode: 'light',
      primaryColor: APP_CONFIG.branding.colors.primary,
      secondaryColor: APP_CONFIG.branding.colors.secondary,
      accentColor: APP_CONFIG.branding.colors.accent,
    },
    user: null,
    permissions: [],
  });

  const initialize = async () => {
    try {
      // Preload core modules
      await moduleService.preloadModules();
      
      // Load theme from storage
      const savedTheme = localStorage.getItem('app-theme');
      if (savedTheme) {
        const theme = JSON.parse(savedTheme);
        setState(prev => ({ ...prev, theme }));
      }

      setState(prev => ({ 
        ...prev, 
        isInitialized: true,
        loadedModules: new Set(moduleService.getAllLoadedModules().map(m => m.id))
      }));

      eventService.emit('app:initialized', null, 'AppProvider');
    } catch (error) {
      console.error('Failed to initialize app:', error);
      eventService.emit(APP_EVENTS.ERROR_OCCURRED, { error }, 'AppProvider');
    }
  };

  const setCurrentModule = (moduleId: string | null) => {
    setState(prev => ({ ...prev, currentModule: moduleId }));
    eventService.emit(APP_EVENTS.ROUTE_CHANGED, { moduleId }, 'AppProvider');
  };

  const setTheme = (themeUpdate: Partial<AppTheme>) => {
    setState(prev => {
      const newTheme = { ...prev.theme, ...themeUpdate };
      localStorage.setItem('app-theme', JSON.stringify(newTheme));
      eventService.emit(APP_EVENTS.THEME_CHANGED, { theme: newTheme }, 'AppProvider');
      return { ...prev, theme: newTheme };
    });
  };

  useEffect(() => {
    initialize();
  }, []);

  const contextValue: AppContextValue = {
    ...state,
    setCurrentModule,
    setTheme,
    initialize,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextValue => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};