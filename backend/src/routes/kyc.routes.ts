import { Router } from 'express';
import { KycController } from '../controllers/kyc.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/status', authenticate, KycController.getStatus);
router.get('/pending-count', authenticate, KycController.pendingCount);
router.post('/submit', authenticate, KycController.submit);
router.get('/', authenticate, KycController.list);
router.put('/:id/review', authenticate, KycController.review);

export default router;
