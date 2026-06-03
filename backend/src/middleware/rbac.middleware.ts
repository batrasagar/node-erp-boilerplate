import { Request, Response, NextFunction } from 'express';
import { sendForbidden } from '../utils/response.util';

export const authorize = (...requiredPermissions: string[]) =>
  (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendForbidden(res, 'Authentication required');
      return;
    }

    const { permissions } = req.user;

    if (permissions.includes('*')) {
      next();
      return;
    }

    const hasPermission = requiredPermissions.every((perm) => permissions.includes(perm));

    if (!hasPermission) {
      sendForbidden(res, `Missing required permissions: ${requiredPermissions.join(', ')}`);
      return;
    }

    next();
  };

export const authorizeAny = (...requiredPermissions: string[]) =>
  (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendForbidden(res, 'Authentication required');
      return;
    }

    const { permissions } = req.user;

    if (permissions.includes('*')) {
      next();
      return;
    }

    const hasAny = requiredPermissions.some((perm) => permissions.includes(perm));

    if (!hasAny) {
      sendForbidden(res, 'Insufficient permissions');
      return;
    }

    next();
  };

export const superAdminOnly = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user?.permissions.includes('*')) {
    sendForbidden(res, 'Super admin access required');
    return;
  }
  next();
};
