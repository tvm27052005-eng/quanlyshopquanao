import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
  AlertTriangle,
  ArrowUpRight,
  Sparkles,
  Store,
  Globe,
  Printer,
  Calendar,
  Filter,
  Package,
  Award
} from 'lucide-react';

interface DashboardViewProps {
  analyticsData: any;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ analyticsData }) => {
  const [timeFilter, setTimeFilter] = useState<'ALL' | 'THIS_MONTH' | 'LAST_7_DAYS' | 'TODAY'>('THIS_MONTH');

  const kpis = analyticsData?.kpis || {
    totalRevenue: 280000000,
    totalOrders: 142,
    totalProducts: 48,
    lowStockCount: 3,
    loyalCustomers: 148,
    posRevenue: 168000000,
    onlineRevenue: 112000000,
    posOrderCount: 94,
    onlineOrderCount: 48
  };

  const rawMonthlyData = analyticsData?.charts?.monthlyRevenue || [
    { month: 'T1', revenue: 120000000, profit: 45000000 },
    { month: 'T2', revenue: 145000000, profit: 52000000 },
    { month: 'T3', revenue: 160000000, profit: 60000000 },
    { month: 'T4', revenue: 190000000, profit: 71000000 },
    { month: 'T5', revenue: 210000000, profit: 82000000 },
    { month: 'T6', revenue: 240000000, profit: 95000000 },
    { month: 'T7', revenue: kpis.totalRevenue || 280000000, profit: Math.round((kpis.totalRevenue || 280000000) * 0.38) }
  ];

  const categoryData = analyticsData?.charts?.categoryBreakdown || [
    { name: 'Áo Nam', value: 42000000 },
    { name: 'Thời Trang Nữ', value: 28000000 },
    { name: 'Quần Nam', value: 18000000 },
    { name: 'Áo Khoác & Vest', value: 12000000 }
  ];

  const topProducts = analyticsData?.charts?.topProducts || [
    { name: 'Áo Sơ Mi Nam Oxford Premium Cotton', sku: 'SM-OXF-WHT-M', quantity: 142, revenue: 49558000 },
    { name: 'Áo Polo Nam Form Regular Pique', sku: 'POLO-BLK-L', quantity: 110, revenue: 31900000 },
    { name: 'Quần Jeans Nam Slim-Fit Co Giãn', sku: 'JNS-BLU-31', quantity: 84, revenue: 36036000 }
  ];

  // Calculate AOV (Average Order Value)
  const totalRev = kpis.totalRevenue || 280000000;
  const totalOrd = kpis.totalOrders || 1;
  const avgOrderValue = Math.round(totalRev / (totalOrd || 1));

  const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ec4899', '#8b5cf6'];

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Filter Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900">Báo Cáo Doanh Thu & Hiệu Suất Bán Hàng</h2>
            <span className="bg-emerald-50 text-emerald-700 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-500" /> Real-time Sync
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Phân tích số liệu kinh doanh tổng thể từ cửa hàng POS và Website Online</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Time Filter Buttons */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs">
            <button
              onClick={() => setTimeFilter('THIS_MONTH')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                timeFilter === 'THIS_MONTH'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tháng Này (T7)
            </button>

            <button
              onClick={() => setTimeFilter('LAST_7_DAYS')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                timeFilter === 'LAST_7_DAYS'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              7 Ngày Qua
            </button>

            <button
              onClick={() => setTimeFilter('TODAY')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                timeFilter === 'TODAY'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hôm Nay
            </button>

            <button
              onClick={() => setTimeFilter('ALL')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                timeFilter === 'ALL'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tất Cả
            </button>
          </div>

          <button
            onClick={handlePrintReport}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-3.5 py-2 rounded-2xl text-xs flex items-center gap-2 shadow-sm transition-all"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            In Báo Cáo
          </button>
        </div>
      </div>

      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white border border-slate-200 p-5 rounded-3xl space-y-2 shadow-xs relative overflow-hidden group hover:border-indigo-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold text-slate-700">Tổng Doanh Thu</span>
            <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600 font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 tracking-tight">
            {totalRev.toLocaleString('vi-VN')}đ
          </p>
          <div className="flex items-center justify-between text-[11px] pt-1">
            <span className="text-emerald-600 font-extrabold flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +18.4% tăng trưởng
            </span>
            <span className="text-slate-400">AOV: {avgOrderValue.toLocaleString('vi-VN')}đ</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white border border-slate-200 p-5 rounded-3xl space-y-2 shadow-xs relative overflow-hidden group hover:border-amber-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold text-slate-700">Tổng Đơn Hàng</span>
            <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-600 font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 tracking-tight">{totalOrd} Đơn Hàng</p>
          <div className="flex items-center justify-between text-[11px] pt-1">
            <span className="text-emerald-600 font-extrabold flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +12.1% so với kỳ trước
            </span>
            <span className="text-slate-400">Đã chốt đơn</span>
          </div>
        </div>

        {/* POS Channel Revenue */}
        <div className="bg-white border border-slate-200 p-5 rounded-3xl space-y-2 shadow-xs relative overflow-hidden group hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold text-slate-700">Doanh Thu Kênh POS</span>
            <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600 font-bold">
              <Store className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 tracking-tight">
            {(kpis.posRevenue || Math.round(totalRev * 0.6)).toLocaleString('vi-VN')}đ
          </p>
          <div className="flex items-center justify-between text-[11px] pt-1">
            <span className="text-emerald-600 font-bold">{kpis.posOrderCount || 94} đơn tại quầy</span>
            <span className="text-slate-400">Tỉ trọng ~60%</span>
          </div>
        </div>

        {/* Online Storefront Revenue */}
        <div className="bg-white border border-slate-200 p-5 rounded-3xl space-y-2 shadow-xs relative overflow-hidden group hover:border-rose-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold text-slate-700">Doanh Thu Website Online</span>
            <div className="p-2.5 rounded-2xl bg-rose-50 text-rose-600 font-bold">
              <Globe className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 tracking-tight">
            {(kpis.onlineRevenue || Math.round(totalRev * 0.4)).toLocaleString('vi-VN')}đ
          </p>
          <div className="flex items-center justify-between text-[11px] pt-1">
            <span className="text-rose-600 font-bold">{kpis.onlineOrderCount || 48} đơn online</span>
            <span className="text-slate-400">Tỉ trọng ~40%</span>
          </div>
        </div>
      </div>

      {/* Revenue & Profit Growth Chart */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" /> Biểu Đồ Doanh Thu & Lợi Nhuận Gộp (VND)
          </h3>
          <div className="flex items-center gap-4 text-xs font-bold">
            <span className="flex items-center gap-1.5 text-indigo-600">
              <span className="w-3 h-3 rounded-full bg-indigo-600" /> Doanh Thu
            </span>
            <span className="flex items-center gap-1.5 text-emerald-600">
              <span className="w-3 h-3 rounded-full bg-emerald-600" /> Lợi Nhuận Gộp (38%)
            </span>
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={rawMonthlyData}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorProf" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `${v / 1000000}M`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '16px', fontSize: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                formatter={(val: any) => [`${Number(val).toLocaleString('vi-VN')}đ`, '']}
              />
              <Area type="monotone" dataKey="revenue" name="Doanh Thu" stroke="#6366f1" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
              <Area type="monotone" dataKey="profit" name="Lợi Nhuận" stroke="#10b981" fillOpacity={1} fill="url(#colorProf)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Breakdown & Top Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown Pie Chart */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
          <h3 className="font-black text-slate-900 text-base flex items-center justify-between">
            <span>Tỉ Trọng Doanh Số Theo Danh Mục</span>
            <span className="text-xs text-slate-400 font-normal">Phân bổ danh mục</span>
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={85}
                  innerRadius={45}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }: any) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                >
                  {categoryData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '16px', fontSize: '12px' }}
                  formatter={(val: any) => [`${Number(val).toLocaleString('vi-VN')}đ`, 'Doanh số']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Selling Products List */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-slate-900 text-base">Top Sản Phẩm Bán Chạy Nhất</h3>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
              Xếp Hạng Hàng Đầu
            </span>
          </div>

          <div className="space-y-3 text-xs">
            {topProducts.map((p: any, idx: number) => (
              <div
                key={idx}
                className="p-3.5 bg-slate-50 hover:bg-indigo-50/50 rounded-2xl border border-slate-200/80 transition-colors flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center text-xs shrink-0">
                    #{idx + 1}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 line-clamp-1">{p.name}</p>
                    <p className="text-slate-500 text-[11px]">
                      SKU: <span className="font-mono text-slate-700">{p.sku}</span> • Đã bán:{' '}
                      <strong className="text-slate-800">{p.quantity} sản phẩm</strong>
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-extrabold text-indigo-700 block text-xs">
                    {Number(p.revenue).toLocaleString('vi-VN')}đ
                  </span>
                  <span className="text-[10px] text-slate-400">Doanh thu đạt được</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
