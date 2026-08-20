import React from 'react';
import { ShieldAlert, Terminal } from 'lucide-react';
import { AuditLog } from '../../types';

interface AuditLogViewProps {
  auditLogs: AuditLog[];
}

export const AuditLogView: React.FC<AuditLogViewProps> = ({ auditLogs }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-white">Nhật Ký Thao Tác Hệ Thống (Enterprise Audit Log)</h2>
        <p className="text-xs text-slate-400 mt-1">Ghi vết toàn bộ hành vi CRUD, địa chỉ IP và tài khoản thao tác.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl text-xs">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-white flex items-center gap-2">
            <Terminal className="w-4 h-4 text-rose-400" /> Hệ Thống Ghi Log Thời Gian Thực
          </h3>
          <span className="text-slate-400 font-mono text-[11px]">{auditLogs.length} ghi nhận</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-4">Thời Gian</th>
                <th className="p-4">Tài Khoản & Quyền</th>
                <th className="p-4">Hành Động</th>
                <th className="p-4">Thực Thể</th>
                <th className="p-4">IP Address</th>
                <th className="p-4">Chi Tiết Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono text-[11px]">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 text-slate-400">{new Date(log.timestamp).toLocaleString('vi-VN')}</td>
                  <td className="p-4 font-bold text-white">
                    {log.userName}{' '}
                    <span className="text-[9px] bg-slate-800 text-amber-400 px-1.5 py-0.5 rounded ml-1">
                      {log.userRole}
                    </span>
                  </td>
                  <td className="p-4 text-rose-400 font-bold">{log.action}</td>
                  <td className="p-4 text-indigo-300">{log.entity}</td>
                  <td className="p-4 text-slate-500">{log.ipAddress}</td>
                  <td className="p-4 text-slate-300 max-w-xs truncate">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
