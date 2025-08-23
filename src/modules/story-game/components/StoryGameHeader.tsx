import React from 'react';
import { Button } from '../../../components/ui/Button';
import { useThemeController } from '../../../controllers/themeController';
import { useStoryGameController } from '../controllers/storyGameController';
import { Sun, Moon, Home, RotateCcw, BookOpen } from 'lucide-react';
import { STORY_GAME_CONFIG } from '../config/story-game.config';

interface StoryGameHeaderProps {
  onBackToHome: () => void;
}

export const StoryGameHeader: React.FC<StoryGameHeaderProps> = ({ onBackToHome }) => {
  const { theme, toggleTheme } = useThemeController();
  const { currentStory, resetGame, gameStatus } = useStoryGameController();

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <div className={`w-8 h-8 bg-gradient-to-r ${STORY_GAME_CONFIG.module.gradient} rounded-lg flex items-center justify-center`}>
          <BookOpen className="text-white" size={20} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {STORY_GAME_CONFIG.branding.title}
          </h2>
          {currentStory && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {currentStory.name}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="p-2"
        >
          {theme.mode === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </Button>

        {gameStatus === 'playing' && currentStory && (
          <Button
            variant="outline"
            size="sm"
            onClick={resetGame}
            className="flex items-center space-x-2"
          >
            <RotateCcw size={16} />
            <span>Restart</span>
          </Button>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={onBackToHome}
          className="flex items-center space-x-2"
        >
          <Home size={16} />
          <span>Home</span>
        </Button>
      </div>
    </header>
  );
};