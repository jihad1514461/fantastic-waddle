import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AdminAuthState, AdminUser } from '../types/admin.types';
import { storageService } from '../../../services/storageService';

interface AdminAuthController extends AdminAuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuthStatus: () => void;
  clearError: () => void;
}

export const useAdminAuthController = create<AdminAuthController>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      permissions: [],

      login: async (email: string, password: string): Promise<boolean> => {
        set({ isLoading: true, error: null });

        try {
          // Simulate API call - replace with actual admin authentication
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Mock admin user - replace with actual API response
          const mockAdminUser: AdminUser = {
            id: 'admin-1',
            email,
            name: email.split('@')[0],
            role: 'admin',
            permissions: ['admin', 'user_management', 'system_settings', 'analytics', 'security'],
            lastLogin: new Date().toISOString(),
            status: 'active',
            createdAt: new Date().toISOString(),
          };

          set({ 
            user: mockAdminUser, 
            isAuthenticated: true, 
            isLoading: false,
            permissions: mockAdminUser.permissions
          });
          
          storageService.set('adminAuthToken', 'admin-mock-token');
          return true;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Admin login failed',
            isLoading: false,
          });
          return false;
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, error: null, permissions: [] });
        storageService.remove('adminAuthToken');
      },

      checkAuthStatus: () => {
        const token = storageService.get<string>('adminAuthToken');
        if (token && !get().isAuthenticated) {
          // Mock validation - replace with actual token validation
          const mockAdminUser: AdminUser = {
            id: 'admin-1',
            email: 'admin@example.com',
            name: 'Admin User',
            role: 'admin',
            permissions: ['admin', 'user_management', 'system_settings', 'analytics', 'security'],
            lastLogin: new Date().toISOString(),
            status: 'active',
            createdAt: new Date().toISOString(),
          };
          set({ 
            user: mockAdminUser, 
            isAuthenticated: true,
            permissions: mockAdminUser.permissions
          });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'admin-auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated,
        permissions: state.permissions
      }),
    }
  )
);