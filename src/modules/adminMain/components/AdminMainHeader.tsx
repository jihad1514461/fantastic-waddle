import React from 'react';
import { LogOut, User, Sun, Moon } from 'lucide-react';
import { useAdminAuthController } from '../controllers/adminMainAuthController';
import { useThemeController } from '../../../controllers/themeController';
import { Button } from '../../../components/ui/Button';

export const AdminHeader: React.FC = () => {
  const { user, logout } = useAdminAuthController();
  const { theme, toggleTheme } = useThemeController();

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Admin Portal
        </h2>
      </div>

      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="p-2"
        >
          {theme.mode === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </Button>

        {user && (
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-red-100 dark:bg-red-900">
              <User size={16} className="text-red-600 dark:text-red-400" />
              <span className="text-sm font-medium text-red-700 dark:text-red-300">
                {user.name}
              </span>
              <span className="text-xs px-2 py-1 bg-red-200 dark:bg-red-800 text-red-700 dark:text-red-300 rounded-full">
                {user.role}
              </span>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="p-2 text-red-600 hover:text-red-700"
            >
              <LogOut size={20} />
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};