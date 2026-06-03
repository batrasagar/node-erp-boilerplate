import { Request, Response, NextFunction } from 'express';
import { Branch } from '../models/Branch';
import { Company } from '../models/Company';
import { sendSuccess, sendCreated, sendNotFound } from '../utils/response.util';
import { getPagination, getPaginationMeta } from '../utils/pagination.util';

export class BranchController {
  static async index(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page, limit, offset } = getPagination(req);
      const where: Record<string, unknown> = { tenantId: req.user!.tenantId };
      if (req.query.companyId) where.companyId = req.query.companyId;

      const { count, rows } = await Branch.findAndCountAll({
        where,
        include: [{ model: Company, as: 'company', attributes: ['id', 'name'] }],
        limit, offset, order: [['name', 'ASC']],
      });
      sendSuccess(res, rows, 'Branches retrieved', 200, getPaginationMeta(count, { page, limit, offset }));
    } catch (err) { next(err); }
  }

  static async show(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const branch = await Branch.findOne({
        where: { id: req.params.id, tenantId: req.user!.tenantId },
        include: [{ model: Company, as: 'company' }],
      });
      if (!branch) { sendNotFound(res, 'Branch'); return; }
      sendSuccess(res, branch);
    } catch (err) { next(err); }
  }

  static async store(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const branch = await Branch.create({ ...req.body, tenantId: req.user!.tenantId });
      sendCreated(res, branch, 'Branch created');
    } catch (err) { next(err); }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const branch = await Branch.findOne({ where: { id: req.params.id, tenantId: req.user!.tenantId } });
      if (!branch) { sendNotFound(res, 'Branch'); return; }
      await branch.update(req.body);
      sendSuccess(res, branch, 'Branch updated');
    } catch (err) { next(err); }
  }

  static async destroy(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const branch = await Branch.findOne({ where: { id: req.params.id, tenantId: req.user!.tenantId } });
      if (!branch) { sendNotFound(res, 'Branch'); return; }
      await branch.update({ status: 'inactive' });
      sendSuccess(res, null, 'Branch deactivated');
    } catch (err) { next(err); }
  }
}
