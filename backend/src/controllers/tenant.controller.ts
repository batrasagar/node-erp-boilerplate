import { Request, Response, NextFunction } from 'express';
import { Tenant } from '../models/Tenant';
import { sendSuccess, sendCreated, sendNotFound } from '../utils/response.util';
import { getPagination, getPaginationMeta } from '../utils/pagination.util';
import { deleteCachePattern } from '../config/redis';

export class TenantController {
  static async index(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page, limit, offset } = getPagination(req);
      const { count, rows } = await Tenant.findAndCountAll({
        limit, offset,
        order: [['createdAt', 'DESC']],
      });
      sendSuccess(res, rows, 'Tenants retrieved', 200, getPaginationMeta(count, { page, limit, offset }));
    } catch (err) { next(err); }
  }

  static async show(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenant = await Tenant.findByPk(req.params.id);
      if (!tenant) { sendNotFound(res, 'Tenant'); return; }
      sendSuccess(res, tenant);
    } catch (err) { next(err); }
  }

  static async store(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenant = await Tenant.create(req.body);
      sendCreated(res, tenant, 'Tenant created successfully');
    } catch (err) { next(err); }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenant = await Tenant.findByPk(req.params.id);
      if (!tenant) { sendNotFound(res, 'Tenant'); return; }
      await tenant.update(req.body);
      await deleteCachePattern(`tenant:${tenant.slug}`);
      await deleteCachePattern(`tenant:${tenant.id}`);
      sendSuccess(res, tenant, 'Tenant updated successfully');
    } catch (err) { next(err); }
  }

  static async destroy(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenant = await Tenant.findByPk(req.params.id);
      if (!tenant) { sendNotFound(res, 'Tenant'); return; }
      await tenant.update({ status: 'inactive' });
      sendSuccess(res, null, 'Tenant deactivated');
    } catch (err) { next(err); }
  }
}
