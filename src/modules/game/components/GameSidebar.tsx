import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { GAME_CONFIG } from '../config/game.config';

interface GameSidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export const GameSidebar: React.FC<GameSidebarProps> = ({ currentPage, onPageChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const LogoIcon = Icons[GAME_CONFIG.branding.logo as keyof typeof Icons] as React.ComponentType<{ size?: number; className?: string }>;

  const getPageFromPath = (path: string): string => {
    const pathMap: Record<string, string> = {
      '/game/dashboard': 'dashboard',
      '/game/leaderboard': 'leaderboard',
      '/game/achievements': 'achievements',
      '/game/tournaments': 'tournaments',
      '/game/profile': 'profile',
      '/game/store': 'store',
    };
    return pathMap[path] || 'dashboard';
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 64 : 240 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={`${GAME_CONFIG.theme.sidebarBg} border-r border-purple-800 flex flex-col`}
    >
      <div className="p-4">
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 bg-gradient-to-r ${GAME_CONFIG.module.gradient} rounded-lg flex items-center justify-center`}>
            <LogoIcon className="text-white" size={20} />
          </div>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className={`font-bold ${GAME_CONFIG.theme.sidebarText} text-lg`}
            >
              {GAME_CONFIG.branding.title}
            </motion.span>
          )}
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {GAME_CONFIG.navigation.map((item) => {
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
                  ? 'bg-purple-800 text-purple-100' 
                  : `${GAME_CONFIG.theme.sidebarText} ${GAME_CONFIG.theme.sidebarHover}`
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