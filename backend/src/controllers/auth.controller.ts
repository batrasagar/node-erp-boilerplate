import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { sendSuccess, sendCreated, sendError } from '../utils/response.util';

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const tenantId = req.tenantId!;
      const result = await AuthService.login(email, password, tenantId);
      sendSuccess(res, result, 'Login successful');
    } catch (err) { next(err); }
  }

  static async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId, tenantId, refreshToken } = req.body;
      const result = await AuthService.refresh(userId, tenantId, refreshToken);
      sendSuccess(res, result, 'Token refreshed');
    } catch (err) { next(err); }
  }

  static async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await AuthService.logout(req.user!.id, req.user!.tenantId);
      sendSuccess(res, null, 'Logged out successfully');
    } catch (err) { next(err); }
  }

  static async me(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { User, Role, Permission } = await import('../models');
      const user = await User.findOne({
        where: { id: req.user!.id },
        attributes: { exclude: ['password', 'refreshTokenHash', 'emailVerificationToken', 'passwordResetToken'] },
        include: [{
          model: Role,
          as: 'roles',
          include: [{ model: Permission, as: 'permissions' }],
        }],
      });
      sendSuccess(res, user, 'Profile retrieved');
    } catch (err) { next(err); }
  }

  static async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await AuthService.forgotPassword(req.body.email, req.tenantId!);
      sendSuccess(res, null, 'If the email exists, a reset link has been sent');
    } catch (err) { next(err); }
  }

  static async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token, password } = req.body;
      await AuthService.resetPassword(token, req.tenantId!, password);
      sendSuccess(res, null, 'Password reset successfully');
    } catch (err) { next(err); }
  }

  static async verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await AuthService.verifyEmail(req.body.token, req.tenantId!);
      sendSuccess(res, null, 'Email verified successfully');
    } catch (err) { next(err); }
  }

  static async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { currentPassword, newPassword } = req.body;
      await AuthService.changePassword(req.user!.id, req.user!.tenantId, currentPassword, newPassword);
      sendSuccess(res, null, 'Password changed successfully');
    } catch (err) { next(err); }
  }

  static async updateFcmToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { User } = await import('../models');
      await User.update({ fcmToken: req.body.fcmToken }, { where: { id: req.user!.id } });
      sendSuccess(res, null, 'FCM token updated');
    } catch (err) { next(err); }
  }
}
