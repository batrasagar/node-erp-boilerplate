import { User } from '../models/User';
import { Tenant } from '../models/Tenant';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        tenantId: string;
        email: string;
        roles: string[];
        permissions: string[];
      };
      tenant?: Tenant;
      tenantId?: string;
    }
  }
}

export {};
