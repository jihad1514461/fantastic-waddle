import { Story, StoryNode, StoryConnection } from '../../admin/types/flow.types';

export interface PlayerGameState {
  currentStory: Story | null;
  currentNodeId: string | null;
  playerChoices: PlayerChoice[];
  gameVariables: Record<string, any>;
  isLoading: boolean;
  error: string | null;
  gameStatus: 'menu' | 'playing' | 'ended';
}

export interface PlayerChoice {
  nodeId: string;
  connectionId: string;
  choiceText: string;
  timestamp: number;
}

export interface StoryGameConfig {
  module: {
    id: string;
    name: string;
    description: string;
    icon: string;
    gradient: string;
  };
  branding: {
    title: string;
    subtitle: string;
    logo: string;
  };
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
  };
}