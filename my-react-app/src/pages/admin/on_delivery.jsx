import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    TruckIcon, 
    ClipboardDocumentListIcon, 
    MapPinIcon, 
    PhoneIcon, 
    ArrowLeftIcon,
    HashtagIcon,
    CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const OnDeliveryAdmin = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [trackingInputs, setTrackingInputs] = useState({});

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await axios.get('http://localhost:5000/api/admin/orders-to-ship');
            setOrders(res.data);
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchOrders(); }, []);

    const handleShipOrder = async (orderId) => {
        const trackingNum = trackingInputs[orderId];
        if (!trackingNum) return alert("กรุณากรอกเลขพัสดุ");

        try {
            await axios.put(`http://localhost:5000/api/admin/shipped-order/${orderId}`, {
                tracking_number: trackingNum
            });
            alert("อัปเดตสถานะจัดส่งเรียบร้อย!");
            setOrders(orders.filter(o => o.id !== orderId));
        } catch (err) {
            alert("Error: " + err.message);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-50/50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading Logistics...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50/50 text-slate-800 font-sans antialiased pb-20">
            {/* Navbar สไตล์เดียวกับ Verify Slips */}
            <nav className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 py-4 shadow-sm">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/admin')} className="p-2 hover:bg-indigo-50 rounded-full transition-all group">
                            <ArrowLeftIcon className="w-5 h-5 text-slate-500 group-hover:text-indigo-600" />
                        </button>
                        <div>
                            <h1 className="text-sm font-bold tracking-tight text-slate-900 uppercase">Logistics Manager</h1>
                            <div className="h-0.5 w-12 bg-amber-500 rounded-full mt-0.5"></div>
                        </div>
                    </div>
                    <div className="bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100 flex items-center gap-2">
                        <TruckIcon className="w-4 h-4 text-indigo-600 animate-bounce" />
                        <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">{orders.length} Ready to ship</span>
                    </div>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto px-6 mt-10">
                {orders.length === 0 ? (
                    <div className="bg-white p-24 text-center rounded-[3rem] border border-slate-200 shadow-sm">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ClipboardDocumentListIcon className="w-10 h-10 text-slate-200" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 mb-2">Clear for Now!</h2>
                        <p className="text-slate-400 font-medium text-sm">All orders have been processed and shipped.</p>
                    </div>
                ) : (
                    <div className="grid gap-8">
                        {orders.map((order) => (
                            <div key={order.id} className="group bg-white rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500 overflow-hidden">
                                <div className="flex flex-col lg:flex-row">
                                    {/* Left Side: Order & Customer Info */}
                                    <div className="flex-1 p-8 lg:p-10">
                                        <div className="flex items-center gap-3 mb-6">
                                            <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-wider border border-emerald-100 flex items-center gap-1.5">
                                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                                                Payment Verified
                                            </span>
                                            <span className="text-slate-300 text-[10px] font-bold flex items-center gap-1">
                                                <HashtagIcon className="w-3 h-3" /> ORD-{order.id}
                                            </span>
                                        </div>

                                        <h3 className="text-3xl font-black text-slate-900 mb-6 tracking-tight leading-none">
                                            {order.first_name} {order.last_name}
                                        </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <div className="flex items-start gap-3">
                                                    <div className="p-2 bg-indigo-50 rounded-xl">
                                                        <MapPinIcon className="w-5 h-5 text-indigo-500" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Shipping Address</p>
                                                        <p className="text-sm font-semibold text-slate-600 leading-relaxed">
                                                            {order.address}, {order.district},<br />
                                                            {order.province} {order.zip_code}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-emerald-50 rounded-xl">
                                                        <PhoneIcon className="w-5 h-5 text-emerald-500" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Contact Number</p>
                                                        <p className="text-sm font-bold text-slate-700">{order.phone}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-amber-50 rounded-xl">
                                                        <CurrencyDollarIcon className="w-5 h-5 text-amber-500" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Order Total</p>
                                                        <p className="text-sm font-black text-slate-900">฿{Number(order.total_amount).toLocaleString()}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Side: Fulfillment Actions */}
                                    <div className="lg:w-96 bg-slate-50 p-8 lg:p-10 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-slate-100">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Logistics Tracking</label>
                                                <input 
                                                    type="text" 
                                                    placeholder="EX: TH123456789"
                                                    className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300 uppercase tracking-widest"
                                                    onChange={(e) => setTrackingInputs({...trackingInputs, [order.id]: e.target.value})}
                                                />
                                            </div>
                                            <button 
                                                onClick={() => handleShipOrder(order.id)}
                                                className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-indigo-600 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                                            >
                                                <TruckIcon className="w-5 h-5" />
                                                Ship Order
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default OnDeliveryAdmin;