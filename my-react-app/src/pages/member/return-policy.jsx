import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  ExclamationTriangleIcon, 
  ArrowPathIcon, 
  ShieldCheckIcon,
  VideoCameraIcon
} from '@heroicons/react/24/outline';

const ReturnPolicy = () => {
  const navigate = useNavigate();

  const policies = [
    {
      title: "Unboxing Video Required",
      desc: "ต้องถ่ายวิดีโอขณะแกะพัสดุโดยไม่มีการตัดต่อ เพื่อใช้เป็นหลักฐานหากสินค้าเสียหาย",
      icon: VideoCameraIcon
    },
    {
      title: "7-Day Return",
      desc: "สามารถแจ้งคืนสินค้าได้ภายใน 7 วันหลังจากได้รับสินค้า (ในกรณีที่สินค้าไม่ตรงตามที่สั่ง)",
      icon: ArrowPathIcon
    },
    {
      title: "Factory Defects",
      desc: "ความผิดพลาดจากการผลิต (Defect) ไม่สามารถเปลี่ยนหรือคืนได้ตามนโยบายของดีไซน์เนอร์",
      icon: ExclamationTriangleIcon
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased pb-20">
      <nav className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-all">
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <h1 className="text-sm font-black uppercase italic tracking-widest">Return Policy</h1>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 mt-16">
        <div className="text-center mb-16">
          <ShieldCheckIcon className="w-16 h-16 mx-auto mb-4 text-black" />
          <h2 className="text-5xl font-black italic uppercase tracking-tighter mb-4">Vault Guarantee</h2>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">นโยบายการรับประกันและการคืนสินค้า</p>
        </div>

        <div className="grid gap-6">
          {policies.map((p, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-[2rem] p-8 flex items-start gap-6 hover:border-black transition-all">
              <div className="bg-slate-100 p-4 rounded-2xl">
                <p.icon className="w-8 h-8 text-black" />
              </div>
              <div>
                <h3 className="text-lg font-black uppercase italic mb-1">{p.title}</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-rose-50 border border-rose-100 rounded-3xl p-8">
          <h4 className="text-rose-900 font-black uppercase text-xs mb-2 flex items-center gap-2">
            <ExclamationTriangleIcon className="w-4 h-4" /> Important Notice
          </h4>
          <p className="text-rose-700 text-sm font-medium">
            สินค้าประเภท "กล่องสุ่ม" (Blind Box) ที่แกะซีลแล้ว ไม่รับเปลี่ยนหรือคืนทุกกรณี ยกเว้นทางร้านส่งผิดคอลเลกชันเท่านั้น
          </p>
        </div>
      </main>
    </div>
  );
};

export default ReturnPolicy;