import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/rbac.middleware';

const router = Router();
router.use(authenticate);

router.get('/stats', authorize('dashboard.read'), DashboardController.stats);
router.get('/activity', authorize('dashboard.read'), DashboardController.recentActivity);

export default router;
