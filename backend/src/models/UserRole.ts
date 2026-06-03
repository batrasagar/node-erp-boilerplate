import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export class UserRole extends Model {
  declare userId: string;
  declare roleId: string;
  declare assignedBy?: string;
  declare assignedAt: Date;
}

UserRole.init(
  {
    userId: { type: DataTypes.UUID, allowNull: false, primaryKey: true },
    roleId: { type: DataTypes.UUID, allowNull: false, primaryKey: true },
    assignedBy: { type: DataTypes.UUID, allowNull: true },
    assignedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    sequelize,
    tableName: 'user_roles',
    timestamps: false,
  },
);

export default UserRole;
