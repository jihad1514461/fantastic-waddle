import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { ADMIN_CONFIG } from '../config/admin.config';

interface AdminSidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ currentPage, onPageChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const LogoIcon = Icons[ADMIN_CONFIG.branding.logo as keyof typeof Icons] as React.ComponentType<{ size?: number; className?: string }>;

  const getPageFromPath = (path: string): string => {
    const pathMap: Record<string, string> = {
      '/admin/dashboard': 'dashboard',
      '/admin/users': 'users',
      '/admin/settings': 'settings',
      '/admin/analytics': 'analytics',
      '/admin/security': 'security',
      '/admin/showcase': 'showcase',
    };
    return pathMap[path] || 'dashboard';
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 64 : 240 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={`${ADMIN_CONFIG.theme.sidebarBg} border-r border-red-800 flex flex-col`}
    >
      <div className="p-4">
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
      </div>

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
                  ? 'bg-red-800 text-red-100' 
                  : `${ADMIN_CONFIG.theme.sidebarText} ${ADMIN_CONFIG.theme.sidebarHover}`
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