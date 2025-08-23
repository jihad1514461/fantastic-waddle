import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../../components/ui/Button';
import { StoryConnection } from '../../admin/types/flow.types';
import { ChevronRight } from 'lucide-react';

interface ChoiceButtonProps {
  connection: StoryConnection;
  index: number;
  onClick: (connectionId: string, choiceText: string) => void;
  disabled?: boolean;
}

export const ChoiceButton: React.FC<ChoiceButtonProps> = ({ 
  connection, 
  index, 
  onClick, 
  disabled = false 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
    >
      <Button
        onClick={() => onClick(connection.id, connection.label)}
        disabled={disabled}
        className="w-full p-6 text-left bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900 transition-all duration-200 shadow-md hover:shadow-lg"
        variant="outline"
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {index + 1}
              </div>
              <span className="text-lg font-medium text-gray-900 dark:text-white">
                {connection.label}
              </span>
            </div>
            {connection.condition && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 ml-11">
                Condition: {connection.condition}
              </p>
            )}
          </div>
          <ChevronRight 
            size={20} 
            className="text-gray-400 group-hover:text-emerald-500 transition-colors" 
          />
        </div>
      </Button>
    </motion.div>
  );
};