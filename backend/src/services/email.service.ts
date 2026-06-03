import { createEmailTransporter, getEmailConfig } from '../config/email';
import logger from '../utils/logger.util';

export class EmailService {
  static async send(to: string, subject: string, html: string): Promise<void> {
    try {
      const transporter = createEmailTransporter();
      const { from } = getEmailConfig();
      await transporter.sendMail({ from, to, subject, html });
      logger.info(`Email sent to ${to}: ${subject}`);
    } catch (error) {
      logger.error(`Failed to send email to ${to}:`, error);
    }
  }

  static async sendWelcome(email: string, firstName: string, verificationToken: string): Promise<void> {
    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    await this.send(email, 'Welcome to ERP System', `
      <h2>Welcome, ${firstName}!</h2>
      <p>Please verify your email to get started.</p>
      <a href="${verifyUrl}" style="background:#007AFF;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;">
        Verify Email
      </a>
    `);
  }

  static async sendPasswordReset(email: string, firstName: string, token: string): Promise<void> {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    await this.send(email, 'Password Reset Request', `
      <h2>Hi ${firstName},</h2>
      <p>You requested to reset your password. This link expires in 1 hour.</p>
      <a href="${resetUrl}" style="background:#007AFF;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;">
        Reset Password
      </a>
      <p>If you didn't request this, ignore this email.</p>
    `);
  }

  static async sendTempPassword(email: string, firstName: string, tempPassword: string): Promise<void> {
    await this.send(email, 'Your Account Credentials', `
      <h2>Hi ${firstName},</h2>
      <p>Your account has been created. Please change your password after logging in.</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Temporary Password:</strong> ${tempPassword}</p>
    `);
  }
}
