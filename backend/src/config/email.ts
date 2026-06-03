import nodemailer from 'nodemailer';
import logger from '../utils/logger.util';

let transporter: nodemailer.Transporter | null = null;

export const createEmailTransporter = (): nodemailer.Transporter => {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
  });

  transporter.verify((error) => {
    if (error) {
      logger.error('Email transporter verification failed:', error);
    } else {
      logger.info('Email transporter ready');
    }
  });

  return transporter;
};

export const getEmailConfig = () => ({
  from: `"${process.env.EMAIL_FROM_NAME || 'ERP System'}" <${process.env.EMAIL_FROM || 'noreply@example.com'}>`,
});

export default createEmailTransporter;
