export interface GamePlayer {
  id: string;
  username: string;
  email: string;
  level: number;
  experience: number;
  coins: number;
  gems: number;
  avatar: string;
  status: 'online' | 'offline' | 'in_game';
  joinedAt: string;
  lastPlayed: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
}

export interface LeaderboardEntry {
  rank: number;
  player: GamePlayer;
  score: number;
  gameMode: string;
  achievedAt: string;
}

export interface Tournament {
  id: string;
  name: string;
  description: string;
  gameMode: string;
  startDate: string;
  endDate: string;
  prizePool: number;
  participants: number;
  maxParticipants: number;
  status: 'upcoming' | 'active' | 'completed';
  entryFee: number;
}

export interface GameAuthState {
  player: GamePlayer | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  achievements: Achievement[];
}

export interface GameNavigationItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  component: string;
  badge?: string | number;
}