import React, { useState } from 'react';
import {
  ShoppingBag,
  User as UserIcon,
  Search,
  Bell,
  LayoutDashboard,
  Store,
  Menu,
  X,
  Sparkles,
  ChevronDown,
  ShieldCheck,
  Award
} from 'lucide-react';
import { User, SystemNotification } from '../types';

interface HeaderProps {
  activeTab: 'STORE' | 'ADMIN' | 'ACCOUNT' | string;
  setActiveTab: (tab: 'STORE' | 'ADMIN' | 'ACCOUNT' | any) => void;
  currentUser: User | null;
  onOpenAuth?: () => void;
  onOpenAuthModal?: () => void;
  onLogout?: () => void;
  cartCount: number;
  onOpenCart: () => void;
  notifications?: SystemNotification[];
  onMarkNotificationsAsRead?: () => void;
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
  searchTerm?: string;
  setSearchTerm?: (q: string) => void;
  wishlistCount?: number;
  onOpenCustomerPortal?: () => void;
  onOpenAccountProfile?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenAuth,
  onOpenAuthModal,
  onLogout = () => {},
  cartCount,
  onOpenCart,
  notifications = [],
  onMarkNotificationsAsRead,
  searchQuery,
  setSearchQuery,
  searchTerm,
  setSearchTerm,
  wishlistCount = 0,
  onOpenCustomerPortal = () => setActiveTab('ACCOUNT'),
  onOpenAccountProfile
}) => {
  const [showNotif, setShowNotif] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const handleOpenAuth = onOpenAuth || onOpenAuthModal || (() => {});
  const currentSearchQuery = searchQuery ?? searchTerm ?? '';
  const handleSearchChange = setSearchQuery || setSearchTerm || (() => {});

  const safeNotifications = notifications || [];
  const userRole = currentUser?.role || 'CUSTOMER';

  const roleFilteredNotifications = safeNotifications.filter((n) => {
    if (userRole === 'CUSTOMER') {
      if (n.recipientRole && n.recipientRole !== 'CUSTOMER') {
        return false;
      }
      return n.type === 'ORDER' || n.type === 'PROMOTION' || !n.type;
    } else {
      if (n.recipientRole === 'CUSTOMER') {
        return false;
      }
      return true;
    }
  });

  const unreadNotifs = roleFilteredNotifications.filter(n => !n.isRead).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md text-slate-800 border-b border-slate-200 shadow-xs">
      {/* Top Bar Announcement */}
      <div className="bg-slate-900 text-slate-100 text-xs text-center py-1.5 font-medium tracking-wide flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
        <span>FLASH SALE SUMMER 2026: GIẢM ĐẾN 50% TOÀN BỘ SẢN PHẨM KHÔNG GIỚI HẠN!</span>
        <span className="hidden md:inline text-amber-300 font-bold">Mã: HELLOSUMMER</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Main Modes */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab('STORE')}
              className="flex items-center gap-2.5 group cursor-pointer text-left"
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white p-0.5 shadow-sm group-hover:bg-indigo-700 transition-colors flex items-center justify-center font-black text-base">
                FP
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight text-slate-900">
                  FashionPro
                </span>
                <span className="block text-[10px] uppercase tracking-widest text-indigo-600 font-bold -mt-1">
                  Enterprise
                </span>
              </div>
            </button>

            {/* Navigation Tabs (Store vs Admin vs Docs) */}
            <nav className="hidden lg:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setActiveTab('STORE')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'STORE'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                }`}
              >
                <Store className="w-4 h-4" />
                Cửa Hàng
              </button>

              {currentUser?.role !== 'CUSTOMER' && (
                <button
                  onClick={() => setActiveTab('ADMIN')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'ADMIN'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Quản Trị POS/ERP
                </button>
              )}
            </nav>
          </div>

          {/* Search bar in header when in Store mode */}
          {activeTab === 'STORE' && (
            <div className="hidden md:flex flex-1 max-w-md relative">
              <input
                type="text"
                placeholder="Tìm kiếm áo Oxford, jeans, đầm silk, mã SKU..."
                value={currentSearchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 text-xs rounded-xl pl-9 pr-8 py-2 border border-slate-200 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-colors placeholder:text-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              {currentSearchQuery && (
                <button
                  onClick={() => handleSearchChange('')}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-700 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center hover:bg-slate-200/80"
                  title="Xóa từ khóa"
                >
                  ✕
                </button>
              )}
            </div>
          )}

          {/* Right Action Icons */}
          <div className="flex items-center gap-3">
            {/* Notification Center */}
            <div className="relative">
              <button
                onClick={() => {
                  const nextState = !showNotif;
                  setShowNotif(nextState);
                  if (nextState && unreadNotifs > 0 && onMarkNotificationsAsRead) {
                    onMarkNotificationsAsRead();
                  }
                }}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl relative transition-colors"
                title="Thông báo hệ thống"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifs > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadNotifs}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotif && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-4 text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <Bell className="w-4 h-4 text-indigo-600" />
                      Thông Báo Mới
                    </span>
                    <span className="text-[10px] text-indigo-700 bg-indigo-50 font-bold px-2 py-0.5 rounded-full border border-indigo-100">
                      Real-time Feed
                    </span>
                  </div>
                  <div className="space-y-2 max-h-72 overflow-y-auto mt-3 pr-1">
                    {roleFilteredNotifications.length === 0 ? (
                      <p className="text-slate-400 text-center py-6 text-xs font-medium">Chưa có thông báo nào dành cho bạn</p>
                    ) : (
                      roleFilteredNotifications.map((n) => (
                        <div
                          key={n.id}
                          className="p-2.5 bg-slate-50/80 rounded-xl border border-slate-200/80 hover:bg-slate-100/60 transition-colors"
                        >
                          <div className="flex items-center justify-between font-semibold text-slate-800">
                            <span className="flex items-center gap-1.5">
                              {n.type === 'PROMOTION' && <Sparkles className="w-3.5 h-3.5 text-amber-500" />}
                              {n.type === 'ORDER' && <ShoppingBag className="w-3.5 h-3.5 text-indigo-500" />}
                              {n.type === 'STOCK' && <ShieldCheck className="w-3.5 h-3.5 text-rose-500" />}
                              {n.title}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {new Date(n.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-slate-600 text-[11px] mt-1">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Shopping Cart Drawer Trigger */}
            <button
              onClick={onOpenCart}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-xl font-bold text-xs shadow-xs transition-all"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-white text-indigo-600 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-indigo-200">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">Giỏ Hàng</span>
            </button>

            {/* User Account / Auth */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200/70 text-slate-800 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 text-xs transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                    {currentUser.name.charAt(0)}
                  </div>
                  <span className="hidden md:inline font-semibold text-slate-800">{currentUser.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-2 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl mb-2 border border-slate-100">
                      <p className="font-bold text-slate-900">{currentUser.name}</p>
                      <p className="text-slate-500 text-[11px] truncate">{currentUser.email}</p>
                      <div className="mt-2 flex items-center justify-between text-[10px]">
                        <span className="bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-full border border-indigo-200 flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          Hạng {currentUser.loyaltyTier}
                        </span>
                        <span className="text-slate-700 font-bold">{currentUser.points} điểm</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        if (onOpenAccountProfile) onOpenAccountProfile();
                      }}
                      className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-2 font-medium"
                    >
                      <UserIcon className="w-4 h-4 text-indigo-600" />
                      Thông Tin & Đổi Mật Khẩu
                    </button>

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onOpenCustomerPortal();
                      }}
                      className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-2 font-medium"
                    >
                      <ShoppingBag className="w-4 h-4 text-rose-500" />
                      Đơn Hàng & Điểm Tích Lũy
                    </button>

                    {currentUser.role !== 'CUSTOMER' && (
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          setActiveTab('ADMIN');
                        }}
                        className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-2 font-medium"
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        Quyền Quản Trị ({currentUser.role})
                      </button>
                    )}

                    <div className="my-1 border-t border-slate-100" />

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onLogout();
                      }}
                      className="w-full text-left px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors font-semibold"
                    >
                      Đăng Xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleOpenAuth}
                className="bg-slate-100 hover:bg-slate-200/70 text-slate-800 px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 transition-colors flex items-center gap-2"
              >
                <UserIcon className="w-4 h-4 text-slate-600" />
                Đăng Nhập
              </button>
            )}

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="lg:hidden p-2 text-slate-300 hover:text-white"
            >
              {mobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenu && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 py-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => { setActiveTab('STORE'); setMobileMenu(false); }}
              className={`p-2.5 rounded-xl text-center text-xs font-bold border ${activeTab === 'STORE' ? 'bg-rose-600 text-white border-rose-500' : 'bg-slate-800 text-slate-300 border-slate-700'}`}
            >
              Cửa Hàng
            </button>
            {currentUser?.role !== 'CUSTOMER' && (
              <button
                onClick={() => { setActiveTab('ADMIN'); setMobileMenu(false); }}
                className={`p-2.5 rounded-xl text-center text-xs font-bold border ${activeTab === 'ADMIN' ? 'bg-amber-600 text-white border-amber-500' : 'bg-slate-800 text-slate-300 border-slate-700'}`}
              >
                Quản Trị POS
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
