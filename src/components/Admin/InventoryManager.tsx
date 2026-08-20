import React, { useState } from 'react';
import { Boxes, ArrowDownRight, ArrowUpRight, History, AlertTriangle, Plus } from 'lucide-react';
import { Product, StockTransaction } from '../../types';

interface InventoryManagerProps {
  products: Product[];
  stockTransactions: StockTransaction[];
  onAdjustStock: (productId: string, variantId: string, quantityDelta: number, note: string) => void;
}

export const InventoryManager: React.FC<InventoryManagerProps> = ({
  products = [],
  stockTransactions = [],
  onAdjustStock
}) => {
  const safeProducts = products || [];
  const safeStockTransactions = stockTransactions || [];

  const [selectedProductId, setSelectedProductId] = useState(safeProducts[0]?.id || '');
  const [selectedVariantId, setSelectedVariantId] = useState(safeProducts[0]?.variants?.[0]?.id || '');
  const [delta, setDelta] = useState(10);
  const [note, setNote] = useState('Kiểm kê điều chỉnh kho định kỳ');

  const selectedProduct = safeProducts.find((p) => p.id === selectedProductId);

  const lowStockVariants = safeProducts.flatMap((p) =>
    (p.variants || [])
      .filter((v) => v.stock < 5)
      .map((v) => ({ ...v, productName: p.name, productId: p.id }))
  );

  const handleAdjustSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || !selectedVariantId) return;
    onAdjustStock(selectedProductId, selectedVariantId, delta, note);
    setDelta(10);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-white">Quản Lý Tồn Kho & Kiểm Kê Điều Chỉnh</h2>
        <p className="text-xs text-slate-400 mt-1">
          Lịch sử giao dịch Nhập/Xuất kho, cảnh báo tồn kho thấp và thẻ kho
        </p>
      </div>

      {/* Low Stock Warning Section */}
      {lowStockVariants.length > 0 && (
        <div className="bg-amber-950/40 border border-amber-900/60 rounded-3xl p-5 text-xs text-amber-200 space-y-3">
          <div className="flex items-center gap-2 font-bold text-amber-400 text-sm">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
            <span>Cảnh Báo Tồn Kho Dưới Ngưỡng An Toàn (&lt; 5 sản phẩm)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {lowStockVariants.map((v) => (
              <div key={v.id} className="p-3 bg-slate-950 rounded-2xl border border-amber-900/40 flex items-center justify-between">
                <div>
                  <p className="font-bold text-white line-clamp-1">{v.productName}</p>
                  <p className="text-[10px] text-slate-400 font-mono">
                    SKU: {v.sku} ({v.color} / {v.size})
                  </p>
                </div>
                <span className="font-black text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-xl border border-rose-500/30">
                  {v.stock} sp
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Manual Stock Adjustment Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 text-xs">
        <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
          <Boxes className="w-4 h-4 text-rose-400" /> Điều Chỉnh Tồn Kho / Kiểm Kê (Audit Adjustment)
        </h3>

        <form onSubmit={handleAdjustSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
          <div>
            <label className="block text-slate-400 font-bold mb-1">Chọn Sản Phẩm</label>
            <select
              value={selectedProductId}
              onChange={(e) => {
                setSelectedProductId(e.target.value);
                const p = safeProducts.find((x) => x.id === e.target.value);
                if (p && p.variants && p.variants[0]) setSelectedVariantId(p.variants[0].id);
              }}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
            >
              {safeProducts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-400 font-bold mb-1">Chọn Biến Thể (Variant)</label>
            <select
              value={selectedVariantId}
              onChange={(e) => setSelectedVariantId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
            >
              {(selectedProduct?.variants || []).map((v) => (
                <option key={v.id} value={v.id}>
                  {v.sku} - {v.color} ({v.size}) - Hiện có: {v.stock}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-400 font-bold mb-1">Số Lượng (+/ -)</label>
            <input
              type="number"
              value={delta}
              onChange={(e) => setDelta(Number(e.target.value))}
              placeholder="Ví dụ: +10 hoặc -5"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
            />
          </div>

          <button
            type="submit"
            className="bg-rose-600 hover:bg-rose-500 text-white font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Xác Nhận Điều Chỉnh
          </button>
        </form>
      </div>

      {/* Stock Transaction Audit Log Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl text-xs">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
            <History className="w-4 h-4 text-amber-400" /> Nhật Ký Thẻ Kho (Stock Audit Trail)
          </h3>
          <span className="text-slate-400 font-mono text-[11px]">Giao dịch gần nhất</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-4">Thời Gian</th>
                <th className="p-4">Sản Phẩm & SKU</th>
                <th className="p-4">Loại Giao Dịch</th>
                <th className="p-4">Số Lượng</th>
                <th className="p-4">Tồn Sau GD</th>
                <th className="p-4">Thực Hiện Bởi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {safeStockTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-slate-500">
                    Chưa có lịch sử giao dịch kho thủ công nào.
                  </td>
                </tr>
              ) : (
                safeStockTransactions.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-mono text-slate-400">
                      {new Date(st.createdAt).toLocaleString('vi-VN')}
                    </td>
                    <td className="p-4 font-bold text-white">
                      {st.productName}
                      <span className="block text-[10px] text-slate-400 font-mono">{st.sku}</span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${
                          st.type === 'IN'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        }`}
                      >
                        {st.type === 'IN' ? 'NHẬP KHO' : 'XUẤT KHO'}
                      </span>
                    </td>
                    <td className="p-4 font-extrabold text-amber-400">{st.quantity}</td>
                    <td className="p-4 font-bold text-white">{st.afterQuantity}</td>
                    <td className="p-4 text-slate-400">{st.performedBy}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
