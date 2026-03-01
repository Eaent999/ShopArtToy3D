import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  ShoppingBagIcon, 
  CreditCardIcon, 
  TruckIcon, 
  CheckBadgeIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import Button from '../../components/common/Button';

const HowToBuy = () => {
  const navigate = useNavigate();

  const steps = [
    {
      id: '01',
      title: 'Select Your Asset',
      description: 'เลือก Art Toy หรือคอลเลกชันที่คุณต้องการจากหน้าร้านค้าของเรา ตรวจสอบรายละเอียดและโมเดล 3D ให้เรียบร้อย',
      icon: MagnifyingGlassIcon,
      color: 'bg-blue-500'
    },
    {
      id: '02',
      title: 'Add to Vault (Cart)',
      description: 'กดปุ่ม Add to Cart เพื่อเก็บสินค้าไว้ในตะกร้า คุณสามารถเลือกซื้อสินค้าชิ้นอื่นเพิ่มได้ในขั้นตอนนี้',
      icon: ShoppingBagIcon,
      color: 'bg-purple-500'
    },
    {
      id: '03',
      title: 'Secure Payment',
      description: 'ดำเนินการชำระเงินผ่านระบบที่ปลอดภัย รองรับทั้งการโอนเงินและช่องทางอื่นๆ ที่เรากำหนด',
      icon: CreditCardIcon,
      color: 'bg-amber-500'
    },
    {
      id: '04',
      title: 'Track & Receive',
      description: 'รอรับหมายเลขติดตามพัสดุผ่านทางหน้าประวัติการสั่งซื้อ และรอรับสินค้าส่งตรงถึงบ้านคุณ',
      icon: TruckIcon,
      color: 'bg-emerald-500'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased pb-20">
      {/* Navigation */}
      <nav className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)} 
              className="p-2 hover:bg-slate-100 rounded-full transition-all group"
            >
              <ArrowLeftIcon className="w-5 h-5 text-slate-500 group-hover:text-black" />
            </button>
            <h1 className="text-sm font-bold tracking-tight text-slate-900 uppercase italic">
              Guide <span className="text-slate-400 font-normal">/</span> How to buy
            </h1>
          </div>
          <Button 
            className="bg-black text-white rounded-xl px-6 py-2 text-[10px] font-black uppercase tracking-widest"
            onClick={() => navigate('/shop')}
          >
            Go to Shop
          </Button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 mt-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter text-black mb-4">
            How to secure <br />your collectibles
          </h2>
          <div className="h-1.5 w-24 bg-black mx-auto rounded-full mb-6"></div>
          <p className="text-slate-500 font-medium max-w-md mx-auto">
            ขั้นตอนการสั่งซื้อที่ง่ายและปลอดภัย เพื่อให้คุณได้รับ Art Toy ชิ้นโปรดส่งตรงถึงมืออย่างมั่นใจ
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid gap-6">
          {steps.map((step, index) => (
            <div 
              key={step.id}
              className="group bg-white border border-slate-200 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-start md:items-center gap-8 transition-all hover:shadow-2xl hover:shadow-slate-200 hover:-translate-y-1"
            >
              <div className="relative">
                <div className={`w-20 h-20 ${step.color} rounded-3xl flex items-center justify-center text-white shadow-lg`}>
                  <step.icon className="w-10 h-10" />
                </div>
                <span className="absolute -top-3 -left-3 bg-black text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg">
                  {step.id}
                </span>
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-black uppercase italic tracking-tight text-slate-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">
                  {step.description}
                </p>
              </div>

              <div className="hidden md:block">
                <CheckBadgeIcon className="w-8 h-8 text-slate-100 group-hover:text-slate-200 transition-colors" />
              </div>
            </div>
          ))}
        </div>

        {/* Support Section */}
        
      </main>
    </div>
  );
};

export default HowToBuy;