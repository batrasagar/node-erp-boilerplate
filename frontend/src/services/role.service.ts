import api from './api';
import { ApiResponse, Role, Permission, Notification, AuditLog, DashboardStats } from '../types';

export const roleService = {
  list: async () => (await api.get<ApiResponse<Role[]>>('/roles')).data,
  get: async (id: string) => (await api.get<ApiResponse<Role>>(`/roles/${id}`)).data.data!,
  create: async (payload: Partial<Role> & { permissionIds?: string[] }) =>
    (await api.post<ApiResponse<Role>>('/roles', payload)).data.data!,
  update: async (id: string, payload: Partial<Role> & { permissionIds?: string[] }) =>
    (await api.put(`/roles/${id}`, payload)).data,
  delete: async (id: string) => (await api.delete(`/roles/${id}`)).data,
};

export const permissionService = {
  list: async () => (await api.get<ApiResponse<{ permissions: Permission[]; grouped: Record<string, Permission[]> }>>('/permissions')).data.data!,
  seed: async () => (await api.post('/permissions/seed')).data,
};

export const notificationService = {
  list: async (params?: { unread?: boolean; page?: number }) =>
    (await api.get<ApiResponse<Notification[]>>('/notifications', { params })).data,
  unreadCount: async () => (await api.get<ApiResponse<{ count: number }>>('/notifications/unread-count')).data.data!,
  markRead: async (id: string) => (await api.put(`/notifications/${id}/read`)).data,
  markAllRead: async () => (await api.put('/notifications/mark-all-read')).data,
  delete: async (id: string) => (await api.delete(`/notifications/${id}`)).data,
};

export const auditLogService = {
  list: async (params?: Record<string, unknown>) =>
    (await api.get<ApiResponse<AuditLog[]>>('/audit-logs', { params })).data,
};

export const dashboardService = {
  stats: async () => (await api.get<ApiResponse<DashboardStats>>('/dashboard/stats')).data.data!,
  activity: async () => (await api.get<ApiResponse<AuditLog[]>>('/dashboard/activity')).data.data!,
};

export const menuService = {
  list: async () => (await api.get('/menus')).data.data,
};

export const settingService = {
  list: async () => (await api.get('/settings')).data.data,
  update: async (settings: Array<{ key: string; value: string }>) =>
    (await api.put('/settings', { settings })).data,
};

export const fileService = {
  list: async (params?: Record<string, unknown>) => (await api.get('/files', { params })).data,
  upload: async (file: File, folder?: string) => {
    const form = new FormData();
    form.append('file', file);
    if (folder) form.append('folder', folder);
    return (await api.post('/files/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } })).data;
  },
  delete: async (id: string) => (await api.delete(`/files/${id}`)).data,
};
