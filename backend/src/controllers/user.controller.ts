import { Request, Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import { User, Role, Permission, Company, Branch, Department } from '../models';
import { sendSuccess, sendCreated, sendNotFound } from '../utils/response.util';
import { getPagination, getPaginationMeta } from '../utils/pagination.util';
import { hashPassword, generateTempPassword } from '../utils/password.util';
import { EmailService } from '../services/email.service';
import { generateEmailVerificationToken } from '../utils/jwt.util';
import { deleteCachePattern } from '../config/redis';

const USER_EXCLUDE = ['password', 'refreshTokenHash', 'emailVerificationToken', 'passwordResetToken', 'passwordResetExpires'];

export class UserController {
  static async index(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page, limit, offset } = getPagination(req);
      const resolvedTenantId = req.user!.isSuperAdmin && req.query.tenantId
        ? req.query.tenantId as string
        : req.user!.tenantId;
      const where: Record<string, unknown> = { tenantId: resolvedTenantId };

      if (req.query.search) {
        (where as any)[Op.or as unknown as string] = [
          { firstName: { [Op.like]: `%${req.query.search}%` } },
          { lastName: { [Op.like]: `%${req.query.search}%` } },
          { email: { [Op.like]: `%${req.query.search}%` } },
        ];
      }
      if (req.query.status) where.status = req.query.status;
      if (req.query.companyId) where.companyId = req.query.companyId;

      const { count, rows } = await User.findAndCountAll({
        where,
        attributes: { exclude: USER_EXCLUDE },
        include: [
          { model: Role, as: 'roles', attributes: ['id', 'name', 'slug'] },
          { model: Company, as: 'company', attributes: ['id', 'name'] },
          { model: Branch, as: 'branch', attributes: ['id', 'name'] },
        ],
        limit, offset,
        order: [['createdAt', 'DESC']],
      });
      sendSuccess(res, rows, 'Users retrieved', 200, getPaginationMeta(count, { page, limit, offset }));
    } catch (err) { next(err); }
  }

  static async show(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const whereUser = req.user!.isSuperAdmin
        ? { id: req.params.id }
        : { id: req.params.id, tenantId: req.user!.tenantId };
      const user = await User.findOne({
        where: whereUser,
        attributes: { exclude: USER_EXCLUDE },
        include: [
          { model: Role, as: 'roles', include: [{ model: Permission, as: 'permissions' }] },
          { model: Company, as: 'company' },
          { model: Branch, as: 'branch' },
          { model: Department, as: 'department' },
        ],
      });
      if (!user) { sendNotFound(res, 'User'); return; }
      sendSuccess(res, user);
    } catch (err) { next(err); }
  }

  static async store(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tempPassword = req.body.password || generateTempPassword();
      const hashedPassword = await hashPassword(tempPassword);
      const verificationToken = generateEmailVerificationToken();

      const user = await User.create({
        ...req.body,
        tenantId: req.user!.tenantId,
        password: hashedPassword,
        emailVerificationToken: verificationToken,
        emailVerified: false,
      });

      if (req.body.roleIds?.length) {
        await (user as any).setRoles(req.body.roleIds);
      }

      await EmailService.sendWelcome(user.email, user.firstName, verificationToken);
      if (!req.body.password) {
        await EmailService.sendTempPassword(user.email, user.firstName, tempPassword);
      }

      const result = await User.findByPk(user.id, {
        attributes: { exclude: USER_EXCLUDE },
        include: [{ model: Role, as: 'roles' }],
      });

      sendCreated(res, result, 'User created successfully');
    } catch (err) { next(err); }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const whereUpdate = req.user!.isSuperAdmin ? { id: req.params.id } : { id: req.params.id, tenantId: req.user!.tenantId };
      const user = await User.findOne({ where: whereUpdate });
      if (!user) { sendNotFound(res, 'User'); return; }

      const { password, roleIds, ...updateData } = req.body;
      if (password) updateData.password = await hashPassword(password);

      await user.update(updateData);

      if (roleIds !== undefined) {
        await (user as any).setRoles(roleIds);
        await deleteCachePattern(`user_permissions:${user.id}:*`);
      }

      sendSuccess(res, null, 'User updated successfully');
    } catch (err) { next(err); }
  }

  static async destroy(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const whereDestroy = req.user!.isSuperAdmin ? { id: req.params.id } : { id: req.params.id, tenantId: req.user!.tenantId };
      const user = await User.findOne({ where: whereDestroy });
      if (!user) { sendNotFound(res, 'User'); return; }
      await user.update({ status: 'inactive' });
      sendSuccess(res, null, 'User deactivated');
    } catch (err) { next(err); }
  }

  static async assignRoles(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const whereRoles = req.user!.isSuperAdmin ? { id: req.params.id } : { id: req.params.id, tenantId: req.user!.tenantId };
      const user = await User.findOne({ where: whereRoles });
      if (!user) { sendNotFound(res, 'User'); return; }
      await (user as any).setRoles(req.body.roleIds);
      await deleteCachePattern(`user_permissions:${user.id}:*`);
      sendSuccess(res, null, 'Roles assigned successfully');
    } catch (err) { next(err); }
  }
}
