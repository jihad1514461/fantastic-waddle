import { DivideIcon as LucideIcon } from 'lucide-react';

export interface ModuleConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  path: string;
  category: 'core' | 'business' | 'utility' | 'admin';
  enabled: boolean;
  permissions?: string[];
  gradient?: string;
  features?: string[];
  version?: string;
}

export interface LandingFeature {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  icon: string;
  gradient: string;
  category: string;
  moduleId?: string;
  enabled: boolean;
  order: number;
}

// Core modules configuration
export const MODULES_CONFIG: ModuleConfig[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'Comprehensive analytics and insights',
    icon: 'LayoutDashboard',
    path: '/dashboard',
    category: 'core',
    enabled: true,
    gradient: 'from-blue-500 to-cyan-500',
    features: ['analytics', 'widgets', 'real-time-data'],
    version: '1.0.0',
  },
  {
    id: 'flow-editor',
    name: 'Flow Editor',
    description: 'Visual workflow builder',
    icon: 'GitBranch',
    path: '/flow',
    category: 'core',
    enabled: true,
    gradient: 'from-purple-500 to-pink-500',
    features: ['drag-drop', 'automation', 'templates'],
    version: '1.0.0',
  },
  {
    id: 'data-management',
    name: 'Data Management',
    description: 'Organize and manage your data',
    icon: 'Database',
    path: '/data',
    category: 'business',
    enabled: true,
    gradient: 'from-emerald-500 to-teal-500',
    features: ['crud-operations', 'filtering', 'export'],
    version: '1.0.0',
  },
  {
    id: 'team-collaboration',
    name: 'Team Collaboration',
    description: 'Work together seamlessly',
    icon: 'Users',
    path: '/team',
    category: 'business',
    enabled: false, // Not implemented yet
    gradient: 'from-orange-500 to-red-500',
    features: ['real-time-collaboration', 'user-management', 'permissions'],
    version: '0.1.0',
  },
  {
    id: 'ui-components',
    name: 'UI Components',
    description: 'Component library showcase',
    icon: 'Palette',
    path: '/showcase',
    category: 'utility',
    enabled: true,
    gradient: 'from-indigo-500 to-purple-500',
    features: ['component-library', 'documentation', 'examples'],
    version: '1.0.0',
  },
  {
    id: 'settings',
    name: 'Settings',
    description: 'Configure your experience',
    icon: 'Settings',
    path: '/settings',
    category: 'admin',
    enabled: true,
    gradient: 'from-gray-600 to-gray-800',
    features: ['preferences', 'themes', 'notifications'],
    version: '1.0.0',
  },
];

// Landing page features configuration
export const LANDING_FEATURES: LandingFeature[] = [
  {
    id: 'admin-portal',
    title: 'Admin Portal',
    description: 'Comprehensive administrative dashboard with user management, system monitoring, and security controls.',
    buttonText: 'Access Admin Portal',
    icon: 'Shield',
    gradient: 'from-red-600 to-orange-600',
    category: 'administration',
    moduleId: 'admin',
    enabled: true,
    order: 1,
  },
  {
    id: 'game-hub',
    title: 'Game Hub',
    description: 'Ultimate gaming platform with leaderboards, achievements, tournaments, and social features for competitive gaming.',
    buttonText: 'Enter Game Hub',
    icon: 'Gamepad2',
    gradient: 'from-purple-600 to-blue-600',
    category: 'gaming',
    moduleId: 'game',
    enabled: true,
    order: 2,
  },
  {
    id: 'coming-soon',
    title: 'More Modules Coming',
    description: 'We are constantly adding new modules and features. Stay tuned for exciting updates and new capabilities.',
    buttonText: 'Coming Soon',
    icon: 'Sparkles',
    gradient: 'from-gray-500 to-gray-700',
    category: 'future',
    moduleId: null,
    enabled: false,
    order: 3,
  },
];

// Helper functions
export const getEnabledModules = (): ModuleConfig[] => {
  return MODULES_CONFIG.filter(module => module.enabled);
};

export const getEnabledLandingFeatures = (): LandingFeature[] => {
  return LANDING_FEATURES
    .filter(feature => feature.enabled)
    .sort((a, b) => a.order - b.order);
};

export const getModuleById = (id: string): ModuleConfig | undefined => {
  return MODULES_CONFIG.find(module => module.id === id);
};

export const getModulesByCategory = (category: ModuleConfig['category']): ModuleConfig[] => {
  return MODULES_CONFIG.filter(module => module.category === category && module.enabled);
};