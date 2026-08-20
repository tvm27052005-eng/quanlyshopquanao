import React from 'react';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Boxes,
  Truck,
  ShoppingCart,
  Receipt,
  Users,
  UserCheck,
  Tag,
  ShieldAlert,
  ShieldCheck,
  LogOut
} from 'lucide-react';
import { User } from '../../types';

interface AdminLayoutProps {
  currentSubTab: string;
  setCurrentSubTab: (tab: string) => void;
  currentUser: User | null;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentSubTab,
  setCurrentSubTab,
  currentUser,
  children
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Báo Cáo Doanh Thu', icon: LayoutDashboard, roleReq: ['ADMIN', 'MANAGER'] },
    { id: 'pos', label: 'Quầy Bán Hàng POS', icon: Receipt, roleReq: ['ADMIN', 'MANAGER', 'STAFF'] },
    { id: 'products', label: 'Quản Lý Sản Phẩm', icon: Package, roleReq: ['ADMIN', 'MANAGER', 'STAFF'] },
    { id: 'categories', label: 'Quản Lý Danh Mục', icon: FolderTree, roleReq: ['ADMIN', 'MANAGER'] },
    { id: 'inventory', label: 'Quản Lý Kho Hàng', icon: Boxes, roleReq: ['ADMIN', 'MANAGER', 'STAFF'] },
    { id: 'suppliers', label: 'Nhà Cung Cấp & PO', icon: Truck, roleReq: ['ADMIN', 'MANAGER'] },
    { id: 'orders', label: 'Đơn Hàng & Giao Hàng', icon: ShoppingCart, roleReq: ['ADMIN', 'MANAGER', 'STAFF'] },
    { id: 'customers', label: 'Khách Hàng & Điểm', icon: Users, roleReq: ['ADMIN', 'MANAGER', 'STAFF'] },
    { id: 'employees', label: 'Nhân Viên & Phân Quyền', icon: UserCheck, roleReq: ['ADMIN'] },
    { id: 'vouchers', label: 'Khuyến Mãi & Flash Sale', icon: Tag, roleReq: ['ADMIN', 'MANAGER'] },
    { id: 'audit', label: 'Nhật Ký Hệ Thống (Audit)', icon: ShieldAlert, roleReq: ['ADMIN'] }
  ];

  const userRole = currentUser?.role || 'ADMIN';

  if (userRole === 'CUSTOMER') {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center max-w-lg mx-auto">
        <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/30 text-rose-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 mb-2">Truy Cập Bị Từ Chối (Access Denied)</h2>
        <p className="text-xs text-slate-600 leading-relaxed mb-6">
          Tài khoản của bạn hiện tại thuộc phân quyền <strong className="text-slate-900 font-bold">Khách Hàng (CUSTOMER)</strong>. Vai trò này chỉ dành cho việc mua sắm, quản lý đơn hàng cá nhân và không có quyền truy cập hệ thống Quản Trị POS/ERP.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 p-4 space-y-6 flex-shrink-0 text-slate-200">
        <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/60">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>RBAC ACCESS: {userRole}</span>
          </div>
          <p className="text-[11px] text-slate-300 font-medium truncate">{currentUser?.name || 'Tài Khoản Quản Trị'}</p>
        </div>

        <nav className="space-y-1.5 text-xs font-semibold">
          {menuItems.map((item) => {
            const isAllowed = item.roleReq.includes(userRole);
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                disabled={!isAllowed}
                onClick={() => setCurrentSubTab(item.id)}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between transition-all ${
                  currentSubTab === item.id
                    ? 'bg-indigo-600 text-white shadow-xs font-bold'
                    : isAllowed
                    ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    : 'text-slate-600 cursor-not-allowed opacity-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {!isAllowed && <span className="text-[9px] bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded">Khóa</span>}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Admin Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
};
