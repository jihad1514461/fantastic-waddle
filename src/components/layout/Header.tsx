import React from 'react';
import { Menu, Sun, Moon, User, LogOut } from 'lucide-react';
import { useNavigationController } from '../../controllers/navigationController';
import { useThemeController } from '../../controllers/themeController';
import { useAuthController } from '../../controllers/authController';
import { Button } from '../ui/Button';

export const Header: React.FC = () => {
  const { toggleSidebar } = useNavigationController();
  const { theme, toggleTheme } = useThemeController();
  const { user, logout } = useAuthController();

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="p-2"
        >
          <Menu size={20} />
        </Button>
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
            <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800">
              <User size={16} />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {user.name}
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