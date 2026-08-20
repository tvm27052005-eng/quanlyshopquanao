import React, { useState } from 'react';
import { Truck, Plus, CheckCircle2, FileText, Building2 } from 'lucide-react';
import { Supplier, PurchaseOrder, Product } from '../../types';

interface SupplierManagerProps {
  suppliers: Supplier[];
  purchaseOrders: PurchaseOrder[];
  products: Product[];
  onCreateSupplier: (data: any) => void;
  onCreatePO: (data: any) => void;
  onReceivePO: (poId: string) => void;
}

export const SupplierManager: React.FC<SupplierManagerProps> = ({
  suppliers,
  purchaseOrders,
  products,
  onCreateSupplier,
  onCreatePO,
  onReceivePO
}) => {
  const [activeTab, setActiveTab] = useState<'POS' | 'SUPPLIERS'>('POS');
  const [showPOModal, setShowPOModal] = useState(false);
  const [supplierId, setSupplierId] = useState(suppliers[0]?.id || '');

  // Line items state
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [selectedVariantId, setSelectedVariantId] = useState(products[0]?.variants[0]?.id || '');
  const [quantity, setQuantity] = useState(50);
  const [importPrice, setImportPrice] = useState(200000);

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  const handleCreatePOSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const variant = selectedProduct.variants.find((v) => v.id === selectedVariantId) || selectedProduct.variants[0];

    const poData = {
      supplierId,
      items: [
        {
          productId: selectedProduct.id,
          variantId: variant.id,
          productName: selectedProduct.name,
          sku: variant.sku,
          color: variant.color,
          size: variant.size,
          quantity,
          importPrice
        }
      ],
      notes: 'Nhập lô hàng bổ sung kho'
    };

    onCreatePO(poData);
    setShowPOModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white">Quản Lý Nhà Cung Cấp & Phiếu Nhập Hàng (PO)</h2>
          <p className="text-xs text-slate-400 mt-1">
            Quản lý nhà máy may mặc, đặt đơn hàng nhập kho và tự động cập nhật số lượng tồn kho.
          </p>
        </div>

        <button
          onClick={() => setShowPOModal(true)}
          className="bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-lg transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Tạo Phiếu Nhập Kho (PO)
        </button>
      </div>

      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('POS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
            activeTab === 'POS'
              ? 'bg-rose-600 text-white border-rose-500 shadow-md'
              : 'bg-slate-900 text-slate-400 border-slate-800'
          }`}
        >
          Danh Sách Phiếu Nhập ({purchaseOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('SUPPLIERS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
            activeTab === 'SUPPLIERS'
              ? 'bg-rose-600 text-white border-rose-500 shadow-md'
              : 'bg-slate-900 text-slate-400 border-slate-800'
          }`}
        >
          Danh Sách Nhà Cung Cấp ({suppliers.length})
        </button>
      </div>

      {activeTab === 'POS' ? (
        <div className="space-y-4">
          {purchaseOrders.map((po) => (
            <div key={po.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs border-b border-slate-800 pb-3">
                <div>
                  <span className="font-extrabold text-white text-sm">Phiếu nhập: {po.poNumber}</span>
                  <span className="text-slate-400 ml-3">Nhà cung cấp: {po.supplierName}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-[11px] font-bold border ${
                      po.status === 'RECEIVED'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    }`}
                  >
                    {po.status === 'RECEIVED' ? 'ĐÃ NHẬP KHO' : 'ĐANG CHỜ HÀNG VỀ'}
                  </span>

                  {po.status !== 'RECEIVED' && (
                    <button
                      onClick={() => onReceivePO(po.id)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded-xl font-bold text-xs shadow-md transition-colors flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Xác Nhận Nhập Kho
                    </button>
                  )}
                </div>
              </div>

              {/* Items in PO */}
              <div className="space-y-2 text-xs">
                {po.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-slate-950 p-3 rounded-2xl border border-slate-800">
                    <div>
                      <p className="font-bold text-white">{item.productName}</p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        SKU: {item.sku} ({item.color} / {item.size})
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-amber-400">x{item.quantity} sản phẩm</p>
                      <p className="text-[11px] text-slate-400">
                        Đơn giá nhập: {item.importPrice.toLocaleString('vi-VN')}đ
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between text-xs font-bold border-t border-slate-800 pt-3">
                <span className="text-slate-400">Tạo bởi: {po.createdBy}</span>
                <span className="text-white">
                  Tổng giá trị PO:{' '}
                  <span className="text-rose-400 text-base">{po.totalAmount.toLocaleString('vi-VN')}đ</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suppliers.map((s) => (
            <div key={s.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-2 text-xs text-slate-300 shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-rose-400" /> {s.name}
                </h3>
                <span className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">{s.code}</span>
              </div>
              <p>Người liên hệ: <span className="text-white font-semibold">{s.contactPerson}</span></p>
              <p>Điện thoại: <span className="text-amber-400 font-mono">{s.phone}</span></p>
              <p>Email: <span className="text-indigo-400 font-mono">{s.email}</span></p>
              <p>Địa chỉ: <span className="text-slate-400">{s.address}</span></p>
            </div>
          ))}
        </div>
      )}

      {/* Modal create PO */}
      {showPOModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 text-xs text-slate-100">
            <h3 className="font-extrabold text-base text-white">Khởi Tạo Phiếu Nhập Kho Mới (PO)</h3>
            <form onSubmit={handleCreatePOSubmit} className="space-y-3">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Nhà Cung Cấp</label>
                <select
                  value={supplierId}
                  onChange={(e) => setSupplierId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Sản Phẩm Cần Nhập</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => {
                    setSelectedProductId(e.target.value);
                    const p = products.find((x) => x.id === e.target.value);
                    if (p && p.variants[0]) setSelectedVariantId(p.variants[0].id);
                  }}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Biến Thể (Size/Color)</label>
                <select
                  value={selectedVariantId}
                  onChange={(e) => setSelectedVariantId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  {selectedProduct?.variants.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.sku} - Màu {v.color} - Size {v.size}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Số Lượng Nhập</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Giá Nhập / SP (VND)</label>
                  <input
                    type="number"
                    value={importPrice}
                    onChange={(e) => setImportPrice(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPOModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Hủy
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold">
                  Tạo Phiếu PO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
