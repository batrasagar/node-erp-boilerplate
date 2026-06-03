import axios from 'axios';
import { whatsappConfig, isWhatsAppConfigured } from '../config/whatsapp';
import logger from '../utils/logger.util';

export class WhatsAppService {
  static async sendMessage(to: string, message: string): Promise<boolean> {
    if (!isWhatsAppConfigured()) {
      logger.warn('WhatsApp not configured');
      return false;
    }

    try {
      const phone = to.replace(/\D/g, '');
      await axios.post(
        `${whatsappConfig.apiUrl}/${whatsappConfig.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: phone,
          type: 'text',
          text: { body: message },
        },
        {
          headers: {
            Authorization: `Bearer ${whatsappConfig.accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );
      return true;
    } catch (error) {
      logger.error('WhatsApp message failed:', error);
      return false;
    }
  }

  static async sendTemplateMessage(
    to: string,
    templateName: string,
    languageCode = 'en',
    components?: object[],
  ): Promise<boolean> {
    if (!isWhatsAppConfigured()) return false;

    try {
      const phone = to.replace(/\D/g, '');
      await axios.post(
        `${whatsappConfig.apiUrl}/${whatsappConfig.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          to: phone,
          type: 'template',
          template: {
            name: templateName,
            language: { code: languageCode },
            components,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${whatsappConfig.accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );
      return true;
    } catch (error) {
      logger.error('WhatsApp template message failed:', error);
      return false;
    }
  }

  static verifyWebhook(mode: string, token: string, challenge: string): string | null {
    if (mode === 'subscribe' && token === whatsappConfig.webhookVerifyToken) {
      return challenge;
    }
    return null;
  }
}
