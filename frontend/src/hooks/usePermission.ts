import { useAuthStore } from '../stores/authStore';

export const usePermission = (permission: string): boolean =>
  useAuthStore((s) => s.hasPermission(permission));

export const useAnyPermission = (...permissions: string[]): boolean => {
  const hasPermission = useAuthStore((s) => s.hasPermission);
  return permissions.some(hasPermission);
};

export const useAllPermissions = (...permissions: string[]): boolean => {
  const hasPermission = useAuthStore((s) => s.hasPermission);
  return permissions.every(hasPermission);
};

export const useIsSuperAdmin = (): boolean =>
  useAuthStore((s) => s.isSuperAdmin());
