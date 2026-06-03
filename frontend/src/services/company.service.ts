import api from './api';
import { ApiResponse, Company, Branch, Department } from '../types';

export const companyService = {
  list: async (params?: Record<string, unknown>) => {
    const { data } = await api.get<ApiResponse<Company[]>>('/companies', { params });
    return data;
  },
  get: async (id: string) => (await api.get<ApiResponse<Company>>(`/companies/${id}`)).data.data!,
  create: async (payload: Partial<Company>) => (await api.post<ApiResponse<Company>>('/companies', payload)).data.data!,
  update: async (id: string, payload: Partial<Company>) => (await api.put<ApiResponse<Company>>(`/companies/${id}`, payload)).data.data!,
  delete: async (id: string) => (await api.delete(`/companies/${id}`)).data,
};

export const branchService = {
  list: async (params?: Record<string, unknown>) => {
    const { data } = await api.get<ApiResponse<Branch[]>>('/branches', { params });
    return data;
  },
  get: async (id: string) => (await api.get<ApiResponse<Branch>>(`/branches/${id}`)).data.data!,
  create: async (payload: Partial<Branch>) => (await api.post<ApiResponse<Branch>>('/branches', payload)).data.data!,
  update: async (id: string, payload: Partial<Branch>) => (await api.put<ApiResponse<Branch>>(`/branches/${id}`, payload)).data.data!,
  delete: async (id: string) => (await api.delete(`/branches/${id}`)).data,
};

export const departmentService = {
  list: async (params?: Record<string, unknown>) => {
    const { data } = await api.get<ApiResponse<Department[]>>('/departments', { params });
    return data;
  },
  get: async (id: string) => (await api.get<ApiResponse<Department>>(`/departments/${id}`)).data.data!,
  create: async (payload: Partial<Department>) => (await api.post<ApiResponse<Department>>('/departments', payload)).data.data!,
  update: async (id: string, payload: Partial<Department>) => (await api.put<ApiResponse<Department>>(`/departments/${id}`, payload)).data.data!,
  delete: async (id: string) => (await api.delete(`/departments/${id}`)).data,
};
