import { Notification } from '../models/Notification';
import { User } from '../models/User';
import { FirebaseService } from './firebase.service';
import { EmailService } from './email.service';
import { WhatsAppService } from './whatsapp.service';
import logger from '../utils/logger.util';

export interface NotificationPayload {
  tenantId: string;
  userId: string;
  title: string;
  body: string;
  type?: 'info' | 'success' | 'warning' | 'error' | 'system';
  data?: Record<string, unknown>;
  channels?: Array<'in_app' | 'push' | 'email' | 'whatsapp'>;
  actionUrl?: string;
}

export class NotificationService {
  static async send(payload: NotificationPayload): Promise<void> {
    const channels = payload.channels || ['in_app'];

    await Notification.create({
      tenantId: payload.tenantId,
      userId: payload.userId,
      title: payload.title,
      body: payload.body,
      type: payload.type || 'info',
      data: payload.data,
      channel: 'in_app',
      actionUrl: payload.actionUrl,
      isRead: false,
    });

    if (channels.includes('push') || channels.includes('email') || channels.includes('whatsapp')) {
      const user = await User.findByPk(payload.userId, { attributes: ['email', 'phone', 'fcmToken'] });
      if (!user) return;

      if (channels.includes('push') && user.fcmToken) {
        await FirebaseService.sendPushNotification(
          user.fcmToken,
          payload.title,
          payload.body,
          payload.data ? Object.fromEntries(
            Object.entries(payload.data).map(([k, v]) => [k, String(v)])
          ) : undefined,
        );
      }

      if (channels.includes('email')) {
        await EmailService.send(user.email, payload.title, `<p>${payload.body}</p>`);
      }

      if (channels.includes('whatsapp') && user.phone) {
        await WhatsAppService.sendMessage(user.phone, `${payload.title}\n\n${payload.body}`);
      }
    }
  }

  static async sendBulk(tenantId: string, userIds: string[], title: string, body: string): Promise<void> {
    const notifications = userIds.map((userId) => ({
      tenantId,
      userId,
      title,
      body,
      type: 'info' as const,
      channel: 'in_app' as const,
      isRead: false,
    }));

    await Notification.bulkCreate(notifications);

    const users = await User.findAll({
      where: { id: userIds },
      attributes: ['id', 'fcmToken'],
    });

    const tokens = users.filter((u) => u.fcmToken).map((u) => u.fcmToken as string);
    if (tokens.length > 0) {
      const result = await FirebaseService.sendMulticast(tokens, title, body);
      logger.info(`Bulk push: ${result.successCount} sent, ${result.failureCount} failed`);
    }
  }
}
