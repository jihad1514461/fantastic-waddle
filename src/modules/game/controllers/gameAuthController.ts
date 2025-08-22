import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameAuthState, GamePlayer, Achievement } from '../types/game.types';
import { storageService } from '../../../services/storageService';

interface GameAuthController extends GameAuthState {
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuthStatus: () => void;
  clearError: () => void;
  updatePlayerStats: (stats: Partial<GamePlayer>) => void;
}

export const useGameAuthController = create<GameAuthController>()(
  persist(
    (set, get) => ({
      player: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      achievements: [],

      login: async (username: string, password: string): Promise<boolean> => {
        set({ isLoading: true, error: null });

        try {
          // Simulate API call - replace with actual game authentication
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Mock game player - replace with actual API response
          const mockPlayer: GamePlayer = {
            id: 'player-1',
            username,
            email: `${username}@game.com`,
            level: 15,
            experience: 2450,
            coins: 1250,
            gems: 45,
            avatar: 'default-avatar.png',
            status: 'online',
            joinedAt: new Date().toISOString(),
            lastPlayed: new Date().toISOString(),
          };

          const mockAchievements: Achievement[] = [
            {
              id: 'first-win',
              name: 'First Victory',
              description: 'Win your first game',
              icon: 'Trophy',
              rarity: 'common',
              points: 100,
              unlockedAt: new Date().toISOString(),
            },
            {
              id: 'level-10',
              name: 'Rising Star',
              description: 'Reach level 10',
              icon: 'Star',
              rarity: 'rare',
              points: 250,
              unlockedAt: new Date().toISOString(),
            },
          ];

          set({ 
            player: mockPlayer, 
            isAuthenticated: true, 
            isLoading: false,
            achievements: mockAchievements
          });
          
          storageService.set('gameAuthToken', 'game-mock-token');
          return true;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Game login failed',
            isLoading: false,
          });
          return false;
        }
      },

      logout: () => {
        set({ player: null, isAuthenticated: false, error: null, achievements: [] });
        storageService.remove('gameAuthToken');
      },

      checkAuthStatus: () => {
        const token = storageService.get<string>('gameAuthToken');
        if (token && !get().isAuthenticated) {
          // Mock validation - replace with actual token validation
          const mockPlayer: GamePlayer = {
            id: 'player-1',
            username: 'GamePlayer',
            email: 'player@game.com',
            level: 15,
            experience: 2450,
            coins: 1250,
            gems: 45,
            avatar: 'default-avatar.png',
            status: 'online',
            joinedAt: new Date().toISOString(),
            lastPlayed: new Date().toISOString(),
          };
          set({ player: mockPlayer, isAuthenticated: true });
        }
      },

      updatePlayerStats: (stats: Partial<GamePlayer>) => {
        const currentPlayer = get().player;
        if (currentPlayer) {
          set({ player: { ...currentPlayer, ...stats } });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'game-auth-storage',
      partialize: (state) => ({ 
        player: state.player, 
        isAuthenticated: state.isAuthenticated,
        achievements: state.achievements
      }),
    }
  )
);