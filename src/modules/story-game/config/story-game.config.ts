import { StoryGameConfig } from '../types/story-game.types';

export const STORY_GAME_CONFIG: StoryGameConfig = {
  module: {
    id: 'story-game',
    name: 'Story Game',
    description: 'Interactive story experience with branching narratives',
    icon: 'BookOpen',
    gradient: 'from-emerald-600 to-teal-600',
  },
  
  branding: {
    title: 'Story Adventure',
    subtitle: 'Choose your own adventure',
    logo: 'BookOpen',
  },

  theme: {
    primaryColor: '#059669',
    secondaryColor: '#0d9488',
    accentColor: '#10b981',
  },
} as const;

export type { StoryGameConfig };