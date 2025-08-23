export const ADMIN_CONFIG = {
  module: {
    id: 'admin',
    name: 'Admin Portal',
    description: 'Administrative dashboard and management tools',
    icon: 'Shield',
    gradient: 'from-red-600 to-orange-600',
    primaryColor: '#dc2626',
    secondaryColor: '#ea580c',
  },
  
  branding: {
    title: 'Admin Portal',
    subtitle: 'Manage your system with powerful tools',
    logo: 'Shield',
  },

  navigation: [
    {
      id: 'admin-dashboard',
      label: 'Dashboard',
      icon: 'LayoutDashboard',
      path: '/admin/dashboard',
      component: 'AdminDashboard',
    },
    {
      id: 'user-management',
      label: 'User Management',
      icon: 'Users',
      path: '/admin/users',
      component: 'UserManagement',
    },
    {
      id: 'system-settings',
      label: 'System Settings',
      icon: 'Settings',
      path: '/admin/settings',
      component: 'SystemSettings',
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: 'BarChart3',
      path: '/admin/analytics',
      component: 'Analytics',
    },
    {
      id: 'security',
      label: 'Security',
      icon: 'Lock',
      path: '/admin/security',
      component: 'Security',
    },
    {
      id: 'ui-showcase',
      label: 'UI Showcase',
      icon: 'Palette',
      path: '/admin/showcase',
      component: 'AdminUIShowcase',
    },
    {
      id: 'story-manager',
      label: 'Story Manager',
      icon: 'GitBranch',
      path: '/admin/stories',
      component: 'AdminStoryManager',
    },
  ],

  permissions: {
    required: ['admin'],
    roles: ['super_admin', 'admin', 'moderator'],
  },

  theme: {
    primaryColor: '#dc2626',
    secondaryColor: '#ea580c',
    accentColor: '#f97316',
    sidebarBg: 'bg-red-900',
    sidebarText: 'text-red-100',
    sidebarHover: 'hover:bg-red-800',
  },
} as const;

export type AdminConfig = typeof ADMIN_CONFIG;