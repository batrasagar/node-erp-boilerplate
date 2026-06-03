import { Router } from 'express';
import { resolveTenant } from '../middleware/tenant.middleware';
import authRoutes from './auth.routes';
import tenantRoutes from './tenant.routes';
import companyRoutes from './company.routes';
import branchRoutes from './branch.routes';
import departmentRoutes from './department.routes';
import userRoutes from './user.routes';
import roleRoutes from './role.routes';
import permissionRoutes from './permission.routes';
import menuRoutes from './menu.routes';
import notificationRoutes from './notification.routes';
import auditLogRoutes from './auditLog.routes';
import fileRoutes from './file.routes';
import settingRoutes from './setting.routes';
import dashboardRoutes from './dashboard.routes';

const router = Router();

router.use(resolveTenant);

router.use('/auth', authRoutes);
router.use('/tenants', tenantRoutes);
router.use('/companies', companyRoutes);
router.use('/branches', branchRoutes);
router.use('/departments', departmentRoutes);
router.use('/users', userRoutes);
router.use('/roles', roleRoutes);
router.use('/permissions', permissionRoutes);
router.use('/menus', menuRoutes);
router.use('/notifications', notificationRoutes);
router.use('/audit-logs', auditLogRoutes);
router.use('/files', fileRoutes);
router.use('/settings', settingRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
