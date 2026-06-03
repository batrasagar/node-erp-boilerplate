import { getMessaging } from '../config/firebase';
import logger from '../utils/logger.util';

export class FirebaseService {
  static async sendPushNotification(
    fcmToken: string,
    title: string,
    body: string,
    data?: Record<string, string>,
  ): Promise<boolean> {
    const messaging = getMessaging();
    if (!messaging) {
      logger.warn('Firebase not configured, skipping push notification');
      return false;
    }

    try {
      await messaging.send({
        token: fcmToken,
        notification: { title, body },
        data,
        apns: {
          payload: {
            aps: {
              alert: { title, body },
              badge: 1,
              sound: 'default',
            },
          },
        },
        android: {
          notification: {
            title,
            body,
            sound: 'default',
          },
        },
      });
      return true;
    } catch (error) {
      logger.error('Push notification failed:', error);
      return false;
    }
  }

  static async sendMulticast(
    tokens: string[],
    title: string,
    body: string,
    data?: Record<string, string>,
  ): Promise<{ successCount: number; failureCount: number }> {
    const messaging = getMessaging();
    if (!messaging || tokens.length === 0) {
      return { successCount: 0, failureCount: tokens.length };
    }

    try {
      const response = await messaging.sendEachForMulticast({
        tokens,
        notification: { title, body },
        data,
      });
      return {
        successCount: response.successCount,
        failureCount: response.failureCount,
      };
    } catch (error) {
      logger.error('Multicast push notification failed:', error);
      return { successCount: 0, failureCount: tokens.length };
    }
  }
}
