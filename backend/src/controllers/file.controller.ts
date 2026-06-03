import { Request, Response, NextFunction } from 'express';
import { File } from '../models/File';
import { sendSuccess, sendCreated, sendNotFound, sendError } from '../utils/response.util';
import { getPagination, getPaginationMeta } from '../utils/pagination.util';
import fs from 'fs';
import path from 'path';

export class FileController {
  static async index(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page, limit, offset } = getPagination(req);
      const where: Record<string, unknown> = { tenantId: req.user!.tenantId };
      if (req.query.folder) where.folder = req.query.folder;

      const { count, rows } = await File.findAndCountAll({
        where, limit, offset,
        order: [['createdAt', 'DESC']],
      });
      sendSuccess(res, rows, 'Files retrieved', 200, getPaginationMeta(count, { page, limit, offset }));
    } catch (err) { next(err); }
  }

  static async upload(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) { sendError(res, 'No file uploaded', 400); return; }

      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const url = `${baseUrl}/uploads/${req.user!.tenantId}/${req.file.filename}`;

      const file = await File.create({
        tenantId: req.user!.tenantId,
        uploadedBy: req.user!.id,
        originalName: req.file.originalname,
        filename: req.file.filename,
        path: req.file.path,
        url,
        mimeType: req.file.mimetype,
        size: req.file.size,
        folder: req.body.folder || 'general',
        isPublic: req.body.isPublic === 'true',
      });

      sendCreated(res, file, 'File uploaded successfully');
    } catch (err) { next(err); }
  }

  static async destroy(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const file = await File.findOne({
        where: { id: req.params.id, tenantId: req.user!.tenantId },
      });
      if (!file) { sendNotFound(res, 'File'); return; }

      try {
        fs.unlinkSync(file.path);
      } catch { /* ignore if file already deleted */ }

      await file.destroy();
      sendSuccess(res, null, 'File deleted');
    } catch (err) { next(err); }
  }
}
