import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { Alert } from './Alert';
import { useToastStore } from '../../hooks/useToast';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Alert
            key={toast.id}
            type={toast.type}
            title={toast.title}
            message={toast.message}
            dismissible
            onDismiss={() => removeToast(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};