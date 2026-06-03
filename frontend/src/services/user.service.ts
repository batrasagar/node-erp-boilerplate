import api from './api';
import { ApiResponse, User } from '../types';

export const userService = {
  list: async (params?: Record<string, unknown>) => {
    const { data } = await api.get<ApiResponse<User[]>>('/users', { params });
    return data;
  },

  get: async (id: string) => {
    const { data } = await api.get<ApiResponse<User>>(`/users/${id}`);
    return data.data!;
  },

  create: async (payload: Partial<User> & { roleIds?: string[] }) => {
    const { data } = await api.post<ApiResponse<User>>('/users', payload);
    return data.data!;
  },

  update: async (id: string, payload: Partial<User> & { roleIds?: string[] }) => {
    const { data } = await api.put<ApiResponse<User>>(`/users/${id}`, payload);
    return data.data!;
  },

  delete: async (id: string) => {
    const { data } = await api.delete(`/users/${id}`);
    return data;
  },

  assignRoles: async (id: string, roleIds: string[]) => {
    const { data } = await api.put(`/users/${id}/roles`, { roleIds });
    return data;
  },
};
