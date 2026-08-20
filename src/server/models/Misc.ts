import mongoose, { Schema, Document } from 'mongoose';
import {
  Voucher as IVoucherType,
  Review as IReviewType,
  AuditLog as IAuditLogType,
  SystemNotification as ISystemNotificationType
} from '../../types';

export interface IVoucherDocument extends Omit<IVoucherType, 'id'>, Document { id: string; }
export interface IReviewDocument extends Omit<IReviewType, 'id'>, Document { id: string; }
export interface IAuditLogDocument extends Omit<IAuditLogType, 'id'>, Document { id: string; }
export interface ISystemNotificationDocument extends Omit<ISystemNotificationType, 'id'>, Document { id: string; }

// Voucher Schema
const VoucherSchema = new Schema<IVoucherDocument>(
  {
    id: { type: String, required: true, unique: true },
    code: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    discountType: { type: String, enum: ['PERCENTAGE', 'FIXED'], required: true },
    discountValue: { type: Number, required: true },
    minOrderValue: { type: Number, default: 0 },
    maxDiscount: { type: Number },
    usageLimit: { type: Number, default: 100 },
    usageCount: { type: Number, default: 0 },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    isFlashSale: { type: Boolean, default: false }
  },
  {
    timestamps: true,
    toJSON: { transform(_, ret) { delete ret._id; delete ret.__v; return ret; } }
  }
);

// Review Schema
const ReviewSchema = new Schema<IReviewDocument>(
  {
    id: { type: String, required: true, unique: true },
    productId: { type: String, required: true },
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    userAvatar: { type: String },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    images: { type: [String], default: [] },
    likes: { type: Number, default: 0 },
    likedBy: { type: [String], default: [] },
    isVerifiedPurchase: { type: Boolean, default: true },
    isReported: { type: Boolean, default: false },
    createdAt: { type: String, default: () => new Date().toISOString() }
  },
  {
    timestamps: true,
    toJSON: { transform(_, ret) { delete ret._id; delete ret.__v; return ret; } }
  }
);

// AuditLog Schema
const AuditLogSchema = new Schema<IAuditLogDocument>(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    userRole: { type: String, required: true },
    action: { type: String, required: true },
    entity: { type: String, required: true },
    entityId: { type: String },
    ipAddress: { type: String, default: '127.0.0.1' },
    details: { type: String, required: true },
    timestamp: { type: String, default: () => new Date().toISOString() }
  },
  {
    timestamps: true,
    toJSON: { transform(_, ret) { delete ret._id; delete ret.__v; return ret; } }
  }
);

// SystemNotification Schema
const NotificationSchema = new Schema<ISystemNotificationDocument>(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['ORDER', 'STOCK', 'SYSTEM', 'PROMOTION'], required: true },
    recipientRole: { type: String },
    recipientUserId: { type: String },
    isRead: { type: Boolean, default: false },
    createdAt: { type: String, default: () => new Date().toISOString() }
  },
  {
    timestamps: true,
    toJSON: { transform(_, ret) { delete ret._id; delete ret.__v; return ret; } }
  }
);

export const VoucherModel = mongoose.models.Voucher || mongoose.model<IVoucherDocument>('Voucher', VoucherSchema);
export const ReviewModel = mongoose.models.Review || mongoose.model<IReviewDocument>('Review', ReviewSchema);
export const AuditLogModel = mongoose.models.AuditLog || mongoose.model<IAuditLogDocument>('AuditLog', AuditLogSchema);
export const NotificationModel = mongoose.models.SystemNotification || mongoose.model<ISystemNotificationDocument>('SystemNotification', NotificationSchema);
