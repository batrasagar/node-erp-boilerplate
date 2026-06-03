import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Tenant } from '../types';

interface TenantState {
  tenant: Tenant | null;
  tenantId: string | null;
  setTenant: (tenant: Tenant) => void;
  clearTenant: () => void;
}

export const useTenantStore = create<TenantState>()(
  persist(
    (set) => ({
      tenant: null,
      tenantId: null,
      setTenant: (tenant) => set({ tenant, tenantId: tenant.id }),
      clearTenant: () => set({ tenant: null, tenantId: null }),
    }),
    { name: 'erp_tenant' },
  ),
);
