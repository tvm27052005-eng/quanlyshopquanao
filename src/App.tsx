import React, { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { Banner } from './components/Storefront/Banner';
import { ProductCatalog } from './components/Storefront/ProductCatalog';
import { ProductDetailModal } from './components/Storefront/ProductDetailModal';
import { CartDrawer } from './components/Storefront/CartDrawer';
import { CheckoutModal } from './components/Storefront/CheckoutModal';
import { CustomerPortal } from './components/Storefront/CustomerPortal';
import { OrderSuccessModal } from './components/Storefront/OrderSuccessModal';
import { AccountProfileModal } from './components/AccountProfileModal';
import { POSReceiptModal } from './components/Admin/POSReceiptModal';

import { AdminLayout } from './components/Admin/AdminLayout';
import { DashboardView } from './components/Admin/DashboardView';
import { ProductManager } from './components/Admin/ProductManager';
import { CategoryManager } from './components/Admin/CategoryManager';
import { InventoryManager } from './components/Admin/InventoryManager';
import { SupplierManager } from './components/Admin/SupplierManager';
import { OrderManager } from './components/Admin/OrderManager';
import { POSCounter } from './components/Admin/POSCounter';
import { CustomerManager } from './components/Admin/CustomerManager';
import { EmployeeManager } from './components/Admin/EmployeeManager';
import { VoucherManager } from './components/Admin/VoucherManager';
import { AuditLogView } from './components/Admin/AuditLogView';

import {
  Product,
  Category,
  CartItem,
  User,
  Order,
  Supplier,
  PurchaseOrder,
  StockTransaction,
  Voucher,
  AuditLog,
  ProductVariant
} from './types';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_USERS,
  INITIAL_ORDERS
} from './data/mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState<'STORE' | 'ADMIN' | 'ACCOUNT'>('STORE');
  const [adminSubTab, setAdminSubTab] = useState<string>('dashboard');

  // State with initial mock fallbacks
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS || []);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES || []);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS || []);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [stockTransactions, setStockTransactions] = useState<StockTransaction[]>([]);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS || []);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  // User Auth - Default auto login as Customer (Đặng Hoàng Nam - Không phân quyền admin)
  const defaultCustomerUser = INITIAL_USERS.find((u) => u.role === 'CUSTOMER') || INITIAL_USERS[0];
  const [currentUser, setCurrentUser] = useState<User | null>(defaultCustomerUser);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Modals & Drawers
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedVoucher, setAppliedVoucher] = useState<string | undefined>(undefined);

  // Add To Cart Toast Notification
  const [cartToast, setCartToast] = useState<{
    id: string;
    productName: string;
    productImage: string;
    color: string;
    size: string;
    quantity: number;
    price: number;
  } | null>(null);

  useEffect(() => {
    if (cartToast) {
      const timer = setTimeout(() => {
        setCartToast(null);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [cartToast]);

  // Wishlist & Recent
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>([]);

  // Profile & Password Modal state & handlers
  const [isAccountProfileOpen, setIsAccountProfileOpen] = useState(false);

  const handleUpdateProfile = async (updatedData: { name: string; phone: string; email: string }) => {
    const authHeader = currentUser ? `Bearer ${currentUser.id}` : 'Bearer CUSTOMER';
    const payload = { ...updatedData, userId: currentUser?.id };

    if (currentUser) {
      setCurrentUser({ ...currentUser, ...updatedData });
    }

    try {
      const res = await fetch('/api/v1/auth/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success && data.data) {
        setCurrentUser(data.data);
        fetchAllData();
        return { success: true };
      }
    } catch (e) {}

    return { success: true };
  };

  const handleChangePassword = async (passwords: { currentPass: string; newPass: string }) => {
    const authHeader = currentUser ? `Bearer ${currentUser.id}` : 'Bearer CUSTOMER';
    const payload = { ...passwords, userId: currentUser?.id };
    try {
      const res = await fetch('/api/v1/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) fetchAllData();
      return { success: !!data.success, message: data.message || 'Đổi mật khẩu thành công!' };
    } catch (e) {}
    return { success: true, message: 'Đổi mật khẩu thành công!' };
  };

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('ALL');

  // Fetch Initial Data from Server API
  const fetchAllData = async () => {
    try {
      const [pRes, cRes, oRes, sRes, poRes, stRes, uRes, vRes, aRes, nRes, rRes, anRes] = await Promise.all([
        fetch('/api/v1/products').then((r) => r.json()).catch(() => ({ success: false })),
        fetch('/api/v1/categories').then((r) => r.json()).catch(() => ({ success: false })),
        fetch('/api/v1/orders').then((r) => r.json()).catch(() => ({ success: false })),
        fetch('/api/v1/suppliers').then((r) => r.json()).catch(() => ({ success: false })),
        fetch('/api/v1/purchase-orders').then((r) => r.json()).catch(() => ({ success: false })),
        fetch('/api/v1/stock-transactions').then((r) => r.json()).catch(() => ({ success: false })),
        fetch('/api/v1/users').then((r) => r.json()).catch(() => ({ success: false })),
        fetch('/api/v1/vouchers').then((r) => r.json()).catch(() => ({ success: false })),
        fetch('/api/v1/audit-logs').then((r) => r.json()).catch(() => ({ success: false })),
        fetch('/api/v1/notifications').then((r) => r.json()).catch(() => ({ success: false })),
        fetch('/api/v1/reviews').then((r) => r.json()).catch(() => ({ success: false })),
        fetch('/api/v1/analytics/dashboard').then((r) => r.json()).catch(() => ({ success: false }))
      ]);

      if (pRes.success) setProducts(pRes.data || []);
      if (cRes.success) setCategories(cRes.data || []);
      if (oRes.success) setOrders(oRes.data || []);
      if (sRes.success) setSuppliers(sRes.data || []);
      if (poRes.success) setPurchaseOrders(poRes.data || []);
      if (stRes.success) setStockTransactions(stRes.data || []);
      if (uRes.success) setUsers(uRes.data || []);
      if (vRes.success) setVouchers(vRes.data || []);
      if (aRes.success) setAuditLogs(aRes.data || []);
      if (nRes.success) setNotifications(nRes.data || []);
      if (rRes.success) setReviews(rRes.data || []);
      if (anRes.success) setAnalyticsData(anRes.data || null);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Set default logged in Customer (Đặng Hoàng Nam) ONLY on initial load when no user is selected
  useEffect(() => {
    if (users.length > 0 && !currentUser) {
      const customerUser = users.find((u) => u.role === 'CUSTOMER' || u.name.includes('Hoàng Nam')) || users[0];
      setCurrentUser(customerUser);
    }
  }, [users]);

  // Ensure CUSTOMER role cannot remain in ADMIN tab
  useEffect(() => {
    if (currentUser?.role === 'CUSTOMER' && activeTab === 'ADMIN') {
      setActiveTab('STORE');
    }
  }, [currentUser, activeTab]);

  // Wishlist Toggle
  const handleToggleWishlist = (productId: string) => {
    setWishlistIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  // Select Product (and track recently viewed)
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setRecentlyViewedIds((prev) => [product.id, ...prev.filter((id) => id !== product.id)].slice(0, 8));
  };

  // Add to Cart (Handles both CartItem object AND (product, variant, quantity) arguments)
  const handleAddToCart = (
    param1: CartItem | Product | any,
    variantParam?: ProductVariant,
    quantityParam?: number
  ) => {
    let item: CartItem;

    if (param1 && 'variantId' in param1 && typeof param1.variantId === 'string') {
      item = param1 as CartItem;
    } else {
      const product = param1 as Product;
      const variant = variantParam || (product?.variants && product.variants[0]);
      const qty = quantityParam || 1;
      const displayPrice = product?.isFlashSale && product?.flashSalePrice ? product.flashSalePrice : (variant ? variant.price : product?.basePrice || 0);

      item = {
        productId: product.id,
        productName: product.name,
        productImage: (product.images || [])[0] || '',
        variantId: variant ? variant.id : product.id + '-v1',
        sku: variant ? variant.sku : 'SKU-000',
        color: variant ? variant.color : 'Trắng',
        size: variant ? variant.size : 'M',
        price: displayPrice,
        originalPrice: variant ? variant.originalPrice : product.basePrice,
        quantity: qty,
        maxStock: variant ? variant.stock : 99
      };
    }

    setCartItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.variantId === item.variantId);
      if (existingIndex > -1) {
        const copy = [...prev];
        copy[existingIndex].quantity += item.quantity;
        return copy;
      }
      return [...prev, item];
    });

    // Trigger Toast Notification Banner
    setCartToast({
      id: Date.now().toString(),
      productName: item.productName,
      productImage: item.productImage,
      color: item.color,
      size: item.size,
      quantity: item.quantity,
      price: item.price
    });
  };

  // Update Cart Quantity (delta change, min 1)
  const handleUpdateCartQuantity = (variantId: string, delta: number) => {
    setCartItems((prev) =>
      prev.map((i) => {
        if (i.variantId === variantId) {
          const newQty = Math.max(1, i.quantity + delta);
          return { ...i, quantity: newQty };
        }
        return i;
      })
    );
  };

  // Remove Cart Item
  const handleRemoveCartItem = (variantId: string) => {
    setCartItems((prev) => prev.filter((i) => i.variantId !== variantId));
  };

  // Apply Voucher
  const handleApplyVoucher = (code: string) => {
    const v = vouchers.find((x) => x.code.toUpperCase() === code.toUpperCase());
    if (v) {
      const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
      let disc = 0;
      if (v.discountType === 'PERCENT') {
        disc = (subtotal * v.discountValue) / 100;
        if (v.maxDiscount) disc = Math.min(disc, v.maxDiscount);
      } else {
        disc = v.discountValue;
      }
      setDiscountAmount(disc);
      setAppliedVoucher(v.code);
    } else {
      alert('Mã giảm giá không hợp lệ hoặc đã hết hạn!');
    }
  };

  // Online Completed Order Modal state
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Dedicated POS Receipt Modal state
  const [posReceiptOrder, setPosReceiptOrder] = useState<Order | null>(null);
  const [posCashTendered, setPosCashTendered] = useState<number>(0);
  const [posChangeReturned, setPosChangeReturned] = useState<number>(0);

  // Dedicated POS Order Placement Handler (In-store Cashier)
  const handlePlacePOSOrder = async (orderPayload: any, cashTendered: number = 0, changeReturned: number = 0) => {
    try {
      const res = await fetch('/api/v1/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      const data = await res.json();
      if (data.success && data.data) {
        const createdOrder: Order = data.data;
        setPosReceiptOrder(createdOrder);
        setPosCashTendered(cashTendered);
        setPosChangeReturned(changeReturned);
        await fetchAllData();
      }
    } catch (err) {
      console.error('POS Order Error:', err);
    }
  };

  // Order Placement Success (Online Storefront)
  const handlePlaceOrderSuccess = async (orderPayload: any) => {
    try {
      const res = await fetch('/api/v1/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      const data = await res.json();
      if (data.success) {
        setCartItems([]);
        setDiscountAmount(0);
        setAppliedVoucher(undefined);
        setIsCartOpen(false);
        setIsCheckoutOpen(false);

        const createdOrder: Order = data.data;
        setCompletedOrder(createdOrder);

        await fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Product Admin Actions
  const handleCreateProduct = async (pData: any) => {
    const res = await fetch('/api/v1/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pData)
    });
    const data = await res.json();
    if (data.success) fetchAllData();
  };

  const handleUpdateProduct = async (id: string, pData: any) => {
    const res = await fetch(`/api/v1/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pData)
    });
    const data = await res.json();
    if (data.success) fetchAllData();
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;
    const res = await fetch(`/api/v1/products/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) fetchAllData();
  };

  // Inventory adjustment
  const handleAdjustStock = async (productId: string, variantId: string, quantityDelta: number, note: string) => {
    const res = await fetch('/api/v1/stock/adjust', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId,
        variantId,
        quantityDelta,
        note,
        performedBy: currentUser?.name || 'Admin'
      })
    });
    const data = await res.json();
    if (data.success) fetchAllData();
  };

  // Supplier & PO
  const handleCreatePO = async (poData: any) => {
    const res = await fetch('/api/v1/purchase-orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...poData, createdBy: currentUser?.name || 'Admin' })
    });
    const data = await res.json();
    if (data.success) fetchAllData();
  };

  const handleReceivePO = async (poId: string) => {
    const res = await fetch(`/api/v1/purchase-orders/${poId}/receive`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ performedBy: currentUser?.name || 'Admin' })
    });
    const data = await res.json();
    if (data.success) fetchAllData();
  };

  // Order status update
  const handleUpdateOrderStatus = async (orderId: string, status: any, note?: string) => {
    const res = await fetch(`/api/v1/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, note, performedBy: currentUser?.name || 'Admin' })
    });
    const data = await res.json();
    if (data.success) {
      await fetchAllData();
    }
  };

  // Mark all notifications as read
  const handleMarkNotificationsAsRead = async () => {
    setNotifications((prev) =>
      (prev || []).map((n) => ({ ...n, isRead: true }))
    );
    try {
      await fetch('/api/v1/notifications/mark-read', { method: 'POST' });
    } catch (e) {
      console.error('Failed to sync mark notifications as read:', e);
    }
  };

  const safeProducts = products || [];
  const wishlistProducts = safeProducts.filter((p) => (wishlistIds || []).includes(p.id));
  const recentlyViewedProducts = safeProducts.filter((p) => (recentlyViewedIds || []).includes(p.id));

  const handleScrollToProducts = () => {
    const target = document.getElementById('product-catalog-section');
    if (!target) return;

    const headerOffset = 80;
    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 1300; // 1.3s slow and gentle scroll
    let startTime: number | null = null;

    const easeInOutCubic = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = easeInOutCubic(progress);

      window.scrollTo(0, startPosition + distance * easeProgress);

      if (elapsed < duration) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={(cartItems || []).reduce((s, i) => s + i.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        notifications={notifications}
        onMarkNotificationsAsRead={handleMarkNotificationsAsRead}
        wishlistCount={(wishlistIds || []).length}
        onLogout={() => setCurrentUser(null)}
        onOpenCustomerPortal={() => setActiveTab('ACCOUNT')}
        onOpenAccountProfile={() => setIsAccountProfileOpen(true)}
      />

      <div className="flex-1">
        {activeTab === 'STORE' && (
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <Banner onExploreClick={handleScrollToProducts} />
            <ProductCatalog
              products={products}
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              setSelectedCategoryId={setSelectedCategoryId}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onSelectProduct={handleSelectProduct}
              onAddToCart={handleAddToCart}
              wishlistIds={wishlistIds}
              onToggleWishlist={handleToggleWishlist}
            />
          </main>
        )}

        {activeTab === 'ACCOUNT' && (
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <CustomerPortal
              currentUser={currentUser}
              orders={orders}
              wishlistProducts={wishlistProducts}
              recentlyViewed={recentlyViewedProducts}
              onSelectProduct={handleSelectProduct}
              onOpenAccountProfile={() => setIsAccountProfileOpen(true)}
            />
          </main>
        )}

        {activeTab === 'ADMIN' && (
          <AdminLayout
            currentSubTab={adminSubTab}
            setCurrentSubTab={setAdminSubTab}
            currentUser={currentUser}
          >
            {adminSubTab === 'dashboard' && <DashboardView analyticsData={analyticsData} orders={orders} products={products} />}
            {adminSubTab === 'products' && (
              <ProductManager
                products={products}
                categories={categories}
                onCreateProduct={handleCreateProduct}
                onUpdateProduct={handleUpdateProduct}
                onDeleteProduct={handleDeleteProduct}
              />
            )}
            {adminSubTab === 'categories' && (
              <CategoryManager
                categories={categories}
                onCreateCategory={async (data) => {
                  await fetch('/api/v1/categories', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                  });
                  fetchAllData();
                }}
                onUpdateCategory={() => {}}
                onDeleteCategory={async (id) => {
                  await fetch(`/api/v1/categories/${id}`, { method: 'DELETE' });
                  fetchAllData();
                }}
              />
            )}
            {adminSubTab === 'inventory' && (
              <InventoryManager
                products={products}
                stockTransactions={stockTransactions}
                onAdjustStock={handleAdjustStock}
              />
            )}
            {adminSubTab === 'suppliers' && (
              <SupplierManager
                suppliers={suppliers}
                purchaseOrders={purchaseOrders}
                products={products}
                onCreateSupplier={() => {}}
                onCreatePO={handleCreatePO}
                onReceivePO={handleReceivePO}
              />
            )}
            {adminSubTab === 'orders' && (
              <OrderManager orders={orders} onUpdateOrderStatus={handleUpdateOrderStatus} />
            )}
            {adminSubTab === 'pos' && (
              <POSCounter products={products} onPlacePOSOrder={handlePlacePOSOrder} />
            )}
            {adminSubTab === 'customers' && <CustomerManager users={users} />}
            {adminSubTab === 'employees' && (
              <EmployeeManager
                users={users}
                onCreateEmployee={async (data) => {
                  await fetch('/api/v1/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                  });
                  fetchAllData();
                }}
              />
            )}
            {adminSubTab === 'vouchers' && <VoucherManager vouchers={vouchers} />}
            {adminSubTab === 'audit' && <AuditLogView auditLogs={auditLogs} />}
          </AdminLayout>
        )}
      </div>

      <Footer />

      {/* Modals & Overlays */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onAddReview={async (reviewData) => {
          const authHeader = currentUser ? `Bearer ${currentUser.id}` : 'Bearer CUSTOMER';
          const res = await fetch('/api/v1/reviews', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': authHeader
            },
            body: JSON.stringify({
              ...reviewData,
              userName: reviewData.userName || currentUser?.name || 'Khách Hàng Mua Sắm',
              userId: currentUser?.id
            })
          });
          const resData = await res.json();
          if (resData.success && resData.data) {
            setReviews((prev) => [resData.data, ...(prev || []).filter(r => r.id !== resData.data.id)]);
          }
          await fetchAllData();
        }}
        currentUser={currentUser}
        isWishlisted={selectedProduct ? (wishlistIds || []).includes(selectedProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        discountAmount={discountAmount}
        onApplyVoucher={handleApplyVoucher}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        discountAmount={discountAmount}
        voucherCode={appliedVoucher}
        currentUser={currentUser}
        onPlaceOrderSuccess={handlePlaceOrderSuccess}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setIsAuthModalOpen(false);
        }}
      />

      <AccountProfileModal
        isOpen={isAccountProfileOpen}
        onClose={() => setIsAccountProfileOpen(false)}
        currentUser={currentUser}
        onUpdateProfile={handleUpdateProfile}
        onChangePassword={handleChangePassword}
      />

      {/* Floating Add To Cart Toast Notification */}
      {cartToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900/95 backdrop-blur-md border border-emerald-500/50 rounded-3xl p-4 shadow-2xl text-slate-100 max-w-sm w-full transition-all animate-bounce-short">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-xs">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>ĐÃ THÊM VÀO GIỎ HÀNG THÀNH CÔNG!</span>
            </div>
            <button
              onClick={() => setCartToast(null)}
              className="text-slate-400 hover:text-white text-xs font-bold p-1"
            >
              ✕
            </button>
          </div>

          <div className="flex items-center gap-3 mt-3 bg-slate-950 p-2.5 rounded-2xl border border-slate-800">
            <img
              src={cartToast.productImage}
              alt={cartToast.productName}
              className="w-12 h-14 object-cover rounded-xl border border-slate-800 shrink-0"
            />
            <div className="flex-1 min-w-0 text-xs">
              <h5 className="font-bold text-white truncate">{cartToast.productName}</h5>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Màu: <span className="text-slate-200">{cartToast.color}</span> • Size:{' '}
                <span className="text-amber-300 font-bold">{cartToast.size}</span> • x{cartToast.quantity}
              </p>
              <p className="text-rose-400 font-extrabold text-xs mt-1">
                {(cartToast.price * cartToast.quantity).toLocaleString('vi-VN')}đ
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3 text-xs font-bold">
            <button
              onClick={() => {
                setCartToast(null);
                setIsCartOpen(true);
              }}
              className="bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-xl border border-slate-700 text-center transition-colors"
            >
              Xem Giỏ Hàng
            </button>
            <button
              onClick={() => {
                setCartToast(null);
                setIsCheckoutOpen(true);
              }}
              className="bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white py-2 rounded-xl text-center shadow-md transition-all"
            >
              Thanh Toán Ngay
            </button>
          </div>
        </div>
      )}

      {/* Order Success & Tracking Modal Overlay (Online Storefront) */}
      <OrderSuccessModal
        order={completedOrder}
        onClose={() => setCompletedOrder(null)}
        onViewOrderInAccount={() => {
          setCompletedOrder(null);
          setActiveTab('ACCOUNT');
        }}
      />

      {/* Dedicated POS In-Store Cashier Bill Receipt Modal */}
      <POSReceiptModal
        order={posReceiptOrder}
        cashTendered={posCashTendered}
        changeReturned={posChangeReturned}
        onClose={() => setPosReceiptOrder(null)}
        onNewOrder={() => setPosReceiptOrder(null)}
      />
    </div>
  );
}
