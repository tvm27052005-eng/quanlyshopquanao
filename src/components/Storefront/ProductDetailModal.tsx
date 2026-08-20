import React, { useState } from 'react';
import {
  X,
  Star,
  ShoppingBag,
  Heart,
  ShieldCheck,
  Truck,
  Sparkles,
  Barcode,
  CheckCircle2,
  ThumbsUp,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { Product, ProductVariant, Review, User } from '../../types';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, variant: ProductVariant, quantity: number) => void;
  reviews?: Review[];
  onAddReview?: (reviewData: any) => void;
  currentUser?: User | null;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  reviews = [],
  onAddReview,
  currentUser,
  isWishlisted,
  onToggleWishlist
}) => {
  if (!product) return null;

  const safeImages = product.images || [];
  const safeVariants = product.variants || [];

  const [selectedImage, setSelectedImage] = useState(safeImages[0] || '');
  const [selectedColor, setSelectedColor] = useState<string>(safeVariants[0]?.color || '');
  const [selectedSize, setSelectedSize] = useState<string>(safeVariants[0]?.size || '');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'DETAILS' | 'REVIEWS'>('DETAILS');

  // Review Form state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [guestReviewerName, setGuestReviewerName] = useState('');
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState('');
  const [localReviews, setLocalReviews] = React.useState<Review[]>(reviews || []);

  React.useEffect(() => {
    if (!reviews) return;
    setLocalReviews((prev) => {
      const combined = [...prev];
      reviews.forEach((r) => {
        if (!combined.some((c) => c.id === r.id || (c.comment === r.comment && c.userName === r.userName))) {
          combined.push(r);
        }
      });
      return combined;
    });
  }, [reviews]);

  // Find exact matching variant
  const selectedVariant = safeVariants.find(
    (v) => v.color === selectedColor && v.size === selectedSize
  ) || safeVariants[0];

  const availableColors = Array.from(new Set(safeVariants.map((v) => v.color)));
  const availableSizesForColor = safeVariants
    .filter((v) => v.color === selectedColor)
    .map((v) => v.size);

  const productReviews = (localReviews || []).filter((r) => String(r.productId) === String(product.id));
  const currentReviewCount = productReviews.length;
  const currentAverageRating = currentReviewCount > 0
    ? (productReviews.reduce((sum, r) => sum + r.rating, 0) / currentReviewCount).toFixed(1)
    : product.rating;

  const handleAddReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const finalName = currentUser?.name || guestReviewerName.trim() || 'Khách Hàng Mua Sắm';

    const tempReview: Review = {
      id: 'rev-temp-' + Date.now(),
      productId: product.id,
      userId: currentUser?.id || 'guest-' + Date.now(),
      userName: finalName,
      rating: newRating,
      comment: newComment,
      likes: 0,
      isVerifiedPurchase: true,
      createdAt: new Date().toISOString()
    };

    setLocalReviews((prev) => [tempReview, ...(prev || [])]);

    if (onAddReview) {
      onAddReview({
        productId: product.id,
        rating: newRating,
        comment: newComment,
        userName: finalName,
        userId: currentUser?.id
      });
    }
    setNewComment('');
    setReviewSuccessMsg('🎉 Đã gửi đánh giá thành công! Cảm ơn phản hồi của bạn.');
    setActiveTab('REVIEWS');
    setTimeout(() => setReviewSuccessMsg(''), 5000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full my-auto overflow-hidden shadow-2xl relative text-slate-100 max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/80 backdrop-blur-md"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto p-6 space-y-6">
          {/* Top Main Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Gallery Images */}
            <div className="space-y-4">
              <div className="aspect-[4/5] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 relative">
                <img
                  src={selectedImage || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => onToggleWishlist(product.id)}
                  className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-colors ${
                    isWishlisted ? 'bg-rose-500 text-white' : 'bg-slate-900/60 text-slate-300'
                  }`}
                >
                  <Heart className="w-5 h-5 fill-current" />
                </button>
              </div>

              {/* Thumbnails */}
              <div className="flex items-center gap-2 overflow-x-auto">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors flex-shrink-0 ${
                      selectedImage === img ? 'border-rose-500' : 'border-slate-800 opacity-60'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Meta & Variant Selection */}
            <div className="space-y-5">
              <div>
                <span className="text-xs text-rose-400 font-bold uppercase tracking-wider">
                  {product.categoryName} • {product.brand}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-1 leading-snug">
                  {product.name}
                </h2>

                <div className="flex items-center gap-3 mt-2 text-xs">
                  <div className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{currentAverageRating}</span>
                  </div>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400">{currentReviewCount} đánh giá</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Còn hàng trong kho
                  </span>
                </div>
              </div>

              {/* Price Banner */}
              <div className="p-4 bg-slate-950/70 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-2xl font-black text-rose-400">
                    {(selectedVariant?.price || product.basePrice).toLocaleString('vi-VN')}đ
                  </span>
                  {selectedVariant?.originalPrice && selectedVariant.originalPrice > selectedVariant.price && (
                    <span className="ml-2 text-xs text-slate-500 line-through">
                      {selectedVariant.originalPrice.toLocaleString('vi-VN')}đ
                    </span>
                  )}
                </div>

                {/* SKU / Barcode Info */}
                <div className="text-right text-[11px] text-slate-400">
                  <p className="flex items-center justify-end gap-1 font-mono">
                    <Barcode className="w-3.5 h-3.5 text-slate-400" />
                    SKU: <span className="text-white font-bold">{selectedVariant?.sku}</span>
                  </p>
                  <p className="font-mono text-slate-500 text-[10px]">Bar: {selectedVariant?.barcode}</p>
                </div>
              </div>

              {/* Color Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  Màu Sắc: <span className="text-rose-400">{selectedColor}</span>
                </label>
                <div className="flex items-center gap-2">
                  {availableColors.map((colName) => {
                    const variantForCol = product.variants.find((v) => v.color === colName);
                    return (
                      <button
                        key={colName}
                        onClick={() => {
                          setSelectedColor(colName);
                          const nextSizes = product.variants.filter((v) => v.color === colName).map((v) => v.size);
                          if (!nextSizes.includes(selectedSize)) {
                            setSelectedSize(nextSizes[0] || 'M');
                          }
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all ${
                          selectedColor === colName
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500'
                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        <span
                          style={{ backgroundColor: variantForCol?.colorHex || '#999' }}
                          className="w-3.5 h-3.5 rounded-full border border-slate-600"
                        />
                        {colName}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Size Selector */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-300">
                    Kích Thước: <span className="text-amber-400">{selectedSize}</span>
                  </label>
                  <span className="text-[10px] text-slate-400 underline cursor-pointer">Bảng quy đổi Size</span>
                </div>
                <div className="flex items-center gap-2">
                  {['S', 'M', 'L', 'XL', '2XL'].map((sz) => {
                    const exists = availableSizesForColor.includes(sz);
                    return (
                      <button
                        key={sz}
                        disabled={!exists}
                        onClick={() => setSelectedSize(sz)}
                        className={`w-10 h-10 rounded-xl text-xs font-bold border transition-all ${
                          selectedSize === sz
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

              {/* Stock Status Indicator */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Tồn kho khả dụng:</span>
                <span className={`font-bold ${selectedVariant?.stock < 5 ? 'text-amber-400 animate-pulse' : 'text-emerald-400'}`}>
                  {selectedVariant?.stock || 0} sản phẩm {selectedVariant?.stock < 5 && '(Sắp hết!)'}
                </span>
              </div>

              {/* Quantity Adjuster & Add To Cart */}
              <div className="flex items-center gap-3 pt-2">
                <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-lg bg-slate-700 text-white font-bold hover:bg-slate-600"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-bold text-xs">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(selectedVariant?.stock || 10, quantity + 1))}
                    className="w-8 h-8 rounded-lg bg-slate-700 text-white font-bold hover:bg-slate-600"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => onAddToCart(product, selectedVariant, quantity)}
                  disabled={!selectedVariant || selectedVariant.stock === 0}
                  className="flex-1 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-extrabold py-3 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 text-xs"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Thêm Vào Giỏ Hàng
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Tabs: Description vs Reviews */}
          <div className="border-t border-slate-800 pt-6">
            <div className="flex items-center gap-4 border-b border-slate-800 pb-3">
              <button
                onClick={() => setActiveTab('DETAILS')}
                className={`text-xs font-bold pb-2 border-b-2 transition-all ${
                  activeTab === 'DETAILS'
                    ? 'border-rose-500 text-rose-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                Mô Tả & Chất Liệu
              </button>
              <button
                onClick={() => setActiveTab('REVIEWS')}
                className={`text-xs font-bold pb-2 border-b-2 transition-all flex items-center gap-1.5 ${
                  activeTab === 'REVIEWS'
                    ? 'border-rose-500 text-rose-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                Đánh Giá Khách Hàng ({productReviews.length})
              </button>
            </div>

            {activeTab === 'DETAILS' ? (
              <div className="pt-4 text-xs text-slate-300 space-y-3 leading-relaxed">
                <p>{product.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="font-bold text-white block mb-1">Chất Liệu & Đường May</span>
                    <span>Sợi vải Cotton Oxford thoáng mát, đường may chuẩn 5 mũi/cm xuất khẩu, giặt không nhăn phai.</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="font-bold text-white block mb-1">Hướng Dẫn Bảo Quản</span>
                    <span>Giặt máy ở nhiệt độ thường, không dùng chất tẩy mạnh, ủi ở nhiệt độ trung bình dưới 150°C.</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="pt-4 space-y-4">
                {reviewSuccessMsg && (
                  <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{reviewSuccessMsg}</span>
                  </div>
                )}

                {/* Add Review Form */}
                <form onSubmit={handleAddReviewSubmit} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <h4 className="font-bold text-xs text-white">Viết Đánh Giá Sản Phẩm:</h4>
                    {currentUser ? (
                      <span className="text-[11px] text-slate-400">
                        Đánh giá dưới tên: <strong className="text-amber-400">{currentUser.name}</strong>
                      </span>
                    ) : (
                      <input
                        type="text"
                        placeholder="Nhập tên hiển thị của bạn..."
                        value={guestReviewerName}
                        onChange={(e) => setGuestReviewerName(e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-rose-500 w-full sm:w-64"
                      />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Chọn số sao:</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewRating(star)}
                          className="p-1 text-amber-400 hover:scale-125 transition-transform"
                        >
                          <Star className={`w-4 h-4 ${star <= newRating ? 'fill-current' : 'text-slate-600'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Cảm nhận của bạn về chất liệu, form dáng, kích thước..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-rose-500"
                    rows={2}
                    required
                  />
                  <button
                    type="submit"
                    className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors"
                  >
                    Gửi Đánh Giá
                  </button>
                </form>

                {/* Review List */}
                <div className="space-y-3">
                  {productReviews.length === 0 ? (
                    <p className="text-xs text-slate-500 py-4">Chưa có đánh giá nào cho sản phẩm này.</p>
                  ) : (
                    productReviews.map((r) => (
                      <div key={r.id} className="p-3 bg-slate-950 rounded-2xl border border-slate-800/80 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white">{r.userName}</span>
                          <span className="text-[10px] text-slate-500">
                            {new Date(r.createdAt).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-amber-400">
                          {Array.from({ length: r.rating }).map((_, idx) => (
                            <Star key={idx} className="w-3 h-3 fill-current" />
                          ))}
                        </div>
                        <p className="text-slate-300">{r.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
