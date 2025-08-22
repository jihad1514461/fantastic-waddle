import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { ADMIN_CONFIG } from '../config/adminMain.config';

interface AdminSidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

/**
 * AdminSidebar component.
 *
 * @param {string} currentPage - The current page route.
 * @param {(page: string) => void} onPageChange - Function to change the current page route.
 *
 * @example
 * <AdminSidebar currentPage="/admin/dashboard" onPageChange={(page) => console.log(page)} />
 */
export const AdminSidebar: React.FC<AdminSidebarProps> = ({ currentPage, onPageChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const LogoIcon = Icons[ADMIN_CONFIG.branding.logo as keyof typeof Icons] as React.ComponentType<{ size?: number; className?: string }>;
  const CollapseIcon = isCollapsed ? Icons.ArrowRightToLine : Icons.ArrowLeftToLine;

  /**
   * Get the page key from the given path.
   *
   * @param {string} path - The path to get the page key from.
   * @returns {string} The page key.
   *
   * @example
   * getPageFromPath('/admin/dashboard') // 'dashboard'
   * getPageFromPath('/admin/unknown') // 'dashboard'
   */
  const getPageFromPath = (path: string): string => {
    const pathMap: Record<string, string> = {
      '/admin/dashboard': 'dashboard',
      '/admin/showcase': 'showcase',
      '/admin/flows': 'flows',
      '/adminMain/storyManager': 'storyManager',
    };
    return pathMap[path] || 'dashboard';
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 64 : 240 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={`${ADMIN_CONFIG.theme.sidebarBg} border-r border-blue-800 flex flex-col`}
    >
      {/* Header with logo + collapse button */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 bg-gradient-to-r ${ADMIN_CONFIG.module.gradient} rounded-lg flex items-center justify-center`}>
            <LogoIcon className="text-white" size={20} />
          </div>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className={`font-bold ${ADMIN_CONFIG.theme.sidebarText} text-lg`}
            >
              {ADMIN_CONFIG.branding.title}
            </motion.span>
          )}
        </div>

        {/* Collapse toggle button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded hover:bg-blue-800 text-blue-200 transition-colors"
        >
          <CollapseIcon size={18} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        {ADMIN_CONFIG.navigation.map((item) => {
          const IconComponent = Icons[item.icon as keyof typeof Icons] as React.ComponentType<{ size?: number; className?: string }>;
          const pageKey = getPageFromPath(item.path);
          const isActive = currentPage === pageKey;

          return (
            <motion.button
              key={item.id}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onPageChange(pageKey)}
              className={`
                w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200
                ${isActive 
                  ? 'bg-blue-700 text-blue-100' 
                  : `${ADMIN_CONFIG.theme.sidebarText} ${ADMIN_CONFIG.theme.sidebarHover}`}
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
