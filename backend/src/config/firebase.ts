import admin from 'firebase-admin';
import logger from '../utils/logger.util';

let firebaseApp: admin.app.App | null = null;

export const initializeFirebase = (): void => {
  if (firebaseApp) return;

  try {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !privateKey) {
      logger.warn('Firebase credentials not configured. FCM push notifications disabled.');
      return;
    }

    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey,
      }),
    });

    logger.info('Firebase initialized successfully');
  } catch (error) {
    logger.error('Firebase initialization failed:', error);
  }
};

export const getFirebaseApp = (): admin.app.App | null => firebaseApp;
export const getMessaging = (): admin.messaging.Messaging | null =>
  firebaseApp ? admin.messaging(firebaseApp) : null;
