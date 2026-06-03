import { Router } from 'express';
import { DepartmentController } from '../controllers/department.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/rbac.middleware';

const router = Router();
router.use(authenticate);

router.get('/', authorize('departments.read'), DepartmentController.index);
router.get('/:id', authorize('departments.read'), DepartmentController.show);
router.post('/', authorize('departments.create'), DepartmentController.store);
router.put('/:id', authorize('departments.update'), DepartmentController.update);
router.delete('/:id', authorize('departments.delete'), DepartmentController.destroy);

export default router;
