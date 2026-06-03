import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.util';
import { User, Role, Permission } from '../models';
import { sendUnauthorized } from '../utils/response.util';
import { getCache, setCache } from '../config/redis';

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      sendUnauthorized(res, 'No token provided');
      return;
    }

    const token = authHeader.slice(7);
    const payload = verifyAccessToken(token);

    const cacheKey = `user_permissions:${payload.userId}:${payload.tenantId}`;
    let userPermissions = await getCache<string[]>(cacheKey);

    if (!userPermissions) {
      const user = await User.findOne({
        where: { id: payload.userId, tenantId: payload.tenantId, status: 'active' },
        include: [{
          model: Role,
          as: 'roles',
          where: { status: 'active' },
          required: false,
          include: [{
            model: Permission,
            as: 'permissions',
            required: false,
          }],
        }],
      });

      if (!user) {
        sendUnauthorized(res, 'User not found or inactive');
        return;
      }

      const roles = (user as any).roles || [];
      const permissions = new Set<string>();
      const roleNames: string[] = [];

      for (const role of roles) {
        roleNames.push(role.slug);
        const rolePerms = (role as any).permissions || [];
        for (const perm of rolePerms) {
          permissions.add(`${perm.module}.${perm.action}`);
        }
      }

      if (user.isSuperAdmin) {
        permissions.add('*');
      }

      userPermissions = Array.from(permissions);

      req.user = {
        id: user.id,
        tenantId: user.tenantId,
        email: user.email,
        roles: roleNames,
        permissions: userPermissions,
      };

      await setCache(cacheKey, userPermissions, 300);
    } else {
      req.user = {
        id: payload.userId,
        tenantId: payload.tenantId,
        email: payload.email,
        roles: [],
        permissions: userPermissions,
      };
    }

    next();
  } catch {
    sendUnauthorized(res, 'Invalid or expired token');
  }
};
