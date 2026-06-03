import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface DepartmentAttributes {
  id: string;
  tenantId: string;
  companyId: string;
  branchId?: string;
  name: string;
  code: string;
  description?: string;
  parentId?: string;
  headUserId?: string;
  status: 'active' | 'inactive';
  createdAt?: Date;
  updatedAt?: Date;
}

type DepartmentCreationAttributes = Optional<DepartmentAttributes, 'id' | 'createdAt' | 'updatedAt'>;

export class Department extends Model<DepartmentAttributes, DepartmentCreationAttributes> implements DepartmentAttributes {
  declare id: string;
  declare tenantId: string;
  declare companyId: string;
  declare branchId?: string;
  declare name: string;
  declare code: string;
  declare description?: string;
  declare parentId?: string;
  declare headUserId?: string;
  declare status: 'active' | 'inactive';
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Department.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    tenantId: { type: DataTypes.UUID, allowNull: false },
    companyId: { type: DataTypes.UUID, allowNull: false },
    branchId: { type: DataTypes.UUID, allowNull: true },
    name: { type: DataTypes.STRING(150), allowNull: false },
    code: { type: DataTypes.STRING(20), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    parentId: { type: DataTypes.UUID, allowNull: true },
    headUserId: { type: DataTypes.UUID, allowNull: true },
    status: { type: DataTypes.ENUM('active', 'inactive'), defaultValue: 'active' },
  },
  {
    sequelize,
    tableName: 'departments',
    indexes: [
      { fields: ['tenantId'] },
      { fields: ['companyId'] },
      { fields: ['branchId'] },
      { fields: ['parentId'] },
      { unique: true, fields: ['tenantId', 'companyId', 'code'] },
    ],
  },
);

export default Department;
