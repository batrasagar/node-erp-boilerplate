import { Router } from 'express';
import { RoleController } from '../controllers/role.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/rbac.middleware';

const router = Router();
router.use(authenticate);

router.get('/', authorize('roles.read'), RoleController.index);
router.get('/:id', authorize('roles.read'), RoleController.show);
router.post('/', authorize('roles.create'), RoleController.store);
router.put('/:id', authorize('roles.update'), RoleController.update);
router.delete('/:id', authorize('roles.delete'), RoleController.destroy);

export default router;
