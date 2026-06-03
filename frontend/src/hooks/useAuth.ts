import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useHistory } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useTenantStore } from '../stores/tenantStore';
import { authService } from '../services/auth.service';
import { useUIStore } from '../stores/uiStore';

export const useLogin = () => {
  const { setAuth } = useAuthStore();
  const { showToast } = useUIStore();
  const history = useHistory();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.login(email, password),
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken);
      history.replace('/app/home');
    },
    onError: (error: unknown) => {
      const message = (error as any)?.response?.data?.message || 'Login failed';
      showToast(message, 'error');
    },
  });
};

export const useLogout = () => {
  const { logout } = useAuthStore();
  const { clearTenant } = useTenantStore();
  const queryClient = useQueryClient();
  const history = useHistory();

  return useMutation({
    mutationFn: authService.logout,
    onSettled: () => {
      logout();
      clearTenant();
      queryClient.clear();
      history.replace('/login');
    },
  });
};

export const useMe = () => useAuthStore((s) => s.user);
export const useIsAuthenticated = () => useAuthStore((s) => s.isAuthenticated);
export const useHasPermission = () => useAuthStore((s) => s.hasPermission);
