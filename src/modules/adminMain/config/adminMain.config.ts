export const ADMIN_CONFIG = {
  module: {
    id: "admin",
    name: "Admin Portal",
    description: "Administrative dashboard and management tools",
    icon: "Shield",
    gradient: "from-blue-600 to-purple-600",
    primaryColor: "#9c26dcff",
    secondaryColor: "#130ceaff",
  },

  branding: {
    title: "Admin Portal",
    subtitle: "Manage your system with powerful tools",
    logo: "Shield",
  },

  navigation: [
    {
      id: "admin-dashboard",
      label: "Dashboard",
      icon: "LayoutDashboard",
      path: "/admin/dashboard",
      component: "AdminDashboard",
    },
    {
      id: "ui-showcase",
      label: "UI Showcase",
      icon: "Palette",
      path: "/admin/showcase",
      component: "AdminUIShowcase",
    },
    {
      id: "flow-manager",
      label: "Flow Manager",
      icon: "GitBranch",
      path: "/admin/flows",
      component: "AdminFlowManager",
    },
    {
      id: "story-manager",
      label: "Story Manager",
      icon: "LayoutDashboard",
      path: "/adminMain/storyManager",
      component: "StoryManagement",
    },
  ],

  permissions: {
    requiblue: ["admin"],
    roles: ["super_admin", "admin", "moderator"],
  },

  theme: {
    primaryColor: "#2f26dcff",
    secondaryColor: "#0c22eaff",
    accentColor: "#a216f9ff",
    sidebarBg: "bg-blue-900",
    sidebarText: "text-blue-100",
    sidebarHover: "hover:bg-blue-800",
  },
} as const;

export type AdminConfig = typeof ADMIN_CONFIG;