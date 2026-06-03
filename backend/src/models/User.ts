import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface UserAttributes {
  id: string;
  tenantId: string;
  companyId?: string;
  branchId?: string;
  departmentId?: string;
  employeeId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'suspended';
  emailVerified: boolean;
  emailVerificationToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  lastLogin?: Date;
  fcmToken?: string;
  refreshTokenHash?: string;
  isSuperAdmin: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

type UserCreationAttributes = Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt'>;

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  declare id: string;
  declare tenantId: string;
  declare companyId?: string;
  declare branchId?: string;
  declare departmentId?: string;
  declare employeeId?: string;
  declare firstName: string;
  declare lastName: string;
  declare email: string;
  declare phone?: string;
  declare password: string;
  declare avatar?: string;
  declare status: 'active' | 'inactive' | 'suspended';
  declare emailVerified: boolean;
  declare emailVerificationToken?: string;
  declare passwordResetToken?: string;
  declare passwordResetExpires?: Date;
  declare lastLogin?: Date;
  declare fcmToken?: string;
  declare refreshTokenHash?: string;
  declare isSuperAdmin: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}

User.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    tenantId: { type: DataTypes.UUID, allowNull: false },
    companyId: { type: DataTypes.UUID, allowNull: true },
    branchId: { type: DataTypes.UUID, allowNull: true },
    departmentId: { type: DataTypes.UUID, allowNull: true },
    employeeId: { type: DataTypes.STRING(50), allowNull: true },
    firstName: { type: DataTypes.STRING(100), allowNull: false },
    lastName: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(255), allowNull: false },
    phone: { type: DataTypes.STRING(20), allowNull: true },
    password: { type: DataTypes.STRING(255), allowNull: false },
    avatar: { type: DataTypes.STRING(500), allowNull: true },
    status: { type: DataTypes.ENUM('active', 'inactive', 'suspended'), defaultValue: 'active' },
    emailVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
    emailVerificationToken: { type: DataTypes.STRING(255), allowNull: true },
    passwordResetToken: { type: DataTypes.STRING(255), allowNull: true },
    passwordResetExpires: { type: DataTypes.DATE, allowNull: true },
    lastLogin: { type: DataTypes.DATE, allowNull: true },
    fcmToken: { type: DataTypes.TEXT, allowNull: true },
    refreshTokenHash: { type: DataTypes.STRING(255), allowNull: true },
    isSuperAdmin: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  {
    sequelize,
    tableName: 'users',
    indexes: [
      { unique: true, fields: ['tenantId', 'email'] },
      { fields: ['tenantId'] },
      { fields: ['status'] },
    ],
  },
);

export default User;
