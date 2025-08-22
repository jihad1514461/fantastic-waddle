// Application Configuration
export const APP_CONFIG = {
  app: {
    name: 'FlowApp',
    version: '1.0.0',
    description: 'The ultimate platform for managing your workflows, data, and team collaboration',
    tagline: 'Built with modern technologies and designed for scalability',
  },
  
  branding: {
    logo: {
      icon: 'Sparkles',
      gradient: 'from-blue-600 to-purple-600',
    },
    colors: {
      primary: 'blue',
      secondary: 'purple',
      accent: 'emerald',
    },
  },

  features: {
    authentication: true,
    darkMode: true,
    animations: true,
    responsiveDesign: true,
  },

  ui: {
    animations: {
      duration: 0.3,
      easing: 'easeInOut',
    },
    layout: {
      sidebarWidth: {
        expanded: 240,
        collapsed: 64,
      },
      headerHeight: 64,
    },
  },

  api: {
    baseUrl: '/api',
    timeout: 10000,
    retries: 3,
  },
} as const;

export type AppConfig = typeof APP_CONFIG;