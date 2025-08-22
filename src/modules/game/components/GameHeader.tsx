import React from 'react';
import { LogOut, User, Coins, Gem, Sun, Moon } from 'lucide-react';
import { useGameAuthController } from '../controllers/gameAuthController';
import { useThemeController } from '../../../controllers/themeController';
import { Button } from '../../../components/ui/Button';

export const GameHeader: React.FC = () => {
  const { player, logout } = useGameAuthController();
  const { theme, toggleTheme } = useThemeController();

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Game Hub
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

        {player && (
          <>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-3 py-1 bg-amber-100 dark:bg-amber-900 rounded-lg">
                <Coins size={16} className="text-amber-600 dark:text-amber-400" />
                <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
                  {player.coins.toLocaleString()}
                </span>
              </div>
              
              <div className="flex items-center space-x-2 px-3 py-1 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Gem size={16} className="text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  {player.gems}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-purple-100 dark:bg-purple-900">
                <User size={16} className="text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                  {player.username}
                </span>
                <span className="text-xs px-2 py-1 bg-purple-200 dark:bg-purple-800 text-purple-700 dark:text-purple-300 rounded-full">
                  Lv.{player.level}
                </span>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="p-2 text-purple-600 hover:text-purple-700"
              >
                <LogOut size={20} />
              </Button>
            </div>
          </>
        )}
      </div>
    </header>
  );
};