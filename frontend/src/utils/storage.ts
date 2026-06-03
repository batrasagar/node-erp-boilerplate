const PREFIX = 'erp_';

export const storage = {
  get: (key: string): string | null => localStorage.getItem(PREFIX + key),
  set: (key: string, value: string): void => localStorage.setItem(PREFIX + key, value),
  remove: (key: string): void => localStorage.removeItem(PREFIX + key),
  clear: (): void => {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(PREFIX))
      .forEach((k) => localStorage.removeItem(k));
  },
};

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  TENANT_ID: 'tenant_id',
} as const;
