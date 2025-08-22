import React from 'react';
import { motion } from 'framer-motion';

export interface RadioOption {
  label: string;
  value: string;
  description?: string;
  disabled?: boolean;
}

interface RadioGroupProps {
  label?: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  className?: string;
  orientation?: 'vertical' | 'horizontal';
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  label,
  options,
  value,
  onChange,
  error,
  disabled = false,
  className = '',
  orientation = 'vertical',
}) => {
  const handleChange = (optionValue: string) => {
    const option = options.find(opt => opt.value === optionValue);
    if (!option?.disabled && !disabled) {
      onChange(optionValue);
    }
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          {label}
        </label>
      )}
      
      <div className={`space-${orientation === 'vertical' ? 'y' : 'x'}-3 ${orientation === 'horizontal' ? 'flex flex-wrap' : ''}`}>
        {options.map((option) => {
          const isSelected = value === option.value;
          const isDisabled = option.disabled || disabled;
          
          return (
            <motion.label
              key={option.value}
              whileHover={!isDisabled ? { scale: 1.02 } : {}}
              whileTap={!isDisabled ? { scale: 0.98 } : {}}
              className={`
                relative flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-all duration-200
                ${isSelected 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 dark:border-blue-400' 
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                }
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <div className="flex items-center h-5">
                <input
                  type="radio"
                  checked={isSelected}
                  onChange={() => handleChange(option.value)}
                  disabled={isDisabled}
                  className="sr-only"
                />
                <div className={`
                  w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-200
                  ${isSelected 
                    ? 'border-blue-600 bg-blue-600' 
                    : 'border-gray-300 dark:border-gray-600'
                  }
                `}>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 rounded-full bg-white"
                    />
                  )}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-medium ${
                  isSelected 
                    ? 'text-blue-900 dark:text-blue-100' 
                    : 'text-gray-900 dark:text-white'
                }`}>
                  {option.label}
                </div>
                {option.description && (
                  <div className={`text-sm ${
                    isSelected 
                      ? 'text-blue-700 dark:text-blue-300' 
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {option.description}
                  </div>
                )}
              </div>
            </motion.label>
          );
        })}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};