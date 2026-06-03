import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface TenantAttributes {
  id: string;
  name: string;
  slug: string;
  plan: 'starter' | 'professional' | 'enterprise';
  status: 'active' | 'inactive' | 'suspended' | 'trial';
  domain?: string;
  logo?: string;
  primaryColor?: string;
  settings?: Record<string, unknown>;
  trialEndsAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

type TenantCreationAttributes = Optional<TenantAttributes, 'id' | 'createdAt' | 'updatedAt'>;

export class Tenant extends Model<TenantAttributes, TenantCreationAttributes> implements TenantAttributes {
  declare id: string;
  declare name: string;
  declare slug: string;
  declare plan: 'starter' | 'professional' | 'enterprise';
  declare status: 'active' | 'inactive' | 'suspended' | 'trial';
  declare domain?: string;
  declare logo?: string;
  declare primaryColor?: string;
  declare settings?: Record<string, unknown>;
  declare trialEndsAt?: Date;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Tenant.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: { len: [2, 100] },
    },
    slug: {
      type: DataTypes.STRING(60),
      allowNull: false,
      unique: true,
      validate: { is: /^[a-z0-9-]+$/ },
    },
    plan: {
      type: DataTypes.ENUM('starter', 'professional', 'enterprise'),
      defaultValue: 'starter',
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'suspended', 'trial'),
      defaultValue: 'trial',
    },
    domain: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true,
    },
    logo: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    primaryColor: {
      type: DataTypes.STRING(7),
      allowNull: true,
      defaultValue: '#007AFF',
    },
    settings: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {},
    },
    trialEndsAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'tenants',
    indexes: [
      { unique: true, fields: ['slug'] },
      { unique: true, fields: ['domain'] },
      { fields: ['status'] },
    ],
  },
);

export default Tenant;
