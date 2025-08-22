import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, User } from '../types';
import { apiService } from '../services/apiService';
import { storageService } from '../services/storageService';

interface AuthController extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  checkAuthStatus: () => void;
  clearError: () => void;
}

export const useAuthController = create<AuthController>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string): Promise<boolean> => {
        set({ isLoading: true, error: null });

        try {
          const response = await apiService.post('/auth/login', { email, password });
          
          if (response.data) {
            const user = response.data.user;
            set({ user, isAuthenticated: true, isLoading: false });
            storageService.set('authToken', response.data.token);
            return true;
          } else {
            // Fallback for development
            const mockUser: User = {
              id: '1',
              email,
              name: email.split('@')[0],
              createdAt: new Date().toISOString(),
            };
            set({ user: mockUser, isAuthenticated: true, isLoading: false });
            storageService.set('authToken', 'mock-token');
            return true;
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Login failed',
            isLoading: false,
          });
          return false;
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, error: null });
        storageService.remove('authToken');
      },

      register: async (email: string, password: string, name: string): Promise<boolean> => {
        set({ isLoading: true, error: null });

        try {
          const response = await apiService.post('/auth/register', { email, password, name });
          
          if (response.data) {
            const user = response.data.user;
            set({ user, isAuthenticated: true, isLoading: false });
            storageService.set('authToken', response.data.token);
            return true;
          } else {
            // Fallback for development
            const mockUser: User = {
              id: Date.now().toString(),
              email,
              name,
              createdAt: new Date().toISOString(),
            };
            set({ user: mockUser, isAuthenticated: true, isLoading: false });
            storageService.set('authToken', 'mock-token');
            return true;
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Registration failed',
            isLoading: false,
          });
          return false;
        }
      },

      checkAuthStatus: () => {
        const token = storageService.get<string>('authToken');
        if (token && !get().isAuthenticated) {
          // In a real app, validate token with API
          const mockUser: User = {
            id: '1',
            email: 'user@example.com',
            name: 'Demo User',
            createdAt: new Date().toISOString(),
          };
          set({ user: mockUser, isAuthenticated: true });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);