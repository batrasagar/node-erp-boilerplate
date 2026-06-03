import { Request, Response, NextFunction } from 'express';
import { Menu } from '../models/Menu';
import { sendSuccess, sendCreated, sendNotFound } from '../utils/response.util';

export class MenuController {
  static async index(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const menus = await Menu.findAll({
        where: { parentId: null },
        include: [{ model: Menu, as: 'children', include: [{ model: Menu, as: 'children' }] }],
        order: [['order', 'ASC'], [{ model: Menu, as: 'children' }, 'order', 'ASC']],
      });

      const userPerms = req.user?.permissions || [];
      const filterByPermission = (items: Menu[]): Menu[] =>
        items
          .filter((m) => !m.requiredPermission || userPerms.includes('*') || userPerms.includes(m.requiredPermission))
          .map((m) => ({
            ...m.toJSON(),
            children: filterByPermission((m as any).children || []),
          })) as Menu[];

      sendSuccess(res, filterByPermission(menus), 'Menu retrieved');
    } catch (err) { next(err); }
  }

  static async store(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const menu = await Menu.create({ ...req.body, tenantId: req.user!.tenantId });
      sendCreated(res, menu, 'Menu created');
    } catch (err) { next(err); }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const menu = await Menu.findByPk(req.params.id);
      if (!menu) { sendNotFound(res, 'Menu'); return; }
      await menu.update(req.body);
      sendSuccess(res, menu, 'Menu updated');
    } catch (err) { next(err); }
  }

  static async destroy(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const menu = await Menu.findByPk(req.params.id);
      if (!menu) { sendNotFound(res, 'Menu'); return; }
      if (menu.isSystem) { sendSuccess(res, null, 'Cannot delete system menus'); return; }
      await menu.destroy();
      sendSuccess(res, null, 'Menu deleted');
    } catch (err) { next(err); }
  }
}
