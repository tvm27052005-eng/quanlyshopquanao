import mongoose, { Schema, Document } from 'mongoose';
import { StockTransaction as IStockTransactionType } from '../../types';

export interface IStockTransactionDocument extends Omit<IStockTransactionType, 'id'>, Document {
  id: string;
}

const StockTransactionSchema = new Schema<IStockTransactionDocument>(
  {
    id: { type: String, required: true, unique: true },
    productId: { type: String, required: true },
    variantId: { type: String, required: true },
    productName: { type: String, required: true },
    sku: { type: String, required: true },
    type: { type: String, enum: ['IN', 'OUT', 'ADJUSTMENT', 'RETURN'], required: true },
    quantity: { type: Number, required: true },
    beforeQuantity: { type: Number, required: true },
    afterQuantity: { type: Number, required: true },
    referenceType: { type: String, enum: ['PO', 'ORDER', 'AUDIT_ADJUSTMENT'], required: true },
    referenceId: { type: String, required: true },
    performedBy: { type: String, required: true },
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

export const StockTransactionModel =
  mongoose.models.StockTransaction || mongoose.model<IStockTransactionDocument>('StockTransaction', StockTransactionSchema);
