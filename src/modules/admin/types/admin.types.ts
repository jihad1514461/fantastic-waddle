export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'moderator';
  permissions: string[];
  lastLogin: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
}

export interface SystemMetrics {
  totalUsers: number;
  activeUsers: number;
  systemUptime: string;
  memoryUsage: number;
  cpuUsage: number;
  diskUsage: number;
}

export interface SecurityLog {
  id: string;
  timestamp: string;
  event: string;
  userId?: string;
  ipAddress: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

export interface AdminAuthState {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  permissions: string[];
}

export interface AdminNavigationItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  component: string;
  permissions?: string[];
}