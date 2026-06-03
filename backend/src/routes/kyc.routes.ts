import { Router } from 'express';
import { KycController } from '../controllers/kyc.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize, authorizeAny } from '../middleware/rbac.middleware';

const router = Router();

router.get('/status', authenticate, KycController.getStatus);
router.get('/pending-count', authenticate, authorizeAny('approvals.read', 'approvals.manage'), KycController.pendingCount);
router.post('/submit', authenticate, authorize('kyc.submit'), KycController.submit);
router.get('/', authenticate, authorizeAny('kyc.read', 'approvals.read'), KycController.list);
router.put('/:id/review', authenticate, authorize('kyc.review'), KycController.review);

export default router;
