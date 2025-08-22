export const GAME_CONFIG = {
  module: {
    id: 'game',
    name: 'Game Hub',
    description: 'Gaming platform with leaderboards and achievements',
    icon: 'Gamepad2',
    gradient: 'from-purple-600 to-blue-600',
    primaryColor: '#7c3aed',
    secondaryColor: '#2563eb',
  },
  
  branding: {
    title: 'Game Hub',
    subtitle: 'Your ultimate gaming experience',
    logo: 'Gamepad2',
  },

  navigation: [
    {
      id: 'game-dashboard',
      label: 'Game Center',
      icon: 'Home',
      path: '/game/dashboard',
      component: 'GameDashboard',
    },
    {
      id: 'leaderboard',
      label: 'Leaderboard',
      icon: 'Trophy',
      path: '/game/leaderboard',
      component: 'Leaderboard',
    },
    {
      id: 'achievements',
      label: 'Achievements',
      icon: 'Award',
      path: '/game/achievements',
      component: 'Achievements',
    },
    {
      id: 'tournaments',
      label: 'Tournaments',
      icon: 'Zap',
      path: '/game/tournaments',
      component: 'Tournaments',
    },
    {
      id: 'profile',
      label: 'Player Profile',
      icon: 'User',
      path: '/game/profile',
      component: 'PlayerProfile',
    },
    {
      id: 'store',
      label: 'Game Store',
      icon: 'ShoppingBag',
      path: '/game/store',
      component: 'GameStore',
    },
  ],

  permissions: {
    required: ['player'],
    roles: ['player', 'premium_player', 'game_master'],
  },

  theme: {
    primaryColor: '#7c3aed',
    secondaryColor: '#2563eb',
    accentColor: '#8b5cf6',
    sidebarBg: 'bg-purple-900',
    sidebarText: 'text-purple-100',
    sidebarHover: 'hover:bg-purple-800',
  },
} as const;

export type GameConfig = typeof GAME_CONFIG;