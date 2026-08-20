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
  Cell
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
  CheckCircle2
} from 'lucide-react';
import { Order, Product } from '../../types';

interface DashboardViewProps {
  analyticsData?: any;
  orders?: Order[];
  products?: Product[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  analyticsData,
  orders = [],
  products = []
}) => {
  const [timeFilter, setTimeFilter] = useState<'ALL' | 'THIS_MONTH' | 'LAST_7_DAYS' | 'TODAY'>('ALL');

  // Fallback to server rawOrders if orders prop is empty
  const activeOrders: Order[] = (orders && orders.length > 0) ? orders : (analyticsData?.rawOrders || []);
  const validOrders = activeOrders.filter((o) => o.status !== 'CANCELLED');

  // Filter valid orders by time range
  const now = new Date();
  const filteredOrders = validOrders.filter((o) => {
    const orderDate = new Date(o.createdAt || Date.now());
    if (timeFilter === 'TODAY') {
      return (
        orderDate.getDate() === now.getDate() &&
        orderDate.getMonth() === now.getMonth() &&
        orderDate.getFullYear() === now.getFullYear()
      );
    }
    if (timeFilter === 'LAST_7_DAYS') {
      const diffTime = Math.abs(now.getTime() - orderDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7;
    }
    if (timeFilter === 'THIS_MONTH') {
      return (
        orderDate.getMonth() === now.getMonth() &&
        orderDate.getFullYear() === now.getFullYear()
      );
    }
    return true; // ALL
  });

  // Calculate Real-Time KPIs
  const totalRevenue = filteredOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const totalOrders = filteredOrders.length;
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  // Channel Breakdown (POS vs Online)
  const posOrders = filteredOrders.filter((o) => o.source === 'POS');
  const onlineOrders = filteredOrders.filter((o) => o.source !== 'POS');
  const posRevenue = posOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const onlineRevenue = onlineOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  // Low Stock Items Warning
  const lowStockCount = products.filter((p) =>
    (p.variants || []).some((v) => v.stock < 5)
  ).length;

  // Real-Time Category Breakdown
  const categorySalesMap: Record<string, number> = {};
  filteredOrders.forEach((o) => {
    (o.items || []).forEach((item) => {
      const prod = products.find((p) => p.id === item.productId || p.name === item.productName);
      const catName = prod?.categoryName || 'Sản Phẩm Khác';
      const itemSales = (item.price || 0) * (item.quantity || 1);
      categorySalesMap[catName] = (categorySalesMap[catName] || 0) + itemSales;
    });
  });

  const categoryData = Object.keys(categorySalesMap).map((name) => ({
    name,
    value: categorySalesMap[name]
  }));

  // Real-Time Top Selling Products
  const productSalesMap: Record<
    string,
    { name: string; sku: string; quantity: number; revenue: number }
  > = {};

  filteredOrders.forEach((o) => {
    (o.items || []).forEach((item) => {
      const key = item.productId || item.productName;
      if (!productSalesMap[key]) {
        productSalesMap[key] = {
          name: item.productName,
          sku: item.sku || 'SKU-GENERAL',
          quantity: 0,
          revenue: 0
        };
      }
      productSalesMap[key].quantity += item.quantity || 1;
      productSalesMap[key].revenue += (item.price || 0) * (item.quantity || 1);
    });
  });

  const topProducts = Object.values(productSalesMap)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Real-Time Monthly / Timeline Chart Data
  const monthMap: Record<string, number> = {};
  filteredOrders.forEach((o) => {
    const d = new Date(o.createdAt || Date.now());
    const mKey = `T${d.getMonth() + 1}`;
    monthMap[mKey] = (monthMap[mKey] || 0) + (o.totalAmount || 0);
  });

  const months = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8'];
  const monthlyData = months.map((m) => {
    const rev = monthMap[m] || 0;
    return {
      month: m,
      revenue: rev,
      profit: Math.round(rev * 0.38)
    };
  });

  const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ec4899', '#8b5cf6'];

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Interactive Filter Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900">Báo Cáo Doanh Thu Real-Time</h2>
            <span className="bg-emerald-50 text-emerald-700 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-500 animate-pulse" /> 100% Cập Nhật Thực Tế
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Tổng hợp dữ liệu kinh doanh trực tiếp từ đơn hàng trong hệ thống (Không có giá trị ảo)
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Time Filter Buttons */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => setTimeFilter('ALL')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                timeFilter === 'ALL'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tất Cả
            </button>

            <button
              type="button"
              onClick={() => setTimeFilter('THIS_MONTH')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                timeFilter === 'THIS_MONTH'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tháng Này
            </button>

            <button
              type="button"
              onClick={() => setTimeFilter('LAST_7_DAYS')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                timeFilter === 'LAST_7_DAYS'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              7 Ngày Qua
            </button>

            <button
              type="button"
              onClick={() => setTimeFilter('TODAY')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                timeFilter === 'TODAY'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hôm Nay
            </button>
          </div>

          <button
            type="button"
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
            {totalRevenue.toLocaleString('vi-VN')}đ
          </p>
          <div className="flex items-center justify-between text-[11px] pt-1">
            <span className="text-emerald-600 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Dữ liệu thực từ {totalOrders} đơn
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
          <p className="text-2xl font-black text-slate-900 tracking-tight">{totalOrders} Đơn Hàng</p>
          <div className="flex items-center justify-between text-[11px] pt-1">
            <span className="text-indigo-600 font-bold">Đã chốt trong hệ thống</span>
            <span className="text-slate-400">Trạng thái hợp lệ</span>
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
            {posRevenue.toLocaleString('vi-VN')}đ
          </p>
          <div className="flex items-center justify-between text-[11px] pt-1">
            <span className="text-emerald-600 font-bold">{posOrders.length} đơn tại quầy</span>
            <span className="text-slate-400">
              {totalRevenue > 0 ? `${Math.round((posRevenue / totalRevenue) * 100)}%` : '0%'}
            </span>
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
            {onlineRevenue.toLocaleString('vi-VN')}đ
          </p>
          <div className="flex items-center justify-between text-[11px] pt-1">
            <span className="text-rose-600 font-bold">{onlineOrders.length} đơn online</span>
            <span className="text-slate-400">
              {totalRevenue > 0 ? `${Math.round((onlineRevenue / totalRevenue) * 100)}%` : '0%'}
            </span>
          </div>
        </div>
      </div>

      {/* Revenue & Profit Growth Area Chart */}
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
            <AreaChart data={monthlyData}>
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
            <span className="text-xs text-slate-400 font-normal">Tính từ đơn thực tế</span>
          </h3>
          <div className="h-64 w-full">
            {categoryData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs font-medium">
                Chưa có dữ liệu bán hàng danh mục trong khoảng thời gian này
              </div>
            ) : (
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
            )}
          </div>
        </div>

        {/* Top Selling Products List */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-slate-900 text-base">Top Sản Phẩm Bán Chạy Nhất</h3>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
              Doanh Số Thực Tế
            </span>
          </div>

          <div className="space-y-3 text-xs">
            {topProducts.length === 0 ? (
              <div className="py-12 text-center text-slate-400 font-medium">
                Chưa có sản phẩm nào được bán ra trong khoảng thời gian này.
              </div>
            ) : (
              topProducts.map((p: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3.5 bg-slate-50 hover:bg-indigo-50/50 rounded-2xl border border-slate-200/80 transition-colors flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center text-xs shrink-0">
                      #{idx + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-slate-900 truncate">{p.name}</p>
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
                    <span className="text-[10px] text-slate-400">Tổng doanh thu</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
