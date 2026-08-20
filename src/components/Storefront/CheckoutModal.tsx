import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  QrCode,
  CreditCard,
  Truck,
  MapPin,
  Phone,
  User as UserIcon,
  ShoppingBag
} from 'lucide-react';
import { CartItem, PaymentMethod, User } from '../../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems?: CartItem[];
  items?: CartItem[];
  discountAmount: number;
  voucherCode?: string;
  currentUser: User | null;
  onPlaceOrderSuccess?: (orderData: any) => void;
  onPlaceOrder?: (orderData: any) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  items,
  discountAmount,
  voucherCode,
  currentUser,
  onPlaceOrderSuccess,
  onPlaceOrder
}) => {
  const [name, setName] = useState(currentUser?.name || 'Đặng Hoàng Nam');
  const [phone, setPhone] = useState(currentUser?.phone || '0987654321');
  const [email, setEmail] = useState(currentUser?.email || 'hoangnam@gmail.com');
  const [address, setAddress] = useState('123 Đường Nguyễn Trãi, Quận 1, TP. Hồ Chí Minh');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('VNPAY');
  const [notes, setNotes] = useState('Giao giờ hành chính giúp tôi');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const activeCartItems = cartItems || items || [];
  const handlePlaceOrderSubmit = onPlaceOrderSuccess || onPlaceOrder || (() => {});

  const subtotal = activeCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = subtotal >= 500000 ? 0 : 30000;
  const totalAmount = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const orderPayload = {
        customerId: currentUser?.id || 'cust-online',
        customerName: name,
        customerPhone: phone,
        customerEmail: email,
        shippingAddress: address,
        items: activeCartItems.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          variantId: item.variantId,
          sku: item.sku,
          color: item.color,
          size: item.size,
          price: item.price,
          quantity: item.quantity
        })),
        subtotal,
        discountAmount,
        voucherCode,
        shippingFee,
        totalAmount,
        status: 'PENDING',
        paymentMethod,
        paymentStatus: paymentMethod === 'COD' ? 'UNPAID' : 'PAID',
        notes,
        source: 'ONLINE'
      };

      setIsProcessing(false);
      handlePlaceOrderSubmit(orderPayload);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full my-auto overflow-hidden shadow-2xl relative text-slate-100 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-rose-400" />
            <h3 className="font-extrabold text-base text-white">Xác Nhận Đặt Hàng & Thanh Toán</h3>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-full bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmitOrder} className="overflow-y-auto p-6 space-y-6 text-xs">
          {/* Shipping Form */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-400" /> 1. Thông Tin Giao Hàng
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Họ & Tên Người Nhận</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Số Điện Thoại</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Địa Chỉ Nhận Hàng</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Ghi Chú Đơn Hàng (Tùy chọn)</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi giao..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-rose-400" /> 2. Cổng Thanh Toán Tích Hợp
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('VNPAY')}
                className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  paymentMethod === 'VNPAY'
                    ? 'bg-rose-500/20 border-rose-500 text-white shadow-lg'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-extrabold text-rose-400">VNPay QR</span>
                  <QrCode className="w-4 h-4 text-rose-400" />
                </div>
                <span className="text-[10px] text-slate-400">Thanh toán VNPAY-QR qua Banking App</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('MOMO')}
                className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  paymentMethod === 'MOMO'
                    ? 'bg-pink-500/20 border-pink-500 text-white shadow-lg'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-extrabold text-pink-400">Ví MoMo</span>
                  <QrCode className="w-4 h-4 text-pink-400" />
                </div>
                <span className="text-[10px] text-slate-400">Quét mã QR qua ví điện tử MoMo</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('COD')}
                className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  paymentMethod === 'COD'
                    ? 'bg-amber-500/20 border-amber-500 text-white shadow-lg'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-extrabold text-amber-400">Thanh Toán COD</span>
                  <Truck className="w-4 h-4 text-amber-400" />
                </div>
                <span className="text-[10px] text-slate-400">Trả tiền mặt khi nhận hàng tận nơi</span>
              </button>
            </div>

            {/* QR Mock Preview for VNPay / MoMo */}
            {(paymentMethod === 'VNPAY' || paymentMethod === 'MOMO') && (
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center gap-4">
                <div className="w-20 h-20 bg-white p-2 rounded-xl flex items-center justify-center flex-shrink-0">
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=FASHIONPRO_PAYMENT"
                    alt="Payment QR"
                    className="w-full h-full"
                  />
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-white text-xs">Mã QR Thanh Toán Tự Động Callback API</p>
                  <p className="text-[11px] text-slate-400">
                    Sau khi đặt hàng, hệ thống sẽ tự động gửi webhook xác nhận giao dịch thành công.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Table */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-white mb-2">Tóm Tắt Đơn Hàng ({activeCartItems.length} sản phẩm)</h4>
            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
              {activeCartItems.map((item) => (
                <div key={item.variantId} className="flex items-center justify-between text-slate-300">
                  <span className="truncate pr-2">
                    {item.productName} ({item.color} / {item.size}) x{item.quantity}
                  </span>
                  <span className="font-bold text-white font-mono">
                    {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-800 pt-2 space-y-1 text-slate-400">
              <div className="flex justify-between">
                <span>Tạm tính:</span>
                <span>{subtotal.toLocaleString('vi-VN')}đ</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-rose-400">
                  <span>Giảm giá voucher:</span>
                  <span>-{discountAmount.toLocaleString('vi-VN')}đ</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Phí vận chuyển:</span>
                <span>{shippingFee === 0 ? 'MIỄN PHÍ' : `${shippingFee.toLocaleString('vi-VN')}đ`}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-white pt-2 border-t border-slate-800">
                <span>Tổng Cần Thanh Toán:</span>
                <span className="text-rose-400 text-base">{totalAmount.toLocaleString('vi-VN')}đ</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-extrabold py-3.5 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 text-sm"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Đang Khởi Tạo Đơn Hàng...
              </span>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" /> Đặt Hàng Ngay ({totalAmount.toLocaleString('vi-VN')}đ)
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
