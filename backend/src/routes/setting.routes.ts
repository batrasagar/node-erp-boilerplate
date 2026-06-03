import { Router } from 'express';
import { SettingController } from '../controllers/setting.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/rbac.middleware';

const router = Router();
router.use(authenticate);

router.get('/', authorize('settings.read'), SettingController.index);
router.get('/:key', authorize('settings.read'), SettingController.get);
router.put('/', authorize('settings.update'), SettingController.update);

export default router;
