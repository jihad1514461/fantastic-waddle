import React from 'react';
import { create } from 'zustand';

interface RouterState {
  currentRoute: string;
  navigate: (route: string) => void;
}

export const useRouter = create<RouterState>((set) => ({
  currentRoute: '/dashboard',
  navigate: (route: string) => {
    set({ currentRoute: route });
    window.history.pushState({}, '', route);
  },
}));

export const useRouterEffect = () => {
  const { navigate } = useRouter();

  React.useEffect(() => {
    const handlePopState = () => {
      navigate(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [navigate]);
};