import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface MenuAttributes {
  id: string;
  tenantId?: string;
  name: string;
  icon?: string;
  path?: string;
  component?: string;
  parentId?: string;
  order: number;
  isVisible: boolean;
  isSystem: boolean;
  requiredPermission?: string;
  badge?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type MenuCreationAttributes = Optional<MenuAttributes, 'id' | 'createdAt' | 'updatedAt'>;

export class Menu extends Model<MenuAttributes, MenuCreationAttributes> implements MenuAttributes {
  declare id: string;
  declare tenantId?: string;
  declare name: string;
  declare icon?: string;
  declare path?: string;
  declare component?: string;
  declare parentId?: string;
  declare order: number;
  declare isVisible: boolean;
  declare isSystem: boolean;
  declare requiredPermission?: string;
  declare badge?: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Menu.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    tenantId: { type: DataTypes.UUID, allowNull: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    icon: { type: DataTypes.STRING(100), allowNull: true },
    path: { type: DataTypes.STRING(255), allowNull: true },
    component: { type: DataTypes.STRING(100), allowNull: true },
    parentId: { type: DataTypes.UUID, allowNull: true },
    order: { type: DataTypes.INTEGER, defaultValue: 0 },
    isVisible: { type: DataTypes.BOOLEAN, defaultValue: true },
    isSystem: { type: DataTypes.BOOLEAN, defaultValue: false },
    requiredPermission: { type: DataTypes.STRING(100), allowNull: true },
    badge: { type: DataTypes.STRING(50), allowNull: true },
  },
  {
    sequelize,
    tableName: 'menus',
    indexes: [
      { fields: ['tenantId'] },
      { fields: ['parentId'] },
      { fields: ['order'] },
    ],
  },
);

export default Menu;
