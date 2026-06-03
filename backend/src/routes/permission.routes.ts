import { Router } from 'express';
import { PermissionController } from '../controllers/permission.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize, superAdminOnly } from '../middleware/rbac.middleware';

const router = Router();
router.use(authenticate);

router.get('/', authorize('permissions.read'), PermissionController.index);
router.post('/seed', superAdminOnly, PermissionController.seed);

export default router;
