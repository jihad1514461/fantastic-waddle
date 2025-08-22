import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AdminAuthState, AdminUser } from '../types/adminMain.types';
import { storageService } from '../../../services/storageService';
import { apiService } from '../../../services/apiService';

interface AdminAuthController extends AdminAuthState {
  login: (userName: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuthStatus: () => void;
  clearError: () => void;
}

const DEMO_USERNAME = 'admin';
const DEMO_PASSWORD = '123';

export const useAdminAuthController = create<AdminAuthController>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      permissions: [],

      login: async (userName: string, password: string): Promise<boolean> => {
        set({ isLoading: true, error: null });

        try {
          const response = await apiService.post("/get_login_admin", {
            username: userName,
            password,
          });

          // ✅ Case 1: Successful login from backend
          if (response.status === 200 && response.data) {
            const userData = response.data as AdminUser;
            set({
              user: userData,
              isAuthenticated: true,
              isLoading: false,
              permissions: userData.permissions || [],
            });
            storageService.set('adminAuthToken', 'backend-token');
            return true;
          }

          // ✅ Case 2: Backend returned 404 → check demo credentials
          if (response.status === 404) {
            if (userName === DEMO_USERNAME && password === DEMO_PASSWORD) {
              const mockAdminUser: AdminUser = {
                id: 'admin-demo',
                userName,
                name: 'Demo Admin',
                role: 'admin',
                permissions: ['admin', 'user_management', 'system_settings'],
                lastLogin: new Date().toISOString(),
                status: 'active',
                createdAt: new Date().toISOString(),
              };

              set({
                user: mockAdminUser,
                isAuthenticated: true,
                isLoading: false,
                permissions: mockAdminUser.permissions,
              });
              storageService.set('adminAuthToken', 'demo-token');
              return true;
            } else {
              alert('Invalid demo credentials');
              set({ error: 'Invalid demo credentials', isLoading: false });
              return false;
            }
          }

          // ✅ Case 3: Other errors
          set({
            error: response.error || 'Admin login failed',
            isLoading: false,
          });
          alert(response.error || 'Admin login failed');
          return false;
        } catch (error) {
          // ✅ Network/unknown error
          const msg = error instanceof Error ? error.message : 'Network error';
          set({ error: msg, isLoading: false });
          alert(msg);
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
          // Mock restore - replace with real validation if needed
          const mockAdminUser: AdminUser = {
            id: 'admin-restore',
            userName: 'restored@admin.com',
            name: 'Restored Admin',
            role: 'admin',
            permissions: ['admin'],
            lastLogin: new Date().toISOString(),
            status: 'active',
            createdAt: new Date().toISOString(),
          };
          set({
            user: mockAdminUser,
            isAuthenticated: true,
            permissions: mockAdminUser.permissions,
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
        permissions: state.permissions,
      }),
    }
  )
);
