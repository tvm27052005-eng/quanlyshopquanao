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
import {
  Category,
  Product,
  Supplier,
  PurchaseOrder,
  Order,
  Voucher,
  User,
  Review,
  AuditLog,
  SystemNotification,
  StockTransaction,
  OrderStatus,
  Role
} from '../types';

import { UserModel } from './models/User';
import { CategoryModel } from './models/Category';
import { ProductModel } from './models/Product';
import { OrderModel } from './models/Order';
import { SupplierModel, PurchaseOrderModel } from './models/Supplier';
import { StockTransactionModel } from './models/StockTransaction';
import { VoucherModel, ReviewModel, AuditLogModel, NotificationModel } from './models/Misc';

class StoreDatabase {
  // In-memory Fallback Cache
  private categories: Category[] = [...INITIAL_CATEGORIES];
  private products: Product[] = [...INITIAL_PRODUCTS];
  private suppliers: Supplier[] = [...INITIAL_SUPPLIERS];
  private purchaseOrders: PurchaseOrder[] = [...INITIAL_PURCHASE_ORDERS];
  private users: User[] = [...INITIAL_USERS];
  private vouchers: Voucher[] = [...INITIAL_VOUCHERS];
  private orders: Order[] = [...INITIAL_ORDERS];
  private reviews: Review[] = [...INITIAL_REVIEWS];
  private auditLogs: AuditLog[] = [...INITIAL_AUDIT_LOGS];
  private notifications: SystemNotification[] = [...INITIAL_NOTIFICATIONS];
  private stockTransactions: StockTransaction[] = [];

  // AUDIT LOG HELPER
  public async logAction(user: { id: string; name: string; role: Role }, action: string, entity: string, details: string, entityId?: string) {
    const log: AuditLog = {
      id: 'log-' + Date.now(),
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action,
      entity,
      entityId,
      ipAddress: '127.0.0.1',
      details,
      timestamp: new Date().toISOString()
    };
    this.auditLogs.unshift(log);
    try {
      await AuditLogModel.create(log);
    } catch (e) {}
    return log;
  }

  // NOTIFICATION HELPER
  public async addNotification(
    title: string,
    message: string,
    type: 'ORDER' | 'STOCK' | 'SYSTEM' | 'PROMOTION',
    recipientRole?: Role,
    recipientUserId?: string
  ) {
    const notif: SystemNotification = {
      id: 'notif-' + Date.now() + Math.random().toString(36).substring(2, 6),
      title,
      message,
      type,
      recipientRole,
      recipientUserId,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    this.notifications.unshift(notif);
    try {
      await NotificationModel.create(notif);
    } catch (e) {}
    return notif;
  }

  public async markNotificationsAsRead() {
    this.notifications.forEach((n) => (n.isRead = true));
    try {
      await NotificationModel.updateMany({}, { $set: { isRead: true } });
    } catch (e) {}
    return true;
  }

  // CATEGORIES
  public async getCategories() {
    try {
      const list = await CategoryModel.find().lean();
      if (list && list.length > 0) return list as any[];
    } catch (e) {}
    return this.categories;
  }

  public async createCategory(data: Partial<Category>, actor: User) {
    const newCat: Category = {
      id: 'cat-' + Date.now(),
      name: data.name || 'Danh mục mới',
      slug: (data.name || 'danh-muc').toLowerCase().replace(/\s+/g, '-'),
      description: data.description || '',
      productCount: 0
    };
    this.categories.push(newCat);
    try {
      await CategoryModel.create(newCat);
    } catch (e) {}
    await this.logAction(actor, 'CREATE_CATEGORY', 'Category', `Tạo danh mục ${newCat.name}`, newCat.id);
    return newCat;
  }

  public async updateCategory(id: string, data: Partial<Category>, actor: User) {
    let updated: any = null;
    try {
      updated = await CategoryModel.findOneAndUpdate({ id }, { $set: data }, { new: true }).lean();
    } catch (e) {}
    const idx = this.categories.findIndex(c => c.id === id);
    if (idx !== -1) {
      this.categories[idx] = { ...this.categories[idx], ...data };
      if (!updated) updated = this.categories[idx];
    }
    if (updated) {
      await this.logAction(actor, 'UPDATE_CATEGORY', 'Category', `Cập nhật danh mục ${updated.name}`, id);
    }
    return updated;
  }

  public async deleteCategory(id: string, actor: User) {
    const cat = this.categories.find(c => c.id === id);
    this.categories = this.categories.filter(c => c.id !== id);
    try {
      await CategoryModel.deleteOne({ id });
    } catch (e) {}
    if (cat) {
      await this.logAction(actor, 'DELETE_CATEGORY', 'Category', `Xóa danh mục ${cat.name}`, id);
    }
    return true;
  }

  // PRODUCTS & VARIANTS
  public async getProducts(filters?: any) {
    try {
      let query: any = {};
      if (filters?.categoryId && filters.categoryId !== 'ALL') {
        query.categoryId = filters.categoryId;
      }
      if (filters?.search) {
        const q = new RegExp(filters.search, 'i');
        query.$or = [{ name: q }, { tags: q }, { brand: q }];
      }
      if (filters?.minPrice || filters?.maxPrice) {
        query.basePrice = {};
        if (filters.minPrice) query.basePrice.$gte = Number(filters.minPrice);
        if (filters.maxPrice) query.basePrice.$lte = Number(filters.maxPrice);
      }
      if (filters?.isFlashSale) {
        query.isFlashSale = true;
      }
      const docs = await ProductModel.find(query).sort({ createdAt: -1 }).lean();
      if (docs && docs.length > 0) return docs as any[];
    } catch (e) {}

    let list = [...this.products];
    if (filters?.categoryId && filters.categoryId !== 'ALL') {
      list = list.filter(p => p.categoryId === filters.categoryId);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q)) || p.brand.toLowerCase().includes(q));
    }
    return list;
  }

  public async getProductById(id: string) {
    try {
      const doc = await ProductModel.findOne({ $or: [{ id }, { slug: id }] }).lean();
      if (doc) return doc as any;
    } catch (e) {}
    return this.products.find(p => p.id === id || p.slug === id) || null;
  }

  public async createProduct(productData: any, actor: User) {
    const id = 'prod-' + Date.now();
    const categories = await this.getCategories();
    const newProduct: Product = {
      id,
      name: productData.name,
      slug: (productData.name || 'san-pham').toLowerCase().replace(/\s+/g, '-'),
      description: productData.description || '',
      categoryId: productData.categoryId,
      categoryName: categories.find(c => c.id === productData.categoryId)?.name || 'Thời trang',
      brand: productData.brand || 'FashionPro Studio',
      images: productData.images || ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop&q=80'],
      basePrice: Number(productData.basePrice) || 300000,
      variants: productData.variants || [],
      rating: 5.0,
      reviewCount: 0,
      isFeatured: !!productData.isFeatured,
      isFlashSale: !!productData.isFlashSale,
      flashSalePrice: productData.flashSalePrice ? Number(productData.flashSalePrice) : undefined,
      tags: productData.tags || ['Mới'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.products.unshift(newProduct);
    try {
      await ProductModel.create(newProduct);
    } catch (e) {}
    await this.logAction(actor, 'CREATE_PRODUCT', 'Product', `Tạo sản phẩm mới ${newProduct.name}`, id);
    return newProduct;
  }

  public async updateProduct(id: string, productData: any, actor: User) {
    let updated: any = null;
    try {
      updated = await ProductModel.findOneAndUpdate({ id }, { $set: { ...productData, updatedAt: new Date().toISOString() } }, { new: true }).lean();
    } catch (e) {}
    const idx = this.products.findIndex(p => p.id === id);
    if (idx !== -1) {
      this.products[idx] = { ...this.products[idx], ...productData, updatedAt: new Date().toISOString() };
      if (!updated) updated = this.products[idx];
    }
    if (updated) {
      await this.logAction(actor, 'UPDATE_PRODUCT', 'Product', `Cập nhật sản phẩm ${updated.name}`, id);
    }
    return updated;
  }

  public async deleteProduct(id: string, actor: User) {
    const prod = this.products.find(p => p.id === id);
    this.products = this.products.filter(p => p.id !== id);
    try {
      await ProductModel.deleteOne({ id });
    } catch (e) {}
    if (prod) {
      await this.logAction(actor, 'DELETE_PRODUCT', 'Product', `Xóa sản phẩm ${prod.name}`, id);
    }
    return true;
  }

  public async adjustStock(productId: string, variantId: string, quantityDelta: number, note: string, performedBy: string) {
    const prod = await this.getProductById(productId);
    if (!prod) return null;

    const variant = prod.variants.find((v: any) => v.id === variantId || v.sku === variantId);
    if (!variant) return null;

    const before = variant.stock;
    variant.stock = Math.max(0, variant.stock + quantityDelta);

    try {
      await ProductModel.updateOne({ id: productId, 'variants.id': variant.id }, { $set: { 'variants.$.stock': variant.stock } });
    } catch (e) {}

    const transaction: StockTransaction = {
      id: 'stk-' + Date.now(),
      productId,
      variantId: variant.id,
      productName: prod.name,
      sku: variant.sku,
      type: quantityDelta >= 0 ? 'IN' : 'OUT',
      quantity: Math.abs(quantityDelta),
      beforeQuantity: before,
      afterQuantity: variant.stock,
      referenceType: 'AUDIT_ADJUSTMENT',
      referenceId: 'ADJ-' + Date.now().toString().slice(-6),
      performedBy,
      createdAt: new Date().toISOString(),
      notes: note || 'Điều chỉnh tồn kho thủ công'
    };

    this.stockTransactions.unshift(transaction);
    try {
      await StockTransactionModel.create(transaction);
    } catch (e) {}

    return transaction;
  }

  // SUPPLIERS & PO
  public async getSuppliers() {
    try {
      const docs = await SupplierModel.find().lean();
      if (docs && docs.length > 0) return docs as any[];
    } catch (e) {}
    return this.suppliers;
  }

  public async createSupplier(data: any, actor: User) {
    const newSup: Supplier = {
      id: 'sup-' + Date.now(),
      code: 'SUP-' + Math.floor(100 + Math.random() * 900),
      name: data.name,
      contactPerson: data.contactPerson,
      phone: data.phone,
      email: data.email,
      address: data.address,
      taxCode: data.taxCode,
      status: 'ACTIVE'
    };
    this.suppliers.push(newSup);
    try {
      await SupplierModel.create(newSup);
    } catch (e) {}
    await this.logAction(actor, 'CREATE_SUPPLIER', 'Supplier', `Thêm nhà cung cấp ${newSup.name}`, newSup.id);
    return newSup;
  }

  public async getPurchaseOrders() {
    try {
      const docs = await PurchaseOrderModel.find().sort({ createdAt: -1 }).lean();
      if (docs && docs.length > 0) return docs as any[];
    } catch (e) {}
    return this.purchaseOrders;
  }

  public async createPurchaseOrder(data: any, actor: User) {
    const poId = 'po-' + Date.now();
    const poNumber = 'PO-' + new Date().getFullYear() + '-' + Math.floor(100 + Math.random() * 900);
    const suppliers = await this.getSuppliers();
    const newPO: PurchaseOrder = {
      id: poId,
      poNumber,
      supplierId: data.supplierId,
      supplierName: suppliers.find(s => s.id === data.supplierId)?.name || 'Nhà cung cấp',
      items: data.items,
      totalAmount: data.items.reduce((sum: number, item: any) => sum + (item.importPrice * item.quantity), 0),
      status: 'ORDERED',
      createdBy: actor.name,
      createdAt: new Date().toISOString(),
      notes: data.notes
    };
    this.purchaseOrders.unshift(newPO);
    try {
      await PurchaseOrderModel.create(newPO);
    } catch (e) {}
    await this.logAction(actor, 'CREATE_PO', 'PurchaseOrder', `Tạo phiếu nhập hàng ${poNumber}`, poId);
    return newPO;
  }

  public async receivePurchaseOrder(poId: string, actor: User) {
    let po: any = null;
    try {
      po = await PurchaseOrderModel.findOne({ id: poId });
    } catch (e) {}
    if (!po) po = this.purchaseOrders.find(p => p.id === poId);
    if (!po || po.status === 'RECEIVED') return null;

    po.status = 'RECEIVED';
    po.receivedAt = new Date().toISOString();
    try {
      await PurchaseOrderModel.updateOne({ id: poId }, { $set: { status: 'RECEIVED', receivedAt: po.receivedAt } });
    } catch (e) {}

    // Auto-update product stock
    for (const item of po.items) {
      const prod = await this.getProductById(item.productId);
      if (prod) {
        const variant = prod.variants.find((v: any) => v.id === item.variantId || v.sku === item.sku);
        if (variant) {
          const before = variant.stock;
          variant.stock += item.quantity;
          try {
            await ProductModel.updateOne({ id: prod.id, 'variants.id': variant.id }, { $set: { 'variants.$.stock': variant.stock } });
          } catch (e) {}

          const stkDoc = {
            id: 'stk-' + Date.now() + Math.random(),
            productId: prod.id,
            variantId: variant.id,
            productName: prod.name,
            sku: variant.sku,
            type: 'IN',
            quantity: item.quantity,
            beforeQuantity: before,
            afterQuantity: variant.stock,
            referenceType: 'PO',
            referenceId: po.poNumber,
            performedBy: actor.name,
            createdAt: new Date().toISOString(),
            notes: `Nhập kho từ phiếu ${po.poNumber}`
          };
          this.stockTransactions.push(stkDoc as any);
          try {
            await StockTransactionModel.create(stkDoc);
          } catch (e) {}
        }
      }
    }

    await this.logAction(actor, 'RECEIVE_PO', 'PurchaseOrder', `Xác nhận nhập kho phiếu ${po.poNumber}`, poId);
    await this.addNotification('Nhập kho thành công', `Phiếu nhập ${po.poNumber} đã tự động cập nhật số lượng tồn kho.`, 'STOCK', 'MANAGER');
    return po;
  }

  // ORDERS & POS
  public async getOrders() {
    try {
      const docs = await OrderModel.find().sort({ createdAt: -1 }).lean();
      if (docs && docs.length > 0) return docs as any[];
    } catch (e) {}
    return this.orders;
  }

  public async createOrder(orderData: any, actor?: User) {
    const orderId = 'ord-' + Date.now();
    const orderCode = 'FP' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + Math.floor(10 + Math.random() * 90);
    
    let subtotal = 0;
    const items = [];
    for (const item of orderData.items) {
      subtotal += item.price * item.quantity;
      items.push(item);

      const prod = await this.getProductById(item.productId);
      if (prod) {
        const v = prod.variants.find((v: any) => v.id === item.variantId || v.sku === item.sku);
        if (v) {
          v.stock = Math.max(0, v.stock - item.quantity);
          try {
            await ProductModel.updateOne({ id: prod.id, 'variants.id': v.id }, { $set: { 'variants.$.stock': v.stock } });
          } catch (e) {}
        }
      }
    }

    const discountAmount = orderData.discountAmount || 0;
    const shippingFee = orderData.shippingFee ?? 30000;
    const totalAmount = subtotal - discountAmount + shippingFee;

    const newOrder: Order = {
      id: orderId,
      orderCode,
      customerId: orderData.customerId || 'guest',
      customerName: orderData.customerName || 'Khách Vãng Lai',
      customerPhone: orderData.customerPhone || '0900000000',
      customerEmail: orderData.customerEmail || 'khach@fashionpro.vn',
      shippingAddress: orderData.shippingAddress || 'Bán tại cửa hàng (POS)',
      items,
      subtotal,
      discountAmount,
      voucherCode: orderData.voucherCode,
      shippingFee,
      totalAmount,
      status: orderData.status || 'PENDING',
      paymentMethod: orderData.paymentMethod || 'COD',
      paymentStatus: orderData.paymentStatus || 'UNPAID',
      notes: orderData.notes,
      source: orderData.source || 'ONLINE',
      createdById: actor?.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      history: [
        {
          status: orderData.status || 'PENDING',
          updatedBy: actor ? actor.name : 'Hệ thống Online',
          timestamp: new Date().toISOString(),
          note: 'Đơn hàng được khởi tạo'
        }
      ]
    };

    this.orders.unshift(newOrder);
    try {
      await OrderModel.create(newOrder);
    } catch (e) {}

    if (orderData.customerId && orderData.customerId !== 'guest') {
      const addedPoints = Math.floor(totalAmount / 10000);
      try {
        await UserModel.updateOne({ id: orderData.customerId }, { $inc: { points: addedPoints } });
      } catch (e) {}
    }

    if (actor) {
      await this.logAction(actor, 'CREATE_ORDER', 'Order', `Tạo đơn hàng ${orderCode} - Tổng tiền: ${totalAmount.toLocaleString('vi-VN')}đ`, orderId);
    }

    await this.addNotification(`Đơn hàng mới #${orderCode}`, `Đơn hàng ${totalAmount.toLocaleString('vi-VN')}đ vừa được khởi tạo.`, 'ORDER', 'STAFF');
    await this.addNotification(
      `🎉 Đơn hàng #${orderCode} đã tạo thành công!`,
      `Tổng thanh toán: ${totalAmount.toLocaleString('vi-VN')}đ (${newOrder.paymentMethod}). Nhấn vào Tài Khoản để xem chi tiết.`,
      'ORDER',
      'CUSTOMER',
      newOrder.customerId
    );

    return newOrder;
  }

  public async updateOrderStatus(orderId: string, status: OrderStatus, actor: User, note?: string) {
    let order: any = null;
    try {
      order = await OrderModel.findOne({ id: orderId });
    } catch (e) {}
    if (!order) order = this.orders.find(o => o.id === orderId);
    if (!order) return null;

    order.status = status;
    order.updatedAt = new Date().toISOString();
    if (status === 'DELIVERED') {
      order.paymentStatus = 'PAID';
    }

    const historyEntry = {
      status,
      updatedBy: actor.name,
      timestamp: new Date().toISOString(),
      note: note || `Cập nhật trạng thái sang ${status}`
    };
    order.history.unshift(historyEntry);

    try {
      await OrderModel.updateOne(
        { id: orderId },
        {
          $set: { status, updatedAt: order.updatedAt, paymentStatus: order.paymentStatus },
          $push: { history: { $each: [historyEntry], $position: 0 } }
        }
      );
    } catch (e) {}

    await this.logAction(actor, 'UPDATE_ORDER_STATUS', 'Order', `Đổi trạng thái đơn ${order.orderCode} -> ${status}`, orderId);

    // Push real-time notification to Customer for status update
    const code = order.orderCode;
    let title = '';
    let message = '';
    switch (status) {
      case 'CONFIRMED':
        title = `🎉 Đơn hàng #${code} đã được xác nhận!`;
        message = `Cửa hàng đã xác nhận đơn hàng #${code} của bạn. Sẽ sớm đóng gói!`;
        break;
      case 'PACKING':
        title = `📦 Đơn hàng #${code} đang được đóng gói`;
        message = `Nhân viên kho đang kiểm tra sản phẩm và đóng gói cho đơn hàng #${code}.`;
        break;
      case 'SHIPPING':
        title = `🚚 Đơn hàng #${code} đang trên đường giao!`;
        message = `Đơn hàng #${code} đã bàn giao cho đơn vị vận chuyển và đang giao tới bạn.`;
        break;
      case 'DELIVERED':
        title = `✅ Đơn hàng #${code} giao thành công!`;
        message = `Đơn hàng #${code} đã giao thành công. Cảm ơn bạn đã tin tưởng mua sắm!`;
        break;
      case 'CANCELLED':
        title = `❌ Đơn hàng #${code} đã bị hủy`;
        message = `Đơn hàng #${code} đã cập nhật trạng thái hủy (${note || 'Theo yêu cầu'}).`;
        break;
      default:
        title = `Cập nhật đơn hàng #${code}`;
        message = `Trạng thái đơn hàng #${code} đã được đổi sang ${status}.`;
    }
    await this.addNotification(title, message, 'ORDER', 'CUSTOMER', order.customerId);

    return order;
  }

  // VOUCHERS
  public async getVouchers() {
    try {
      const docs = await VoucherModel.find().lean();
      if (docs && docs.length > 0) return docs as any[];
    } catch (e) {}
    return this.vouchers;
  }

  public async validateVoucher(code: string, subtotal: number) {
    const vouchers = await this.getVouchers();
    const v = vouchers.find(v => v.code.toUpperCase() === code.toUpperCase() && v.isActive);
    if (!v) return { valid: false, message: 'Mã giảm giá không tồn tại hoặc đã hết hạn' };
    if (subtotal < v.minOrderValue) {
      return { valid: false, message: `Đơn hàng phải từ ${v.minOrderValue.toLocaleString('vi-VN')}đ để sử dụng mã này` };
    }
    let discount = 0;
    if (v.discountType === 'FIXED') {
      discount = v.discountValue;
    } else {
      discount = Math.round((subtotal * v.discountValue) / 100);
      if (v.maxDiscount && discount > v.maxDiscount) {
        discount = v.maxDiscount;
      }
    }
    return { valid: true, discount, voucher: v };
  }

  // REVIEWS
  public async getReviews(productId?: string) {
    let list = [...this.reviews];
    try {
      const query = productId ? { productId } : {};
      const docs = await ReviewModel.find(query).sort({ createdAt: -1 }).lean();
      if (docs && docs.length > 0) {
        docs.forEach((d: any) => {
          if (!list.some(m => m.id === d.id)) list.push(d as any);
        });
      }
    } catch (e) {}

    if (productId) {
      return list.filter(r => r.productId === productId);
    }
    return list;
  }

  public async addReview(reviewData: any, actor: User) {
    const reviewerName = reviewData.userName || (actor && actor.name && actor.role === 'CUSTOMER' ? actor.name : (actor?.name || 'Khách Hàng'));
    const reviewerId = reviewData.userId || actor?.id || 'rev-user-' + Date.now();

    const newRev: Review = {
      id: 'rev-' + Date.now(),
      productId: reviewData.productId,
      userId: reviewerId,
      userName: reviewerName,
      userAvatar: reviewData.userAvatar || actor?.avatar,
      rating: reviewData.rating || 5,
      comment: reviewData.comment,
      images: reviewData.images || [],
      likes: 0,
      isVerifiedPurchase: true,
      createdAt: new Date().toISOString()
    };
    this.reviews.unshift(newRev);
    try {
      await ReviewModel.create(newRev);
    } catch (e) {}

    // recalculate product rating
    const prod = await this.getProductById(reviewData.productId);
    if (prod) {
      const prodRevs = await this.getReviews(prod.id);
      const avg = prodRevs.reduce((sum, r) => sum + r.rating, 0) / prodRevs.length;
      prod.rating = Number(avg.toFixed(1));
      prod.reviewCount = prodRevs.length;
      try {
        await ProductModel.updateOne({ id: prod.id }, { $set: { rating: prod.rating, reviewCount: prod.reviewCount } });
      } catch (e) {}
    }

    return newRev;
  }

  // USERS & EMPLOYEES
  public async getUsers() {
    try {
      const docs = await UserModel.find().lean();
      if (docs && docs.length > 0) return docs as any[];
    } catch (e) {}
    return this.users;
  }

  public async createUser(userData: any, actor: User) {
    const newUser: User = {
      id: 'user-' + Date.now(),
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      role: userData.role || 'CUSTOMER',
      isVerified: true,
      points: 0,
      loyaltyTier: 'BRONZE',
      createdAt: new Date().toISOString()
    };
    this.users.push(newUser);
    try {
      await UserModel.create(newUser);
    } catch (e) {}
    await this.logAction(actor, 'CREATE_USER', 'User', `Tạo tài khoản mới ${newUser.name} (${newUser.role})`, newUser.id);
    return newUser;
  }

  public async updateUser(id: string, userData: any, actor: User) {
    let updated: any = null;
    try {
      updated = await UserModel.findOneAndUpdate({ id }, { $set: userData }, { new: true, upsert: true }).lean();
    } catch (e) {}

    const idx = this.users.findIndex(u => u.id === id);
    if (idx !== -1) {
      this.users[idx] = { ...this.users[idx], ...userData };
      updated = this.users[idx];
    } else {
      const newUser: User = {
        id: id || 'user-' + Date.now(),
        name: userData.name || actor?.name || 'Khách Hàng',
        email: userData.email || actor?.email || 'user@fashionpro.vn',
        phone: userData.phone || actor?.phone || '',
        role: userData.role || actor?.role || 'CUSTOMER',
        isVerified: true,
        points: actor?.points || 0,
        loyaltyTier: actor?.loyaltyTier || 'BRONZE',
        createdAt: new Date().toISOString(),
        ...userData
      };
      this.users.push(newUser);
      updated = newUser;
    }

    if (updated) {
      await this.logAction(actor || updated, 'UPDATE_USER', 'User', `Cập nhật tài khoản ${updated.name}`, updated.id);
    }
    return updated;
  }

  public async deleteUser(id: string, actor: User) {
    const user = this.users.find(u => u.id === id);
    this.users = this.users.filter(u => u.id !== id);
    try {
      await UserModel.deleteOne({ id });
    } catch (e) {}
    if (user) {
      await this.logAction(actor, 'DELETE_USER', 'User', `Xóa tài khoản ${user.name}`, id);
    }
    return true;
  }

  // AUDIT LOGS, NOTIFS & STOCK TRANSACTIONS
  public async getAuditLogs() {
    try {
      const docs = await AuditLogModel.find().sort({ timestamp: -1 }).limit(100).lean();
      if (docs && docs.length > 0) return docs as any[];
    } catch (e) {}
    return this.auditLogs;
  }

  public async getNotifications() {
    try {
      const docs = await NotificationModel.find().sort({ createdAt: -1 }).limit(50).lean();
      if (docs && docs.length > 0) return docs as any[];
    } catch (e) {}
    return this.notifications;
  }

  public async getStockTransactions() {
    try {
      const docs = await StockTransactionModel.find().sort({ createdAt: -1 }).lean();
      if (docs && docs.length > 0) return docs as any[];
    } catch (e) {}
    return this.stockTransactions;
  }
}

export const db = new StoreDatabase();
