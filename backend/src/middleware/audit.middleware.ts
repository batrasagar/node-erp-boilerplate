import { Request, Response, NextFunction } from 'express';
import { AuditLog } from '../models/AuditLog';
import logger from '../utils/logger.util';

interface AuditOptions {
  action: string;
  resource: string;
  getResourceId?: (req: Request) => string | undefined;
}

export const auditLog = (options: AuditOptions) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const originalJson = res.json.bind(res);

    res.json = function (body) {
      setImmediate(async () => {
        try {
          if (!req.user?.tenantId) return;
          await AuditLog.create({
            tenantId: req.user.tenantId,
            userId: req.user.id,
            action: options.action,
            resource: options.resource,
            resourceId: options.getResourceId?.(req) || req.params.id,
            newValues: body?.data,
            ipAddress: req.ip || req.socket.remoteAddress,
            userAgent: req.headers['user-agent'],
            status: res.statusCode < 400 ? 'success' : 'failure',
          });
        } catch (err) {
          logger.error('Audit log error:', err);
        }
      });
      return originalJson(body);
    };

    next();
  };
