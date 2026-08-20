import React, { useState } from 'react';
import {
  X,
  User,
  KeyRound,
  Lock,
  ShieldCheck,
  Award,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Mail,
  Phone,
  Calendar,
  Save,
  ShieldAlert
} from 'lucide-react';
import { User as UserType } from '../types';

interface AccountProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserType | null;
  onUpdateProfile?: (updatedData: { name: string; phone: string; email: string }) => Promise<{ success: boolean; message?: string }>;
  onChangePassword?: (data: { currentPass: string; newPass: string }) => Promise<{ success: boolean; message?: string }>;
}

export const AccountProfileModal: React.FC<AccountProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateProfile,
  onChangePassword
}) => {
  if (!isOpen || !currentUser) return null;

  const [activeTab, setActiveTab] = useState<'PROFILE' | 'PASSWORD'>('PROFILE');

  // Profile Form state
  const [name, setName] = useState(currentUser.name || '');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [email, setEmail] = useState(currentUser.email || '');

  // Password Form state
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Status Feedback
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const clearFeedback = () => {
    setSuccessMsg('');
    setErrorMsg('');
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearFeedback();
    if (!name.trim()) {
      setErrorMsg('Vui lòng nhập họ và tên của bạn.');
      return;
    }
    setLoading(true);
    try {
      if (onUpdateProfile) {
        const res = await onUpdateProfile({ name, phone, email });
        if (res.success) {
          setSuccessMsg('🎉 Cập nhật thông tin cá nhân thành công!');
        } else {
          setErrorMsg(res.message || 'Cập nhật thất bại, vui lòng thử lại.');
        }
      } else {
        setSuccessMsg('🎉 Đã lưu thay đổi thông tin cá nhân!');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Có lỗi xảy ra khi lưu thông tin.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearFeedback();
    if (!currentPass) {
      setErrorMsg('Vui lòng nhập mật khẩu hiện tại.');
      return;
    }
    if (newPass.length < 6) {
      setErrorMsg('Mật khẩu mới phải có tối thiểu 6 ký tự.');
      return;
    }
    if (newPass !== confirmPass) {
      setErrorMsg('Mật khẩu xác nhận không khớp với mật khẩu mới.');
      return;
    }

    setLoading(true);
    try {
      if (onChangePassword) {
        const res = await onChangePassword({ currentPass, newPass });
        if (res.success) {
          setSuccessMsg('🔒 Đổi mật khẩu thành công! Mật khẩu mới đã có hiệu lực.');
          setCurrentPass('');
          setNewPass('');
          setConfirmPass('');
        } else {
          setErrorMsg(res.message || 'Mật khẩu hiện tại không đúng hoặc có lỗi xảy ra.');
        }
      } else {
        setSuccessMsg('🔒 Đổi mật khẩu thành công!');
        setCurrentPass('');
        setNewPass('');
        setConfirmPass('');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Không thể đổi mật khẩu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return { text: 'Quản Trị Viên (Admin)', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40' };
      case 'MANAGER':
        return { text: 'Quản Lý Cửa Hàng (Manager)', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
      case 'STAFF':
        return { text: 'Nhân Viên POS/Kho (Staff)', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' };
      default:
        return { text: 'Khách Hàng Thân Thiết (Customer)', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
    }
  };

  const roleMeta = getRoleLabel(currentUser.role);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full my-auto overflow-hidden shadow-2xl relative text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header Banner */}
        <div className="relative p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-rose-500 text-white flex items-center justify-center font-black text-xl shadow-lg border border-white/20 shrink-0">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white">{currentUser.name}</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${roleMeta.color}`}>
                  {currentUser.role}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{currentUser.email}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/80 hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 px-6">
          <button
            onClick={() => {
              setActiveTab('PROFILE');
              clearFeedback();
            }}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'PROFILE'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            Thông Tin Cá Nhân
          </button>

          <button
            onClick={() => {
              setActiveTab('PASSWORD');
              clearFeedback();
            }}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'PASSWORD'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            Đổi Mật Khẩu
          </button>
        </div>

        {/* Feedback Banners */}
        <div className="px-6 pt-4 space-y-2">
          {successMsg && (
            <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold rounded-2xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold rounded-2xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'PROFILE' ? (
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              {/* Role & Badges Summary */}
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 font-medium block">Phân Quyền Hệ Thống</span>
                  <span className="font-bold text-slate-200 mt-0.5 block">{roleMeta.text}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-medium block">Hạng Thành Viên & Điểm</span>
                  <span className="font-bold text-amber-400 mt-0.5 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" />
                    Hạng {currentUser.loyaltyTier || 'BRONZE'} • {currentUser.points || 0} Điểm
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 font-medium mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-indigo-400" /> Họ và Tên
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 font-medium mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-indigo-400" /> Email Tên Truy Cập
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 font-medium mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-indigo-400" /> Số Điện Thoại
                  </label>
                  <input
                    type="text"
                    placeholder="0988xxxxxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg transition-all"
                >
                  <Save className="w-4 h-4" />
                  {loading ? 'Đang Lưu...' : 'Lưu Thay Đổi Thông Tin'}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 font-medium mb-1.5 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-rose-400" /> Mật Khẩu Hiện Tại
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPass ? 'text' : 'password'}
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    placeholder="Nhập mật khẩu hiện tại..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 pr-10 text-xs text-white focus:outline-none focus:border-rose-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                  >
                    {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 font-medium mb-1.5 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-rose-400" /> Mật Khẩu Mới
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPass ? 'text' : 'password'}
                      value={newPass}
                      onChange={(e) => setNewPass(e.target.value)}
                      placeholder="Ít nhất 6 ký tự..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 pr-10 text-xs text-white focus:outline-none focus:border-rose-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                    >
                      {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 font-medium mb-1.5 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-rose-400" /> Xác Nhận Mật Khẩu Mới
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPass ? 'text' : 'password'}
                      value={confirmPass}
                      onChange={(e) => setConfirmPass(e.target.value)}
                      placeholder="Nhập lại mật khẩu mới..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 pr-10 text-xs text-white focus:outline-none focus:border-rose-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPass(!showConfirmPass)}
                      className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                    >
                      {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
                <span className="font-bold text-slate-300 block mb-1">Mẹo bảo mật mật khẩu:</span>
                <p className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                  Mật khẩu nên chứa tối thiểu 6 ký tự kết hợp chữ và số.
                </p>
                <p className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                  Không chia sẻ mật khẩu quản trị cho người ngoài.
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 disabled:opacity-50 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg transition-all"
                >
                  <Lock className="w-4 h-4" />
                  {loading ? 'Đang Cập Nhật...' : 'Cập Nhật Mật Khẩu Mới'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
