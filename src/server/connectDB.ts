import mongoose from 'mongoose';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_SUPPLIERS,
  INITIAL_PURCHASE_ORDERS,
  INITIAL_USERS,
  INITIAL_VOUCHERS,
  INITIAL_ORDERS,
  INITIAL_REVIEWS,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS
} from '../data/mockData';
import { UserModel } from './models/User';
import { CategoryModel } from './models/Category';
import { ProductModel } from './models/Product';
import { OrderModel } from './models/Order';
import { SupplierModel, PurchaseOrderModel } from './models/Supplier';
import { VoucherModel, ReviewModel, AuditLogModel, NotificationModel } from './models/Misc';

export async function connectMongoDB() {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fashionpro';

  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(mongoURI);
    console.log(`✅ [MongoDB] Connected successfully to: ${mongoURI.split('@').pop()}`);

    await autoSeedInitialData();
  } catch (err: any) {
    console.warn(`⚠️ [MongoDB] Connection error: ${err.message}. Operating in fallback mode.`);
  }
}

async function autoSeedInitialData() {
  try {
    const userCount = await UserModel.countDocuments();
    if (userCount === 0) {
      console.log('🌱 [MongoDB Auto-Seeder] Populating initial sample dataset...');
      await UserModel.insertMany(INITIAL_USERS);
      await CategoryModel.insertMany(INITIAL_CATEGORIES);
      await ProductModel.insertMany(INITIAL_PRODUCTS);
      await SupplierModel.insertMany(INITIAL_SUPPLIERS);
      await PurchaseOrderModel.insertMany(INITIAL_PURCHASE_ORDERS);
      await OrderModel.insertMany(INITIAL_ORDERS);
      await VoucherModel.insertMany(INITIAL_VOUCHERS);
      await ReviewModel.insertMany(INITIAL_REVIEWS);
      await AuditLogModel.insertMany(INITIAL_AUDIT_LOGS);
      await NotificationModel.insertMany(INITIAL_NOTIFICATIONS);
      console.log('✨ [MongoDB Auto-Seeder] Successfully seeded default store data!');
    }
  } catch (err) {
    console.error('❌ [MongoDB Auto-Seeder Error]:', err);
  }
}
