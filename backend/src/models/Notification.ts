import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface NotificationAttributes {
  id: string;
  tenantId: string;
  userId: string;
  title: string;
  body: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'system';
  data?: Record<string, unknown>;
  isRead: boolean;
  readAt?: Date;
  channel: 'in_app' | 'push' | 'email' | 'whatsapp';
  actionUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type NotificationCreationAttributes = Optional<NotificationAttributes, 'id' | 'createdAt' | 'updatedAt'>;

export class Notification extends Model<NotificationAttributes, NotificationCreationAttributes> implements NotificationAttributes {
  declare id: string;
  declare tenantId: string;
  declare userId: string;
  declare title: string;
  declare body: string;
  declare type: 'info' | 'success' | 'warning' | 'error' | 'system';
  declare data?: Record<string, unknown>;
  declare isRead: boolean;
  declare readAt?: Date;
  declare channel: 'in_app' | 'push' | 'email' | 'whatsapp';
  declare actionUrl?: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Notification.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    tenantId: { type: DataTypes.UUID, allowNull: false },
    userId: { type: DataTypes.UUID, allowNull: false },
    title: { type: DataTypes.STRING(255), allowNull: false },
    body: { type: DataTypes.TEXT, allowNull: false },
    type: { type: DataTypes.ENUM('info', 'success', 'warning', 'error', 'system'), defaultValue: 'info' },
    data: { type: DataTypes.JSON, allowNull: true },
    isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
    readAt: { type: DataTypes.DATE, allowNull: true },
    channel: { type: DataTypes.ENUM('in_app', 'push', 'email', 'whatsapp'), defaultValue: 'in_app' },
    actionUrl: { type: DataTypes.STRING(500), allowNull: true },
  },
  {
    sequelize,
    tableName: 'notifications',
    indexes: [
      { fields: ['tenantId', 'userId'] },
      { fields: ['isRead'] },
      { fields: ['createdAt'] },
    ],
  },
);

export default Notification;
