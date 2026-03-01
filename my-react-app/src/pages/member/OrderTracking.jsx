import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Package, Truck, CheckCircle, Clock, ArrowLeft,
  ShieldCheck, Search, Check
} from 'lucide-react';

const OrderTracking = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('ongoing'); 
    
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // ขั้นตอนสถานะ
    const statusSteps = [
        { id: 'pending', label: 'Verifying', icon: Clock },
        { id: 'paid', label: 'Preparing', icon: ShieldCheck },
        { id: 'on_delivery', label: 'On Delivery', icon: Truck },
        { id: 'completed', label: 'Delivered', icon: CheckCircle },
    ];

    // ฟังก์ชันช่วยหาลำดับ Index ของสถานะ
    const getStatusIndex = (status) => {
        const s = (status || '').toLowerCase().trim();
        if (s === 'pending' || s === '') return 0;
        if (s === 'paid') return 1;
        if (s === 'on_delivery') return 2;
        if (s === 'completed') return 3;
        return 0;
    };

    const fetchAllOrders = async () => {
        if (!user?.id) {
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const res = await axios.get(`http://localhost:5000/api/orders/user/${user.id}`);
            // เรียงลำดับให้อันล่าสุดอยู่บนสุด
            const sortedData = Array.isArray(res.data) 
                ? res.data.sort((a, b) => b.id - a.id) 
                : [];
            setOrders(sortedData);
        } catch (err) { 
            console.error("Fetch Error:", err); 
        } finally { 
            setLoading(false); 
        }
    };

    useEffect(() => {
        fetchAllOrders();
    }, [user?.id]);

    // ฟังก์ชันหลัก: กดยืนยันรับสินค้า
    const handleConfirmReceived = async (orderId) => {
        if (!window.confirm("คุณได้รับสินค้าเรียบร้อยแล้วใช่หรือไม่? สถานะจะเปลี่ยนเป็น Delivered ทันที")) return;
        
        try {
            // ยิง API ไป Update สถานะเป็น completed
            await axios.put(`http://localhost:5000/api/admin/orders/${orderId}/status`, {
                status: 'completed'
            });
            
            // แจ้งเตือนผู้ใช้
            alert("อัปเดตสถานะเป็น Delivered เรียบร้อยแล้ว!");
            
            // ดึงข้อมูลใหม่เพื่อให้ออเดอร์ย้ายไปอยู่ Tab Completed
            await fetchAllOrders(); 
            
            // สลับ Tab ไปหน้า Completed ให้เห็นออเดอร์ที่เพิ่งยืนยันไป
            setActiveTab('completed');
            
        } catch (err) {
            console.error("Update Status Error:", err);
            alert("เกิดข้อผิดพลาดในการอัปเดตสถานะ");
        }
    };

    // การกรองข้อมูลแยก Tab
    const filteredOrders = orders.filter(order => {
        const s = (order.status || '').toLowerCase().trim();
        if (activeTab === 'ongoing') {
            return s !== 'completed' && s !== 'cancelled';
        }
        return s === 'completed';
    });

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-black"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F5F5F7] pb-20 pt-10 px-6">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-5xl font-extrabold italic tracking-tighter">ORDER HISTORY</h1>
                        <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-1">
                           Account: {user.username || 'Guest User'} | User ID: {user.id}
                        </p>
                    </div>
                    <button onClick={() => navigate('/')} className="bg-white p-4 rounded-full shadow-sm hover:bg-black hover:text-white transition-all transform active:scale-95">
                        <ArrowLeft size={24} />
                    </button>
                </div>

                {/* Tab Switcher */}
                <div className="flex bg-white p-1.5 rounded-full mb-10 shadow-sm w-fit border border-gray-100">
                    {['ongoing', 'completed'].map((tab) => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-10 py-3 rounded-full font-black uppercase text-xs italic transition-all ${activeTab === tab ? 'bg-black text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            {tab} ({orders.filter(o => tab === 'ongoing' ? (o.status || '') !== 'completed' : o.status === 'completed').length})
                        </button>
                    ))}
                </div>

                {/* Order List */}
                {filteredOrders.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-gray-200">
                        <Package size={48} className="mx-auto text-gray-200 mb-4" />
                        <p className="text-gray-400 font-bold uppercase italic text-sm">No {activeTab} orders found</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {filteredOrders.map((order) => {
                            const currentIndex = getStatusIndex(order.status);
                            
                            return (
                                <div key={order.id} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 hover:border-gray-300 transition-all">
                                    {/* Order Info Header */}
                                    <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
                                        <div className="flex items-center gap-5">
                                            <div className={`p-4 rounded-2xl ${order.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-yellow-400 text-black'}`}>
                                                <Package size={28} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order ID</p>
                                                <h3 className="text-xl font-black italic">#ORD-{order.id}</h3>
                                            </div>
                                        </div>
                                        <div className="md:text-right flex flex-col items-start md:items-end">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Grand Total</p>
                                            <p className="text-3xl font-black text-black">฿{Number(order.total_amount).toLocaleString()}</p>
                                        </div>
                                    </div>

                                    {/* Stepper Display */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                                        {statusSteps.map((step, idx) => {
                                            const isActive = idx === currentIndex;
                                            const isDone = idx < currentIndex;
                                            const Icon = step.icon;

                                            return (
                                                <div 
                                                    key={step.id} 
                                                    className={`flex items-center gap-3 p-4 rounded-2xl border transition-all 
                                                        ${isActive ? 'bg-black text-white border-black scale-105 shadow-md z-10' : 
                                                          isDone ? 'bg-green-50 text-green-600 border-green-100' : 
                                                          'bg-gray-50 text-gray-200 border-transparent'}`}
                                                >
                                                    <Icon size={18} />
                                                    <span className="text-[10px] font-bold uppercase italic">{step.label}</span>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Bottom Info & Action Button */}
                                    <div className="pt-6 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
                                        <div className="flex flex-wrap gap-3">
                                            <div className="bg-gray-100 px-4 py-2 rounded-lg">
                                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                                    Method: {order.payment_method}
                                                </span>
                                            </div>
                                            {order.tracking_number && (
                                                <div className="flex items-center gap-2 text-blue-600 font-bold text-xs bg-blue-50 px-4 py-2 rounded-lg">
                                                    <Search size={14} /> Tracking: {order.tracking_number}
                                                </div>
                                            )}
                                        </div>

                                       
                                        {/* เมื่อรายการสำเร็จแล้ว */}
                                        {order.status === 'completed' && (
                                            <div className="flex items-center gap-2 text-green-600 font-bold text-sm bg-green-50 px-6 py-3 rounded-2xl border border-green-100">
                                                <CheckCircle size={20} /> Successfully Delivered
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderTracking;