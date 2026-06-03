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
      const kycStatus = data.tenant?.kycStatus ?? null;
      setAuth(data.user, data.accessToken, data.refreshToken, [], kycStatus as any);
      const { setTenant } = useTenantStore.getState();
      if (data.tenant) setTenant(data.tenant as any);
      if (!kycStatus || kycStatus === 'not_submitted' || kycStatus === 'rejected') {
        history.replace('/app/kyc');
      } else if (kycStatus === 'pending' || kycStatus === 'under_review') {
        history.replace('/app/kyc/pending');
      } else {
        history.replace('/app/home');
      }
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
