import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface CompanyAttributes {
  id: string;
  tenantId: string;
  name: string;
  code: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  phone?: string;
  email?: string;
  website?: string;
  logo?: string;
  taxNumber?: string;
  registrationNumber?: string;
  currency?: string;
  timezone?: string;
  status: 'active' | 'inactive';
  createdAt?: Date;
  updatedAt?: Date;
}

type CompanyCreationAttributes = Optional<CompanyAttributes, 'id' | 'createdAt' | 'updatedAt'>;

export class Company extends Model<CompanyAttributes, CompanyCreationAttributes> implements CompanyAttributes {
  declare id: string;
  declare tenantId: string;
  declare name: string;
  declare code: string;
  declare address?: string;
  declare city?: string;
  declare state?: string;
  declare country?: string;
  declare postalCode?: string;
  declare phone?: string;
  declare email?: string;
  declare website?: string;
  declare logo?: string;
  declare taxNumber?: string;
  declare registrationNumber?: string;
  declare currency?: string;
  declare timezone?: string;
  declare status: 'active' | 'inactive';
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Company.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    tenantId: { type: DataTypes.UUID, allowNull: false },
    name: { type: DataTypes.STRING(150), allowNull: false },
    code: { type: DataTypes.STRING(20), allowNull: false },
    address: { type: DataTypes.TEXT, allowNull: true },
    city: { type: DataTypes.STRING(100), allowNull: true },
    state: { type: DataTypes.STRING(100), allowNull: true },
    country: { type: DataTypes.STRING(100), allowNull: true },
    postalCode: { type: DataTypes.STRING(20), allowNull: true },
    phone: { type: DataTypes.STRING(20), allowNull: true },
    email: { type: DataTypes.STRING(255), allowNull: true },
    website: { type: DataTypes.STRING(255), allowNull: true },
    logo: { type: DataTypes.STRING(500), allowNull: true },
    taxNumber: { type: DataTypes.STRING(50), allowNull: true },
    registrationNumber: { type: DataTypes.STRING(50), allowNull: true },
    currency: { type: DataTypes.STRING(3), allowNull: true, defaultValue: 'USD' },
    timezone: { type: DataTypes.STRING(50), allowNull: true, defaultValue: 'UTC' },
    status: { type: DataTypes.ENUM('active', 'inactive'), defaultValue: 'active' },
  },
  {
    sequelize,
    tableName: 'companies',
    indexes: [
      { fields: ['tenantId'] },
      { unique: true, fields: ['tenantId', 'code'] },
    ],
  },
);

export default Company;
