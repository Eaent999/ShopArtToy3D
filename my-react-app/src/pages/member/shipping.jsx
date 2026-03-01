import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon, TruckIcon, CheckCircleIcon, 
  InformationCircleIcon, ShieldCheckIcon, 
  ClockIcon, SparklesIcon, FireIcon,
  GlobeAsiaAustraliaIcon, CubeIcon
} from '@heroicons/react/24/outline';

const Shipping = () => {
  const navigate = useNavigate();
  
  const SHIPPING_PARTNERS = [
    { 
      id: 'flash', 
      name: 'Flash Express', 
      tagline: 'Fast & Economic',
      desc: 'จัดส่งรวดเร็วทั่วไทย (1-2 วัน)',
      details: 'ครอบคลุมทุกพื้นที่ทั่วประเทศ พร้อมระบบติดตามพัสดุแบบ Real-time ตลอด 24 ชม. เหมาะสำหรับผู้ที่ต้องการความรวดเร็วและราคาประหยัด',
      feature: 'Pick-up Service: เข้ารับทุกวันไม่มีวันหยุด',
      color: 'bg-yellow-400',
      textColor: 'text-black',
      highlight: 'Speed'
    },
    { 
      id: 'jt', 
      name: 'J&T Express', 
      tagline: 'E-commerce Expert',
      desc: 'จัดส่งทุกวันไม่เว้นวันหยุด (1-3 วัน)',
      details: 'เน้นความยืดหยุ่นในการจัดส่ง เหมาะสำหรับการสั่งซื้อผ่านแพลตฟอร์มออนไลน์ มีจุดให้บริการครอบคลุมทั่วทุกตำบลในประเทศไทย',
      feature: 'Non-stop: จัดส่ง 365 วัน ไม่มีวันหยุดราชการ',
      color: 'bg-red-600',
      textColor: 'text-white',
      highlight: '365 Days'
    },
    { 
      id: 'ems', 
      name: 'Thailand Post EMS', 
      tagline: 'Reliable Standard',
      desc: 'มาตรฐานไปรษณีย์ไทย (1-3 วัน)', 
      details: 'บริการที่น่าเชื่อถือที่สุดด้วยเครือข่ายที่เข้าถึงทุกบ้านเลขที่ในไทย รับประกันความปลอดภัยพัสดุภายใต้มาตรฐานไปรษณีย์ไทย',
      feature: 'Reach: ส่งถึงปลายทางแม้พื้นที่ห่างไกลมาก',
      color: 'bg-red-500',
      textColor: 'text-white',
      highlight: 'Coverage'
    },
    { 
      id: 'kerry', 
      name: 'Kerry Express', 
      tagline: 'Premium Delivery',
      desc: 'บริการระดับพรีเมียม (1-2 วัน)', 
      details: 'การจัดส่งระดับพรีเมียมที่เน้นการดูแลพัสดุเป็นพิเศษ มีพนักงานโทรแจ้งก่อนเข้าส่ง เพื่อให้มั่นใจว่าของถึงมือผู้รับในสภาพสมบูรณ์',
      feature: 'Care: พนักงานโทรนัดหมายก่อนเข้าส่งทุกราย',
      color: 'bg-orange-500',
      textColor: 'text-white',
      highlight: 'Premium'
    }
  ];

  const [selectedCourier, setSelectedCourier] = useState('flash');
  const currentCourier = SHIPPING_PARTNERS.find(c => c.id === selectedCourier);

  return (
    <div className="min-h-screen bg-[#F8F8F8] text-slate-900 font-sans antialiased pb-20">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-8 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-black transition-all group">
            <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Exit to Cart</span>
          </button>
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Logistics Information Center</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 mt-20">
        {/* ใช้ items-stretch เพื่อให้คอลัมน์ซ้ายและขวาสูงเท่ากัน */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-stretch">
          
          {/* Left Side: Selection Tabs */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            <div className="mb-4">
                <h2 className="text-5xl font-black uppercase italic tracking-tighter mb-4">Courier<br/><span className="text-slate-300">Partners</span></h2>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic border-l-2 border-black pl-4">Select Courier to view details</h3>
            </div>
            
            <div className="space-y-3 h-full">
              {SHIPPING_PARTNERS.map((courier) => (
                <button 
                  key={courier.id}
                  onClick={() => setSelectedCourier(courier.id)}
                  className={`w-full text-left relative p-8 rounded-[2.5rem] transition-all duration-500 overflow-hidden group h-[calc(25%-0.75rem)] min-h-[140px] flex flex-col justify-center ${
                    selectedCourier === courier.id 
                    ? 'bg-black text-white shadow-2xl scale-[1.02] z-10' 
                    : 'bg-white border border-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between relative z-10">
                      <div>
                          <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${selectedCourier === courier.id ? 'text-white/40' : 'text-slate-400'}`}>
                             {courier.tagline}
                          </p>
                          <h4 className="text-xl font-black uppercase italic tracking-tighter">{courier.name}</h4>
                      </div>
                      {selectedCourier === courier.id ? (
                          <CheckCircleIcon className="w-6 h-6 text-white" />
                      ) : (
                          <div className={`w-3 h-3 rounded-full ${courier.color}`} />
                      )}
                  </div>
                  <span className={`absolute -right-2 -bottom-4 text-5xl font-black italic opacity-[0.03] transition-transform group-hover:scale-110 ${selectedCourier === courier.id ? 'opacity-[0.07]' : ''}`}>
                      {courier.highlight}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Side: Visual Detail Display */}
          <div className="lg:col-span-7">
            {/* h-full เพื่อยืดความสูงให้เต็มคอลัมน์ตามด้านซ้าย */}
            <div className="bg-white border border-slate-100 rounded-[4rem] p-12 shadow-sm transition-all duration-500 h-full relative overflow-hidden flex flex-col">
                
                {/* Header of Detail */}
                <div className="flex items-start justify-between mb-12 pb-10 border-b border-slate-50">
                    <div className="space-y-4">
                        <div className={`inline-block px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${currentCourier.color} ${currentCourier.textColor}`}>
                            {currentCourier.tagline}
                        </div>
                        <h3 className="text-5xl font-black uppercase italic tracking-tighter leading-tight">Insight: <br/>{currentCourier.name}</h3>
                    </div>
                    <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center">
                        <InformationCircleIcon className="w-10 h-10 text-slate-200" />
                    </div>
                </div>

                {/* Body Content - flex-grow เพื่อดันส่วนที่เหลือลงไปด้านล่าง */}
                <div className="space-y-12 flex-grow">
                    <p className="text-lg font-bold leading-relaxed text-slate-700 italic uppercase tracking-tight">
                        "{currentCourier.details}"
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                        <div className="space-y-3 bg-slate-50 p-6 rounded-[2.5rem] border border-transparent hover:border-slate-200 transition-colors">
                            <div className="flex items-center gap-2 text-emerald-500 mb-2">
                                <ShieldCheckIcon className="w-5 h-5" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Key Advantage</span>
                            </div>
                            <p className="text-xs font-black uppercase leading-relaxed text-slate-600">{currentCourier.feature}</p>
                        </div>

                        <div className="space-y-3 bg-slate-50 p-6 rounded-[2.5rem] border border-transparent hover:border-slate-200 transition-colors">
                            <div className="flex items-center gap-2 text-blue-500 mb-2">
                                <ClockIcon className="w-5 h-5" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Timeframe</span>
                            </div>
                            <p className="text-xs font-black uppercase leading-relaxed text-slate-600">{currentCourier.desc}</p>
                        </div>
                    </div>
                </div>

                {/* Footer Guard Notice - จะอยู่ติดด้านล่างเสมอ */}
                <div className="mt-12 pt-8 border-t border-slate-50 flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center flex-shrink-0 shadow-lg shadow-black/20">
                        <CubeIcon className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight leading-relaxed">
                        พัสดุทุกชิ้นสนับสนุนการส่งด้วย <span className="text-black font-black">Vault-Spec Packaging</span> <br /> 
                        การันตีความปลอดภัยและสถานะการจัดส่งตลอด 24 ชั่วโมง
                    </p>
                </div>

                {/* Decorative Background Text */}
                <div className="absolute -bottom-10 -right-5 text-[120px] font-black text-slate-50 leading-none select-none z-0">
                  {currentCourier.id.toUpperCase()}
                </div>
            </div>
          </div>
        </div>

        
      </main>
    </div>
  );
};

export default Shipping;