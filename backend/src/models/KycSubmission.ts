import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface KycSubmissionAttributes {
  id: string;
  tenantId: string;
  businessName: string;
  businessType: 'sole_proprietor' | 'partnership' | 'llc' | 'corporation' | 'ngo' | 'other';
  registrationNumber?: string;
  taxNumber?: string;
  address: string;
  city: string;
  state?: string;
  country: string;
  postalCode?: string;
  phone: string;
  website?: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  rejectionReason?: string;
  reviewedBy?: string;
  reviewedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

type KycCreationAttributes = Optional<KycSubmissionAttributes, 'id' | 'status' | 'createdAt' | 'updatedAt'>;

export class KycSubmission extends Model<KycSubmissionAttributes, KycCreationAttributes> implements KycSubmissionAttributes {
  declare id: string;
  declare tenantId: string;
  declare businessName: string;
  declare businessType: 'sole_proprietor' | 'partnership' | 'llc' | 'corporation' | 'ngo' | 'other';
  declare registrationNumber?: string;
  declare taxNumber?: string;
  declare address: string;
  declare city: string;
  declare state?: string;
  declare country: string;
  declare postalCode?: string;
  declare phone: string;
  declare website?: string;
  declare status: 'pending' | 'under_review' | 'approved' | 'rejected';
  declare rejectionReason?: string;
  declare reviewedBy?: string;
  declare reviewedAt?: Date;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

KycSubmission.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    tenantId: { type: DataTypes.UUID, allowNull: false, unique: true },
    businessName: { type: DataTypes.STRING(150), allowNull: false },
    businessType: {
      type: DataTypes.ENUM('sole_proprietor', 'partnership', 'llc', 'corporation', 'ngo', 'other'),
      allowNull: false,
    },
    registrationNumber: { type: DataTypes.STRING(100), allowNull: true },
    taxNumber: { type: DataTypes.STRING(100), allowNull: true },
    address: { type: DataTypes.TEXT, allowNull: false },
    city: { type: DataTypes.STRING(100), allowNull: false },
    state: { type: DataTypes.STRING(100), allowNull: true },
    country: { type: DataTypes.STRING(100), allowNull: false },
    postalCode: { type: DataTypes.STRING(20), allowNull: true },
    phone: { type: DataTypes.STRING(20), allowNull: false },
    website: { type: DataTypes.STRING(255), allowNull: true },
    status: {
      type: DataTypes.ENUM('pending', 'under_review', 'approved', 'rejected'),
      defaultValue: 'pending',
    },
    rejectionReason: { type: DataTypes.TEXT, allowNull: true },
    reviewedBy: { type: DataTypes.UUID, allowNull: true },
    reviewedAt: { type: DataTypes.DATE, allowNull: true },
  },
  {
    sequelize,
    tableName: 'kyc_submissions',
    indexes: [{ fields: ['tenantId'] }, { fields: ['status'] }],
  },
);

export default KycSubmission;
