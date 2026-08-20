import mongoose, { Schema, Document } from 'mongoose';
import { Product as IProductType, ProductVariant } from '../../types';

export interface IProductDocument extends Omit<IProductType, 'id'>, Document {
  id: string;
}

const ProductVariantSchema = new Schema<ProductVariant>(
  {
    id: { type: String, required: true },
    sku: { type: String, required: true },
    barcode: { type: String, default: '' },
    color: { type: String, required: true },
    colorHex: { type: String, default: '#000000' },
    size: { type: String, enum: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', 'FREE'], default: 'M' },
    price: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    reservedStock: { type: Number, default: 0 }
  },
  { _id: false }
);

const ProductSchema = new Schema<IProductDocument>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String, default: '' },
    categoryId: { type: String, required: true },
    categoryName: { type: String, required: true },
    brand: { type: String, default: 'FashionPro Studio' },
    images: { type: [String], default: [] },
    basePrice: { type: Number, required: true },
    variants: [ProductVariantSchema],
    rating: { type: Number, default: 5.0 },
    reviewCount: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isFlashSale: { type: Boolean, default: false },
    flashSalePrice: { type: Number },
    tags: { type: [String], default: [] },
    createdAt: { type: String, default: () => new Date().toISOString() },
    updatedAt: { type: String, default: () => new Date().toISOString() }
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

export const ProductModel = mongoose.models.Product || mongoose.model<IProductDocument>('Product', ProductSchema);
