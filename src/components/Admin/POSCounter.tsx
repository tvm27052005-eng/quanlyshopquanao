import React, { useState } from 'react';
import {
  Receipt,
  Search,
  Plus,
  Trash2,
  CheckCircle2,
  Barcode,
  CreditCard,
  DollarSign,
  QrCode,
  UserCheck,
  Tag,
  Percent,
  Calculator
} from 'lucide-react';
import { Product, CartItem, ProductVariant } from '../../types';

interface POSCounterProps {
  products: Product[];
  onPlacePOSOrder: (orderData: any, cashTendered?: number, changeReturned?: number) => void;
}

export const POSCounter: React.FC<POSCounterProps> = ({ products, onPlacePOSOrder }) => {
  const [search, setSearch] = useState('');
  const [posCart, setPosCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState('Khách Mua Vãng Lai');
  const [customerPhone, setCustomerPhone] = useState('0900000000');
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CARD' | 'BANK_QR'>('CASH');

  // Financials & Cash Calculator
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [cashTenderedInput, setCashTenderedInput] = useState<string>('');

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.variants.some((v) => v.sku.toLowerCase().includes(search.toLowerCase()) || v.barcode.includes(search))
  );

  const handleAddItemToPOSCart = (product: Product, variant: ProductVariant) => {
    setPosCart((prev) => {
      const idx = prev.findIndex((i) => i.variantId === variant.id);
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx].quantity += 1;
        return copy;
      }
      return [
        ...prev,
        {
          productId: product.id,
          productName: product.name,
          productImage: product.images[0],
          variantId: variant.id,
          sku: variant.sku,
          color: variant.color,
          size: variant.size,
          price: variant.price,
          originalPrice: variant.originalPrice,
          quantity: 1,
          maxStock: variant.stock
        }
      ];
    });
  };

  const handleUpdateQuantity = (variantId: string, delta: number) => {
    setPosCart((prev) =>
      prev
        .map((item) => {
          if (item.variantId === variantId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const subtotal = posCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalAmount = Math.max(0, subtotal - discountAmount);

  // Cash Calculation
  const cashGiven = Number(cashTenderedInput) || (paymentMethod === 'CASH' ? totalAmount : totalAmount);
  const changeReturned = Math.max(0, cashGiven - totalAmount);

  const handleCheckoutPOS = () => {
    if (posCart.length === 0) return;

    const payload = {
      customerId: 'pos-guest',
      customerName: customerName.trim() || 'Khách Mua Tại Quầy',
      customerPhone: customerPhone.trim() || '0900000000',
      customerEmail: 'pos@fashionpro.vn',
      shippingAddress: 'Mua trực tiếp tại Showroom FashionPro POS',
      items: posCart.map((i) => ({
        productId: i.productId,
        productName: i.productName,
        variantId: i.variantId,
        sku: i.sku,
        color: i.color,
        size: i.size,
        price: i.price,
        quantity: i.quantity
      })),
      subtotal,
      discountAmount,
      shippingFee: 0,
      totalAmount,
      status: 'DELIVERED',
      paymentMethod,
      paymentStatus: 'PAID',
      source: 'POS'
    };

    onPlacePOSOrder(payload, cashGiven, changeReturned);
    setPosCart([]);
    setDiscountAmount(0);
    setCashTenderedInput('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Barcode className="w-5 h-5 text-amber-400" /> Quầy Bán Hàng Tại Quầy (POS Counter)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Chuyên dụng cho thu ngân: Quét Barcode/SKU, tính tiền thừa, in hóa đơn 80mm tức thì tại quầy.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-xl text-xs text-amber-300 font-bold flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-emerald-400" /> Thu Ngân: Lê Thị Quản Lý (POS-01)
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Product Lookup Grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Quét mã vạch Barcode hoặc tìm sản phẩm, SKU, màu sắc..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-rose-500 shadow-xl"
            />
            <Barcode className="w-5 h-5 text-amber-400 absolute left-3 top-3" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[620px] overflow-y-auto pr-1">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex gap-3 shadow-lg hover:border-slate-700 transition-colors"
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-16 h-20 object-cover rounded-xl border border-slate-800 flex-shrink-0"
                />

                <div className="flex-1 min-w-0 space-y-1">
                  <h4 className="font-bold text-xs text-white truncate">{product.name}</h4>
                  <p className="text-rose-400 font-black text-xs">
                    {product.basePrice.toLocaleString('vi-VN')}đ
                  </p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {product.variants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => handleAddItemToPOSCart(product, variant)}
                        disabled={variant.stock === 0}
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-colors ${
                          variant.stock > 0
                            ? 'bg-slate-800 hover:bg-rose-600 hover:text-white text-slate-300 border-slate-700'
                            : 'bg-slate-950 text-slate-600 border-slate-900 line-through'
                        }`}
                      >
                        {variant.size}-{variant.color} ({variant.stock})
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Active POS Cart & Cashier Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl flex flex-col justify-between h-[660px] text-xs">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
                <Receipt className="w-4 h-4 text-rose-400" /> Hóa Đơn Thanh Toán POS
              </h3>
              <span className="bg-amber-500/20 text-amber-300 font-bold px-2.5 py-0.5 rounded-full border border-amber-500/30">
                {posCart.length} mặt hàng
              </span>
            </div>

            {/* Customer Quick Info */}
            <div className="grid grid-cols-2 gap-2 bg-slate-950 p-2.5 rounded-2xl border border-slate-800">
              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-0.5">Tên Khách Hàng</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1 text-white font-semibold text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-0.5">Số Điện Thoại</label>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1 text-white font-mono text-xs"
                />
              </div>
            </div>

            {/* Cart Items List */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {posCart.length === 0 ? (
                <p className="text-center text-slate-500 py-10">Chưa chọn sản phẩm vào hóa đơn quầy.</p>
              ) : (
                posCart.map((item) => (
                  <div key={item.variantId} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div className="min-w-0 flex-1 pr-2">
                      <p className="font-bold text-white text-xs truncate">{item.productName}</p>
                      <p className="text-[10px] text-slate-400">
                        {item.color} / Size {item.size} • {item.price.toLocaleString('vi-VN')}đ
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center bg-slate-800 rounded-lg p-0.5">
                        <button
                          onClick={() => handleUpdateQuantity(item.variantId, -1)}
                          className="w-5 h-5 flex items-center justify-center font-bold text-slate-300 hover:text-white"
                        >
                          -
                        </button>
                        <span className="w-5 text-center font-bold text-white">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.variantId, 1)}
                          className="w-5 h-5 flex items-center justify-center font-bold text-slate-300 hover:text-white"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => handleUpdateQuantity(item.variantId, -item.quantity)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Cashier Payment & Calculator Panel */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            {/* Payment Method Selector */}
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                Phương Thức Thanh Toán Tại Quầy:
              </label>
              <div className="grid grid-cols-3 gap-1.5 text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('CASH')}
                  className={`py-2 rounded-xl border flex items-center justify-center gap-1.5 transition-all ${
                    paymentMethod === 'CASH'
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <DollarSign className="w-3.5 h-3.5" /> Tiền Mặt
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('CARD')}
                  className={`py-2 rounded-xl border flex items-center justify-center gap-1.5 transition-all ${
                    paymentMethod === 'CARD'
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" /> Quẹt Thẻ
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('BANK_QR')}
                  className={`py-2 rounded-xl border flex items-center justify-center gap-1.5 transition-all ${
                    paymentMethod === 'BANK_QR'
                      ? 'bg-amber-600 text-white border-amber-500 shadow-sm'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <QrCode className="w-3.5 h-3.5" /> Bank QR
                </button>
              </div>
            </div>

            {/* Cash Calculator (for Cash payments) */}
            {paymentMethod === 'CASH' && (
              <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                    <Calculator className="w-3 h-3 text-amber-400" /> Số Tiền Khách Đưa (VND):
                  </span>
                  <input
                    type="number"
                    placeholder={totalAmount.toString()}
                    value={cashTenderedInput}
                    onChange={(e) => setCashTenderedInput(e.target.value)}
                    className="w-32 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-right text-white font-mono font-bold text-xs"
                  />
                </div>

                {/* Quick Cash Buttons */}
                <div className="flex items-center gap-1 overflow-x-auto">
                  {[totalAmount, 100000, 200000, 500000, 1000000].map((amt, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCashTenderedInput(amt.toString())}
                      className="text-[9px] font-bold bg-slate-900 hover:bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-800 whitespace-nowrap"
                    >
                      {amt === totalAmount ? 'Đủ tiền' : `${amt / 1000}k`}
                    </button>
                  ))}
                </div>

                {/* Change to return */}
                <div className="flex items-center justify-between text-xs font-bold pt-1 border-t border-slate-800">
                  <span className="text-slate-400">Tiền Thừa Trả Khách:</span>
                  <span className="text-emerald-400 font-black text-sm">
                    {changeReturned.toLocaleString('vi-VN')}đ
                  </span>
                </div>
              </div>
            )}

            {/* Total Financial Summary */}
            <div className="space-y-1 pt-1 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Tạm tính tiền hàng:</span>
                <span>{subtotal.toLocaleString('vi-VN')}đ</span>
              </div>

              <div className="flex justify-between font-black text-white text-sm pt-1 border-t border-slate-800">
                <span>TỔNG CỘNG THANH TOÁN:</span>
                <span className="text-rose-400 text-base">{totalAmount.toLocaleString('vi-VN')}đ</span>
              </div>
            </div>

            {/* Checkout & Print Receipt Button */}
            <button
              onClick={handleCheckoutPOS}
              disabled={posCart.length === 0}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 text-slate-950 font-black py-3 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 text-sm"
            >
              <CheckCircle2 className="w-5 h-5" /> Thanh Toán & In Hóa Đơn POS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
