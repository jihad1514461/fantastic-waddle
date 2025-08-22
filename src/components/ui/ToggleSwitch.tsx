import React from 'react';
import { motion } from 'framer-motion';

interface ToggleSwitchProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  description?: string;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  label,
  checked,
  onChange,
  disabled = false,
  size = 'md',
  className = '',
  description,
}) => {
  const sizes = {
    sm: { switch: 'w-8 h-4', thumb: 'w-3 h-3', translate: 'translate-x-4' },
    md: { switch: 'w-11 h-6', thumb: 'w-5 h-5', translate: 'translate-x-5' },
    lg: { switch: 'w-14 h-7', thumb: 'w-6 h-6', translate: 'translate-x-7' },
  };

  const sizeConfig = sizes[size];

  return (
    <div className={className}>
      <label className={`flex items-center justify-between cursor-pointer ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}>
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
        
        <div className="ml-4">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
            className="sr-only"
          />
          <div
            className={`
              ${sizeConfig.switch} relative rounded-full transition-colors duration-200 ease-in-out
              ${checked 
                ? 'bg-blue-600' 
                : 'bg-gray-200 dark:bg-gray-700'
              }
              ${!disabled && 'hover:bg-opacity-80'}
            `}
          >
            <motion.div
              className={`
                ${sizeConfig.thumb} absolute top-0.5 left-0.5 bg-white rounded-full shadow-md
                transition-transform duration-200 ease-in-out
              `}
              animate={{
                x: checked ? sizeConfig.translate.replace('translate-x-', '').replace('px', '') + 'px' : '0px'
              }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </div>
        </div>
      </label>
    </div>
  );
};