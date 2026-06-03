import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface BranchAttributes {
  id: string;
  tenantId: string;
  companyId: string;
  name: string;
  code: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  phone?: string;
  email?: string;
  isHeadquarters: boolean;
  status: 'active' | 'inactive';
  createdAt?: Date;
  updatedAt?: Date;
}

type BranchCreationAttributes = Optional<BranchAttributes, 'id' | 'createdAt' | 'updatedAt'>;

export class Branch extends Model<BranchAttributes, BranchCreationAttributes> implements BranchAttributes {
  declare id: string;
  declare tenantId: string;
  declare companyId: string;
  declare name: string;
  declare code: string;
  declare address?: string;
  declare city?: string;
  declare state?: string;
  declare country?: string;
  declare phone?: string;
  declare email?: string;
  declare isHeadquarters: boolean;
  declare status: 'active' | 'inactive';
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Branch.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    tenantId: { type: DataTypes.UUID, allowNull: false },
    companyId: { type: DataTypes.UUID, allowNull: false },
    name: { type: DataTypes.STRING(150), allowNull: false },
    code: { type: DataTypes.STRING(20), allowNull: false },
    address: { type: DataTypes.TEXT, allowNull: true },
    city: { type: DataTypes.STRING(100), allowNull: true },
    state: { type: DataTypes.STRING(100), allowNull: true },
    country: { type: DataTypes.STRING(100), allowNull: true },
    phone: { type: DataTypes.STRING(20), allowNull: true },
    email: { type: DataTypes.STRING(255), allowNull: true },
    isHeadquarters: { type: DataTypes.BOOLEAN, defaultValue: false },
    status: { type: DataTypes.ENUM('active', 'inactive'), defaultValue: 'active' },
  },
  {
    sequelize,
    tableName: 'branches',
    indexes: [
      { fields: ['tenantId'] },
      { fields: ['companyId'] },
      { unique: true, fields: ['tenantId', 'companyId', 'code'] },
    ],
  },
);

export default Branch;
