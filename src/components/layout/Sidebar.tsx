import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { useNavigationController } from '../../controllers/navigationController';

export const Sidebar: React.FC = () => {
  const { navigationItems, activeRoute, isCollapsed, setActiveRoute } = useNavigationController();

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 64 : 240 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col"
    >
      <div className="p-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Icons.Zap className="text-white" size={20} />
          </div>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="font-bold text-gray-900 dark:text-white text-lg"
            >
              FlowApp
            </motion.span>
          )}
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navigationItems.map((item) => {
          const IconComponent = Icons[item.icon as keyof typeof Icons] as React.ComponentType<{ size?: number; className?: string }>;
          const isActive = activeRoute === item.path;

          return (
            <motion.button
              key={item.id}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveRoute(item.path)}
              className={`
                w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200
                ${isActive 
                  ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }
              `}
            >
              <IconComponent size={20} />
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="font-medium"
                >
                  {item.label}
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </nav>
    </motion.aside>
  );
};