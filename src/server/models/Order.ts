import mongoose, { Schema, Document } from 'mongoose';
import { Order as IOrderType, OrderItem } from '../../types';

export interface IOrderDocument extends Omit<IOrderType, 'id'>, Document {
  id: string;
}

const OrderItemSchema = new Schema<OrderItem>(
  {
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    variantId: { type: String, required: true },
    sku: { type: String, required: true },
    color: { type: String, required: true },
    size: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true }
  },
  { _id: false }
);

const OrderHistorySchema = new Schema(
  {
    status: { type: String, required: true },
    updatedBy: { type: String, required: true },
    timestamp: { type: String, default: () => new Date().toISOString() },
    note: { type: String }
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrderDocument>(
  {
    id: { type: String, required: true, unique: true },
    orderCode: { type: String, required: true, unique: true },
    customerId: { type: String, required: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerEmail: { type: String, required: true },
    shippingAddress: { type: String, required: true },
    items: [OrderItemSchema],
    subtotal: { type: Number, required: true },
    discountAmount: { type: Number, default: 0 },
    voucherCode: { type: String },
    shippingFee: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['PENDING', 'CONFIRMED', 'PACKING', 'SHIPPING', 'DELIVERED', 'CANCELLED'],
      default: 'PENDING'
    },
    paymentMethod: {
      type: String,
      enum: ['COD', 'VNPAY', 'MOMO', 'BANK_TRANSFER'],
      default: 'COD'
    },
    paymentStatus: {
      type: String,
      enum: ['UNPAID', 'PAID', 'REFUNDED', 'FAILED'],
      default: 'UNPAID'
    },
    notes: { type: String },
    source: { type: String, enum: ['ONLINE', 'POS'], default: 'ONLINE' },
    createdById: { type: String },
    createdAt: { type: String, default: () => new Date().toISOString() },
    updatedAt: { type: String, default: () => new Date().toISOString() },
    history: [OrderHistorySchema]
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

export const OrderModel = mongoose.models.Order || mongoose.model<IOrderDocument>('Order', OrderSchema);
