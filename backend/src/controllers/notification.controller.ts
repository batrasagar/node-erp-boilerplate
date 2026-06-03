import { Request, Response, NextFunction } from 'express';
import { Notification } from '../models/Notification';
import { sendSuccess, sendNotFound } from '../utils/response.util';
import { getPagination, getPaginationMeta } from '../utils/pagination.util';

export class NotificationController {
  static async index(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page, limit, offset } = getPagination(req);
      const where: Record<string, unknown> = {
        tenantId: req.user!.tenantId,
        userId: req.user!.id,
      };
      if (req.query.unread === 'true') where.isRead = false;

      const { count, rows } = await Notification.findAndCountAll({
        where, limit, offset,
        order: [['createdAt', 'DESC']],
      });
      sendSuccess(res, rows, 'Notifications retrieved', 200, getPaginationMeta(count, { page, limit, offset }));
    } catch (err) { next(err); }
  }

  static async markRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const notification = await Notification.findOne({
        where: { id: req.params.id, userId: req.user!.id },
      });
      if (!notification) { sendNotFound(res, 'Notification'); return; }
      await notification.update({ isRead: true, readAt: new Date() });
      sendSuccess(res, null, 'Marked as read');
    } catch (err) { next(err); }
  }

  static async markAllRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await Notification.update(
        { isRead: true, readAt: new Date() },
        { where: { userId: req.user!.id, tenantId: req.user!.tenantId, isRead: false } },
      );
      sendSuccess(res, null, 'All notifications marked as read');
    } catch (err) { next(err); }
  }

  static async unreadCount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const count = await Notification.count({
        where: { userId: req.user!.id, tenantId: req.user!.tenantId, isRead: false },
      });
      sendSuccess(res, { count });
    } catch (err) { next(err); }
  }

  static async destroy(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await Notification.destroy({
        where: { id: req.params.id, userId: req.user!.id },
      });
      sendSuccess(res, null, 'Notification deleted');
    } catch (err) { next(err); }
  }
}
