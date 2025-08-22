import React from 'react';

interface TextareaProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  rows?: number;
  maxLength?: number;
  className?: string;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  rows = 4,
  maxLength,
  className = '',
  resize = 'vertical',
}) => {
  const resizeClasses = {
    none: 'resize-none',
    vertical: 'resize-y',
    horizontal: 'resize-x',
    both: 'resize',
  };

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        required={required}
        rows={rows}
        maxLength={maxLength}
        className={`
          w-full px-3 py-2 border rounded-lg transition-colors duration-200 ${resizeClasses[resize]}
          ${error 
            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
          }
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
          dark:bg-gray-800 dark:border-gray-600 dark:text-white
          focus:outline-none focus:ring-2 focus:ring-offset-2
        `}
      />
      <div className="flex justify-between items-center">
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
        {maxLength && (
          <p className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
            {value.length}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
};