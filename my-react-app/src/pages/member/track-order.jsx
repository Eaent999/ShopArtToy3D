import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  MagnifyingGlassIcon, 
  TruckIcon, 
  CubeIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

const TrackOrder = () => {
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState('');
  const [trackingInfo, setTrackingInfo] = useState(null);

  const handleTrack = (e) => {
    e.preventDefault();
    // จำลองการหาข้อมูล
    setTrackingInfo({
      id: orderId || 'VLT-8892',
      status: 'In Transit',
      location: 'Bangkok Distribution Center',
      updatedAt: '2026-01-18 14:30'
    });
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased pb-20">
      <nav className="p-6">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all">
          <ArrowLeftIcon className="w-5 h-5 text-white" />
        </button>
      </nav>

      <main className="max-w-xl mx-auto px-6 mt-10">
        <header className="text-center mb-12">
          <TruckIcon className="w-16 h-16 mx-auto mb-4 text-white" />
          <h2 className="text-4xl font-black italic uppercase tracking-tighter">Asset Tracking</h2>
          <p className="text-slate-500 font-bold uppercase text-[9px] tracking-[0.2em] mt-2">ตรวจสอบสถานะการจัดส่งพัสดุของคุณ</p>
        </header>

        <form onSubmit={handleTrack} className="relative group mb-12">
          <input 
            type="text"
            placeholder="ENTER ORDER ID (e.g. VLT-XXXX)"
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-sm font-black uppercase tracking-widest outline-none focus:border-white transition-all"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
          />
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 bg-white text-black p-3 rounded-xl hover:scale-110 transition-all">
            <MagnifyingGlassIcon className="w-5 h-5" />
          </button>
        </form>

        {trackingInfo && (
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex justify-between items-start border-b border-white/5 pb-6">
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase">Order ID</p>
                <h3 className="text-xl font-black italic">#{trackingInfo.id}</h3>
              </div>
              <span className="bg-emerald-500 text-black px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">
                {trackingInfo.status}
              </span>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                  <div className="w-0.5 h-12 bg-white/10"></div>
                  <div className="w-3 h-3 bg-white/20 rounded-full"></div>
                </div>
                <div className="space-y-8">
                  <div className="relative -top-1">
                    <p className="text-[10px] font-black text-white uppercase">{trackingInfo.location}</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">{trackingInfo.updatedAt}</p>
                  </div>
                  <div className="relative -top-2">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-white/30">Order Confirmed</p>
                  </div>
                </div>
              </div>
            </div>

            <button className="w-full py-4 bg-white/10 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all">
              Copy Tracking Number
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default TrackOrder;