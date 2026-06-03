import { Router } from 'express';
import { BranchController } from '../controllers/branch.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/rbac.middleware';

const router = Router();
router.use(authenticate);

router.get('/', authorize('branches.read'), BranchController.index);
router.get('/:id', authorize('branches.read'), BranchController.show);
router.post('/', authorize('branches.create'), BranchController.store);
router.put('/:id', authorize('branches.update'), BranchController.update);
router.delete('/:id', authorize('branches.delete'), BranchController.destroy);

export default router;
