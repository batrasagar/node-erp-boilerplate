import { User } from '../models/User';
import { hashPassword, comparePassword, generateTempPassword } from '../utils/password.util';
import {
  generateAccessToken, generateRefreshToken, storeRefreshToken,
  getStoredRefreshToken, revokeRefreshToken, generateEmailVerificationToken,
  generatePasswordResetToken,
} from '../utils/jwt.util';
import { AppError } from '../middleware/errorHandler.middleware';
import { EmailService } from './email.service';
import { deleteCachePattern } from '../config/redis';

export class AuthService {
  static async login(email: string, password: string, tenantId: string) {
    const user = await User.findOne({ where: { email, tenantId } });
    if (!user) throw new AppError('Invalid credentials', 401);
    if (user.status !== 'active') throw new AppError(`Account is ${user.status}`, 403);

    const valid = await comparePassword(password, user.password);
    if (!valid) throw new AppError('Invalid credentials', 401);

    const accessToken = generateAccessToken({
      userId: user.id,
      tenantId: user.tenantId,
      email: user.email,
      isSuperAdmin: user.isSuperAdmin,
    });
    const refreshToken = generateRefreshToken();

    await storeRefreshToken(user.id, user.tenantId, refreshToken);
    await user.update({ lastLogin: new Date() });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        avatar: user.avatar,
        tenantId: user.tenantId,
        isSuperAdmin: user.isSuperAdmin,
      },
    };
  }

  static async refresh(userId: string, tenantId: string, refreshToken: string) {
    const storedToken = await getStoredRefreshToken(userId, tenantId);
    if (!storedToken || storedToken !== refreshToken) {
      throw new AppError('Invalid refresh token', 401);
    }

    const user = await User.findOne({ where: { id: userId, tenantId, status: 'active' } });
    if (!user) throw new AppError('User not found', 401);

    const newAccessToken = generateAccessToken({
      userId: user.id,
      tenantId: user.tenantId,
      email: user.email,
      isSuperAdmin: user.isSuperAdmin,
    });
    const newRefreshToken = generateRefreshToken();

    await storeRefreshToken(user.id, user.tenantId, newRefreshToken);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  static async logout(userId: string, tenantId: string) {
    await revokeRefreshToken(userId, tenantId);
    await deleteCachePattern(`user_permissions:${userId}:${tenantId}`);
  }

  static async forgotPassword(email: string, tenantId: string) {
    const user = await User.findOne({ where: { email, tenantId } });
    if (!user) return;

    const resetToken = generatePasswordResetToken();
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    await user.update({ passwordResetToken: resetToken, passwordResetExpires: expires });
    await EmailService.sendPasswordReset(user.email, user.firstName, resetToken);
  }

  static async resetPassword(token: string, tenantId: string, newPassword: string) {
    const user = await User.findOne({
      where: { passwordResetToken: token, tenantId },
    });

    if (!user || !user.passwordResetExpires || user.passwordResetExpires < new Date()) {
      throw new AppError('Invalid or expired reset token', 400);
    }

    const hashedPassword = await hashPassword(newPassword);
    await user.update({
      password: hashedPassword,
      passwordResetToken: undefined,
      passwordResetExpires: undefined,
    });
    await revokeRefreshToken(user.id, user.tenantId);
  }

  static async verifyEmail(token: string, tenantId: string) {
    const user = await User.findOne({ where: { emailVerificationToken: token, tenantId } });
    if (!user) throw new AppError('Invalid verification token', 400);

    await user.update({ emailVerified: true, emailVerificationToken: undefined });
  }

  static async changePassword(userId: string, tenantId: string, currentPassword: string, newPassword: string) {
    const user = await User.findOne({ where: { id: userId, tenantId } });
    if (!user) throw new AppError('User not found', 404);

    const valid = await comparePassword(currentPassword, user.password);
    if (!valid) throw new AppError('Current password is incorrect', 400);

    const hashedPassword = await hashPassword(newPassword);
    await user.update({ password: hashedPassword });
    await revokeRefreshToken(user.id, user.tenantId);
  }
}
