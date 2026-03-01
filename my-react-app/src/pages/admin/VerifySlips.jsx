import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  EyeIcon, 
  ArrowLeftIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const VerifySlips = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlip, setSelectedSlip] = useState(null);
  const navigate = useNavigate();

  const fetchPendingOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/pending-orders');
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingOrders();
  }, []);

  const handleApprove = async (orderId) => {
    if (!window.confirm("ยืนยันการรับชำระเงินสำหรับออเดอร์นี้?")) return;
    try {
      await axios.put(`http://localhost:5000/api/admin/approve-order/${orderId}`);
      alert("อนุมัติสำเร็จ!");
      fetchPendingOrders();
    } catch (err) {
      alert("เกิดข้อผิดพลาดในการอนุมัติ");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50/50 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 font-sans antialiased pb-20">
      {/* Navbar สไตล์เดียวกับหน้า Flash Sale Admin */}
      <nav className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/admin')} className="p-2 hover:bg-indigo-50 rounded-full transition-all group">
              <ArrowLeftIcon className="w-5 h-5 text-slate-500 group-hover:text-indigo-600" />
            </button>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-slate-900 uppercase">Verify Slips</h1>
              <div className="h-0.5 w-12 bg-indigo-500 rounded-full mt-0.5"></div>
            </div>
          </div>
          <div className="bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100 flex items-center gap-2">
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Pending Review</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 mt-10">
        {/* Statistics Cards (Indigo & Rose Theme) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-indigo-100 p-6 rounded-[2rem] shadow-sm flex items-center gap-4">
            <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
              <ShieldCheckIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Total Pending</p>
              <p className="text-2xl font-black text-slate-900 leading-none">{orders.length} <span className="text-sm font-medium text-slate-400">Orders</span></p>
            </div>
          </div>
          {/* คุณสามารถเพิ่ม Card อื่นๆ ตรงนี้ได้ */}
        </div>

        {/* Table Section */}
        <section className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order Details</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Customer info</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Amount</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Slip Evidence</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-8 py-24 text-center">
                      <div className="flex flex-col items-center opacity-20">
                        <CheckCircleIcon className="w-16 h-16 mb-4" />
                        <p className="text-[11px] font-bold uppercase tracking-[0.2em]">All Slips Verified</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="group hover:bg-indigo-50/30 transition-all">
                      <td className="px-8 py-6">
                        <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black mb-1">#{order.id}</span>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Order ID</p>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-400">
                            <UserIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800 leading-none mb-1">{order.first_name} {order.last_name}</p>
                            <p className="text-[10px] font-bold text-slate-400 tracking-wide">{order.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-lg font-black text-indigo-600 italic tracking-tighter">฿{Number(order.total_amount).toLocaleString()}</p>
                      </td>
                      <td className="px-8 py-6">
                        {order.slip_url ? (
                          <button 
                            onClick={() => setSelectedSlip(`http://localhost:5000${order.slip_url}`)}
                            className="flex items-center gap-2 text-[10px] font-black bg-slate-100 text-slate-600 px-4 py-2.5 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                          >
                            <EyeIcon className="w-4 h-4 stroke-[2.5px]" /> VIEW SLIP
                          </button>
                        ) : (
                          <span className="text-[10px] text-rose-400 font-bold uppercase bg-rose-50 px-3 py-1.5 rounded-full border border-rose-100">No Slip</span>
                        )}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex justify-center gap-2">
                          <button 
                            onClick={() => handleApprove(order.id)}
                            className="flex items-center gap-1.5 bg-emerald-500 text-white px-5 py-2.5 rounded-2xl text-[10px] font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100 uppercase tracking-wider"
                          >
                            <CheckCircleIcon className="w-4 h-4 stroke-[2.5px]" /> Approve
                          </button>
                          <button className="flex items-center gap-1.5 bg-white text-rose-500 border border-rose-100 px-5 py-2.5 rounded-2xl text-[10px] font-bold hover:bg-rose-50 transition-all uppercase tracking-wider">
                            <XCircleIcon className="w-4 h-4 stroke-[2.5px]" /> Reject
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

      {/* Modern Slip Modal */}
      {selectedSlip && (
        <div className="fixed inset-0 z-[300] bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-sm w-full animate-in fade-in zoom-in duration-200">
            <div className="bg-white p-3 rounded-[3rem] shadow-2xl">
              <div className="flex items-center justify-between px-6 py-4">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Slip Evidence</span>
                <button 
                  onClick={() => setSelectedSlip(null)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <XCircleIcon className="w-6 h-6 text-slate-400" />
                </button>
              </div>
              <img src={selectedSlip} alt="Slip Evidence" className="w-full h-auto rounded-[2.5rem] border border-slate-50 shadow-inner" />
              <div className="p-4">
                 <button 
                  onClick={() => setSelectedSlip(null)}
                  className="w-full py-4 bg-slate-900 text-white rounded-[2rem] text-[11px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all"
                 >
                   Done
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifySlips;