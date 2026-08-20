import React, { useState } from 'react';
import { UserCheck, Shield, Plus, Key } from 'lucide-react';
import { User, Role } from '../../types';

interface EmployeeManagerProps {
  users: User[];
  onCreateEmployee: (userData: any) => void;
}

export const EmployeeManager: React.FC<EmployeeManagerProps> = ({ users = [], onCreateEmployee }) => {
  const safeUsers = users || [];
  const employees = safeUsers.filter((u) => u.role !== 'CUSTOMER');
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<Role>('STAFF');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    onCreateEmployee({ name, email, phone, role });
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-white">Quản Lý Nhân Viên & Phân Quyền Access Control (RBAC)</h2>
          <p className="text-xs text-slate-400 mt-1">Gán vai trò Admin, Manager, Staff với ma trận quyền hạn tương ứng.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-lg transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Thêm Nhân Viên Mới
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {employees.map((emp) => (
          <div key={emp.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3 shadow-xl text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center">
                  {emp.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-white">{emp.name}</h3>
                  <p className="text-[10px] text-slate-400 font-mono">{emp.email}</p>
                </div>
              </div>
            </div>

            <div className="p-2 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400 font-medium">Vai Trò Hệ Thống:</span>
              <span
                className={`font-bold px-2.5 py-0.5 rounded-full text-[10px] ${
                  emp.role === 'ADMIN'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : emp.role === 'MANAGER'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                }`}
              >
                {emp.role}
              </span>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 text-xs text-slate-100">
            <h3 className="font-extrabold text-base text-white">Tạo Nhân Viên Mới</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Họ & Tên *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-300 font-bold mb-1">Email Công Việc *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-300 font-bold mb-1">Số Điện Thoại</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-bold mb-1">Vai Trò Phân Quyền (RBAC)</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as Role)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  <option value="STAFF">Staff (Nhân viên bán hàng POS/Kho)</option>
                  <option value="MANAGER">Manager (Quản lý cửa hàng)</option>
                  <option value="ADMIN">Admin (Quản trị toàn quyền)</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Hủy
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold">
                  Tạo Nhân Viên
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
