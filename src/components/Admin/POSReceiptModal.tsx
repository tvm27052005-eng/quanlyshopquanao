import React from 'react';
import { X, Printer, CheckCircle2, Store, DollarSign, CreditCard, QrCode } from 'lucide-react';
import { Order } from '../../types';

interface POSReceiptModalProps {
  order: Order | null;
  cashTendered?: number;
  changeReturned?: number;
  onClose: () => void;
  onNewOrder: () => void;
}

export const POSReceiptModal: React.FC<POSReceiptModalProps> = ({
  order,
  cashTendered = 0,
  changeReturned = 0,
  onClose,
  onNewOrder
}) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'CASH':
      case 'COD':
        return 'Tiền Mặt (Cash)';
      case 'CARD':
        return 'Quẹt Thẻ POS (Card)';
      case 'BANK_QR':
      case 'VNPAY':
      case 'MOMO':
        return 'Chuyển Khoản QR (Bank Transfer)';
      default:
        return method;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full my-auto overflow-hidden shadow-2xl relative text-slate-100 print:shadow-none print:border-none print:bg-white print:text-black print:w-full print:max-w-none">
        {/* Header - Screen only */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>THANH TOÁN TẠI QUẦY POS THÀNH CÔNG!</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-full bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 80mm Receipt Content - Printable */}
        <div className="p-6 space-y-4 text-xs font-mono bg-slate-900 print:bg-white print:p-2 text-slate-200 print:text-slate-900">
          {/* Store Header */}
          <div className="text-center space-y-1 border-b border-dashed border-slate-700 print:border-slate-400 pb-4">
            <h2 className="text-base font-black text-white print:text-black tracking-wider uppercase">
              FASHIONPRO SHOWROOM
            </h2>
            <p className="text-[11px] text-slate-400 print:text-slate-600">
              123 Đường Nguyễn Trãi, Q.1, TP. Hồ Chí Minh
            </p>
            <p className="text-[11px] text-slate-400 print:text-slate-600">
              Hotline: 1900 6868 • MST: 010892849
            </p>
            <h3 className="text-sm font-black text-amber-400 print:text-black pt-2 uppercase tracking-wide">
              HÓA ĐƠN BÁN HÀNG POS
            </h3>
          </div>

          {/* Bill Meta */}
          <div className="space-y-1 text-[11px] border-b border-dashed border-slate-700 print:border-slate-400 pb-3">
            <div className="flex justify-between">
              <span className="text-slate-400 print:text-slate-600">Mã hóa đơn:</span>
              <span className="font-bold text-white print:text-black">#{order.orderCode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 print:text-slate-600">Thời gian:</span>
              <span>{new Date(order.createdAt).toLocaleString('vi-VN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 print:text-slate-600">Thu ngân:</span>
              <span>Lê Thị Quản Lý (POS-01)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 print:text-slate-600">Khách hàng:</span>
              <span className="font-bold text-slate-200 print:text-black">{order.customerName} ({order.customerPhone})</span>
            </div>
          </div>

          {/* Items Table */}
          <div className="space-y-2 border-b border-dashed border-slate-700 print:border-slate-400 pb-4">
            <div className="grid grid-cols-12 font-bold text-slate-400 print:text-slate-700 text-[10px] uppercase border-b border-slate-800 print:border-slate-300 pb-1">
              <span className="col-span-6">Tên sản phẩm</span>
              <span className="col-span-2 text-center">SL</span>
              <span className="col-span-4 text-right">Thành tiền</span>
            </div>

            {(order.items || []).map((item, idx) => (
              <div key={idx} className="grid grid-cols-12 text-[11px] py-1">
                <div className="col-span-6 pr-1">
                  <p className="font-bold text-white print:text-black line-clamp-1">{item.productName}</p>
                  <p className="text-[10px] text-slate-400 print:text-slate-600">
                    {item.color} / {item.size}
                  </p>
                </div>
                <span className="col-span-2 text-center self-center font-bold">x{item.quantity}</span>
                <span className="col-span-4 text-right self-center font-bold text-slate-200 print:text-black">
                  {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                </span>
              </div>
            ))}
          </div>

          {/* Financial Totals */}
          <div className="space-y-1.5 pt-1 text-[11px]">
            <div className="flex justify-between text-slate-400 print:text-slate-600">
              <span>Tạm tính tiền hàng:</span>
              <span>{order.subtotal.toLocaleString('vi-VN')}đ</span>
            </div>

            {order.discountAmount > 0 && (
              <div className="flex justify-between text-rose-400 print:text-black">
                <span>Chiết khấu / Giảm giá:</span>
                <span>-{order.discountAmount.toLocaleString('vi-VN')}đ</span>
              </div>
            )}

            <div className="flex justify-between text-sm font-black text-white print:text-black border-t border-slate-800 print:border-slate-400 pt-2">
              <span>TỔNG KHÁCH THANH TOÁN:</span>
              <span className="text-amber-400 print:text-black text-base">
                {order.totalAmount.toLocaleString('vi-VN')}đ
              </span>
            </div>

            <div className="flex justify-between pt-1 text-slate-400 print:text-slate-700">
              <span>Phương thức thanh toán:</span>
              <span className="font-bold text-white print:text-black">
                {getPaymentMethodLabel(order.paymentMethod)}
              </span>
            </div>

            {cashTendered > 0 && (
              <>
                <div className="flex justify-between text-slate-300 print:text-slate-800">
                  <span>Tiền khách đưa:</span>
                  <span>{cashTendered.toLocaleString('vi-VN')}đ</span>
                </div>

                <div className="flex justify-between font-bold text-emerald-400 print:text-black">
                  <span>Tiền thừa trả lại:</span>
                  <span>{changeReturned.toLocaleString('vi-VN')}đ</span>
                </div>
              </>
            )}
          </div>

          {/* Footer Receipt Note & Barcode */}
          <div className="text-center pt-4 border-t border-dashed border-slate-700 print:border-slate-400 space-y-2">
            <div className="h-8 bg-slate-800 print:bg-slate-200 rounded flex items-center justify-center tracking-[0.3em] text-[10px] font-black text-slate-400 print:text-slate-800">
              ||||| || |||||| |||| ||| |||||| |||||
            </div>
            <p className="text-[10px] text-slate-400 print:text-slate-600 italic">
              Cảm ơn Quý khách & Hẹn gặp lại!
            </p>
            <p className="text-[9px] text-slate-500 print:text-slate-500">
              Đổi trả sản phẩm trong vòng 7 ngày kèm hóa đơn còn nguyên tem mác.
            </p>
          </div>
        </div>

        {/* Action Buttons - Screen only */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 grid grid-cols-2 gap-3 print:hidden">
          <button
            onClick={handlePrint}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <Printer className="w-4 h-4 text-amber-300" />
            In Hóa Đơn POS
          </button>

          <button
            onClick={onNewOrder}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            Tạo Đơn Tiếp Theo
          </button>
        </div>
      </div>
    </div>
  );
};
