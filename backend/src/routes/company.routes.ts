import { Router } from 'express';
import { CompanyController } from '../controllers/company.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/rbac.middleware';
import { auditLog } from '../middleware/audit.middleware';

const router = Router();
router.use(authenticate);

router.get('/', authorize('companies.read'), CompanyController.index);
router.get('/:id', authorize('companies.read'), CompanyController.show);
router.post('/', authorize('companies.create'), auditLog({ action: 'create', resource: 'Company' }), CompanyController.store);
router.put('/:id', authorize('companies.update'), auditLog({ action: 'update', resource: 'Company' }), CompanyController.update);
router.delete('/:id', authorize('companies.delete'), CompanyController.destroy);

export default router;
