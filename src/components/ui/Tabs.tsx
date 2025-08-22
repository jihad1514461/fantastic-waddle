import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  tabs: TabItem[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  className?: string;
  variant?: 'default' | 'pills' | 'underline';
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab,
  onChange,
  className = '',
  variant = 'default',
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabChange = (tabId: string) => {
    const tab = tabs.find(t => t.id === tabId);
    if (tab && !tab.disabled) {
      setActiveTab(tabId);
      onChange?.(tabId);
    }
  };

  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;

  const getTabClasses = (tab: TabItem) => {
    const baseClasses = 'relative px-4 py-2 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2';
    
    const variantClasses = {
      default: `rounded-lg ${
        activeTab === tab.id
          ? 'bg-blue-600 text-white shadow-sm'
          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
      }`,
      pills: `rounded-full ${
        activeTab === tab.id
          ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
      }`,
      underline: `border-b-2 rounded-none ${
        activeTab === tab.id
          ? 'border-blue-600 text-blue-600 dark:text-blue-400'
          : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300'
      }`,
    };

    const disabledClasses = tab.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

    return `${baseClasses} ${variantClasses[variant]} ${disabledClasses}`;
  };

  return (
    <div className={className}>
      <div className={`flex space-x-1 ${variant === 'underline' ? 'border-b border-gray-200 dark:border-gray-700' : ''}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            disabled={tab.disabled}
            className={getTabClasses(tab)}
          >
            <div className="flex items-center space-x-2">
              {tab.icon && <span>{tab.icon}</span>}
              <span>{tab.label}</span>
            </div>
            
            {activeTab === tab.id && variant !== 'underline' && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-blue-600 rounded-lg -z-10"
                initial={false}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
        ))}
      </div>

      <div className="mt-4">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTabContent}
        </motion.div>
      </div>
    </div>
  );
};