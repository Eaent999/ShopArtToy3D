import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import { productAPI } from '../../services/api';
import { 
  CubeTransparentIcon, 
  RocketLaunchIcon, 
  ShieldCheckIcon 
} from '@heroicons/react/24/outline';
import '@google/model-viewer';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await productAPI.getAll();
        const formattedData = res.data.map(item => ({
          ...item,
          image: item.image_url ? `${API_BASE_URL}${item.image_url}` : '/img/placeholder.png'
        }));
        setProducts(formattedData);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    /* 🟢 แก้ไขจุดที่ 1: เพิ่ม pt-[80px] เพื่อดันเนื้อหาลงมาไม่ให้ Navbar บัง */
    <div className="flex flex-col min-h-screen bg-white pt-[70px]">
      
      {/* 1. Hero Section: ปรับ h ให้เหลือสัก 80vh หรือ 85vh เพื่อให้พอดีจอหลังดันลงมา */}
      <section className="relative h-[85vh] flex items-center bg-[#f8f8f8] overflow-hidden">
        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 items-center gap-4 z-10">
          
          {/* Left Content */}
          <div className="space-y-6 lg:col-span-5">
            {/* 🟢 ตัวนี้จะไม่โดนบังแล้ว */}
            <span className="inline-block px-4 py-2 bg-yellow-400 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
              New Arrival 2026
            </span>
            <h1 className="text-6xl lg:text-8xl font-black text-gray-900 leading-[0.9] italic tracking-tighter">
              COLLECT <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500">
                BEYOND
              </span> <br />
              LIMITS.
            </h1>
            <p className="text-gray-500 text-lg max-w-md font-bold leading-relaxed">
              สัมผัสประสบการณ์การสะสม Art Toy รูปแบบใหม่ 
              หมุนชมโมเดล 3D ความละเอียดสูงก่อนตัดสินใจสั่งซื้อ
            </p>
            <div className="flex gap-4 pt-4">
              <Link to="/shop">
                <Button size="lg" className="px-10 py-4 shadow-xl shadow-yellow-200">
                  ช้อปเลย
                </Button>
              </Link>
              <Link to="/collections">
                <Button variant="outline" size="lg">
                  ดูคอลเลกชัน
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Right Content: 3D Model Viewer */}
          <div className="relative hidden lg:block h-[700px] lg:col-span-7 lg:-translate-x-24 cursor-grab active:cursor-grabbing">
            <div className="w-[500px] h-[500px] bg-yellow-300 rounded-full blur-[120px] opacity-25 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
            
            <model-viewer
              src="/models/hero_showcase.glb"
              poster="/img/hero-placeholder.png"
              alt="Featured 3D Art Toy"
              shadow-intensity="2"
              camera-controls
              auto-rotate
              rotation-per-second="30deg"
              interaction-prompt="none"
              exposure="1.2"
              environment-image="neutral"
              style={{ width: '100%', height: '100%', outline: 'none' }}
            />
          </div>
        </div>
      </section>

      {/* 2. Features */}
      <section className="py-24 bg-white border-y border-gray-50">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-yellow-50 rounded-[2rem] flex items-center justify-center mb-8 text-yellow-500 shadow-inner">
              <CubeTransparentIcon className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black uppercase italic tracking-tight mb-3">3D Experience</h3>
            <p className="text-gray-400 text-sm font-bold leading-relaxed">ชมโมเดลสินค้าได้ทุกซอกทุกมุม<br/>เสมือนได้จับของจริงก่อนจุ่ม</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-blue-50 rounded-[2rem] flex items-center justify-center mb-8 text-blue-500 shadow-inner">
              <RocketLaunchIcon className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black uppercase italic tracking-tight mb-3">Fast Shipping</h3>
            <p className="text-gray-400 text-sm font-bold leading-relaxed">ระบบขนส่งที่รวดเร็วทันใจ<br/>แพ็คแน่นหนาป้องกันการกระแทก</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-green-50 rounded-[2rem] flex items-center justify-center mb-8 text-green-500 shadow-inner">
              <ShieldCheckIcon className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black uppercase italic tracking-tight mb-3">100% Authentic</h3>
            <p className="text-gray-400 text-sm font-bold leading-relaxed">รับประกันสินค้าลิขสิทธิ์แท้<br/>จากสตูดิโอผู้ผลิตโดยตรง</p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;