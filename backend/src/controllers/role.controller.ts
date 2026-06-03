import { Request, Response, NextFunction } from 'express';
import { Role, Permission } from '../models';
import { sendSuccess, sendCreated, sendNotFound } from '../utils/response.util';
import { getPagination, getPaginationMeta } from '../utils/pagination.util';
import { deleteCachePattern } from '../config/redis';

export class RoleController {
  static async index(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page, limit, offset } = getPagination(req);
      const { count, rows } = await Role.findAndCountAll({
        where: { tenantId: req.user!.tenantId },
        include: [{ model: Permission, as: 'permissions' }],
        limit, offset,
        order: [['name', 'ASC']],
      });
      sendSuccess(res, rows, 'Roles retrieved', 200, getPaginationMeta(count, { page, limit, offset }));
    } catch (err) { next(err); }
  }

  static async show(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const role = await Role.findOne({
        where: { id: req.params.id, tenantId: req.user!.tenantId },
        include: [{ model: Permission, as: 'permissions' }],
      });
      if (!role) { sendNotFound(res, 'Role'); return; }
      sendSuccess(res, role);
    } catch (err) { next(err); }
  }

  static async store(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const role = await Role.create({
        ...req.body,
        tenantId: req.user!.tenantId,
        slug: req.body.name.toLowerCase().replace(/\s+/g, '-'),
      });

      if (req.body.permissionIds?.length) {
        await (role as any).setPermissions(req.body.permissionIds);
      }

      sendCreated(res, role, 'Role created successfully');
    } catch (err) { next(err); }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const role = await Role.findOne({ where: { id: req.params.id, tenantId: req.user!.tenantId } });
      if (!role) { sendNotFound(res, 'Role'); return; }
      if (role.isSystem) {
        const { permissionIds, ...safeUpdate } = req.body;
        await role.update(safeUpdate);
        if (permissionIds !== undefined) {
          await (role as any).setPermissions(permissionIds);
        }
      } else {
        await role.update(req.body);
        if (req.body.permissionIds !== undefined) {
          await (role as any).setPermissions(req.body.permissionIds);
        }
      }
      await deleteCachePattern(`user_permissions:*`);
      sendSuccess(res, null, 'Role updated');
    } catch (err) { next(err); }
  }

  static async destroy(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const role = await Role.findOne({ where: { id: req.params.id, tenantId: req.user!.tenantId } });
      if (!role) { sendNotFound(res, 'Role'); return; }
      if (role.isSystem) {
        sendSuccess(res, null, 'Cannot delete system roles');
        return;
      }
      await role.destroy();
      sendSuccess(res, null, 'Role deleted');
    } catch (err) { next(err); }
  }
}
