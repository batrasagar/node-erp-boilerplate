import { Router } from 'express';
import { TenantController } from '../controllers/tenant.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize, superAdminOnly } from '../middleware/rbac.middleware';

const router = Router();
router.use(authenticate);

router.get('/', superAdminOnly, TenantController.index);
router.get('/:id', authorize('tenants.read'), TenantController.show);
router.post('/', superAdminOnly, TenantController.store);
router.put('/:id', authorize('tenants.update'), TenantController.update);
router.delete('/:id', superAdminOnly, TenantController.destroy);

export default router;
