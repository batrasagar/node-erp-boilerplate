import { Request, Response, NextFunction } from 'express';
import { Company } from '../models/Company';
import { sendSuccess, sendCreated, sendNotFound } from '../utils/response.util';
import { getPagination, getPaginationMeta } from '../utils/pagination.util';

export class CompanyController {
  static async index(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page, limit, offset } = getPagination(req);
      const { count, rows } = await Company.findAndCountAll({
        where: { tenantId: req.user!.tenantId },
        limit, offset, order: [['name', 'ASC']],
      });
      sendSuccess(res, rows, 'Companies retrieved', 200, getPaginationMeta(count, { page, limit, offset }));
    } catch (err) { next(err); }
  }

  static async show(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const company = await Company.findOne({ where: { id: req.params.id, tenantId: req.user!.tenantId } });
      if (!company) { sendNotFound(res, 'Company'); return; }
      sendSuccess(res, company);
    } catch (err) { next(err); }
  }

  static async store(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const company = await Company.create({ ...req.body, tenantId: req.user!.tenantId });
      sendCreated(res, company, 'Company created');
    } catch (err) { next(err); }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const company = await Company.findOne({ where: { id: req.params.id, tenantId: req.user!.tenantId } });
      if (!company) { sendNotFound(res, 'Company'); return; }
      await company.update(req.body);
      sendSuccess(res, company, 'Company updated');
    } catch (err) { next(err); }
  }

  static async destroy(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const company = await Company.findOne({ where: { id: req.params.id, tenantId: req.user!.tenantId } });
      if (!company) { sendNotFound(res, 'Company'); return; }
      await company.update({ status: 'inactive' });
      sendSuccess(res, null, 'Company deactivated');
    } catch (err) { next(err); }
  }
}
