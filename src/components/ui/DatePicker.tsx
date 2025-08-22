import React from 'react';
import ReactDatePicker from 'react-datepicker';
import { Calendar } from 'lucide-react';
import 'react-datepicker/dist/react-datepicker.css';

interface DatePickerProps {
  label?: string;
  selected: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  dateFormat?: string;
  showTimeSelect?: boolean;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  selected,
  onChange,
  placeholder = 'Select date',
  error,
  disabled = false,
  required = false,
  dateFormat = 'MM/dd/yyyy',
  showTimeSelect = false,
  className = '',
  minDate,
  maxDate,
}) => {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <ReactDatePicker
          selected={selected}
          onChange={onChange}
          placeholderText={placeholder}
          disabled={disabled}
          dateFormat={dateFormat}
          showTimeSelect={showTimeSelect}
          minDate={minDate}
          maxDate={maxDate}
          className={`
            w-full px-3 py-2 pr-10 border rounded-lg transition-colors duration-200
            ${error 
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            }
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
            dark:bg-gray-800 dark:border-gray-600 dark:text-white
            focus:outline-none focus:ring-2 focus:ring-offset-2
          `}
          wrapperClassName="w-full"
          popperClassName="react-datepicker-popper"
        />
        <Calendar 
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" 
          size={16} 
        />
      </div>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};