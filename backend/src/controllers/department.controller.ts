import { Request, Response, NextFunction } from 'express';
import { Department } from '../models/Department';
import { Branch } from '../models/Branch';
import { Company } from '../models/Company';
import { sendSuccess, sendCreated, sendNotFound } from '../utils/response.util';
import { getPagination, getPaginationMeta } from '../utils/pagination.util';

export class DepartmentController {
  static async index(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page, limit, offset } = getPagination(req);
      const where: Record<string, unknown> = { tenantId: req.user!.tenantId };
      if (req.query.companyId) where.companyId = req.query.companyId;
      if (req.query.branchId) where.branchId = req.query.branchId;

      const { count, rows } = await Department.findAndCountAll({
        where,
        include: [
          { model: Company, as: 'company', attributes: ['id', 'name'] },
          { model: Branch, as: 'branch', attributes: ['id', 'name'] },
          { model: Department, as: 'parent', attributes: ['id', 'name'] },
        ],
        limit, offset, order: [['name', 'ASC']],
      });
      sendSuccess(res, rows, 'Departments retrieved', 200, getPaginationMeta(count, { page, limit, offset }));
    } catch (err) { next(err); }
  }

  static async show(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dept = await Department.findOne({
        where: { id: req.params.id, tenantId: req.user!.tenantId },
        include: [
          { model: Company, as: 'company' },
          { model: Branch, as: 'branch' },
          { model: Department, as: 'parent' },
          { model: Department, as: 'children' },
        ],
      });
      if (!dept) { sendNotFound(res, 'Department'); return; }
      sendSuccess(res, dept);
    } catch (err) { next(err); }
  }

  static async store(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dept = await Department.create({ ...req.body, tenantId: req.user!.tenantId });
      sendCreated(res, dept, 'Department created');
    } catch (err) { next(err); }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dept = await Department.findOne({ where: { id: req.params.id, tenantId: req.user!.tenantId } });
      if (!dept) { sendNotFound(res, 'Department'); return; }
      await dept.update(req.body);
      sendSuccess(res, dept, 'Department updated');
    } catch (err) { next(err); }
  }

  static async destroy(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dept = await Department.findOne({ where: { id: req.params.id, tenantId: req.user!.tenantId } });
      if (!dept) { sendNotFound(res, 'Department'); return; }
      await dept.update({ status: 'inactive' });
      sendSuccess(res, null, 'Department deactivated');
    } catch (err) { next(err); }
  }
}
