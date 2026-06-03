import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export class RolePermission extends Model {
  declare roleId: string;
  declare permissionId: string;
}

RolePermission.init(
  {
    roleId: { type: DataTypes.UUID, allowNull: false, primaryKey: true },
    permissionId: { type: DataTypes.UUID, allowNull: false, primaryKey: true },
  },
  {
    sequelize,
    tableName: 'role_permissions',
    timestamps: false,
  },
);

export default RolePermission;
