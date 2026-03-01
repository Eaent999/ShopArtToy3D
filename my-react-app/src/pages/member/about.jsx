import React from 'react';
import { SparklesIcon, ShieldCheckIcon, HeartIcon } from '@heroicons/react/24/outline';

const About = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased pt-20 pb-20">
      <main className="max-w-7xl mx-auto px-8">
        {/* Hero Section */}
        <section className="mb-32">
          <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 mb-6 italic">Our Story</h3>
          <h1 className="text-7xl md:text-9xl font-black uppercase italic tracking-tighter leading-[0.8] mb-12">
            The Art of <br />
            <span className="text-slate-200">Unboxing.</span>
          </h1>
          <p className="max-w-2xl text-xl font-medium text-slate-600 leading-relaxed uppercase tracking-tight">
            เราไม่ได้แค่ขาย Art Toy แต่เราส่งมอบ "ความตื่นเต้น" ในทุกครั้งที่คุณเปิดกล่อง 
            ด้วยความหลงใหลในดีไซน์และคุณภาพ เราจึงคัดสรรเฉพาะผลงานที่ดีที่สุดจากศิลปินทั่วโลก
          </p>
        </section>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-slate-100 pt-20">
          <div className="space-y-6">
            <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center">
              <SparklesIcon className="w-6 h-6" />
            </div>
            <h4 className="text-2xl font-black uppercase italic tracking-tighter">Authentic Only</h4>
            <p className="text-sm text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
              สินค้าทุกชิ้นในร้านเป็นของแท้ 100% จากสตูดิโอผู้ผลิตโดยตรง มั่นใจได้ทุกการจุ่ม
            </p>
          </div>

          <div className="space-y-6">
            <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center">
              <ShieldCheckIcon className="w-6 h-6" />
            </div>
            <h4 className="text-2xl font-black uppercase italic tracking-tighter">Vault Packing</h4>
            <p className="text-sm text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
              ระบบการแพ็คระดับพรีเมียม เพื่อรักษา "กล่องนอก" ให้สมบูรณ์ที่สุดสำหรับนักสะสม
            </p>
          </div>

          <div className="space-y-6">
            <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center">
              <HeartIcon className="w-6 h-6" />
            </div>
            <h4 className="text-2xl font-black uppercase italic tracking-tighter">Collector First</h4>
            <p className="text-sm text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
              เราดูแลลูกค้าทุกคนเหมือนเพื่อนนักสะสม พร้อมให้คำปรึกษาและบริการหลังการขายที่ยอดเยี่ยม
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;