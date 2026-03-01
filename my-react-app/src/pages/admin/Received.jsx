import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  CheckBadgeIcon, 
  ClockIcon, 
  CurrencyDollarIcon,
  InboxStackIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  HashtagIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const ReceivedAdmin = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchReceivedHistory = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/admin/orders/on-delivery');
      setOrders(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceivedHistory();
  }, []);

  const handleFinalConfirm = async (orderId) => {
    if (window.confirm(`ยืนยันว่าออเดอร์ #${orderId} จัดส่งถึงมือลูกค้าเรียบร้อยแล้ว?`)) {
      try {
        const res = await axios.put(`http://localhost:5000/api/admin/orders/${orderId}/status`, {
          status: 'completed' 
        });

        if (res.status === 200 || res.data.status === "success") {
          setOrders(orders.filter(order => order.id !== orderId));
          alert("ยืนยันรายการสำเร็จ! ออเดอร์ถูกอัปเดตเป็น 'จัดส่งเรียบร้อยแล้ว'");
        }
      } catch (err) {
        alert("เกิดข้อผิดพลาดในการอัปเดตสถานะ");
      }
    }
  };

  const filteredOrders = orders.filter(order => 
    (order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (order.id?.toString().includes(searchTerm))
  );

  const totalPendingAmount = filteredOrders.reduce((sum, order) => sum + Number(order.total_amount || 0), 0);

  if (loading) return (
    <div className="min-h-screen bg-slate-50/50 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 font-sans antialiased pb-20">
      {/* Navbar - Unified Style */}
      <nav className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/admin')} className="p-2 hover:bg-emerald-50 rounded-full transition-all group">
              <ArrowLeftIcon className="w-5 h-5 text-slate-500 group-hover:text-emerald-600" />
            </button>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-slate-900 uppercase">Received Verification</h1>
              <div className="h-0.5 w-12 bg-emerald-500 rounded-full mt-0.5"></div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-3 bg-slate-100 px-4 py-2 rounded-2xl border border-slate-200">
            <CurrencyDollarIcon className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-black text-slate-600 tracking-tight">Pending Value: ฿{totalPendingAmount.toLocaleString()}</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 mt-10">
        {/* Search & Header Stats */}
        <div className="flex flex-col md:flex-row gap-6 justify-between items-end mb-8">
          <div className="w-full md:max-w-md relative group">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search by name or order ID..." 
              className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-[1.5rem] shadow-sm focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none font-bold text-sm transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            Currently On-Delivery
          </div>
        </div>

        {/* Modern Table Section */}
        <section className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order Reference</th>
                  <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Customer & Destination</th>
                  <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Transaction</th>
                  <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Fulfillment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-8 py-24 text-center">
                      <div className="flex flex-col items-center opacity-30">
                        <CheckBadgeIcon className="w-16 h-16 text-slate-300 mb-4" />
                        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">All Shipments Completed</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="group hover:bg-emerald-50/30 transition-all duration-300">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-all">
                            <HashtagIcon className="w-5 h-5 stroke-[2.5px]" />
                          </div>
                          <div>
                            <p className="font-black text-slate-900 leading-none mb-1">#{order.id}</p>
                            <p className="text-[10px] font-bold text-blue-500 tracking-wider">
                              {order.tracking_number || 'PENDING TRACKING'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-sm font-bold text-slate-800 mb-0.5">{order.customer_name || 'Walking Customer'}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter line-clamp-1 max-w-[280px]">
                          {order.shipping_address || 'Pickup at Store'}
                        </p>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-base font-black text-slate-900 italic tracking-tighter">
                          ฿{Number(order.total_amount || 0).toLocaleString()}
                        </p>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex justify-center">
                          <button 
                            onClick={() => handleFinalConfirm(order.id)}
                            className="bg-slate-900 text-white hover:bg-emerald-600 px-6 py-3.5 rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-slate-200 hover:shadow-emerald-200 active:scale-[0.97]"
                          >
                            <CheckCircleIcon className="w-4 h-4 stroke-[2.5px]" />
                            Confirm Delivered
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ReceivedAdmin;