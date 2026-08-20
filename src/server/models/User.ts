import mongoose, { Schema, Document } from 'mongoose';
import { User as IUserType } from '../../types';

export interface IUserDocument extends Omit<IUserType, 'id'>, Document {
  id: string;
}

const UserSchema = new Schema<IUserDocument>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    role: { type: String, enum: ['ADMIN', 'MANAGER', 'STAFF', 'CUSTOMER'], default: 'CUSTOMER' },
    avatar: { type: String },
    isVerified: { type: Boolean, default: true },
    points: { type: Number, default: 0 },
    loyaltyTier: { type: String, enum: ['BRONZE', 'SILVER', 'GOLD', 'DIAMOND'], default: 'BRONZE' },
    createdAt: { type: String, default: () => new Date().toISOString() },
    lastLogin: { type: String }
  },
  {
    timestamps: true,
    toJSON: {
      transform(_, ret) {
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

export const UserModel = mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema);
