import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TypeaheadOption {
  label: string;
  value: string;
  description?: string;
  category?: string;
  disabled?: boolean;
}

interface TypeaheadProps {
  label?: string;
  options: TypeaheadOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  onSearch?: (query: string) => void;
  allowClear?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  groupByCategory?: boolean;
  maxResults?: number;
}

export const Typeahead: React.FC<TypeaheadProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = 'Search...',
  error,
  disabled = false,
  className = '',
  onSearch,
  allowClear = true,
  loading = false,
  emptyMessage = 'No results found',
  groupByCategory = false,
  maxResults,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (onSearch) {
      onSearch(searchQuery);
    }
  }, [searchQuery, onSearch]);

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [searchQuery]);

  let filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    option.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (maxResults) {
    filteredOptions = filteredOptions.slice(0, maxResults);
  }

  const groupedOptions = groupByCategory && filteredOptions.some(opt => opt.category)
    ? filteredOptions.reduce((groups, option) => {
        const category = option.category || 'Other';
        if (!groups[category]) groups[category] = [];
        groups[category].push(option);
        return groups;
      }, {} as Record<string, TypeaheadOption[]>)
    : null;

  const selectedOption = options.find(option => option.value === value);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          const option = filteredOptions[highlightedIndex];
          if (!option.disabled) {
            onChange(option.value);
            setIsOpen(false);
            setSearchQuery('');
          }
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchQuery('');
        break;
    }
  };

  const handleOptionClick = (option: TypeaheadOption) => {
    if (!option.disabled) {
      onChange(option.value);
      setIsOpen(false);
      setSearchQuery('');
    }
  };

  const handleClear = () => {
    onChange('');
    setSearchQuery('');
    inputRef.current?.focus();
  };

  const renderOption = (option: TypeaheadOption, index: number) => (
    <button
      key={option.value}
      type="button"
      onClick={() => handleOptionClick(option)}
      onMouseEnter={() => setHighlightedIndex(index)}
      disabled={option.disabled}
      className={`
        w-full px-3 py-2 text-left transition-colors duration-150 flex items-center space-x-2
        ${highlightedIndex === index
          ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
          : value === option.value
          ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
          : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white'
        }
        ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        first:rounded-t-lg last:rounded-b-lg
      `}
    >
      <div className="flex-1">
        <div className="font-medium">{option.label}</div>
        {option.description && (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {option.description}
          </div>
        )}
      </div>
      {value === option.value && (
        <Check size={16} className="text-blue-600 dark:text-blue-300" />
      )}
    </button>
  );

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={isOpen ? searchQuery : selectedOption?.label || ''}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => {
            setIsOpen(true);
            setSearchQuery('');
          }}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className={`
            w-full pl-10 ${allowClear && selectedOption ? 'pr-10' : 'pr-3'} py-2 bg-white dark:bg-gray-800 border rounded-lg
            transition-colors duration-200
            ${error 
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            }
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'cursor-text'}
            dark:border-gray-600 dark:text-white
            focus:outline-none focus:ring-2 focus:ring-offset-2
          `}
        />
        
        {allowClear && selectedOption && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            ref={optionsRef}
            className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto"
          >
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredOptions.length > 0 ? (
              groupedOptions ? (
                Object.entries(groupedOptions).map(([category, categoryOptions]) => (
                  <div key={category}>
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                      {category}
                    </div>
                    {categoryOptions.map((option, index) => {
                      const globalIndex = filteredOptions.findIndex(opt => opt.value === option.value);
                      return renderOption(option, globalIndex);
                    })}
                  </div>
                ))
              ) : (
                filteredOptions.map((option, index) => renderOption(option, index))
              )
            ) : (
              <div className="px-3 py-8 text-center text-gray-500 dark:text-gray-400">
                {emptyMessage}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};