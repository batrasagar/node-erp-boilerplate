import { Router } from 'express';
import { MenuController } from '../controllers/menu.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/rbac.middleware';

const router = Router();
router.use(authenticate);

router.get('/', MenuController.index);
router.post('/', authorize('menus.create'), MenuController.store);
router.put('/:id', authorize('menus.update'), MenuController.update);
router.delete('/:id', authorize('menus.delete'), MenuController.destroy);

export default router;
