import api from './api';
import { ApiResponse, Tenant } from '../types';

export const tenantService = {
  list: async (page = 1, limit = 20) => {
    const { data } = await api.get<ApiResponse<Tenant[]>>('/tenants', { params: { page, limit } });
    return data;
  },

  get: async (id: string) => {
    const { data } = await api.get<ApiResponse<Tenant>>(`/tenants/${id}`);
    return data.data!;
  },

  create: async (payload: Partial<Tenant>) => {
    const { data } = await api.post<ApiResponse<Tenant>>('/tenants', payload);
    return data.data!;
  },

  update: async (id: string, payload: Partial<Tenant>) => {
    const { data } = await api.put<ApiResponse<Tenant>>(`/tenants/${id}`, payload);
    return data.data!;
  },

  delete: async (id: string) => {
    const { data } = await api.delete(`/tenants/${id}`);
    return data;
  },
};
