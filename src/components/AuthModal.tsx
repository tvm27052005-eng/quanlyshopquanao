import React, { useState } from 'react';
import { X, ShieldCheck, UserCheck, Key, Lock, Mail } from 'lucide-react';
import { User, Role } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [selectedRole, setSelectedRole] = useState<Role>('ADMIN');
  const [email, setEmail] = useState('admin@fashionpro.vn');
  const [password, setPassword] = useState('123456');
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleRoleQuickSelect = (role: Role) => {
    setSelectedRole(role);
    if (role === 'ADMIN') {
      setEmail('admin@fashionpro.vn');
      setName('Nguyễn Văn Admin');
    } else if (role === 'MANAGER') {
      setEmail('manager@fashionpro.vn');
      setName('Lê Thị Quản Lý');
    } else if (role === 'STAFF') {
      setEmail('staff@fashionpro.vn');
      setName('Phạm Văn Bán Hàng');
    } else {
      setEmail('hoangnam@gmail.com');
      setName('Đặng Hoàng Nam');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mockUser: User = {
      id: 'usr-' + selectedRole.toLowerCase(),
      name: name || (selectedRole === 'ADMIN' ? 'Nguyễn Văn Admin' : selectedRole === 'MANAGER' ? 'Lê Thị Quản Lý' : selectedRole === 'STAFF' ? 'Phạm Bán Hàng' : 'Khách Hàng VIP'),
      email,
      role: selectedRole,
      isVerified: true,
      points: selectedRole === 'CUSTOMER' ? 380 : 1200,
      loyaltyTier: selectedRole === 'CUSTOMER' ? 'GOLD' : 'DIAMOND',
      createdAt: new Date().toISOString()
    };

    onLoginSuccess(mockUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center justify-center mx-auto mb-3 text-rose-400">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-xl">
            {isRegistering ? 'Đăng Ký Tài Khoản' : 'Đăng Nhập Hệ Thống'}
          </h3>
          <p className="text-slate-400 text-xs mt-1">
            Chọn vai trò (Role-Based Access Control) để kiểm thử phân quyền
          </p>
        </div>

        {/* Quick Role Switcher Buttons */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-slate-400 mb-2">
            Chọn Nhanh Vai Trò Demo (RBAC):
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => handleRoleQuickSelect('ADMIN')}
              className={`p-2 rounded-xl text-[11px] font-bold border transition-all ${
                selectedRole === 'ADMIN'
                  ? 'bg-rose-600 text-white border-rose-500 shadow-md'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => handleRoleQuickSelect('MANAGER')}
              className={`p-2 rounded-xl text-[11px] font-bold border transition-all ${
                selectedRole === 'MANAGER'
                  ? 'bg-amber-600 text-white border-amber-500 shadow-md'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              Manager
            </button>
            <button
              type="button"
              onClick={() => handleRoleQuickSelect('STAFF')}
              className={`p-2 rounded-xl text-[11px] font-bold border transition-all ${
                selectedRole === 'STAFF'
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              Staff
            </button>
            <button
              type="button"
              onClick={() => handleRoleQuickSelect('CUSTOMER')}
              className={`p-2 rounded-xl text-[11px] font-bold border transition-all ${
                selectedRole === 'CUSTOMER'
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              Khách
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {isRegistering && (
            <div>
              <label className="block text-slate-300 font-medium mb-1">Họ & Tên</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập họ tên đầy đủ"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-slate-300 font-medium mb-1">Email Đăng Nhập</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-rose-500"
                required
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Mật Khẩu</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-rose-500"
                required
              />
              <Key className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-bold py-3 rounded-xl shadow-lg transition-all"
          >
            {isRegistering ? 'Tạo Tài Khoản Mới' : `Đăng Nhập Với Quyền (${selectedRole})`}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-amber-400 hover:underline text-xs font-medium"
          >
            {isRegistering ? 'Đã có tài khoản? Đăng nhập ngay' : 'Chưa có tài khoản? Đăng ký tại đây'}
          </button>
        </div>
      </div>
    </div>
  );
};
