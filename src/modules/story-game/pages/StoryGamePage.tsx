import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Alert } from '../../../components/ui/Alert';
import { StoryNodeDisplay } from '../components/StoryNodeDisplay';
import { ChoiceButton } from '../components/ChoiceButton';
import { useStoryGameController } from '../controllers/storyGameController';
import { useToast } from '../../../hooks/useToast';
import { BookOpen, Play, RotateCcw, Trophy, Clock, Star } from 'lucide-react';

export const StoryGamePage: React.FC = () => {
  const {
    currentStory,
    currentNodeId,
    playerChoices,
    gameStatus,
    isLoading,
    error,
    loadStory,
    makeChoice,
    resetGame,
    setGameStatus,
    getCurrentNode,
    isEnding,
    getAvailableStories,
    clearError,
  } = useStoryGameController();

  const toast = useToast();
  const availableStories = getAvailableStories();
  const currentNode = getCurrentNode();

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, toast, clearError]);

  const handleStorySelect = (storyId: string) => {
    const story = availableStories.find(s => s.id === storyId);
    if (story) {
      loadStory(story);
      toast.success(`Started "${story.name}"`);
    }
  };

  const handleMakeChoice = (connectionId: string, choiceText: string) => {
    makeChoice(connectionId, choiceText);
  };

  const handleRestart = () => {
    resetGame();
    toast.info('Story restarted');
  };

  const handleBackToMenu = () => {
    setGameStatus('menu');
  };

  const getPlayTime = () => {
    if (playerChoices.length === 0) return '0m';
    const startTime = playerChoices[0]?.timestamp || Date.now();
    const endTime = playerChoices[playerChoices.length - 1]?.timestamp || Date.now();
    const minutes = Math.floor((endTime - startTime) / 60000);
    return `${minutes}m`;
  };

  // Story Selection Screen
  if (gameStatus === 'menu') {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
              <BookOpen size={40} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Story Adventures
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Choose your own adventure and shape your destiny
            </p>
          </motion.div>

          {availableStories.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No Stories Available
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  There are no published stories to play yet. Check back later or contact an administrator.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableStories.map((story, index) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-0 shadow-md">
                    <CardHeader>
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                          <BookOpen className="text-white" size={24} />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            {story.name}
                          </h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                            <span>{story.nodes.length} scenes</span>
                            <span>•</span>
                            <span>{story.nodes.filter(n => n.type === 'end').length} endings</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                        {story.description}
                      </p>
                      <Button
                        onClick={() => handleStorySelect(story.id)}
                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                      >
                        <Play size={16} className="mr-2" />
                        Start Adventure
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400">Loading your adventure...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <Alert
            type="error"
            title="Story Error"
            message={error}
            dismissible
            onDismiss={clearError}
          />
          <div className="mt-4 text-center">
            <Button onClick={handleBackToMenu} variant="outline">
              Back to Story Selection
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Game Ending Screen
  if (gameStatus === 'ended' && currentNode) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mb-8"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
              <Trophy size={40} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Adventure Complete!
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              You've reached the end of your journey
            </p>
          </motion.div>

          <StoryNodeDisplay node={currentNode} className="mb-8" />

          {/* Game Statistics */}
          <Card className="mb-8">
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center">
                Your Journey Statistics
              </h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Star className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{playerChoices.length}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Choices Made</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Clock className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{getPlayTime()}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Play Time</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <BookOpen className="w-6 h-6 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{currentStory?.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Story Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleRestart}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
            >
              <RotateCcw size={16} className="mr-2" />
              Play Again
            </Button>
            <Button
              onClick={handleBackToMenu}
              variant="outline"
            >
              <BookOpen size={16} className="mr-2" />
              Choose New Story
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Main Game Screen
  if (gameStatus === 'playing' && currentNode) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Story Content */}
          <StoryNodeDisplay node={currentNode} />

          {/* Player Choices */}
          {currentNode.connections.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white text-center">
                    What do you choose?
                  </h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <AnimatePresence>
                      {currentNode.connections.map((connection, index) => (
                        <ChoiceButton
                          key={connection.id}
                          connection={connection}
                          index={index}
                          onClick={handleMakeChoice}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Progress Indicator */}
          {playerChoices.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Choices made: {playerChoices.length} • Play time: {getPlayTime()}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  return null;
};