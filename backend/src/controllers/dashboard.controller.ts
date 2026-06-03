import { Request, Response, NextFunction } from 'express';
import { User, Company, Branch, Department, Role } from '../models';
import { AuditLog } from '../models/AuditLog';
import { Notification } from '../models/Notification';
import { sendSuccess } from '../utils/response.util';
import { Op } from 'sequelize';

export class DashboardController {
  static async stats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.user!.tenantId;
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      const [
        totalUsers, activeUsers, totalCompanies, totalBranches,
        totalDepartments, totalRoles, recentLogs, unreadNotifications,
      ] = await Promise.all([
        User.count({ where: { tenantId } }),
        User.count({ where: { tenantId, status: 'active' } }),
        Company.count({ where: { tenantId } }),
        Branch.count({ where: { tenantId } }),
        Department.count({ where: { tenantId } }),
        Role.count({ where: { tenantId } }),
        AuditLog.count({ where: { tenantId, createdAt: { [Op.gte]: thirtyDaysAgo } } }),
        Notification.count({ where: { tenantId, userId: req.user!.id, isRead: false } }),
      ]);

      sendSuccess(res, {
        users: { total: totalUsers, active: activeUsers, inactive: totalUsers - activeUsers },
        organizations: { companies: totalCompanies, branches: totalBranches, departments: totalDepartments },
        access: { roles: totalRoles },
        activity: { recentLogs, unreadNotifications },
      }, 'Dashboard stats');
    } catch (err) { next(err); }
  }

  static async recentActivity(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const logs = await AuditLog.findAll({
        where: { tenantId: req.user!.tenantId },
        include: [{ model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'avatar'] }],
        order: [['createdAt', 'DESC']],
        limit: 20,
      });
      sendSuccess(res, logs, 'Recent activity');
    } catch (err) { next(err); }
  }
}
