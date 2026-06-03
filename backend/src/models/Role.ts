import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface RoleAttributes {
  id: string;
  tenantId: string;
  name: string;
  slug: string;
  description?: string;
  isSystem: boolean;
  status: 'active' | 'inactive';
  createdAt?: Date;
  updatedAt?: Date;
}

type RoleCreationAttributes = Optional<RoleAttributes, 'id' | 'createdAt' | 'updatedAt'>;

export class Role extends Model<RoleAttributes, RoleCreationAttributes> implements RoleAttributes {
  declare id: string;
  declare tenantId: string;
  declare name: string;
  declare slug: string;
  declare description?: string;
  declare isSystem: boolean;
  declare status: 'active' | 'inactive';
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Role.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    tenantId: { type: DataTypes.UUID, allowNull: false },
    name: { type: DataTypes.STRING(100), allowNull: false },
    slug: { type: DataTypes.STRING(100), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    isSystem: { type: DataTypes.BOOLEAN, defaultValue: false },
    status: { type: DataTypes.ENUM('active', 'inactive'), defaultValue: 'active' },
  },
  {
    sequelize,
    tableName: 'roles',
    indexes: [
      { fields: ['tenantId'] },
      { unique: true, fields: ['tenantId', 'slug'] },
    ],
  },
);

export default Role;
