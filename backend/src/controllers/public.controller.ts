import { Request, Response, NextFunction } from 'express';
import { PLANS } from '../config/plans';
import { Tenant } from '../models/Tenant';
import { User } from '../models/User';
import { Role } from '../models/Role';
import { UserRole } from '../models/UserRole';
import { hashPassword } from '../utils/password.util';
import { generateAccessToken, generateRefreshToken, storeRefreshToken } from '../utils/jwt.util';
import { sendSuccess, sendCreated, sendError } from '../utils/response.util';
import { sequelize } from '../config/database';

export class PublicController {
  static async getPlans(_req: Request, res: Response): Promise<void> {
    sendSuccess(res, Object.values(PLANS), 'Plans retrieved');
  }

  static async checkSlug(req: Request, res: Response): Promise<void> {
    const { slug } = req.params;
    const existing = await Tenant.findOne({ where: { slug } });
    sendSuccess(res, { available: !existing }, 'Slug checked');
  }

  static async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { plan, orgName, orgSlug, firstName, lastName, email, password } = req.body;

    const missing = ['plan', 'orgName', 'orgSlug', 'firstName', 'lastName', 'email', 'password']
      .filter((f) => !req.body[f]?.toString().trim());
    if (missing.length) {
      sendError(res, `Missing required fields: ${missing.join(', ')}`, 400);
      return;
    }
    if (!/^[a-z0-9-]+$/.test(orgSlug) || orgSlug.length < 3) {
      sendError(res, 'Slug must be at least 3 characters and contain only lowercase letters, numbers, and hyphens', 400);
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      sendError(res, 'Invalid email address', 400);
      return;
    }
    if (password.length < 8) {
      sendError(res, 'Password must be at least 8 characters', 400);
      return;
    }

    const t = await sequelize.transaction();
    try {
      if (!PLANS[plan as keyof typeof PLANS]) {
        await t.rollback();
        sendError(res, 'Invalid plan selected', 400);
        return;
      }

      const [slugExists, emailExists] = await Promise.all([
        Tenant.findOne({ where: { slug: orgSlug }, transaction: t }),
        User.findOne({ where: { email }, transaction: t }),
      ]);

      if (slugExists) {
        await t.rollback();
        sendError(res, 'Organisation slug already taken', 409);
        return;
      }
      if (emailExists) {
        await t.rollback();
        sendError(res, 'Email already registered', 409);
        return;
      }

      const tenant = await Tenant.create({
        name: orgName,
        slug: orgSlug,
        plan: plan as any,
        status: 'trial',
        kycStatus: 'not_submitted',
        trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      }, { transaction: t });

      const hashedPassword = await hashPassword(password);
      const user = await User.create({
        tenantId: tenant.id,
        firstName,
        lastName,
        email,
        password: hashedPassword,
        status: 'active',
        emailVerified: false,
        isSuperAdmin: true,
      }, { transaction: t });

      const adminRole = await Role.create({
        tenantId: tenant.id,
        name: 'Admin',
        slug: 'admin',
        description: 'Full access admin role',
        isSystem: true,
        status: 'active',
      }, { transaction: t });

      await UserRole.create({ userId: user.id, roleId: adminRole.id }, { transaction: t });

      await t.commit();

      const accessToken = generateAccessToken({
        userId: user.id,
        tenantId: tenant.id,
        email: user.email,
        isSuperAdmin: true,
      });
      const refreshToken = generateRefreshToken();
      await storeRefreshToken(user.id, tenant.id, refreshToken);

      sendCreated(res, {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          tenantId: tenant.id,
          isSuperAdmin: true,
        },
        tenant: {
          id: tenant.id,
          name: tenant.name,
          slug: tenant.slug,
          plan: tenant.plan,
          status: tenant.status,
          kycStatus: tenant.kycStatus,
        },
      }, 'Account created successfully');
    } catch (err) {
      await t.rollback();
      next(err);
    }
  }
}
