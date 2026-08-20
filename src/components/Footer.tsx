import React from 'react';
import { Shield, Truck, RefreshCw, PhoneCall, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 text-xs mt-auto">
      {/* Service Value Highlights */}
      <div className="border-b border-slate-200 bg-slate-50/60 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">Giao Hàng Toàn Quốc</h4>
              <p className="text-[11px] text-slate-500">Miễn phí cho đơn hàng từ 500k</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">Đổi Trả 30 Ngày</h4>
              <p className="text-[11px] text-slate-500">Đổi size & mẫu miễn phí tận nhà</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">Chính Hãng 100%</h4>
              <p className="text-[11px] text-slate-500">Sợi vải Cotton & Silk cao cấp</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">Hỗ Trợ 24/7</h4>
              <p className="text-[11px] text-slate-500">Hotline: 1900-8888-99</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-black flex items-center justify-center text-sm shadow-xs">
              FP
            </div>
            <span className="font-extrabold text-base text-slate-900 tracking-tight">FashionPro Enterprise</span>
          </div>
          <p className="text-slate-500 leading-relaxed mb-4">
            Hệ thống quản lý cửa hàng thời trang & chuỗi thương mại điện tử Enterprise. Tích hợp POS, quản lý tồn kho, khuyến mãi và thanh toán tự động.
          </p>
          <div className="space-y-1.5 text-slate-600">
            <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-indigo-600" /> 123 Đường Nguyễn Trãi, Quận 1, TP. HCM</p>
            <p className="flex items-center gap-2"><PhoneCall className="w-4 h-4 text-emerald-600" /> 1900-8888-99</p>
            <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-indigo-600" /> support@fashionpro.vn</p>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-slate-900 text-sm mb-4">Danh Mục Sản Phẩm</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-indigo-600 transition-colors">Áo Sơ Mi Nam Oxford</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition-colors">Áo Polo Nam Anti-Bacterial</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition-colors">Quần Jeans Slim-Fit Co Giãn</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition-colors">Đầm Silk Lụa Tơ Tằm Nữ</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition-colors">Áo Khoác Blazer Hàn Quốc</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-slate-900 text-sm mb-4">Chính Sách & Hỗ Trợ</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-indigo-600 transition-colors">Hướng dẫn chọn size chuẩn</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition-colors">Chính sách bảo mật thông tin</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition-colors">Quy định đổi trả hàng</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition-colors">Điều khoản thanh toán VNPay/MoMo</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition-colors">Chương trình tích điểm VIP</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-slate-900 text-sm mb-4">Phương Thức Thanh Toán</h4>
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-slate-50 p-2 rounded-lg text-center font-bold text-indigo-600 border border-slate-200">VNPay</div>
            <div className="bg-slate-50 p-2 rounded-lg text-center font-bold text-pink-600 border border-slate-200">MoMo</div>
            <div className="bg-slate-50 p-2 rounded-lg text-center font-bold text-slate-800 border border-slate-200">COD</div>
          </div>
          <p className="text-[11px] text-slate-500">
            Hệ thống mã hóa giao dịch bảo mật chuẩn OWASP Top 10 & PCI-DSS compliance.
          </p>
        </div>
      </div>

      <div className="border-t border-slate-200 py-6 text-center text-[11px] text-slate-500">
        © 2026 FashionPro Enterprise Architecture System. Developed for Clothing Store Management & E-Commerce.
      </div>
    </footer>
  );
};
