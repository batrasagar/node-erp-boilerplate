import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface FileAttributes {
  id: string;
  tenantId: string;
  uploadedBy: string;
  originalName: string;
  filename: string;
  path: string;
  url: string;
  mimeType: string;
  size: number;
  folder?: string;
  isPublic: boolean;
  metadata?: Record<string, unknown>;
  createdAt?: Date;
  updatedAt?: Date;
}

type FileCreationAttributes = Optional<FileAttributes, 'id' | 'createdAt' | 'updatedAt'>;

export class File extends Model<FileAttributes, FileCreationAttributes> implements FileAttributes {
  declare id: string;
  declare tenantId: string;
  declare uploadedBy: string;
  declare originalName: string;
  declare filename: string;
  declare path: string;
  declare url: string;
  declare mimeType: string;
  declare size: number;
  declare folder?: string;
  declare isPublic: boolean;
  declare metadata?: Record<string, unknown>;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

File.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    tenantId: { type: DataTypes.UUID, allowNull: false },
    uploadedBy: { type: DataTypes.UUID, allowNull: false },
    originalName: { type: DataTypes.STRING(255), allowNull: false },
    filename: { type: DataTypes.STRING(255), allowNull: false },
    path: { type: DataTypes.STRING(500), allowNull: false },
    url: { type: DataTypes.STRING(500), allowNull: false },
    mimeType: { type: DataTypes.STRING(100), allowNull: false },
    size: { type: DataTypes.BIGINT, allowNull: false },
    folder: { type: DataTypes.STRING(255), allowNull: true },
    isPublic: { type: DataTypes.BOOLEAN, defaultValue: false },
    metadata: { type: DataTypes.JSON, allowNull: true },
  },
  {
    sequelize,
    tableName: 'files',
    indexes: [
      { fields: ['tenantId'] },
      { fields: ['uploadedBy'] },
      { fields: ['folder'] },
    ],
  },
);

export default File;
