import api from './api';
import { ApiResponse, LoginResponse } from '../types';

export const authService = {
  login: async (email: string, password: string) => {
    const { data } = await api.post<ApiResponse<LoginResponse>>('/auth/login', { email, password });
    return data.data!;
  },

  logout: async () => {
    await api.post('/auth/logout');
  },

  me: async () => {
    const { data } = await api.get('/auth/me');
    return data.data;
  },

  refreshToken: async (userId: string, tenantId: string, refreshToken: string) => {
    const { data } = await api.post('/auth/refresh', { userId, tenantId, refreshToken });
    return data.data;
  },

  forgotPassword: async (email: string) => {
    const { data } = await api.post('/auth/forgot-password', { email });
    return data;
  },

  resetPassword: async (token: string, password: string) => {
    const { data } = await api.post('/auth/reset-password', { token, password });
    return data;
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const { data } = await api.put('/auth/change-password', { currentPassword, newPassword });
    return data;
  },

  updateFcmToken: async (fcmToken: string) => {
    const { data } = await api.put('/auth/fcm-token', { fcmToken });
    return data;
  },
};
