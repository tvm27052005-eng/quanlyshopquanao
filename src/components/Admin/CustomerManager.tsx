import React from 'react';
import { Users, Award, ShieldCheck, Search } from 'lucide-react';
import { User } from '../../types';

interface CustomerManagerProps {
  users: User[];
}

export const CustomerManager: React.FC<CustomerManagerProps> = ({ users = [] }) => {
  const safeUsers = users || [];
  const customers = safeUsers.filter((u) => u.role === 'CUSTOMER');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-white">Quản Lý Khách Hàng CRM & Điểm Tích Lũy</h2>
        <p className="text-xs text-slate-400 mt-1">
          Hạng thành viên (Bronze / Silver / Gold / Diamond) & lịch sử mua hàng
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-4">Tên Khách Hàng</th>
                <th className="p-4">Email / Phone</th>
                <th className="p-4">Hạng VIP Member</th>
                <th className="p-4">Điểm Tích Lũy</th>
                <th className="p-4">Ngày Tham Gia</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 font-bold text-white">{c.name}</td>
                  <td className="p-4 font-mono text-slate-400">
                    {c.email} <span className="block text-slate-500">{c.phone}</span>
                  </td>
                  <td className="p-4">
                    <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-full font-bold text-[10px] flex items-center gap-1 w-fit">
                      <Award className="w-3 h-3" /> Hạng {c.loyaltyTier}
                    </span>
                  </td>
                  <td className="p-4 font-extrabold text-amber-400">{c.points} điểm</td>
                  <td className="p-4 text-slate-400 font-mono">
                    {new Date(c.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
