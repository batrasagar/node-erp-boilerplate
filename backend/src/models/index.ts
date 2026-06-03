import { Tenant } from './Tenant';
import { Company } from './Company';
import { Branch } from './Branch';
import { Department } from './Department';
import { User } from './User';
import { Role } from './Role';
import { Permission } from './Permission';
import { RolePermission } from './RolePermission';
import { UserRole } from './UserRole';
import { Menu } from './Menu';
import { Notification } from './Notification';
import { AuditLog } from './AuditLog';
import { File } from './File';
import { Setting } from './Setting';
import { KycSubmission } from './KycSubmission';

// Tenant associations
Tenant.hasMany(Company, { foreignKey: 'tenantId', as: 'companies' });
Tenant.hasMany(User, { foreignKey: 'tenantId', as: 'users' });
Tenant.hasMany(Role, { foreignKey: 'tenantId', as: 'roles' });
Tenant.hasMany(Setting, { foreignKey: 'tenantId', as: 'tenantSettings' });

// Company associations
Company.belongsTo(Tenant, { foreignKey: 'tenantId', as: 'tenant' });
Company.hasMany(Branch, { foreignKey: 'companyId', as: 'branches' });
Company.hasMany(Department, { foreignKey: 'companyId', as: 'departments' });
Company.hasMany(User, { foreignKey: 'companyId', as: 'users' });

// Branch associations
Branch.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });
Branch.belongsTo(Tenant, { foreignKey: 'tenantId', as: 'tenant' });
Branch.hasMany(Department, { foreignKey: 'branchId', as: 'departments' });
Branch.hasMany(User, { foreignKey: 'branchId', as: 'users' });

// Department associations
Department.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });
Department.belongsTo(Branch, { foreignKey: 'branchId', as: 'branch' });
Department.belongsTo(Department, { foreignKey: 'parentId', as: 'parent' });
Department.hasMany(Department, { foreignKey: 'parentId', as: 'children' });
Department.hasMany(User, { foreignKey: 'departmentId', as: 'users' });

// User associations
User.belongsTo(Tenant, { foreignKey: 'tenantId', as: 'tenant' });
User.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });
User.belongsTo(Branch, { foreignKey: 'branchId', as: 'branch' });
User.belongsTo(Department, { foreignKey: 'departmentId', as: 'department' });
User.belongsToMany(Role, { through: UserRole, foreignKey: 'userId', otherKey: 'roleId', as: 'roles' });

// Role associations
Role.belongsTo(Tenant, { foreignKey: 'tenantId', as: 'tenant' });
Role.belongsToMany(User, { through: UserRole, foreignKey: 'roleId', otherKey: 'userId', as: 'users' });
Role.belongsToMany(Permission, { through: RolePermission, foreignKey: 'roleId', otherKey: 'permissionId', as: 'permissions' });

// Permission associations
Permission.belongsToMany(Role, { through: RolePermission, foreignKey: 'permissionId', otherKey: 'roleId', as: 'roles' });

// Menu associations
Menu.belongsTo(Menu, { foreignKey: 'parentId', as: 'parent' });
Menu.hasMany(Menu, { foreignKey: 'parentId', as: 'children' });

// Notification associations
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Notification.belongsTo(Tenant, { foreignKey: 'tenantId', as: 'tenant' });

// AuditLog associations
AuditLog.belongsTo(User, { foreignKey: 'userId', as: 'user' });
AuditLog.belongsTo(Tenant, { foreignKey: 'tenantId', as: 'tenant' });

// File associations
File.belongsTo(User, { foreignKey: 'uploadedBy', as: 'uploader' });
File.belongsTo(Tenant, { foreignKey: 'tenantId', as: 'tenant' });

// KYC associations
Tenant.hasOne(KycSubmission, { foreignKey: 'tenantId', as: 'kycSubmission' });
KycSubmission.belongsTo(Tenant, { foreignKey: 'tenantId', as: 'tenant' });

export {
  Tenant, Company, Branch, Department, User, Role, Permission,
  RolePermission, UserRole, Menu, Notification, AuditLog, File, Setting, KycSubmission,
};
