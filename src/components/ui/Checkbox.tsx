import React from 'react';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface CheckboxProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  error?: string;
  className?: string;
  description?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  onChange,
  disabled = false,
  error,
  className = '',
  description,
}) => {
  return (
    <div className={className}>
      <label className={`flex items-start space-x-3 cursor-pointer ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}>
        <div className="relative flex items-center">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
            className="sr-only"
          />
          <div
            className={`
              w-5 h-5 border-2 rounded transition-all duration-200 flex items-center justify-center
              ${checked 
                ? 'bg-blue-600 border-blue-600' 
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
              }
              ${!disabled && 'hover:border-blue-500'}
              ${error ? 'border-red-500' : ''}
            `}
          >
            {checked && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Check size={14} className="text-white" />
              </motion.div>
            )}
          </div>
        </div>
        
        {(label || description) && (
          <div className="flex-1">
            {label && (
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {label}
              </div>
            )}
            {description && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {description}
              </div>
            )}
          </div>
        )}
      </label>
      
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};