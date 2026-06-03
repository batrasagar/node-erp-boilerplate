import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthUser } from '../types';

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  permissions: string[];
  isAuthenticated: boolean;

  setAuth: (user: AuthUser, accessToken: string, refreshToken: string, permissions?: string[]) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setPermissions: (permissions: string[]) => void;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  isSuperAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      permissions: [],
      isAuthenticated: false,

      setAuth: (user, accessToken, refreshToken, permissions = []) =>
        set({ user, accessToken, refreshToken, permissions, isAuthenticated: true }),

      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),

      setPermissions: (permissions) => set({ permissions }),

      logout: () =>
        set({ user: null, accessToken: null, refreshToken: null, permissions: [], isAuthenticated: false }),

      hasPermission: (permission) => {
        const { permissions, user } = get();
        if (user?.isSuperAdmin || permissions.includes('*')) return true;
        return permissions.includes(permission);
      },

      isSuperAdmin: () => get().user?.isSuperAdmin ?? false,
    }),
    {
      name: 'erp_auth',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        permissions: state.permissions,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
