import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface MultiSelectOption {
  label: string;
  value: string;
  description?: string;
  disabled?: boolean;
}

interface MultiSelectProps {
  label?: string;
  options: MultiSelectOption[];
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  maxSelections?: number;
  searchable?: boolean;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  options,
  values,
  onChange,
  placeholder = 'Select options',
  error,
  disabled = false,
  className = '',
  maxSelections,
  searchable = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const selectRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  const filteredOptions = searchable
    ? options.filter(option =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        option.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  const selectedOptions = options.filter(option => values.includes(option.value));

  const handleToggleOption = (optionValue: string) => {
    const option = options.find(opt => opt.value === optionValue);
    if (option?.disabled) return;

    if (values.includes(optionValue)) {
      onChange(values.filter(value => value !== optionValue));
    } else {
      if (maxSelections && values.length >= maxSelections) return;
      onChange([...values, optionValue]);
    }
  };

  const handleRemoveOption = (optionValue: string, event: React.MouseEvent) => {
    event.stopPropagation();
    onChange(values.filter(value => value !== optionValue));
  };

  const handleClearAll = (event: React.MouseEvent) => {
    event.stopPropagation();
    onChange([]);
  };

  return (
    <div className={`relative ${className}`} ref={selectRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
          {maxSelections && (
            <span className="text-xs text-gray-500 ml-1">
              ({values.length}/{maxSelections})
            </span>
          )}
        </label>
      )}
      
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full px-3 py-2 text-left bg-white dark:bg-gray-800 border rounded-lg
          transition-colors duration-200 flex items-center justify-between min-h-[42px]
          ${error 
            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
          }
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'}
          dark:border-gray-600 dark:text-white
          focus:outline-none focus:ring-2 focus:ring-offset-2
        `}
      >
        <div className="flex-1 flex flex-wrap gap-1">
          {selectedOptions.length > 0 ? (
            selectedOptions.map((option) => (
              <span
                key={option.value}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
              >
                {option.label}
                <button
                  type="button"
                  onClick={(e) => handleRemoveOption(option.value, e)}
                  className="ml-1 hover:text-blue-600 dark:hover:text-blue-300"
                >
                  <X size={12} />
                </button>
              </span>
            ))
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )}
        </div>
        
        <div className="flex items-center space-x-1">
          {selectedOptions.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="p-1 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X size={14} />
            </button>
          )}
          <ChevronDown 
            size={16} 
            className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-hidden"
          >
            {searchable && (
              <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search options..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            )}
            
            <div className="max-h-48 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => {
                  const isSelected = values.includes(option.value);
                  const isDisabled = option.disabled || (maxSelections && !isSelected && values.length >= maxSelections);
                  
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleToggleOption(option.value)}
                      disabled={isDisabled}
                      className={`
                        w-full px-3 py-2 text-left transition-colors duration-150 flex items-center space-x-2
                        ${isSelected 
                          ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300' 
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white'
                        }
                        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                      `}
                    >
                      <div className={`w-4 h-4 border rounded flex items-center justify-center ${
                        isSelected 
                          ? 'bg-blue-600 border-blue-600' 
                          : 'border-gray-300 dark:border-gray-600'
                      }`}>
                        {isSelected && <Check size={12} className="text-white" />}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{option.label}</div>
                        {option.description && (
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {option.description}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="px-3 py-2 text-gray-500 dark:text-gray-400 text-center">
                  No options found
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};