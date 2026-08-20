import mongoose, { Schema, Document } from 'mongoose';
import { Supplier as ISupplierType, PurchaseOrder as IPurchaseOrderType, PurchaseOrderItem } from '../../types';

export interface ISupplierDocument extends Omit<ISupplierType, 'id'>, Document {
  id: string;
}

export interface IPurchaseOrderDocument extends Omit<IPurchaseOrderType, 'id'>, Document {
  id: string;
}

const SupplierSchema = new Schema<ISupplierDocument>(
  {
    id: { type: String, required: true, unique: true },
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    contactPerson: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    taxCode: { type: String, required: true },
    status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' }
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

const PurchaseOrderItemSchema = new Schema<PurchaseOrderItem>(
  {
    productId: { type: String, required: true },
    variantId: { type: String, required: true },
    productName: { type: String, required: true },
    sku: { type: String, required: true },
    color: { type: String, required: true },
    size: { type: String, required: true },
    quantity: { type: Number, required: true },
    importPrice: { type: Number, required: true }
  },
  { _id: false }
);

const PurchaseOrderSchema = new Schema<IPurchaseOrderDocument>(
  {
    id: { type: String, required: true, unique: true },
    poNumber: { type: String, required: true, unique: true },
    supplierId: { type: String, required: true },
    supplierName: { type: String, required: true },
    items: [PurchaseOrderItemSchema],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['DRAFT', 'ORDERED', 'RECEIVED', 'CANCELLED'], default: 'ORDERED' },
    createdBy: { type: String, required: true },
    receivedAt: { type: String },
    createdAt: { type: String, default: () => new Date().toISOString() },
    notes: { type: String }
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

export const SupplierModel = mongoose.models.Supplier || mongoose.model<ISupplierDocument>('Supplier', SupplierSchema);
export const PurchaseOrderModel = mongoose.models.PurchaseOrder || mongoose.model<IPurchaseOrderDocument>('PurchaseOrder', PurchaseOrderSchema);
