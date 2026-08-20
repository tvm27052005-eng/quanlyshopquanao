import React, { useState } from 'react';
import {
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  CreditCard,
  Copy,
  Check,
  ArrowRight,
  ShoppingBag,
  X
} from 'lucide-react';
import { Order } from '../../types';

interface OrderSuccessModalProps {
  order: Order | null;
  onClose: () => void;
  onViewOrderInAccount: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  onClose,
  onViewOrderInAccount
}) => {
  const [copied, setCopied] = useState(false);

  if (!order) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(order.orderCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full my-auto overflow-hidden shadow-2xl relative text-slate-100 flex flex-col max-h-[92vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 text-center border-b border-slate-800 space-y-3">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto shadow-lg animate-pulse">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <h3 className="font-extrabold text-xl text-white">🎉 Đặt Hàng Thành Công!</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Cảm ơn bạn đã mua sắm tại <strong className="text-white">FashionPro Enterprise</strong>. Đơn hàng của bạn đã được ghi nhận vào hệ thống.
          </p>

          {/* Order Code Badge */}
          <div className="inline-flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-2xl border border-slate-800 text-xs mt-1">
            <span className="text-slate-400">Mã Đơn Hàng:</span>
            <span className="font-mono font-extrabold text-amber-400 text-sm">#{order.orderCode}</span>
            <button
              onClick={handleCopyCode}
              className="p-1 text-slate-400 hover:text-white transition-colors"
              title="Sao chép mã đơn"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-5 text-xs">
          {/* Tracking Progress Bar */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
            <h4 className="font-bold text-white flex items-center gap-2 text-xs">
              <Truck className="w-4 h-4 text-rose-400" />
              Hành Trình Vận Chuyển Đơn Hàng
            </h4>

            <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
              <div className="space-y-1">
                <div className="w-7 h-7 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center mx-auto shadow-sm">
                  1
                </div>
                <p className="font-bold text-emerald-400">Khởi Tạo</p>
              </div>
              <div className="space-y-1 opacity-70">
                <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center mx-auto shadow-sm">
                  2
                </div>
                <p className="font-bold text-slate-300">Đóng Gói</p>
              </div>
              <div className="space-y-1 opacity-40">
                <div className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 font-bold flex items-center justify-center mx-auto border border-slate-700">
                  3
                </div>
                <p className="text-slate-400">Vận Chuyển</p>
              </div>
              <div className="space-y-1 opacity-40">
                <div className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 font-bold flex items-center justify-center mx-auto border border-slate-700">
                  4
                </div>
                <p className="text-slate-400">Giao Hàng</p>
              </div>
            </div>
          </div>

          {/* Shipping & Recipient Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
              <span className="font-bold text-slate-400 uppercase text-[10px] block">Người Nhận Hàng</span>
              <p className="font-bold text-white text-xs">{order.customerName}</p>
              <p className="text-slate-400 text-[11px]">{order.customerPhone} • {order.customerEmail}</p>
            </div>

            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
              <span className="font-bold text-slate-400 uppercase text-[10px] block">Địa Chỉ Giao Hàng</span>
              <p className="text-slate-200 text-[11px] line-clamp-2">{order.shippingAddress}</p>
            </div>
          </div>

          {/* Purchased Items Breakdown */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-white text-xs mb-2">Chi Tiết Sản Phẩm ({order.items.length})</h4>
            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs text-slate-300 py-1 border-b border-slate-800/60 last:border-0">
                  <div>
                    <span className="font-bold text-white">{item.productName}</span>
                    <span className="text-slate-400 ml-2">({item.color} / Size {item.size}) x{item.quantity}</span>
                  </div>
                  <span className="font-mono font-bold text-rose-400">
                    {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-800 pt-2 space-y-1 text-slate-400 text-xs">
              <div className="flex justify-between">
                <span>Phương Thức Thanh Toán:</span>
                <span className="text-white font-bold">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-white pt-2 border-t border-slate-800">
                <span>Tổng Tiền Đơn Hàng:</span>
                <span className="text-rose-400 text-base">{order.totalAmount.toLocaleString('vi-VN')}đ</span>
              </div>
            </div>
          </div>

          {/* Direct Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={onViewOrderInAccount}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold py-3.5 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 text-xs"
            >
              <Package className="w-4 h-4" />
              Theo Dõi Đơn Hàng Trong Tài Khoản
            </button>
            <button
              onClick={onClose}
              className="bg-slate-800 hover:bg-slate-700 text-white font-extrabold py-3.5 rounded-2xl border border-slate-700 transition-all flex items-center justify-center gap-2 text-xs"
            >
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              Tiếp Tục Mua Sắm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
