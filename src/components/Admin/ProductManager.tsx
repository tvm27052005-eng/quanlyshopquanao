import React, { useState } from 'react';
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  Sparkles,
  Barcode,
  Upload,
  Check,
  Search,
  AlertCircle
} from 'lucide-react';
import { Product, Category, ProductVariant } from '../../types';

interface ProductManagerProps {
  products: Product[];
  categories: Category[];
  onCreateProduct: (productData: any) => void;
  onUpdateProduct: (id: string, productData: any) => void;
  onDeleteProduct: (id: string) => void;
}

export const ProductManager: React.FC<ProductManagerProps> = ({
  products = [],
  categories = [],
  onCreateProduct,
  onUpdateProduct,
  onDeleteProduct
}) => {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const safeProducts = products || [];
  const safeCategories = categories || [];

  // Form State
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState(safeCategories[0]?.id || '');
  const [brand, setBrand] = useState('FashionPro Studio');
  const [basePrice, setBasePrice] = useState(350000);
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop&q=80'
  ]);
  const [isFlashSale, setIsFlashSale] = useState(false);
  const [flashSalePrice, setFlashSalePrice] = useState(299000);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Variants list state
  const [variants, setVariants] = useState<ProductVariant[]>([
    {
      id: 'var-new-1',
      sku: 'SKU-NEW-WHT-M',
      barcode: '893600001001',
      color: 'Trắng',
      colorHex: '#FFFFFF',
      size: 'M',
      price: 350000,
      originalPrice: 450000,
      stock: 50,
      reservedStock: 0
    }
  ]);

  const filteredProducts = safeProducts.filter(
    (p) =>
      (p.name ? p.name.toLowerCase().includes(search.toLowerCase()) : false) ||
      (p.variants || []).some((v) => v.sku && v.sku.toLowerCase().includes(search.toLowerCase()))
  );

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setName('');
    setCategoryId(categories[0]?.id || '');
    setBrand('FashionPro Studio');
    setBasePrice(350000);
    setDescription('');
    setIsFlashSale(false);
    setVariants([
      {
        id: 'var-new-1',
        sku: 'SKU-' + Date.now().toString().slice(-4) + '-M',
        barcode: '8936' + Math.floor(10000000 + Math.random() * 90000000),
        color: 'Trắng',
        colorHex: '#FFFFFF',
        size: 'M',
        price: 350000,
        originalPrice: 450000,
        stock: 30,
        reservedStock: 0
      }
    ]);
    setShowModal(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingId(product.id);
    setName(product.name);
    setCategoryId(product.categoryId);
    setBrand(product.brand);
    setBasePrice(product.basePrice);
    setDescription(product.description);
    setImages(product.images);
    setIsFlashSale(!!product.isFlashSale);
    setFlashSalePrice(product.flashSalePrice || product.basePrice);
    setVariants(product.variants);
    setShowModal(true);
  };

  const handleGenerateAIDescription = async () => {
    if (!name.trim()) return;
    setIsGeneratingAI(true);
    try {
      const selectedCategoryName = categories.find((c) => c.id === categoryId)?.name || 'Thời trang';
      const res = await fetch('/api/v1/ai/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          category: selectedCategoryName,
          brand,
          features: 'Chất liệu vải cao cấp, thoáng mát, đường may sắc sảo'
        })
      });
      const data = await res.json();
      if (data.success && data.description) {
        setDescription(data.description);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleAddVariantRow = () => {
    const nextVar: ProductVariant = {
      id: 'var-' + Date.now(),
      sku: 'SKU-' + Math.floor(1000 + Math.random() * 9000),
      barcode: '8936' + Math.floor(10000000 + Math.random() * 90000000),
      color: 'Xanh Navy',
      colorHex: '#1B2A4A',
      size: 'L',
      price: basePrice,
      originalPrice: basePrice + 100000,
      stock: 20,
      reservedStock: 0
    };
    setVariants([...variants, nextVar]);
  };

  const handleRemoveVariantRow = (id: string) => {
    setVariants(variants.filter((v) => v.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name,
      categoryId,
      brand,
      basePrice,
      description,
      images,
      isFlashSale,
      flashSalePrice: isFlashSale ? flashSalePrice : undefined,
      variants
    };

    if (editingId) {
      onUpdateProduct(editingId, payload);
    } else {
      onCreateProduct(payload);
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white">Quản Lý Sản Phẩm & Hệ Thống Biến Thể (Variants)</h2>
          <p className="text-xs text-slate-400 mt-1">
            Quản lý kích thước (Size S-3XL), màu sắc, mã SKU, Barcode, tồn kho và giá bán.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-lg transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Thêm Sản Phẩm Mới
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <input
          type="text"
          placeholder="Tìm sản phẩm theo tên, mã SKU hoặc Barcode..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
      </div>

      {/* Product Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-4">Sản Phẩm</th>
                <th className="p-4">Danh Mục / Hãng</th>
                <th className="p-4">Giá Cơ Bản</th>
                <th className="p-4">Biến Thể (Size/Color/SKU/Stock)</th>
                <th className="p-4 text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredProducts.map((p) => {
                const productVariants = p.variants || [];
                const productImages = p.images || [];
                const totalStock = productVariants.reduce((sum, v) => sum + v.stock, 0);

                return (
                  <tr key={p.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={productImages[0]}
                          alt={p.name}
                          className="w-12 h-14 object-cover rounded-xl border border-slate-800 flex-shrink-0"
                        />
                        <div>
                          <p className="font-bold text-white text-xs line-clamp-1">{p.name}</p>
                          <p className="text-[10px] text-slate-500 font-mono">ID: {p.id}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="bg-slate-800 text-slate-200 px-2.5 py-1 rounded-lg font-semibold">
                        {p.categoryName}
                      </span>
                      <p className="text-[10px] text-slate-400 mt-1">{p.brand}</p>
                    </td>

                    <td className="p-4 font-bold text-rose-400">
                      {p.basePrice.toLocaleString('vi-VN')}đ
                    </td>

                    <td className="p-4 space-y-1">
                      <div className="flex flex-wrap gap-1">
                        {productVariants.map((v) => (
                          <span
                            key={v.id}
                            className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                              v.stock < 5
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                : 'bg-slate-950 text-slate-300 border-slate-800'
                            }`}
                          >
                            {v.size}-{v.color} ({v.stock}sp)
                          </span>
                        ))}
                      </div>
                      <p className="text-[10px] text-slate-400">Tổng tồn kho: <span className="font-bold text-white">{totalStock} sản phẩm</span></p>
                    </td>

                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="p-2 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-xl transition-colors"
                          title="Sửa"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteProduct(p.id)}
                          className="p-2 bg-slate-800 hover:bg-slate-700 text-rose-400 rounded-xl transition-colors"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add/Edit Product */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full my-auto overflow-hidden shadow-2xl relative text-slate-100 flex flex-col max-h-[92vh]">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-extrabold text-base text-white">
                {editingId ? 'Cập Nhật Sản Phẩm & Biến Thể' : 'Tạo Sản Phẩm Mới'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-slate-400 hover:text-white rounded-full bg-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Tên Sản Phẩm *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ví dụ: Áo Sơ Mi Nam Oxford Premium..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Danh Mục</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Thương Hiệu (Brand)</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Giá Bán Niêm Yết (VND)</label>
                  <input
                    type="number"
                    value={basePrice}
                    onChange={(e) => setBasePrice(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                    required
                  />
                </div>
              </div>

              {/* Gemini AI Auto-Generator for Description */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-300 font-bold">Mô Tả Sản Phẩm & SEO</label>
                  <button
                    type="button"
                    onClick={handleGenerateAIDescription}
                    disabled={isGeneratingAI || !name.trim()}
                    className="bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white px-3 py-1 rounded-lg border border-indigo-500/40 font-bold text-[11px] transition-all flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    {isGeneratingAI ? 'Đang viết tự động Gemini...' : 'Viết Bằng AI Gemini'}
                  </button>
                </div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Mô tả công năng chất liệu, kiểu dáng..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Variants Matrix Section */}
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-xs flex items-center gap-2">
                    <Barcode className="w-4 h-4 text-amber-400" /> Cấu Hình Biến Thể (Color / Size / SKU / Stock)
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddVariantRow}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1 rounded-lg text-[11px] font-bold border border-slate-700"
                  >
                    + Thêm Biến Thể
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {variants.map((v, idx) => (
                    <div
                      key={v.id}
                      className="p-3 bg-slate-950 rounded-2xl border border-slate-800 grid grid-cols-1 sm:grid-cols-6 gap-2 items-center"
                    >
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">SKU</span>
                        <input
                          type="text"
                          value={v.sku}
                          onChange={(e) => {
                            const copy = [...variants];
                            copy[idx].sku = e.target.value;
                            setVariants(copy);
                          }}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white font-mono text-[11px]"
                        />
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">Màu</span>
                        <input
                          type="text"
                          value={v.color}
                          onChange={(e) => {
                            const copy = [...variants];
                            copy[idx].color = e.target.value;
                            setVariants(copy);
                          }}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white text-[11px]"
                        />
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">Size</span>
                        <select
                          value={v.size}
                          onChange={(e) => {
                            const copy = [...variants];
                            copy[idx].size = e.target.value as any;
                            setVariants(copy);
                          }}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white text-[11px]"
                        >
                          <option value="S">S</option>
                          <option value="M">M</option>
                          <option value="L">L</option>
                          <option value="XL">XL</option>
                          <option value="2XL">2XL</option>
                        </select>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">Tồn Kho</span>
                        <input
                          type="number"
                          value={v.stock}
                          onChange={(e) => {
                            const copy = [...variants];
                            copy[idx].stock = Number(e.target.value);
                            setVariants(copy);
                          }}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white text-[11px]"
                        />
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">Giá (VND)</span>
                        <input
                          type="number"
                          value={v.price}
                          onChange={(e) => {
                            const copy = [...variants];
                            copy[idx].price = Number(e.target.value);
                            setVariants(copy);
                          }}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white text-[11px]"
                        />
                      </div>

                      <div className="text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveVariantRow(v.id)}
                          className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors mt-3"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 transition-colors"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-extrabold shadow-lg transition-all"
                >
                  Lưu Sản Phẩm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
