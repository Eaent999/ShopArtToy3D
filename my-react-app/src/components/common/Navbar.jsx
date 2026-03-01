import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import { 
  ShoppingCartIcon, 
  MagnifyingGlassIcon, 
  UserIcon, 
  Bars3Icon, 
  ArrowRightOnRectangleIcon,
  ShieldCheckIcon,
  ShoppingBagIcon 
} from '@heroicons/react/24/outline';
import { useCart } from '../../context/CartContext'; 

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const { setIsCartOpen, cartItems, clearCart } = useCart();
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const checkUser = () => {
      const savedUser = localStorage.getItem('user');
      setUser(savedUser ? JSON.parse(savedUser) : null);
    };
    checkUser();
    window.addEventListener('storage', checkUser);
    return () => window.removeEventListener('storage', checkUser);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // ปรับให้เปลี่ยนสถานะเร็วขึ้นเพื่อให้รอยต่อดูเนียน
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const viewOrderHistory = () => {
    if (!user) return navigate('/login');
    navigate('/order-history'); 
  };

  const handleTrackOrder = async () => {
    if (!user) return navigate('/login');
    navigate('/order-history');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    clearCart(); 
    alert('ออกจากระบบเรียบร้อย');
    navigate('/login');
  };

  return (
    /* 🟢 แก้ไขจุดที่ 1: เพิ่ม h-[80px] ให้คงที่ และปรับพื้นหลังให้ทึบเพื่อกัน Gap */
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-300 h-[80px] flex items-center ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white'
    }`}>
      <div className="container mx-auto px-6 flex items-center justify-between w-full">
        
        {/* Left: Logo */}
        <div className="flex items-center gap-4">
          <button className="lg:hidden p-2 text-gray-700">
            <Bars3Icon className="w-6 h-6" />
          </button>
          <Link to="/" className="text-2xl font-black tracking-tighter hover:scale-105 transition-transform">
            K&M <span className="text-yellow-400">3D</span>
          </Link>
        </div>

        {/* Center: Desktop Menu */}
        <div className={`hidden lg:flex items-center space-x-8 text-sm font-bold uppercase tracking-widest text-gray-700`}>
          <Link to="/shop" className="hover:text-yellow-500 transition-colors">Shop</Link>
          <Link to="/collections" className="hover:text-yellow-500 transition-colors">Collections</Link>
          <Link to="/new-arrivals" className="hover:text-yellow-500 transition-colors">New Arrivals</Link>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-3">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <MagnifyingGlassIcon className="w-6 h-6 text-gray-700" />
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              <button 
                onClick={handleTrackOrder}
                className="p-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-full transition-all relative group"
                title="ติดตามสถานะล่าสุด"
              >
                <ShoppingBagIcon className="w-6 h-6" />
                <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                  Track Order
                </span>
              </button>

              {user.role === 'admin' && (
                <Link 
                  to="/admin" 
                  className="hidden md:flex items-center gap-1 bg-red-500 text-white text-[10px] font-black px-3 py-1.5 rounded-lg hover:bg-red-600 transition-all mr-2"
                >
                  <ShieldCheckIcon className="w-4 h-4" /> ADMIN
                </Link>
              )}

              <div className="hidden md:flex items-center gap-2 bg-yellow-400/10 px-4 py-1.5 rounded-full border border-yellow-400/20">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-black text-gray-800 uppercase">{user.username}</span>
              </div>

              <button 
                onClick={handleLogout}
                className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
              >
                <ArrowRightOnRectangleIcon className="w-6 h-6" />
              </button>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="flex items-center gap-2 bg-black text-white text-[12px] font-bold px-5 py-2 rounded-full hover:bg-yellow-400 hover:text-black transition-all shadow-lg"
            >
              <UserIcon className="w-4 h-4" /> LOGIN
            </Link>
          )}

          <div className="h-6 w-[1px] bg-gray-200 mx-1 hidden md:block"></div>

          <button 
            onClick={() => setIsCartOpen(true)} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
          >
            <ShoppingCartIcon className="w-6 h-6 text-gray-700" />
            {totalItems > 0 && (
              <span className="absolute top-1 right-1 bg-yellow-400 text-black text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-black border-2 border-white shadow-sm animate-bounce-short">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
      
      {/* 🟢 แก้ไขจุดที่ 2: ลบคำว่า jsx ออกจากแท็ก style เพื่อแก้ Error ใน Console */}
      <style>{`
        @keyframes bounce-short {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .animate-bounce-short {
          animation: bounce-short 0.5s ease-in-out 1;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;