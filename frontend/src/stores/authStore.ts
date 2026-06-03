import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthUser, KycStatus } from '../types';

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  permissions: string[];
  isAuthenticated: boolean;
  kycStatus: KycStatus | null;

  setAuth: (user: AuthUser, accessToken: string, refreshToken: string, permissions?: string[], kycStatus?: KycStatus | null) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setPermissions: (permissions: string[]) => void;
  setKycStatus: (status: KycStatus) => void;
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
      kycStatus: null,

      setAuth: (user, accessToken, refreshToken, permissions = [], kycStatus = null as KycStatus | null) =>
        set({ user, accessToken, refreshToken, permissions, isAuthenticated: true, kycStatus }),

      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),

      setPermissions: (permissions) => set({ permissions }),

      setKycStatus: (kycStatus) => set({ kycStatus }),

      logout: () =>
        set({ user: null, accessToken: null, refreshToken: null, permissions: [], isAuthenticated: false, kycStatus: null }),

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
        kycStatus: state.kycStatus,
      }),
    },
  ),
);
