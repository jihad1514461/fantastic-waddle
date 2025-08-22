import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Theme } from '../types';

interface ThemeController {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (mode: 'light' | 'dark') => void;
}

const lightTheme: Theme = {
  mode: 'light',
  colors: {
    primary: '#3B82F6',
    secondary: '#10B981',
    accent: '#8B5CF6',
    background: '#FFFFFF',
    surface: '#F8FAFC',
    text: '#1F2937',
    border: '#E5E7EB',
  },
};

const darkTheme: Theme = {
  mode: 'dark',
  colors: {
    primary: '#60A5FA',
    secondary: '#34D399',
    accent: '#A78BFA',
    background: '#111827',
    surface: '#1F2937',
    text: '#F9FAFB',
    border: '#374151',
  },
};

export const useThemeController = create<ThemeController>()(
  persist(
    (set, get) => ({
      theme: lightTheme,

      toggleTheme: () => {
        const currentMode = get().theme.mode;
        const newTheme = currentMode === 'light' ? darkTheme : lightTheme;
        set({ theme: newTheme });
      },

      setTheme: (mode: 'light' | 'dark') => {
        const newTheme = mode === 'light' ? lightTheme : darkTheme;
        set({ theme: newTheme });
      },
    }),
    {
      name: 'theme-storage',
    }
  )
);