import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
router.use(authenticate);

router.get('/', NotificationController.index);
router.get('/unread-count', NotificationController.unreadCount);
router.put('/mark-all-read', NotificationController.markAllRead);
router.put('/:id/read', NotificationController.markRead);
router.delete('/:id', NotificationController.destroy);

export default router;
