import mongoose, { Schema, Document } from 'mongoose';
import { Category as ICategoryType } from '../../types';

export interface ICategoryDocument extends Omit<ICategoryType, 'id'>, Document {
  id: string;
}

const CategorySchema = new Schema<ICategoryDocument>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    parentId: { type: String, default: null },
    image: { type: String },
    productCount: { type: Number, default: 0 }
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

export const CategoryModel = mongoose.models.Category || mongoose.model<ICategoryDocument>('Category', CategorySchema);
