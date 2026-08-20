import React, { useState } from 'react';
import { X, Lock, Mail, Key, UserCheck, ShieldCheck, ArrowRight, Eye, EyeOff, Sparkles, CheckCircle2 } from 'lucide-react';
import { User, Role } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Form Inputs
  const [emailOrPhone, setEmailOrPhone] = useState('hoangnam@gmail.com');
  const [password, setPassword] = useState('123456');
  const [fullName, setFullName] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role>('CUSTOMER');

  // Quick Demo Accounts Panel State
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);

  if (!isOpen) return null;

  const handleSelectDemoAccount = (role: Role) => {
    setSelectedRole(role);
    if (role === 'ADMIN') {
      setEmailOrPhone('admin@fashionpro.vn');
      setFullName('Nguyễn Văn Admin');
    } else if (role === 'MANAGER') {
      setEmailOrPhone('manager@fashionpro.vn');
      setFullName('Lê Thị Quản Lý');
    } else if (role === 'STAFF') {
      setEmailOrPhone('staff@fashionpro.vn');
      setFullName('Phạm Văn Bán Hàng');
    } else {
      setEmailOrPhone('hoangnam@gmail.com');
      setFullName('Đặng Hoàng Nam');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isCustomer = selectedRole === 'CUSTOMER';
    const mockUser: User = {
      id: 'usr-' + (selectedRole ? selectedRole.toLowerCase() : 'cust'),
      name: fullName.trim() || (isCustomer ? 'Đặng Hoàng Nam' : selectedRole === 'ADMIN' ? 'Nguyễn Văn Admin' : selectedRole === 'MANAGER' ? 'Lê Thị Quản Lý' : 'Phạm Bán Hàng'),
      email: emailOrPhone.includes('@') ? emailOrPhone : `${emailOrPhone}@fashionpro.vn`,
      phone: !emailOrPhone.includes('@') ? emailOrPhone : '0987654321',
      role: selectedRole || 'CUSTOMER',
      isVerified: true,
      points: isCustomer ? 380 : 1250,
      loyaltyTier: isCustomer ? 'GOLD' : 'DIAMOND',
      createdAt: new Date().toISOString()
    };

    onLoginSuccess(mockUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full my-auto overflow-hidden shadow-2xl relative text-slate-900 animate-in fade-in zoom-in duration-200">
        
        {/* Top Banner Accent */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 text-amber-400 text-[11px] font-bold tracking-wider uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5" /> FashionPro VIP Member
          </div>

          <h3 className="text-2xl font-black tracking-tight text-white">
            {authMode === 'LOGIN' ? 'Đăng Nhập Tài Khoản' : 'Đăng Ký Thành Viên'}
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            {authMode === 'LOGIN'
              ? 'Nhập Email/SĐT để tích điểm & nhận voucher ưu đãi 50K'
              : 'Tạo tài khoản mới để trải nghiệm mua sắm thời trang cao cấp'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-100 bg-slate-50 text-xs font-bold">
          <button
            type="button"
            onClick={() => setAuthMode('LOGIN')}
            className={`flex-1 py-3 text-center transition-all border-b-2 ${
              authMode === 'LOGIN'
                ? 'border-indigo-600 text-indigo-600 bg-white shadow-xs font-black'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            ĐĂNG NHẬP
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('REGISTER')}
            className={`flex-1 py-3 text-center transition-all border-b-2 ${
              authMode === 'REGISTER'
                ? 'border-indigo-600 text-indigo-600 bg-white shadow-xs font-black'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            ĐĂNG KÝ MỚI
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4 text-xs">
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {authMode === 'REGISTER' && (
              <div>
                <label className="block text-slate-700 font-bold mb-1">Họ và Tên</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn Ánh"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-colors"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-slate-700 font-bold mb-1">Email hoặc Số điện thoại</label>
              <div className="relative">
                <input
                  type="text"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  placeholder="name@example.com hoặc 0987654321"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-colors"
                  required
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-slate-700 font-bold">Mật khẩu</label>
                {authMode === 'LOGIN' && (
                  <button
                    type="button"
                    onClick={() => alert('Vui lòng kiểm tra email của bạn để đặt lại mật khẩu!')}
                    className="text-[11px] text-indigo-600 font-semibold hover:underline"
                  >
                    Quên mật khẩu?
                  </button>
                )}
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu từ 6 ký tự"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-colors"
                  required
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {authMode === 'LOGIN' && (
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="remember" className="text-slate-600 text-[11px] font-medium cursor-pointer">
                  Ghi nhớ đăng nhập trên thiết bị này
                </label>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm mt-2"
            >
              <span>{authMode === 'LOGIN' ? 'Đăng Nhập' : 'Tạo Tài Khoản'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Social Logins */}
          <div className="pt-3 border-t border-slate-100">
            <p className="text-[11px] text-slate-400 text-center font-medium mb-3">
              Hoặc đăng nhập nhanh bằng
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleSelectDemoAccount('CUSTOMER')}
                className="py-2 px-3 border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2 text-xs transition-colors"
              >
                <span className="font-bold text-rose-500 text-sm">G</span> Google
              </button>

              <button
                type="button"
                onClick={() => handleSelectDemoAccount('CUSTOMER')}
                className="py-2 px-3 border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2 text-xs transition-colors"
              >
                <span className="font-bold text-blue-600 text-sm">f</span> Facebook
              </button>
            </div>
          </div>

          {/* Collapsible Role Switcher for System Testing Demo */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowDemoAccounts(!showDemoAccounts)}
              className="w-full text-[11px] text-slate-400 hover:text-indigo-600 font-medium text-center flex items-center justify-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
              <span>{showDemoAccounts ? 'Ẩn tài khoản thử nghiệm' : 'Thử nghiệm đăng nhập theo phân quyền (Admin / Staff)'}</span>
            </button>

            {showDemoAccounts && (
              <div className="mt-2 p-2.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5 animate-in fade-in">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Chọn nhanh tài khoản mẫu:</p>
                <div className="grid grid-cols-2 gap-1.5 text-[11px] font-bold">
                  <button
                    type="button"
                    onClick={() => handleSelectDemoAccount('ADMIN')}
                    className={`py-1.5 px-2 rounded-lg border text-left flex items-center justify-between ${
                      selectedRole === 'ADMIN' ? 'bg-rose-600 text-white border-rose-500' : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    <span>Quản Trị (Admin)</span>
                    {selectedRole === 'ADMIN' && <CheckCircle2 className="w-3 h-3" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectDemoAccount('MANAGER')}
                    className={`py-1.5 px-2 rounded-lg border text-left flex items-center justify-between ${
                      selectedRole === 'MANAGER' ? 'bg-amber-600 text-white border-amber-500' : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    <span>Quản Lý (Manager)</span>
                    {selectedRole === 'MANAGER' && <CheckCircle2 className="w-3 h-3" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectDemoAccount('STAFF')}
                    className={`py-1.5 px-2 rounded-lg border text-left flex items-center justify-between ${
                      selectedRole === 'STAFF' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    <span>Bán Hàng (Staff)</span>
                    {selectedRole === 'STAFF' && <CheckCircle2 className="w-3 h-3" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectDemoAccount('CUSTOMER')}
                    className={`py-1.5 px-2 rounded-lg border text-left flex items-center justify-between ${
                      selectedRole === 'CUSTOMER' ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    <span>Khách Mua (Customer)</span>
                    {selectedRole === 'CUSTOMER' && <CheckCircle2 className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
