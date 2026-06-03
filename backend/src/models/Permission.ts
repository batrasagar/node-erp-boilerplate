import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface PermissionAttributes {
  id: string;
  module: string;
  action: string;
  resource: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type PermissionCreationAttributes = Optional<PermissionAttributes, 'id' | 'createdAt' | 'updatedAt'>;

export class Permission extends Model<PermissionAttributes, PermissionCreationAttributes> implements PermissionAttributes {
  declare id: string;
  declare module: string;
  declare action: string;
  declare resource: string;
  declare description?: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  get key(): string {
    return `${this.module}.${this.action}`;
  }
}

Permission.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    module: { type: DataTypes.STRING(50), allowNull: false },
    action: { type: DataTypes.STRING(50), allowNull: false },
    resource: { type: DataTypes.STRING(100), allowNull: false },
    description: { type: DataTypes.STRING(255), allowNull: true },
  },
  {
    sequelize,
    tableName: 'permissions',
    indexes: [
      { unique: true, fields: ['module', 'action'] },
      { fields: ['module'] },
    ],
  },
);

export const PERMISSIONS = {
  TENANTS: { CREATE: 'tenants.create', READ: 'tenants.read', UPDATE: 'tenants.update', DELETE: 'tenants.delete' },
  COMPANIES: { CREATE: 'companies.create', READ: 'companies.read', UPDATE: 'companies.update', DELETE: 'companies.delete' },
  BRANCHES: { CREATE: 'branches.create', READ: 'branches.read', UPDATE: 'branches.update', DELETE: 'branches.delete' },
  DEPARTMENTS: { CREATE: 'departments.create', READ: 'departments.read', UPDATE: 'departments.update', DELETE: 'departments.delete' },
  USERS: { CREATE: 'users.create', READ: 'users.read', UPDATE: 'users.update', DELETE: 'users.delete' },
  ROLES: { CREATE: 'roles.create', READ: 'roles.read', UPDATE: 'roles.update', DELETE: 'roles.delete' },
  PERMISSIONS: { READ: 'permissions.read', ASSIGN: 'permissions.assign' },
  MENUS: { CREATE: 'menus.create', READ: 'menus.read', UPDATE: 'menus.update', DELETE: 'menus.delete' },
  NOTIFICATIONS: { READ: 'notifications.read', SEND: 'notifications.send' },
  AUDIT_LOGS: { READ: 'audit_logs.read' },
  FILES: { CREATE: 'files.create', READ: 'files.read', DELETE: 'files.delete' },
  SETTINGS: { READ: 'settings.read', UPDATE: 'settings.update' },
  DASHBOARD: { READ: 'dashboard.read' },
} as const;

export default Permission;
