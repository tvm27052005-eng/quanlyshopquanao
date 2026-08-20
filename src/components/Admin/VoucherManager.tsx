import React from 'react';
import { Tag, Sparkles, Clock, Plus } from 'lucide-react';
import { Voucher } from '../../types';

interface VoucherManagerProps {
  vouchers: Voucher[];
}

export const VoucherManager: React.FC<VoucherManagerProps> = ({ vouchers }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-white">Quản Lý Voucher, Coupon & Flash Sale</h2>
          <p className="text-xs text-slate-400 mt-1">
            Thiết lập chương trình khuyến mãi theo %, giảm cố định VND hoặc Flash Sale theo khung giờ
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {vouchers.map((v) => (
          <div key={v.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3 shadow-xl text-xs">
            <div className="flex items-center justify-between">
              <span className="font-mono font-black text-amber-400 text-sm bg-slate-950 px-3 py-1 rounded-xl border border-slate-800">
                {v.code}
              </span>
              {v.isFlashSale && (
                <span className="bg-rose-600 text-white font-black text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> FLASH SALE
                </span>
              )}
            </div>

            <p className="font-bold text-white text-xs">{v.description}</p>
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800/80 space-y-1 text-slate-400">
              <p>
                Đơn tối thiểu:{' '}
                <span className="text-white font-bold">{v.minOrderValue.toLocaleString('vi-VN')}đ</span>
              </p>
              <p>
                Đã sử dụng:{' '}
                <span className="text-amber-400 font-bold">
                  {v.usageCount} / {v.usageLimit} lượt
                </span>
              </p>
              <p className="text-[10px] font-mono text-slate-500">
                Thời gian: {v.startDate} đến {v.endDate}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
