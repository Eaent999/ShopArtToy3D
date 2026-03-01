import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  CurrencyDollarIcon, 
  ShoppingBagIcon, 
  UserGroupIcon, 
  ArrowLeftIcon,
  PlusIcon,
  ArchiveBoxIcon,
  SparklesIcon,
  BoltIcon,
  CheckBadgeIcon,
  TruckIcon,
  ClockIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { 
  AreaChart,
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    totalRevenue: 0,
    newOrdersCount: 0,
    totalUsers: 0,
    lowStockProducts: [],
    chartData: []
  });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/admin/dashboard-summary');
      setData(res.data);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const stats = [
    { name: 'ยอดขายทั้งหมด', value: `฿${Number(data.totalRevenue).toLocaleString()}`, icon: CurrencyDollarIcon, change: '+12%', color: 'bg-emerald-50 text-emerald-600' },
    { name: 'ออเดอร์รอตรวจ', value: data.newOrdersCount.toString(), icon: ShoppingBagIcon, change: 'Pending', color: 'bg-blue-50 text-blue-600' },
    { name: 'สมาชิกทั้งหมด', value: data.totalUsers.toString(), icon: UserGroupIcon, change: 'Active', color: 'bg-purple-50 text-purple-600' },
    { name: 'สินค้าสต็อกต่ำ', value: data.lowStockProducts.length.toString(), icon: ArchiveBoxIcon, change: 'Alert', color: 'bg-red-50 text-red-600' },
  ];

  return (
    <div className="p-6 lg:p-10 bg-[#FBFBFE] min-h-screen pt-24">
      
      {/* 🟢 FIXED: BACK BUTTON STYLE SYNC */}
      <div className="mb-8">
        <button 
          onClick={() => navigate('/')} 
          className="group flex items-center gap-3 text-gray-400 hover:text-black transition-all font-black uppercase text-[10px] tracking-[0.2em]"
        >
          <div className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all border border-gray-100">
            <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          </div>
          Back to Shop
        </button>
      </div>

      {/* HEADER SECTION */}
      <header className="mb-10 flex flex-col xl:flex-row xl:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">Command Center</h1>
          <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-3">Real-time Shop Analytics & Management</p>
        </div>

        {/* ACTION BUTTONS GRID */}
        <div className="flex flex-wrap gap-3">
          <button onClick={() => navigate('/admin/collections')} className="flex items-center gap-2 bg-white text-black border-2 border-black px-5 py-3 rounded-2xl text-[10px] font-black hover:invert transition-all shadow-sm">
            <SparklesIcon className="w-4 h-4" /> COLLECTIONS
          </button>

          <button onClick={() => navigate('/admin/flash-sale')} className="flex items-center gap-2 bg-red-600 text-white px-5 py-3 rounded-2xl text-[10px] font-black hover:bg-black transition-all shadow-lg shadow-red-100">
            <BoltIcon className="w-4 h-4 fill-white" /> FLASH SALE
          </button>

          <button 
            onClick={() => navigate('/admin/verify-slips')}
            className="relative flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-2xl text-[10px] font-black hover:bg-black transition-all shadow-lg shadow-blue-100"
          >
            <CheckBadgeIcon className="w-4 h-4" /> VERIFY SLIPS
            {data.newOrdersCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 text-[9px] items-center justify-center font-black border-2 border-white">
                  {data.newOrdersCount}
                </span>
              </span>
            )}
          </button>

          <button 
            onClick={() => navigate('/admin/on_delivery')} 
            className="flex items-center gap-2 bg-orange-500 text-white px-5 py-3 rounded-2xl text-[10px] font-black hover:bg-black transition-all shadow-lg shadow-orange-100"
          >
            <TruckIcon className="w-4 h-4" /> SHIPPING
          </button>

          <button 
            onClick={() => navigate('/admin/received')} 
            className="flex items-center gap-2 bg-emerald-500 text-white px-5 py-3 rounded-2xl text-[10px] font-black hover:bg-black transition-all shadow-lg shadow-emerald-100"
          >
            <ClockIcon className="w-4 h-4" /> HISTORY
          </button>

          <button onClick={() => navigate('/admin/inventory')} className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-2xl text-[10px] font-black hover:bg-yellow-400 hover:text-black transition-all shadow-xl">
            <PlusIcon className="w-4 h-4 stroke-[3px]" /> ADD PRODUCT
          </button>
        </div>
      </header>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50 hover:border-yellow-400 transition-all group">
            <div className="flex items-center justify-between mb-6">
              <div className={`p-4 rounded-2xl ${stat.color}`}>
                <stat.icon className="w-7 h-7" />
              </div>
              <div className="text-right">
                <span className="text-[10px] font-black px-3 py-1 bg-gray-100 rounded-full text-gray-500 uppercase">
                  {stat.change}
                </span>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">{stat.name}</p>
            <p className="text-3xl font-black text-gray-900 mt-1 italic italic">
              {loading ? "---" : stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* CHART SECTION */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[3rem] shadow-sm border border-gray-50">
           <div className="flex items-center justify-between mb-10">
             <div>
               <h3 className="font-black text-xl uppercase italic tracking-tighter">Revenue Performance</h3>
               <p className="text-gray-400 text-[10px] font-bold uppercase">Weekly sales overview</p>
             </div>
             <div className="bg-gray-50 p-2 rounded-xl flex gap-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <span className="text-[10px] font-black uppercase text-gray-400">Sales Amount</span>
             </div>
           </div>
           <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.chartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FACC15" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#FACC15" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: '900', fill: '#9ca3af'}} dy={15} />
                <YAxis hide={true} domain={['auto', 'auto']} />
                <Tooltip 
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: '900' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#FACC15" strokeWidth={5} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* LOW STOCK ALERT SECTION */}
        <div className="bg-black rounded-[3rem] shadow-xl p-8 flex flex-col text-white">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-black text-xl uppercase italic tracking-tighter text-yellow-400">Inventory Alert</h3>
              <p className="text-gray-500 text-[10px] font-bold uppercase">Items needing restock</p>
            </div>
            <ArchiveBoxIcon className="w-8 h-8 text-yellow-400" />
          </div>
          
          <div className="space-y-3 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
            {data.lowStockProducts.length > 0 ? (
              data.lowStockProducts.map(product => (
                <div key={product.id} className="p-5 bg-white/5 rounded-[2rem] border border-white/10 flex justify-between items-center group hover:bg-white/10 transition-all">
                  <div>
                    <p className="text-sm font-black uppercase tracking-tight">{product.name}</p>
                    <p className="text-[10px] font-bold text-red-500 uppercase mt-1">Stock: {product.stock} units left</p>
                  </div>
                  <button 
                    onClick={() => navigate('/admin/inventory')}
                    className="p-3 bg-yellow-400 rounded-2xl text-black hover:scale-110 transition-transform"
                  >
                    <PlusIcon className="w-4 h-4 stroke-[3px]" />
                  </button>
                </div>
              ))
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-10 opacity-30">
                <CheckBadgeIcon className="w-16 h-16 mb-4" />
                <p className="font-black uppercase italic text-xs">Inventory Healthy</p>
              </div>
            )}
          </div>

          <button 
            onClick={() => navigate('/admin/inventory')}
            className="mt-auto w-full py-4 bg-white/10 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2"
          >
            Go to Inventory <ArrowRightIcon className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;