import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/rbac.middleware';
import { auditLog } from '../middleware/audit.middleware';

const router = Router();
router.use(authenticate);

router.get('/', authorize('users.read'), UserController.index);
router.get('/:id', authorize('users.read'), UserController.show);
router.post('/', authorize('users.create'), auditLog({ action: 'create', resource: 'User' }), UserController.store);
router.put('/:id', authorize('users.update'), auditLog({ action: 'update', resource: 'User' }), UserController.update);
router.delete('/:id', authorize('users.delete'), UserController.destroy);
router.put('/:id/roles', authorize('users.update', 'roles.read'), UserController.assignRoles);
router.put('/:id/reset-password', authorize('users.update'), UserController.resetPassword);

export default router;
