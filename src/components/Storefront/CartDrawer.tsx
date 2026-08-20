import React, { useState } from 'react';
import {
  X,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Tag,
  Truck,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { CartItem } from '../../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems?: CartItem[];
  items?: CartItem[];
  onUpdateQuantity: (variantId: string, delta: number) => void;
  onRemoveItem: (variantId: string) => void;
  onApplyVoucher: (code: string) => void;
  discountAmount: number;
  voucherCode?: string;
  onCheckout?: () => void;
  onProceedToCheckout?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onApplyVoucher,
  discountAmount,
  voucherCode,
  onCheckout,
  onProceedToCheckout
}) => {
  const [inputCode, setInputCode] = useState('');

  if (!isOpen) return null;

  const activeCartItems = cartItems || items || [];
  const handleProceedCheckout = onCheckout || onProceedToCheckout || (() => {});

  const subtotal = activeCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const freeShippingThreshold = 500000;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const shippingFee = subtotal >= freeShippingThreshold ? 0 : 30000;
  const total = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleVoucherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim()) {
      onApplyVoucher(inputCode.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-end">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-md h-full flex flex-col shadow-2xl text-slate-100">
        {/* Drawer Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-rose-400" />
            <h3 className="font-extrabold text-base text-white">Giỏ Hàng Của Bạn ({activeCartItems.length})</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Meter */}
        <div className="p-4 bg-slate-950/80 border-b border-slate-800/80 text-xs">
          <div className="flex items-center justify-between mb-1.5 font-bold">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Truck className="w-4 h-4 text-amber-400" />
              {subtotal >= freeShippingThreshold
                ? 'Bạn đã đủ điều kiện MIỄN PHÍ GIAO HÀNG!'
                : `Mua thêm ${(freeShippingThreshold - subtotal).toLocaleString('vi-VN')}đ để Freeship`}
            </span>
            <span className="text-amber-400">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              style={{ width: `${progressPercent}%` }}
              className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full transition-all duration-500"
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeCartItems.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-3">
              <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto" />
              <p className="font-bold text-sm text-white">Giỏ Hàng Chưa Có Sản Phẩm</p>
              <p className="text-xs text-slate-500">Hãy chọn các mẫu thời trang yêu thích và thêm vào giỏ nhé.</p>
            </div>
          ) : (
            activeCartItems.map((item) => (
              <div
                key={item.variantId}
                className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center gap-3"
              >
                <img
                  src={item.productImage}
                  alt={item.productName}
                  className="w-16 h-20 object-cover rounded-xl border border-slate-800 flex-shrink-0"
                />

                <div className="flex-1 min-w-0 space-y-1">
                  <h4 className="font-bold text-xs text-white truncate">{item.productName}</h4>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <span className="bg-slate-800 px-2 py-0.5 rounded-md">Màu: {item.color}</span>
                    <span className="bg-slate-800 px-2 py-0.5 rounded-md">Size: {item.size}</span>
                  </div>
                  <p className="text-rose-400 font-extrabold text-xs">
                    {item.price.toLocaleString('vi-VN')}đ
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
                      <button
                        disabled={item.quantity <= 1}
                        onClick={() => onUpdateQuantity(item.variantId, -1)}
                        className={`w-5 h-5 flex items-center justify-center font-bold text-xs rounded transition-colors ${
                          item.quantity <= 1 ? 'text-slate-600 cursor-not-allowed opacity-50' : 'hover:bg-slate-700 text-slate-200'
                        }`}
                        title={item.quantity <= 1 ? 'Số lượng tối thiểu là 1' : 'Giảm số lượng'}
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-bold text-[11px] text-white">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.variantId, 1)}
                        className="w-5 h-5 flex items-center justify-center font-bold text-xs hover:bg-slate-700 rounded text-slate-200"
                        title="Tăng số lượng"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.variantId)}
                      className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Voucher Code Form & Order Calculation Footer */}
        {activeCartItems.length > 0 && (
          <div className="p-4 sm:p-6 border-t border-slate-800 bg-slate-950/90 space-y-3 text-xs">
            {/* Voucher input */}
            <form onSubmit={handleVoucherSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Nhập mã FASHION50K, HELLOSUMMER..."
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-white font-mono uppercase focus:outline-none focus:border-rose-500"
                />
                <Tag className="w-3.5 h-3.5 text-amber-400 absolute left-2.5 top-2.5" />
              </div>
              <button
                type="submit"
                className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-3 py-2 rounded-xl transition-colors whitespace-nowrap"
              >
                Áp Dụng
              </button>
            </form>

            {voucherCode && (
              <p className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Đã áp dụng mã {voucherCode} (Giảm {discountAmount.toLocaleString('vi-VN')}đ)
              </p>
            )}

            {/* Price Summary */}
            <div className="space-y-1.5 text-slate-400 border-t border-slate-800/80 pt-3">
              <div className="flex justify-between">
                <span>Tạm tính:</span>
                <span className="text-white font-bold">{subtotal.toLocaleString('vi-VN')}đ</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-rose-400">
                  <span>Giảm giá voucher:</span>
                  <span>-{discountAmount.toLocaleString('vi-VN')}đ</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Phí vận chuyển:</span>
                <span className="text-white font-bold">
                  {shippingFee === 0 ? <span className="text-emerald-400 font-bold">MIỄN PHÍ</span> : `${shippingFee.toLocaleString('vi-VN')}đ`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-white pt-2 border-t border-slate-800">
                <span>Tổng Thanh Toán:</span>
                <span className="text-rose-400 text-base">{total.toLocaleString('vi-VN')}đ</span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                handleProceedCheckout();
              }}
              className="w-full bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-extrabold py-3.5 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 text-sm"
            >
              Tiến Hành Đặt Hàng <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
