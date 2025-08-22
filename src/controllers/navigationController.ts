import { create } from 'zustand';
import { NavigationItem } from '../types';
import { getEnabledModules } from '../config/modules.config';

interface NavigationController {
  activeRoute: string;
  isCollapsed: boolean;
  navigationItems: NavigationItem[];
  setActiveRoute: (route: string) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export const useNavigationController = create<NavigationController>((set) => ({
  activeRoute: '/dashboard',
  isCollapsed: false,
  navigationItems: getEnabledModules().map(module => ({
    id: module.id,
    label: module.name,
    icon: module.icon,
    path: module.path,
  })),

  setActiveRoute: (route: string) => set({ activeRoute: route }),
  
  toggleSidebar: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
  
  setSidebarCollapsed: (collapsed: boolean) => set({ isCollapsed: collapsed }),
}));