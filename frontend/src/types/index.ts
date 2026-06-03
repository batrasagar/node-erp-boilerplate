export interface Tenant {
  id: string;
  name: string;
  slug: string;
  plan: 'starter' | 'professional' | 'enterprise';
  status: 'active' | 'inactive' | 'suspended' | 'trial';
  domain?: string;
  logo?: string;
  primaryColor?: string;
  createdAt: string;
}

export interface Company {
  id: string;
  tenantId: string;
  name: string;
  code: string;
  address?: string;
  city?: string;
  country?: string;
  phone?: string;
  email?: string;
  logo?: string;
  currency?: string;
  status: 'active' | 'inactive';
}

export interface Branch {
  id: string;
  tenantId: string;
  companyId: string;
  name: string;
  code: string;
  city?: string;
  isHeadquarters: boolean;
  status: 'active' | 'inactive';
  company?: Company;
}

export interface Department {
  id: string;
  tenantId: string;
  companyId: string;
  branchId?: string;
  name: string;
  code: string;
  parentId?: string;
  status: 'active' | 'inactive';
}

export interface User {
  id: string;
  tenantId: string;
  companyId?: string;
  branchId?: string;
  departmentId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'suspended';
  emailVerified: boolean;
  lastLogin?: string;
  isSuperAdmin: boolean;
  roles?: Role[];
  company?: Company;
  branch?: Branch;
  createdAt: string;
}

export interface Role {
  id: string;
  tenantId: string;
  name: string;
  slug: string;
  description?: string;
  isSystem: boolean;
  status: 'active' | 'inactive';
  permissions?: Permission[];
}

export interface Permission {
  id: string;
  module: string;
  action: string;
  resource: string;
  description?: string;
}

export interface Menu {
  id: string;
  name: string;
  icon?: string;
  path?: string;
  parentId?: string;
  order: number;
  isVisible: boolean;
  requiredPermission?: string;
  children?: Menu[];
}

export interface Notification {
  id: string;
  tenantId: string;
  userId: string;
  title: string;
  body: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'system';
  isRead: boolean;
  readAt?: string;
  actionUrl?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  tenantId: string;
  userId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  oldValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
  ipAddress?: string;
  status: 'success' | 'failure';
  createdAt: string;
  user?: User;
}

export interface File {
  id: string;
  tenantId: string;
  originalName: string;
  url: string;
  mimeType: string;
  size: number;
  folder?: string;
  createdAt: string;
}

export interface Setting {
  id: string;
  key: string;
  value?: string;
  type: string;
  group: string;
  description?: string;
}

export interface DashboardStats {
  users: { total: number; active: number; inactive: number };
  organizations: { companies: number; branches: number; departments: number };
  access: { roles: number };
  activity: { recentLogs: number; unreadNotifications: number };
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  meta?: PaginationMeta;
}

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  tenantId: string;
  isSuperAdmin: boolean;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}
