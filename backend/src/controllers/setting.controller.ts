import { Request, Response, NextFunction } from 'express';
import { Setting } from '../models/Setting';
import { sendSuccess } from '../utils/response.util';

export class SettingController {
  static async index(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const settings = await Setting.findAll({
        where: { tenantId: req.user!.tenantId },
        order: [['group', 'ASC'], ['key', 'ASC']],
      });
      sendSuccess(res, settings);
    } catch (err) { next(err); }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { settings } = req.body as { settings: Array<{ key: string; value: string }> };
      for (const { key, value } of settings) {
        await Setting.upsert({ tenantId: req.user!.tenantId, key, value, group: 'general', type: 'string', isPublic: false });
      }
      sendSuccess(res, null, 'Settings updated');
    } catch (err) { next(err); }
  }

  static async get(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const setting = await Setting.findOne({
        where: { tenantId: req.user!.tenantId, key: req.params.key },
      });
      sendSuccess(res, setting?.parsedValue ?? null);
    } catch (err) { next(err); }
  }
}
