import React, { useState } from 'react';
import {
  Search,
  Filter,
  Star,
  Eye,
  ShoppingBag,
  Heart,
  Sparkles,
  Check,
  RotateCcw
} from 'lucide-react';
import { Product, Category, ProductFilterState } from '../../types';

interface ProductCatalogProps {
  products: Product[];
  categories: Category[];
  selectedCategoryId?: string;
  setSelectedCategoryId?: (id: string) => void;
  searchTerm?: string;
  setSearchTerm?: (s: string) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCartQuick?: (product: Product) => void;
  onAddToCart?: (product: Product, variant: any, quantity: number) => void;
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products = [],
  categories = [],
  selectedCategoryId = 'ALL',
  setSelectedCategoryId,
  searchTerm = '',
  setSearchTerm,
  onSelectProduct,
  onAddToCartQuick,
  onAddToCart,
  wishlistIds = [],
  onToggleWishlist
}) => {
  const [quickAddProduct, setQuickAddProduct] = useState<Product | null>(null);
  const [quickColor, setQuickColor] = useState<string>('');
  const [quickSize, setQuickSize] = useState<string>('');
  const [quickQty, setQuickQty] = useState<number>(1);

  const handleOpenQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickAddProduct(product);
    const firstVariant = product.variants?.[0];
    setQuickColor(firstVariant?.color || '');
    setQuickSize(firstVariant?.size || 'M');
    setQuickQty(1);
  };

  const handleConfirmQuickAdd = () => {
    if (!quickAddProduct) return;
    const variant = (quickAddProduct.variants || []).find(
      (v) => v.color === quickColor && v.size === quickSize
    ) || quickAddProduct.variants?.[0];

    if (onAddToCart) {
      onAddToCart(quickAddProduct, variant, quickQty);
    } else if (onAddToCartQuick) {
      onAddToCartQuick(quickAddProduct);
    }
    setQuickAddProduct(null);
  };

  const [filters, setFilters] = useState<ProductFilterState>({
    search: '',
    categoryId: '',
    minPrice: 0,
    maxPrice: 2000000,
    colors: [],
    sizes: [],
    brands: [],
    inStockOnly: false,
    sortBy: 'featured'
  });

  const availableSizes = ['S', 'M', 'L', 'XL', '2XL'];
  const availableColors = [
    { name: 'Trắng', hex: '#FFFFFF' },
    { name: 'Xanh Navy', hex: '#1B2A4A' },
    { name: 'Đen Tuyền', hex: '#000000' },
    { name: 'Xanh Indigo', hex: '#254E70' },
    { name: 'Đỏ Đô', hex: '#8B0000' },
    { name: 'Xám Ghi', hex: '#808080' }
  ];

  const safeProducts = products || [];
  const safeCategories = categories || [];
  const safeWishlistIds = wishlistIds || [];

  // Effective Category & Search Term (from props or local filters)
  const activeCategoryId = (selectedCategoryId && selectedCategoryId !== 'ALL') ? selectedCategoryId : filters.categoryId;
  const activeSearchTerm = (searchTerm || filters.search || '').trim().toLowerCase();

  // Filter & Search Logic
  const filteredProducts = safeProducts.filter((p) => {
    if (activeCategoryId && p.categoryId !== activeCategoryId) return false;

    if (activeSearchTerm) {
      const q = activeSearchTerm;
      const matchName = p.name ? p.name.toLowerCase().includes(q) : false;
      const matchBrand = p.brand ? p.brand.toLowerCase().includes(q) : false;
      const matchCategory = p.categoryName ? p.categoryName.toLowerCase().includes(q) : false;
      const matchDesc = p.description ? p.description.toLowerCase().includes(q) : false;
      const matchTag = (p.tags || []).some((t) => t.toLowerCase().includes(q));
      const matchSKU = (p.variants || []).some((v) => v.sku && v.sku.toLowerCase().includes(q));
      const matchBarcode = (p.variants || []).some((v) => v.barcode && v.barcode.toLowerCase().includes(q));
      const matchColor = (p.variants || []).some((v) => v.color && v.color.toLowerCase().includes(q));

      if (!matchName && !matchBrand && !matchCategory && !matchDesc && !matchTag && !matchSKU && !matchBarcode && !matchColor) {
        return false;
      }
    }
    if (p.basePrice < filters.minPrice || p.basePrice > filters.maxPrice) return false;
    if (filters.sizes.length > 0) {
      const hasSize = (p.variants || []).some((v) => filters.sizes.includes(v.size));
      if (!hasSize) return false;
    }
    if (filters.colors.length > 0) {
      const hasColor = (p.variants || []).some((v) => filters.colors.includes(v.color));
      if (!hasColor) return false;
    }
    if (filters.inStockOnly) {
      const inStock = (p.variants || []).some((v) => v.stock > 0);
      if (!inStock) return false;
    }
    return true;
  }).sort((a, b) => {
    if (filters.sortBy === 'price-asc') return a.basePrice - b.basePrice;
    if (filters.sortBy === 'price-desc') return b.basePrice - a.basePrice;
    if (filters.sortBy === 'rating') return b.rating - a.rating;
    if (filters.sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
  });

  const toggleSize = (sz: string) => {
    setFilters((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(sz) ? prev.sizes.filter((s) => s !== sz) : [...prev.sizes, sz]
    }));
  };

  const toggleColor = (col: string) => {
    setFilters((prev) => ({
      ...prev,
      colors: prev.colors.includes(col) ? prev.colors.filter((c) => c !== col) : [...prev.colors, col]
    }));
  };

  const resetFilters = () => {
    if (setSearchTerm) setSearchTerm('');
    if (setSelectedCategoryId) setSelectedCategoryId('ALL');
    setFilters({
      search: '',
      categoryId: '',
      minPrice: 0,
      maxPrice: 2000000,
      colors: [],
      sizes: [],
      brands: [],
      inStockOnly: false,
      sortBy: 'featured'
    });
  };

  const handleCategorySelect = (id: string) => {
    if (setSelectedCategoryId) setSelectedCategoryId(id);
    setFilters((prev) => ({ ...prev, categoryId: id === 'ALL' ? '' : id }));
  };

  return (
    <div id="product-catalog-section" className="space-y-6">
      {/* Category Pill Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => handleCategorySelect('ALL')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
            activeCategoryId === '' || activeCategoryId === 'ALL'
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          Tất Cả Sản Phẩm ({products.length})
        </button>

        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => handleCategorySelect(c.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
              activeCategoryId === c.id
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Filter Toolbar & Sorting */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs text-slate-700">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-indigo-600" />
          <span className="font-bold text-slate-900">Bộ Lọc Tìm Kiếm Nâng Cao</span>

          {activeSearchTerm && (
            <span className="bg-indigo-50 text-indigo-700 font-bold px-2.5 py-1 rounded-lg border border-indigo-200 text-xs flex items-center gap-1.5 shadow-2xs">
              Từ khóa: "{activeSearchTerm}"
              <button
                onClick={() => {
                  if (setSearchTerm) setSearchTerm('');
                  setFilters((prev) => ({ ...prev, search: '' }));
                }}
                className="hover:text-rose-600 font-extrabold ml-0.5"
                title="Xóa tìm kiếm"
              >
                ✕
              </button>
            </span>
          )}

          {(activeCategoryId || filters.colors.length > 0 || filters.sizes.length > 0 || activeSearchTerm) && (
            <button
              onClick={resetFilters}
              className="ml-2 text-indigo-600 hover:underline flex items-center gap-1 font-semibold"
            >
              <RotateCcw className="w-3 h-3" /> Đặt lại bộ lọc
            </button>
          )}
        </div>

        {/* Size selection */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 font-medium">Size:</span>
          {availableSizes.map((sz) => (
            <button
              key={sz}
              onClick={() => toggleSize(sz)}
              className={`w-7 h-7 rounded-lg text-[10px] font-bold border transition-colors ${
                filters.sizes.includes(sz)
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {sz}
            </button>
          ))}
        </div>

        {/* Color picker */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">Màu:</span>
          <div className="flex items-center gap-1.5">
            {availableColors.map((c) => (
              <button
                key={c.name}
                onClick={() => toggleColor(c.name)}
                style={{ backgroundColor: c.hex }}
                className={`w-5 h-5 rounded-full border border-slate-300 relative flex items-center justify-center transition-transform ${
                  filters.colors.includes(c.name) ? 'scale-125 ring-2 ring-indigo-600' : 'hover:scale-110'
                }`}
                title={c.name}
              >
                {filters.colors.includes(c.name) && <Check className="w-3 h-3 text-indigo-600 drop-shadow" />}
              </button>
            ))}
          </div>
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">Sắp xếp:</span>
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }))}
            className="bg-slate-50 text-slate-800 border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-indigo-500"
          >
            <option value="featured">Nổi Bật Nhất</option>
            <option value="price-asc">Giá Thấp Đến Cao</option>
            <option value="price-desc">Giá Cao Đến Thấp</option>
            <option value="rating">Đánh Giá Cao Nhất</option>
            <option value="newest">Sản Phẩm Mới Nhất</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-500 shadow-xs">
          <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="font-bold text-slate-900 text-base">Không Tìm Thấy Sản Phẩm Phù Hợp</h4>
          <p className="text-xs text-slate-500 mt-1">
            Thử thay đổi từ khóa tìm kiếm hoặc bỏ chọn bộ lọc kích thước, màu sắc.
          </p>
          <button
            onClick={resetFilters}
            className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors"
          >
            Bỏ Lọc & Xem Tất Cả
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const isWishlisted = wishlistIds.includes(product.id);
            const displayPrice = product.isFlashSale && product.flashSalePrice ? product.flashSalePrice : product.basePrice;

            return (
              <div
                key={product.id}
                className="group bg-white border border-slate-200/90 hover:border-slate-300 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all hover:-translate-y-0.5 flex flex-col justify-between text-slate-800"
              >
                <div>
                  {/* Image Container */}
                  <div className="relative aspect-[4/5] bg-slate-50 overflow-hidden">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Flash Sale / Featured Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                      {product.isFlashSale && (
                        <span className="bg-indigo-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> FLASH SALE
                        </span>
                      )}
                      {product.isFeatured && !product.isFlashSale && (
                        <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-full shadow-xs">
                          HOT TREND
                        </span>
                      )}
                    </div>

                    {/* Wishlist Button */}
                    <button
                      onClick={() => onToggleWishlist(product.id)}
                      className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors z-10 ${
                        isWishlisted ? 'bg-rose-500 text-white' : 'bg-white/80 text-slate-600 hover:text-slate-900 border border-slate-200/60'
                      }`}
                      title="Yêu thích"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </button>

                    {/* Quick Hover Actions */}
                    <div className="absolute inset-x-3 bottom-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={() => onSelectProduct(product)}
                        className="flex-1 bg-white/95 hover:bg-white text-slate-900 py-2 rounded-xl text-xs font-bold shadow-md border border-slate-200 flex items-center justify-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5 text-indigo-600" /> Xem Chi Tiết
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="font-semibold text-slate-600">{product.brand}</span>
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{product.rating}</span>
                        <span className="text-slate-400">({product.reviewCount})</span>
                      </div>
                    </div>

                    <h3
                      onClick={() => onSelectProduct(product)}
                      className="font-bold text-slate-900 text-sm line-clamp-2 hover:text-indigo-600 cursor-pointer transition-colors"
                    >
                      {product.name}
                    </h3>

                    {/* Variant Colors Preview */}
                    <div className="flex items-center gap-1 pt-1">
                      {Array.from(new Set(product.variants.map((v) => v.color))).slice(0, 4).map((colName) => {
                        const v = product.variants.find((v) => v.color === colName);
                        return (
                          <span
                            key={colName}
                            style={{ backgroundColor: v?.colorHex || '#ccc' }}
                            className="w-3.5 h-3.5 rounded-full border border-slate-300 inline-block"
                            title={colName}
                          />
                        );
                      })}
                      {product.variants.length > 4 && (
                        <span className="text-[10px] text-slate-500 font-medium">+{product.variants.length - 4}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Price & Add To Cart */}
                <div className="p-4 pt-0 flex items-center justify-between border-t border-slate-100 mt-2">
                  <div>
                    <span className="font-extrabold text-indigo-600 text-base">
                      {displayPrice.toLocaleString('vi-VN')}đ
                    </span>
                    {product.isFlashSale && product.flashSalePrice && (
                      <span className="block text-[11px] text-slate-400 line-through">
                        {product.basePrice.toLocaleString('vi-VN')}đ
                      </span>
                    )}
                  </div>

                  <button
                    onClick={(e) => handleOpenQuickAdd(product, e)}
                    className="p-2.5 bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white rounded-xl border border-indigo-200/80 transition-all font-bold text-xs flex items-center gap-1.5 shadow-xs"
                    title="Thêm nhanh vào giỏ"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span className="hidden sm:inline">Thêm Nhanh</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Add Modal Overlay */}
      {quickAddProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl text-slate-100 relative">
            <button
              onClick={() => setQuickAddProduct(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800"
            >
              <Check className="w-4 h-4 hidden" />
              <span className="font-bold text-sm">✕</span>
            </button>

            <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
              <img
                src={quickAddProduct.images[0]}
                alt={quickAddProduct.name}
                className="w-16 h-20 object-cover rounded-xl border border-slate-800"
              />
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-rose-400">Thêm Nhanh Vào Giỏ</span>
                <h4 className="font-bold text-white text-sm line-clamp-1">{quickAddProduct.name}</h4>
                <p className="text-amber-400 font-extrabold text-base mt-1">
                  {((quickAddProduct.isFlashSale && quickAddProduct.flashSalePrice) || quickAddProduct.basePrice).toLocaleString('vi-VN')}đ
                </p>
              </div>
            </div>

            {/* Color selection */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">Chọn Màu Sắc:</label>
              <div className="flex flex-wrap items-center gap-2">
                {Array.from(new Set(quickAddProduct.variants.map((v) => v.color))).map((colName) => {
                  const v = quickAddProduct.variants.find((x) => x.color === colName);
                  return (
                    <button
                      key={colName}
                      onClick={() => setQuickColor(colName)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all ${
                        quickColor === colName
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      <span
                        style={{ backgroundColor: v?.colorHex || '#999' }}
                        className="w-3 h-3 rounded-full border border-slate-600"
                      />
                      {colName}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size selection */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">Chọn Kích Thước (Size):</label>
              <div className="flex items-center gap-2">
                {['S', 'M', 'L', 'XL', '2XL'].map((sz) => {
                  const exists = quickAddProduct.variants.some((v) => v.color === quickColor && v.size === sz);
                  return (
                    <button
                      key={sz}
                      disabled={!exists}
                      onClick={() => setQuickSize(sz)}
                      className={`w-9 h-9 rounded-xl text-xs font-bold border transition-all ${
                        quickSize === sz
                          ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white border-rose-400 shadow-md'
                          : exists
                          ? 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
                          : 'bg-slate-900/40 text-slate-600 border-slate-800 cursor-not-allowed line-through'
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-bold text-slate-300">Số Lượng:</span>
              <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl p-1">
                <button
                  onClick={() => setQuickQty(Math.max(1, quickQty - 1))}
                  className="w-7 h-7 rounded-lg bg-slate-700 text-white font-bold hover:bg-slate-600 text-xs"
                >
                  -
                </button>
                <span className="w-8 text-center font-bold text-xs">{quickQty}</span>
                <button
                  onClick={() => setQuickQty(quickQty + 1)}
                  className="w-7 h-7 rounded-lg bg-slate-700 text-white font-bold hover:bg-slate-600 text-xs"
                >
                  +
                </button>
              </div>
            </div>

            {/* Confirm Add Button */}
            <button
              onClick={handleConfirmQuickAdd}
              className="w-full bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-extrabold py-3.5 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 text-xs"
            >
              <ShoppingBag className="w-4 h-4" />
              Xác Nhận Thêm Vào Giỏ Hàng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
