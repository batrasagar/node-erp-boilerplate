import { Router } from 'express';
import { FileController } from '../controllers/file.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/rbac.middleware';
import { uploadSingle, uploadMultiple } from '../middleware/upload.middleware';
import { uploadRateLimiter } from '../middleware/rateLimiter.middleware';

const router = Router();
router.use(authenticate);

router.get('/', authorize('files.read'), FileController.index);
router.post('/upload', uploadRateLimiter, authorize('files.create'), uploadSingle, FileController.upload);
router.delete('/:id', authorize('files.delete'), FileController.destroy);

export default router;
