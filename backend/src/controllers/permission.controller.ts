import { Request, Response, NextFunction } from 'express';
import { Permission } from '../models/Permission';
import { sendSuccess } from '../utils/response.util';

export class PermissionController {
  static async index(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const permissions = await Permission.findAll({ order: [['module', 'ASC'], ['action', 'ASC']] });

      const grouped = permissions.reduce((acc, perm) => {
        if (!acc[perm.module]) acc[perm.module] = [];
        acc[perm.module].push(perm);
        return acc;
      }, {} as Record<string, Permission[]>);

      sendSuccess(res, { permissions, grouped });
    } catch (err) { next(err); }
  }

  static async seed(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const permissionDefs = [
        { module: 'tenants', action: 'create', resource: 'Tenant', description: 'Create tenants' },
        { module: 'tenants', action: 'read', resource: 'Tenant', description: 'View tenants' },
        { module: 'tenants', action: 'update', resource: 'Tenant', description: 'Update tenants' },
        { module: 'tenants', action: 'delete', resource: 'Tenant', description: 'Delete tenants' },
        { module: 'companies', action: 'create', resource: 'Company', description: 'Create companies' },
        { module: 'companies', action: 'read', resource: 'Company', description: 'View companies' },
        { module: 'companies', action: 'update', resource: 'Company', description: 'Update companies' },
        { module: 'companies', action: 'delete', resource: 'Company', description: 'Delete companies' },
        { module: 'branches', action: 'create', resource: 'Branch', description: 'Create branches' },
        { module: 'branches', action: 'read', resource: 'Branch', description: 'View branches' },
        { module: 'branches', action: 'update', resource: 'Branch', description: 'Update branches' },
        { module: 'branches', action: 'delete', resource: 'Branch', description: 'Delete branches' },
        { module: 'departments', action: 'create', resource: 'Department', description: 'Create departments' },
        { module: 'departments', action: 'read', resource: 'Department', description: 'View departments' },
        { module: 'departments', action: 'update', resource: 'Department', description: 'Update departments' },
        { module: 'departments', action: 'delete', resource: 'Department', description: 'Delete departments' },
        { module: 'users', action: 'create', resource: 'User', description: 'Create users' },
        { module: 'users', action: 'read', resource: 'User', description: 'View users' },
        { module: 'users', action: 'update', resource: 'User', description: 'Update users' },
        { module: 'users', action: 'delete', resource: 'User', description: 'Delete users' },
        { module: 'roles', action: 'create', resource: 'Role', description: 'Create roles' },
        { module: 'roles', action: 'read', resource: 'Role', description: 'View roles' },
        { module: 'roles', action: 'update', resource: 'Role', description: 'Update roles' },
        { module: 'roles', action: 'delete', resource: 'Role', description: 'Delete roles' },
        { module: 'permissions', action: 'read', resource: 'Permission', description: 'View permissions' },
        { module: 'permissions', action: 'assign', resource: 'Permission', description: 'Assign permissions' },
        { module: 'menus', action: 'create', resource: 'Menu', description: 'Create menus' },
        { module: 'menus', action: 'read', resource: 'Menu', description: 'View menus' },
        { module: 'menus', action: 'update', resource: 'Menu', description: 'Update menus' },
        { module: 'menus', action: 'delete', resource: 'Menu', description: 'Delete menus' },
        { module: 'notifications', action: 'read', resource: 'Notification', description: 'View notifications' },
        { module: 'notifications', action: 'send', resource: 'Notification', description: 'Send notifications' },
        { module: 'audit_logs', action: 'read', resource: 'AuditLog', description: 'View audit logs' },
        { module: 'files', action: 'create', resource: 'File', description: 'Upload files' },
        { module: 'files', action: 'read', resource: 'File', description: 'View files' },
        { module: 'files', action: 'delete', resource: 'File', description: 'Delete files' },
        { module: 'settings', action: 'read', resource: 'Setting', description: 'View settings' },
        { module: 'settings', action: 'update', resource: 'Setting', description: 'Update settings' },
        { module: 'dashboard', action: 'read', resource: 'Dashboard', description: 'View dashboard' },
        { module: 'kyc', action: 'read', resource: 'KycSubmission', description: 'View KYC submissions' },
        { module: 'kyc', action: 'submit', resource: 'KycSubmission', description: 'Submit KYC' },
        { module: 'kyc', action: 'review', resource: 'KycSubmission', description: 'Review and approve KYC' },
        { module: 'approvals', action: 'read', resource: 'Approval', description: 'View approvals queue' },
        { module: 'approvals', action: 'manage', resource: 'Approval', description: 'Process approvals' },
      ];

      await Permission.bulkCreate(permissionDefs, { ignoreDuplicates: true });
      const permissions = await Permission.findAll();
      sendSuccess(res, permissions, 'Permissions seeded');
    } catch (err) { next(err); }
  }
}
