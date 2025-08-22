import { create } from 'zustand';
import { DashboardCard } from '../types';

interface DashboardController {
  cards: DashboardCard[];
  selectedCard: DashboardCard | null;
  refreshData: () => Promise<void>;
  updateCard: (cardId: string, updates: Partial<DashboardCard>) => void;
  selectCard: (card: DashboardCard | null) => void;
}

const mockCards: DashboardCard[] = [
  {
    id: '1',
    title: 'Total Users',
    description: 'Active users in the system',
    value: 1248,
    trend: { value: 12, direction: 'up' },
    icon: 'Users',
    color: 'blue',
  },
  {
    id: '2',
    title: 'Revenue',
    description: 'Monthly recurring revenue',
    value: '$24,580',
    trend: { value: 8, direction: 'up' },
    icon: 'DollarSign',
    color: 'emerald',
  },
  {
    id: '3',
    title: 'Projects',
    description: 'Active projects',
    value: 42,
    trend: { value: 3, direction: 'down' },
    icon: 'FolderOpen',
    color: 'purple',
  },
  {
    id: '4',
    title: 'Performance',
    description: 'System uptime',
    value: '99.9%',
    icon: 'TrendingUp',
    color: 'green',
  },
];

export const useDashboardController = create<DashboardController>((set, get) => ({
  cards: mockCards,
  selectedCard: null,

  refreshData: async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const updatedCards = get().cards.map(card => ({
      ...card,
      value: typeof card.value === 'number' 
        ? card.value + Math.floor(Math.random() * 10)
        : card.value,
    }));
    
    set({ cards: updatedCards });
  },

  updateCard: (cardId: string, updates: Partial<DashboardCard>) => {
    const cards = get().cards.map(card =>
      card.id === cardId ? { ...card, ...updates } : card
    );
    set({ cards });
  },

  selectCard: (card: DashboardCard | null) => set({ selectedCard: card }),
}));