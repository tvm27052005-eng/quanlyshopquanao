import React, { useState, useEffect } from 'react';
import { Flame, Clock, Sparkles, ArrowRight, Tag } from 'lucide-react';

interface BannerProps {
  onExploreClick: () => void;
}

export const Banner: React.FC<BannerProps> = ({ onExploreClick }) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 5, minutes: 24, seconds: 12 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6">
      {/* Main Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 shadow-xl text-white">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 sm:py-16 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 font-bold text-xs">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              BỘ SƯU TẬP BỘ ĐỒ CÔNG SỞ & CASUAL 2026
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Nâng Tầm Phong Cách Với{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-amber-300 to-indigo-200">
                Chất Liệu Cao Cấp
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Trải nghiệm dòng sản phẩm Áo Sơ Mi Oxford 100% Cotton, Áo Polo Anti-Bacterial và Đầm Silk lụa tơ tằm thiết kế bởi FashionPro Studio. Vừa vặn, thoáng mát & sang trọng.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onExploreClick}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold px-6 py-3.5 rounded-2xl shadow-lg transition-all flex items-center gap-2 text-sm"
              >
                Khám Phá Sản Phẩm
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 bg-slate-800/80 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-700/60">
                <Tag className="w-5 h-5 text-amber-400" />
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Voucher Khách Hàng Mới</p>
                  <p className="font-extrabold text-white text-xs">FASHION50K - Giảm 50K</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative flex justify-center">
            <div className="relative w-full max-w-md aspect-[4/3] rounded-3xl overflow-hidden border-2 border-slate-700 shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80"
                alt="Fashion Summer 2026 Collection"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-4 left-4 right-4 p-4 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 text-xs flex items-center justify-between">
                <div>
                  <p className="font-bold text-white">Đầm Silk Lụa Tơ Tằm</p>
                  <p className="text-amber-400 font-extrabold mt-0.5">850,000đ <span className="text-slate-500 line-through text-[10px]">1,100,000đ</span></p>
                </div>
                <span className="bg-indigo-600 text-white font-extrabold text-[10px] px-2.5 py-1 rounded-full">
                  -23% OFF
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Flash Sale Banner with Countdown */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4 text-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-xs">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-lg sm:text-xl text-slate-900">FLASH SALE TRONG NGÀY</h3>
              <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-200">
                LIVE
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Ưu đãi giảm cực sốc có giới hạn thời gian cho các sản phẩm hot nhất</p>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="flex items-center gap-3 bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-200">
          <Clock className="w-4 h-4 text-indigo-600" />
          <span className="text-xs text-slate-600 font-bold uppercase">Kết thúc sau:</span>
          <div className="flex items-center gap-1.5 font-mono font-black text-sm">
            <span className="bg-slate-900 text-white px-2 py-1 rounded-lg">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span className="text-slate-900 font-bold">:</span>
            <span className="bg-slate-900 text-white px-2 py-1 rounded-lg">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span className="text-slate-900 font-bold">:</span>
            <span className="bg-slate-900 text-white px-2 py-1 rounded-lg">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
