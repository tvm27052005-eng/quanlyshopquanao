/**
 * FashionPro Enterprise Clothing Store Management System - Type Definitions
 */

export type Role = 'ADMIN' | 'MANAGER' | 'STAFF' | 'CUSTOMER';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  avatar?: string;
  isVerified: boolean;
  points: number;
  loyaltyTier: 'BRONZE' | 'SILVER' | 'GOLD' | 'DIAMOND';
  createdAt: string;
  lastLogin?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  parentId?: string | null;
  image?: string;
  productCount: number;
}

export interface ProductVariant {
  id: string;
  sku: string;
  barcode: string;
  color: string;
  colorHex: string;
  size: 'XS' | 'S' | 'M' | 'L' | 'XL' | '2XL' | '3XL' | 'FREE';
  price: number;
  originalPrice: number;
  stock: number;
  reservedStock: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  categoryName: string;
  brand: string;
  images: string[];
  basePrice: number;
  variants: ProductVariant[];
  rating: number;
  reviewCount: number;
  isFeatured?: boolean;
  isFlashSale?: boolean;
  flashSalePrice?: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  productName: string;
  productImage: string;
  variantId: string;
  sku: string;
  color: string;
  size: string;
  price: number;
  originalPrice: number;
  quantity: number;
  maxStock: number;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PACKING' | 'SHIPPING' | 'DELIVERED' | 'CANCELLED';
export type PaymentMethod = 'COD' | 'VNPAY' | 'MOMO' | 'BANK_TRANSFER';
export type PaymentStatus = 'UNPAID' | 'PAID' | 'REFUNDED' | 'FAILED';

export interface OrderItem {
  productId: string;
  productName: string;
  variantId: string;
  sku: string;
  color: string;
  size: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  orderCode: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: string;
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  voucherCode?: string;
  shippingFee: number;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  notes?: string;
  source: 'ONLINE' | 'POS';
  createdById?: string;
  createdAt: string;
  updatedAt: string;
  history: {
    status: OrderStatus;
    updatedBy: string;
    timestamp: string;
    note?: string;
  }[];
}

export interface Supplier {
  id: string;
  code: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  taxCode: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface PurchaseOrderItem {
  productId: string;
  variantId: string;
  productName: string;
  sku: string;
  color: string;
  size: string;
  quantity: number;
  importPrice: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  items: PurchaseOrderItem[];
  totalAmount: number;
  status: 'DRAFT' | 'ORDERED' | 'RECEIVED' | 'CANCELLED';
  createdBy: string;
  receivedAt?: string;
  createdAt: string;
  notes?: string;
}

export interface StockTransaction {
  id: string;
  productId: string;
  variantId: string;
  productName: string;
  sku: string;
  type: 'IN' | 'OUT' | 'ADJUSTMENT' | 'RETURN';
  quantity: number;
  beforeQuantity: number;
  afterQuantity: number;
  referenceType: 'PO' | 'ORDER' | 'AUDIT_ADJUSTMENT';
  referenceId: string;
  performedBy: string;
  createdAt: string;
  notes?: string;
}

export interface Voucher {
  id: string;
  code: string;
  description: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  usageLimit: number;
  usageCount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  isFlashSale?: boolean;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  images?: string[];
  likes: number;
  likedBy?: string[];
  isVerifiedPurchase: boolean;
  isReported?: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: Role;
  action: string;
  entity: string;
  entityId?: string;
  ipAddress: string;
  details: string;
  timestamp: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: 'ORDER' | 'STOCK' | 'SYSTEM' | 'PROMOTION';
  recipientRole?: Role;
  recipientUserId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface ProductFilterState {
  search: string;
  categoryId: string;
  minPrice: number;
  maxPrice: number;
  colors: string[];
  sizes: string[];
  brands: string[];
  inStockOnly: boolean;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
}
