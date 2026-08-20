import React, { useState } from 'react';
import {
  Package,
  Award,
  Heart,
  Clock,
  CheckCircle2,
  Truck,
  RotateCcw,
  Sparkles,
  ChevronRight,
  User as UserIcon,
  ShoppingBag,
  Search,
  Clipboard,
  KeyRound,
  X
} from 'lucide-react';
import { Order, User, Product } from '../../types';

interface CustomerPortalProps {
  currentUser: User | null;
  orders: Order[];
  wishlistProducts: Product[];
  recentlyViewed: Product[];
  onSelectProduct: (product: Product) => void;
  onOpenAccountProfile?: () => void;
}

export const CustomerPortal: React.FC<CustomerPortalProps> = ({
  currentUser,
  orders = [],
  wishlistProducts = [],
  recentlyViewed = [],
  onSelectProduct,
  onOpenAccountProfile
}) => {
  const [activeTab, setActiveTab] = useState<'ORDERS' | 'LOYALTY' | 'WISHLIST' | 'RECENT'>('ORDERS');
  const [searchOrderCode, setSearchOrderCode] = useState('');

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        const cleaned = text.trim().replace(/^#/, '');
        setSearchOrderCode(cleaned);
      }
    } catch (err) {
      console.error('Clipboard error:', err);
    }
  };

  if (!currentUser) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 space-y-4 max-w-xl mx-auto my-12">
        <UserIcon className="w-12 h-12 text-slate-600 mx-auto" />
        <h3 className="font-extrabold text-white text-lg">Vui Lòng Đăng Nhập</h3>
        <p className="text-xs text-slate-400">
          Đăng nhập tài khoản để xem lịch sử đơn hàng, theo dõi hành trình vận chuyển và điểm thưởng VIP.
        </p>
      </div>
    );
  }

  const safeOrders = orders || [];
  const safeWishlistProducts = wishlistProducts || [];
  const safeRecentlyViewed = recentlyViewed || [];

  const customerOrders = safeOrders.filter(
    (o) => o.customerId === currentUser.id || o.customerEmail === currentUser.email
  );

  const filteredOrders = customerOrders.filter((o) => {
    if (!searchOrderCode.trim()) return true;
    const q = searchOrderCode.trim().toLowerCase().replace(/^#/, '');
    const matchCode = o.orderCode.toLowerCase().includes(q);
    const matchName = o.customerName ? o.customerName.toLowerCase().includes(q) : false;
    const matchPhone = o.customerPhone ? o.customerPhone.includes(q) : false;
    const matchItem = (o.items || []).some(item => item.productName.toLowerCase().includes(q));
    return matchCode || matchName || matchPhone || matchItem;
  });

  return (
    <div className="space-y-6">
      {/* Customer Profile Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-white flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 p-0.5 shadow-xl">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-black text-2xl text-amber-300">
              {currentUser.name.charAt(0)}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-xl">{currentUser.name}</h2>
              <span className="bg-amber-500/20 text-amber-300 font-extrabold text-xs px-3 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1">
                <Award className="w-3.5 h-3.5" /> Hạng {currentUser.loyaltyTier}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">{currentUser.email} • {currentUser.phone}</p>
          </div>
        </div>

        {/* Loyalty Points Counter & Account Actions */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs">
            <div>
              <p className="text-slate-400 uppercase font-bold text-[10px]">Tích Điểm Thưởng</p>
              <p className="font-black text-xl text-amber-400">{currentUser.points} Điểm</p>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <div>
              <p className="text-slate-400 uppercase font-bold text-[10px]">Đơn Hàng Đã Mua</p>
              <p className="font-black text-xl text-white">{customerOrders.length} Đơn</p>
            </div>
          </div>

          {onOpenAccountProfile && (
            <button
              onClick={onOpenAccountProfile}
              className="bg-gradient-to-r from-indigo-600 to-rose-600 hover:from-indigo-500 hover:to-rose-500 text-white text-xs font-bold px-4 py-3 rounded-2xl border border-indigo-500/40 flex items-center gap-2 shadow-lg transition-all"
            >
              <KeyRound className="w-4 h-4" />
              Đổi Mật Khẩu & Hồ Sơ
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('ORDERS')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
            activeTab === 'ORDERS'
              ? 'bg-rose-600 text-white border-rose-500 shadow-md'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          <Package className="w-4 h-4" />
          Lịch Sử Đơn Hàng ({customerOrders.length})
        </button>

        <button
          onClick={() => setActiveTab('WISHLIST')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
            activeTab === 'WISHLIST'
              ? 'bg-rose-600 text-white border-rose-500 shadow-md'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          <Heart className="w-4 h-4" />
          Sản Phẩm Yêu Thích ({safeWishlistProducts.length})
        </button>

        <button
          onClick={() => setActiveTab('RECENT')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
            activeTab === 'RECENT'
              ? 'bg-rose-600 text-white border-rose-500 shadow-md'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          <Clock className="w-4 h-4" />
          Đã Xem Gần Đây ({safeRecentlyViewed.length})
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'ORDERS' && (
        <div className="space-y-4">
          {/* Order Code Lookup Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs">
                <Search className="w-4 h-4 text-amber-400" />
                <span className="font-extrabold text-white">Tra Cứu Mã Đơn Hàng</span>
              </div>

              <div className="flex items-center gap-2 flex-1 max-w-md">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Dán hoặc nhập mã đơn hàng (Ví dụ: ORD-1092)..."
                    value={searchOrderCode}
                    onChange={(e) => setSearchOrderCode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-8 py-2 text-white font-mono text-xs focus:outline-none focus:border-amber-500 transition-colors"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                  {searchOrderCode && (
                    <button
                      onClick={() => setSearchOrderCode('')}
                      className="absolute right-2.5 top-2 text-slate-400 hover:text-white text-xs font-bold"
                      title="Xóa mã"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handlePasteClipboard}
                  className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold px-3 py-2 rounded-xl border border-amber-500/40 transition-all text-xs flex items-center gap-1.5 whitespace-nowrap shadow-sm"
                  title="Dán mã đã sao chép từ Clipboard"
                >
                  <Clipboard className="w-3.5 h-3.5 text-amber-400" />
                  <span>Dán Mã (Paste)</span>
                </button>
              </div>
            </div>

            {searchOrderCode && (
              <div className="flex items-center justify-between text-xs bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800/90 text-slate-300">
                <span>
                  Đang lọc theo mã đơn: <strong className="text-amber-400 font-mono">#{searchOrderCode}</strong>
                </span>
                <span className="text-emerald-400 font-bold">Khớp {filteredOrders.length} đơn hàng</span>
              </div>
            )}
          </div>

          {filteredOrders.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400">
              <Package className="w-12 h-12 text-slate-600 mx-auto mb-2" />
              <p className="font-bold text-white text-sm">
                {searchOrderCode ? `Không Tìm Thấy Đơn Hàng Khớp Với Mã "${searchOrderCode}"` : 'Bạn Chưa Có Đơn Hàng Nào'}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {searchOrderCode ? 'Thử xóa từ khóa tra cứu hoặc dán lại mã đơn hàng khác.' : 'Hãy đặt ngay các bộ quần áo thời trang cao cấp trên cửa hàng nhé.'}
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const isMatchedSearch = Boolean(
                searchOrderCode.trim() &&
                  order.orderCode.toLowerCase().includes(searchOrderCode.trim().toLowerCase().replace(/^#/, ''))
              );

              return (
                <div
                  key={order.id}
                  className={`bg-slate-900 border rounded-3xl p-6 space-y-4 shadow-xl transition-all ${
                    isMatchedSearch
                      ? 'border-amber-500 ring-2 ring-amber-500/30 bg-slate-900/95'
                      : 'border-slate-800'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs border-b border-slate-800 pb-3">
                    <div>
                      <span className="font-extrabold text-white text-sm">Mã đơn: #{order.orderCode}</span>
                      {isMatchedSearch && (
                        <span className="ml-2 bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-md text-[10px] border border-amber-500/40">
                          🎯 Đã tìm thấy
                        </span>
                      )}
                      <span className="text-slate-400 ml-3">
                        Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-bold border ${
                        order.status === 'DELIVERED'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : order.status === 'SHIPPING'
                          ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
                          : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      {order.status === 'DELIVERED'
                        ? 'Hoàn Thành'
                        : order.status === 'SHIPPING'
                        ? 'Đang Giao Hàng'
                        : 'Chờ Xử Lý'}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs text-slate-300 py-1">
                      <div>
                        <span className="font-bold text-white">{item.productName}</span>
                        <span className="text-slate-500 ml-2">({item.color} / Size {item.size}) x{item.quantity}</span>
                      </div>
                      <span className="font-mono font-bold text-rose-400">
                        {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                  ))}
                </div>

                {/* Order Timeline Progress */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
                  <p className="font-bold text-slate-300">Hành Trình Vận Chuyển:</p>
                  <div className="space-y-1.5 pl-2 border-l-2 border-slate-800">
                    {order.history.map((h, i) => (
                      <div key={i} className="text-[11px] relative pl-3">
                        <span className="w-2 h-2 rounded-full bg-rose-500 absolute -left-[17px] top-1" />
                        <span className="font-bold text-slate-200">{h.status}:</span>{' '}
                        <span className="text-slate-400">{h.note}</span>{' '}
                        <span className="text-[10px] text-slate-500 ml-1">
                          ({new Date(h.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 text-xs font-bold border-t border-slate-800">
                  <span className="text-slate-400">Thanh toán: {order.paymentMethod}</span>
                  <span className="text-white">
                    Tổng cộng: <span className="text-rose-400 text-base">{order.totalAmount.toLocaleString('vi-VN')}đ</span>
                  </span>
                </div>
              </div>
            );
          })
        )}
        </div>
      )}

      {activeTab === 'WISHLIST' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {safeWishlistProducts.length === 0 ? (
            <div className="col-span-full bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400">
              <Heart className="w-12 h-12 text-slate-600 mx-auto mb-2" />
              <p className="font-bold text-white text-sm">Danh Sách Yêu Thích Trống</p>
            </div>
          ) : (
            safeWishlistProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => onSelectProduct(p)}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex items-center gap-3 cursor-pointer hover:border-slate-700 transition-colors"
              >
                <img src={(p.images || [])[0]} alt={p.name} className="w-16 h-20 object-cover rounded-xl" />
                <div>
                  <h4 className="font-bold text-white text-xs line-clamp-1">{p.name}</h4>
                  <p className="text-rose-400 font-extrabold text-xs mt-1">
                    {p.basePrice.toLocaleString('vi-VN')}đ
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'RECENT' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {safeRecentlyViewed.length === 0 ? (
            <div className="col-span-full bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400">
              <Clock className="w-12 h-12 text-slate-600 mx-auto mb-2" />
              <p className="font-bold text-white text-sm">Chưa Có Sản Phẩm Đã Xem</p>
            </div>
          ) : (
            safeRecentlyViewed.map((p) => (
              <div
                key={p.id}
                onClick={() => onSelectProduct(p)}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex items-center gap-3 cursor-pointer hover:border-slate-700 transition-colors"
              >
                <img src={(p.images || [])[0]} alt={p.name} className="w-16 h-20 object-cover rounded-xl" />
                <div>
                  <h4 className="font-bold text-white text-xs line-clamp-1">{p.name}</h4>
                  <p className="text-rose-400 font-extrabold text-xs mt-1">
                    {p.basePrice.toLocaleString('vi-VN')}đ
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
