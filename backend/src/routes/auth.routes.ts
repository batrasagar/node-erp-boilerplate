import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authRateLimiter } from '../middleware/rateLimiter.middleware';

const router = Router();

router.post('/login', authRateLimiter, AuthController.login);
router.post('/refresh', AuthController.refresh);
router.post('/forgot-password', authRateLimiter, AuthController.forgotPassword);
router.post('/reset-password', AuthController.resetPassword);
router.post('/verify-email', AuthController.verifyEmail);

router.use(authenticate);
router.post('/logout', AuthController.logout);
router.get('/me', AuthController.me);
router.put('/change-password', AuthController.changePassword);
router.put('/fcm-token', AuthController.updateFcmToken);

export default router;
