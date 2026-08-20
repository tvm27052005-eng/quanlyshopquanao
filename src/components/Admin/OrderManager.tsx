import React, { useState } from 'react';
import { ShoppingCart, Clock, CheckCircle, Truck, PackageCheck, XCircle, Printer } from 'lucide-react';
import { Order, OrderStatus } from '../../types';

interface OrderManagerProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;
}

export const OrderManager: React.FC<OrderManagerProps> = ({ orders = [], onUpdateOrderStatus }) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(null);

  const safeOrders = orders || [];

  const filteredOrders = safeOrders.filter((o) => {
    if (filterStatus === 'ALL') return true;
    return o.status === filterStatus;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-1 rounded-full font-bold">Chờ Xác Nhận</span>;
      case 'CONFIRMED':
        return <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 px-2.5 py-1 rounded-full font-bold">Đã Xác Nhận</span>;
      case 'PACKING':
        return <span className="bg-purple-500/20 text-purple-300 border border-purple-500/40 px-2.5 py-1 rounded-full font-bold">Đang Đóng Gói</span>;
      case 'SHIPPING':
        return <span className="bg-blue-500/20 text-blue-300 border border-blue-500/40 px-2.5 py-1 rounded-full font-bold">Đang Giao Hàng</span>;
      case 'DELIVERED':
        return <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-1 rounded-full font-bold">Hoàn Thành</span>;
      case 'CANCELLED':
        return <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2.5 py-1 rounded-full font-bold">Đã Hủy</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white">Quản Lý Đơn Hàng & Vận Chuyển</h2>
          <p className="text-xs text-slate-400 mt-1">
            Quy trình xử lý đơn: Chờ xác nhận ➔ Đã xác nhận ➔ Đóng gói ➔ Giao hàng ➔ Hoàn thành
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs font-bold">
        {['ALL', 'PENDING', 'CONFIRMED', 'PACKING', 'SHIPPING', 'DELIVERED', 'CANCELLED'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3.5 py-2 rounded-xl transition-all border whitespace-nowrap ${
              filterStatus === st
                ? 'bg-rose-600 text-white border-rose-500 shadow-md'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            {st === 'ALL' ? 'Tất Cả Đơn Hàng' : st}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400">
            <ShoppingCart className="w-12 h-12 text-slate-600 mx-auto mb-2" />
            <p className="font-bold text-white text-sm">Không Có Đơn Hàng Nào</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs border-b border-slate-800 pb-3">
                <div>
                  <span className="font-black text-white text-base">#{order.orderCode}</span>
                  <span className="text-slate-400 ml-3">
                    Khách hàng: <span className="text-white font-bold">{order.customerName}</span> ({order.customerPhone})
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {getStatusBadge(order.status)}
                  <button
                    onClick={() => setSelectedOrderForInvoice(order)}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-colors"
                    title="In hóa đơn"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Items Table */}
              <div className="space-y-2 text-xs">
                {(order.items || []).map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-slate-950 p-3 rounded-2xl border border-slate-800">
                    <div>
                      <p className="font-bold text-white">{item.productName}</p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        SKU: {item.sku} ({item.color} / {item.size}) x{item.quantity}
                      </p>
                    </div>
                    <span className="font-extrabold text-rose-400">
                      {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Pipeline Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs border-t border-slate-800">
                <div className="text-slate-400">
                  Địa chỉ giao: <span className="text-white font-semibold">{order.shippingAddress}</span>
                </div>

                <div className="flex items-center gap-2">
                  {order.status === 'PENDING' && (
                    <button
                      onClick={() => onUpdateOrderStatus(order.id, 'CONFIRMED', 'Admin xác nhận đơn')}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3 py-1.5 rounded-xl transition-colors"
                    >
                      Xác Nhận Đơn
                    </button>
                  )}
                  {order.status === 'CONFIRMED' && (
                    <button
                      onClick={() => onUpdateOrderStatus(order.id, 'PACKING', 'Nhân viên kho đang đóng gói')}
                      className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-3 py-1.5 rounded-xl transition-colors"
                    >
                      Bắt Đầu Đóng Gói
                    </button>
                  )}
                  {order.status === 'PACKING' && (
                    <button
                      onClick={() => onUpdateOrderStatus(order.id, 'SHIPPING', 'Bàn giao Shipper')}
                      className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1.5 rounded-xl transition-colors"
                    >
                      Giao Cho Shipper
                    </button>
                  )}
                  {order.status === 'SHIPPING' && (
                    <button
                      onClick={() => onUpdateOrderStatus(order.id, 'DELIVERED', 'Khách đã nhận hàng & thanh toán')}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-xl transition-colors"
                    >
                      Xác Nhận Đã Giao
                    </button>
                  )}
                  {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                    <button
                      onClick={() => onUpdateOrderStatus(order.id, 'CANCELLED', 'Hủy đơn hàng')}
                      className="bg-slate-800 hover:bg-rose-600/30 text-rose-400 font-bold px-3 py-1.5 rounded-xl transition-colors"
                    >
                      Hủy Đơn
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Invoice Modal */}
      {selectedOrderForInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 text-xs text-slate-100">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-base">Hóa Đơn Bán Hàng #{selectedOrderForInvoice.orderCode}</h3>
              <button onClick={() => setSelectedOrderForInvoice(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <p>Khách hàng: <span className="text-white font-bold">{selectedOrderForInvoice.customerName}</span></p>
              <p>Điện thoại: {selectedOrderForInvoice.customerPhone}</p>
              <p>Địa chỉ: {selectedOrderForInvoice.shippingAddress}</p>
              <div className="border-t border-slate-800 my-2 pt-2">
                {(selectedOrderForInvoice.items || []).map((it, i) => (
                  <div key={i} className="flex justify-between">
                    <span>{it.productName} ({it.size}) x{it.quantity}</span>
                    <span className="font-mono font-bold text-white">{(it.price * it.quantity).toLocaleString('vi-VN')}đ</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-800 pt-2 flex justify-between font-extrabold text-rose-400 text-sm">
                <span>Tổng Thanh Toán:</span>
                <span>{selectedOrderForInvoice.totalAmount.toLocaleString('vi-VN')}đ</span>
              </div>
            </div>
            <button
              onClick={() => window.print()}
              className="w-full bg-rose-600 text-white font-bold py-2.5 rounded-xl hover:bg-rose-500 transition-colors"
            >
              In Hóa Đơn Bán Hàng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
