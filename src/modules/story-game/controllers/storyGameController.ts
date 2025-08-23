import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PlayerGameState, PlayerChoice } from '../types/story-game.types';
import { Story, StoryNode } from '../../admin/types/flow.types';
import { storageService } from '../../../services/storageService';

interface StoryGameController extends PlayerGameState {
  // Story management
  loadStory: (story: Story) => void;
  resetGame: () => void;
  
  // Game progression
  makeChoice: (connectionId: string, choiceText: string) => void;
  getCurrentNode: () => StoryNode | null;
  isEnding: () => boolean;
  
  // Game state
  setGameStatus: (status: PlayerGameState['gameStatus']) => void;
  setGameVariable: (key: string, value: any) => void;
  getGameVariable: (key: string) => any;
  
  // Utility
  clearError: () => void;
  getAvailableStories: () => Story[];
}

export const useStoryGameController = create<StoryGameController>()(
  persist(
    (set, get) => ({
      currentStory: null,
      currentNodeId: null,
      playerChoices: [],
      gameVariables: {},
      isLoading: false,
      error: null,
      gameStatus: 'menu',

      loadStory: (story: Story) => {
        set({ isLoading: true, error: null });

        try {
          // Find the intro node to start the story
          const introNode = story.nodes.find(node => node.type === 'intro');
          
          if (!introNode) {
            set({ 
              error: 'This story has no starting point. Please contact the story creator.',
              isLoading: false 
            });
            return;
          }

          set({
            currentStory: story,
            currentNodeId: introNode.id,
            playerChoices: [],
            gameVariables: {},
            gameStatus: 'playing',
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to load story',
            isLoading: false,
          });
        }
      },

      resetGame: () => {
        const { currentStory } = get();
        if (currentStory) {
          const introNode = currentStory.nodes.find(node => node.type === 'intro');
          set({
            currentNodeId: introNode?.id || null,
            playerChoices: [],
            gameVariables: {},
            gameStatus: 'playing',
            error: null,
          });
        }
      },

      makeChoice: (connectionId: string, choiceText: string) => {
        const { currentStory, currentNodeId, playerChoices } = get();
        
        if (!currentStory || !currentNodeId) return;

        const currentNode = currentStory.nodes.find(node => node.id === currentNodeId);
        if (!currentNode) return;

        const connection = currentNode.connections.find(conn => conn.id === connectionId);
        if (!connection) return;

        // Record the choice
        const newChoice: PlayerChoice = {
          nodeId: currentNodeId,
          connectionId,
          choiceText,
          timestamp: Date.now(),
        };

        // Move to the target node
        const targetNode = currentStory.nodes.find(node => node.id === connection.targetNodeId);
        if (!targetNode) {
          set({ error: 'Story path is broken. This choice leads nowhere.' });
          return;
        }

        set({
          currentNodeId: connection.targetNodeId,
          playerChoices: [...playerChoices, newChoice],
          gameStatus: targetNode.type === 'end' ? 'ended' : 'playing',
        });
      },

      getCurrentNode: () => {
        const { currentStory, currentNodeId } = get();
        if (!currentStory || !currentNodeId) return null;
        return currentStory.nodes.find(node => node.id === currentNodeId) || null;
      },

      isEnding: () => {
        const currentNode = get().getCurrentNode();
        return currentNode?.type === 'end' || false;
      },

      setGameStatus: (status: PlayerGameState['gameStatus']) => {
        set({ gameStatus: status });
      },

      setGameVariable: (key: string, value: any) => {
        set(state => ({
          gameVariables: { ...state.gameVariables, [key]: value }
        }));
      },

      getGameVariable: (key: string) => {
        return get().gameVariables[key];
      },

      clearError: () => set({ error: null }),

      getAvailableStories: () => {
        // Get stories from admin storage
        const savedStories = storageService.get<Story[]>('admin-stories') || [];
        // Only return active stories that have at least one intro node
        return savedStories.filter(story => 
          story.isActive && story.nodes.some(node => node.type === 'intro')
        );
      },
    }),
    {
      name: 'story-game-storage',
      partialize: (state) => ({
        gameVariables: state.gameVariables,
        playerChoices: state.playerChoices,
      }),
    }
  )
);