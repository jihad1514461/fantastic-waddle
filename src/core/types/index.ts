// Core application types
export * from '../../types';

// Extended types for the new architecture
export interface AppModule {
  id: string;
  name: string;
  component: React.ComponentType;
  config: import('../config/modules.config').ModuleConfig;
  isLoaded: boolean;
  loadError?: string;
}

export interface AppRoute {
  path: string;
  component: React.ComponentType;
  moduleId: string;
  requiresAuth: boolean;
  permissions?: string[];
}

export interface AppTheme {
  mode: 'light' | 'dark';
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  customColors?: Record<string, string>;
}

export interface AppState {
  isInitialized: boolean;
  currentModule: string | null;
  loadedModules: Set<string>;
  theme: AppTheme;
  user: any | null;
  permissions: string[];
}

// Event system types
export interface AppEvent {
  type: string;
  payload?: any;
  timestamp: number;
  source: string;
}

export type EventHandler = (event: AppEvent) => void;

// Plugin system types
export interface Plugin {
  id: string;
  name: string;
  version: string;
  initialize: (app: any) => Promise<void>;
  destroy?: () => Promise<void>;
}