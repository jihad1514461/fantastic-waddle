import { create } from 'zustand';
import { ToastNotification } from '../types';

interface ToastStore {
  toasts: ToastNotification[];
  addToast: (toast: Omit<ToastNotification, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  
  addToast: (toast) => {
    const id = Date.now().toString();
    const newToast: ToastNotification = {
      ...toast,
      id,
      duration: toast.duration || 5000,
    };
    
    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));
    
    // Auto-remove toast after duration
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, newToast.duration);
  },
  
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },
  
  clearToasts: () => {
    set({ toasts: [] });
  },
}));

export const useToast = () => {
  const { addToast, removeToast, clearToasts } = useToastStore();
  
  return {
    success: (message: string, title?: string) => addToast({ type: 'success', message, title }),
    error: (message: string, title?: string) => addToast({ type: 'error', message, title }),
    warning: (message: string, title?: string) => addToast({ type: 'warning', message, title }),
    info: (message: string, title?: string) => addToast({ type: 'info', message, title }),
    remove: removeToast,
    clear: clearToasts,
  };
};