import { Request, Response, NextFunction } from 'express';
import { Tenant } from '../models/Tenant';
import { getCache, setCache } from '../config/redis';
import { sendError } from '../utils/response.util';

export const resolveTenant = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const tenantIdentifier =
      req.headers['x-tenant-id'] as string ||
      req.headers['x-tenant-slug'] as string ||
      extractSubdomain(req.hostname);

    if (!tenantIdentifier) {
      sendError(res, 'Tenant identifier required', 400);
      return;
    }

    const cacheKey = `tenant:${tenantIdentifier}`;
    let tenant = await getCache<Tenant>(cacheKey);

    if (!tenant) {
      const isUUID = /^[0-9a-f-]{36}$/.test(tenantIdentifier);
      const dbTenant = await Tenant.findOne({
        where: isUUID ? { id: tenantIdentifier } : { slug: tenantIdentifier },
      });

      if (!dbTenant) {
        sendError(res, 'Tenant not found', 404);
        return;
      }

      if (dbTenant.status === 'suspended') {
        sendError(res, 'Tenant account suspended', 403);
        return;
      }

      tenant = dbTenant.toJSON() as Tenant;
      await setCache(cacheKey, tenant, 300);
    }

    req.tenant = tenant;
    req.tenantId = (tenant as any).id;
    next();
  } catch (error) {
    sendError(res, 'Failed to resolve tenant', 500);
  }
};

const extractSubdomain = (hostname: string): string | null => {
  const parts = hostname.split('.');
  if (parts.length >= 3) return parts[0];
  return null;
};
