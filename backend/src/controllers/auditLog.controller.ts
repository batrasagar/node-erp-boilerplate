import { Request, Response, NextFunction } from 'express';
import { AuditLog } from '../models/AuditLog';
import { User } from '../models/User';
import { sendSuccess } from '../utils/response.util';
import { getPagination, getPaginationMeta } from '../utils/pagination.util';
import { Op } from 'sequelize';

export class AuditLogController {
  static async index(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page, limit, offset } = getPagination(req);
      const where: Record<string, unknown> = { tenantId: req.user!.tenantId };

      if (req.query.userId) where.userId = req.query.userId;
      if (req.query.resource) where.resource = req.query.resource;
      if (req.query.action) where.action = req.query.action;
      if (req.query.from && req.query.to) {
        where.createdAt = {
          [Op.between]: [new Date(req.query.from as string), new Date(req.query.to as string)],
        };
      }

      const { count, rows } = await AuditLog.findAndCountAll({
        where,
        include: [{ model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'avatar'] }],
        limit, offset,
        order: [['createdAt', 'DESC']],
      });
      sendSuccess(res, rows, 'Audit logs retrieved', 200, getPaginationMeta(count, { page, limit, offset }));
    } catch (err) { next(err); }
  }
}
