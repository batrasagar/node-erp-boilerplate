import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface SettingAttributes {
  id: string;
  tenantId: string;
  key: string;
  value?: string;
  type: 'string' | 'number' | 'boolean' | 'json';
  group: string;
  description?: string;
  isPublic: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

type SettingCreationAttributes = Optional<SettingAttributes, 'id' | 'createdAt' | 'updatedAt'>;

export class Setting extends Model<SettingAttributes, SettingCreationAttributes> implements SettingAttributes {
  declare id: string;
  declare tenantId: string;
  declare key: string;
  declare value?: string;
  declare type: 'string' | 'number' | 'boolean' | 'json';
  declare group: string;
  declare description?: string;
  declare isPublic: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  get parsedValue(): unknown {
    if (!this.value) return null;
    switch (this.type) {
      case 'number': return parseFloat(this.value);
      case 'boolean': return this.value === 'true';
      case 'json': return JSON.parse(this.value);
      default: return this.value;
    }
  }
}

Setting.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    tenantId: { type: DataTypes.UUID, allowNull: false },
    key: { type: DataTypes.STRING(100), allowNull: false },
    value: { type: DataTypes.TEXT, allowNull: true },
    type: { type: DataTypes.ENUM('string', 'number', 'boolean', 'json'), defaultValue: 'string' },
    group: { type: DataTypes.STRING(50), allowNull: false, defaultValue: 'general' },
    description: { type: DataTypes.STRING(255), allowNull: true },
    isPublic: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  {
    sequelize,
    tableName: 'settings',
    indexes: [
      { unique: true, fields: ['tenantId', 'key'] },
      { fields: ['group'] },
    ],
  },
);

export default Setting;
