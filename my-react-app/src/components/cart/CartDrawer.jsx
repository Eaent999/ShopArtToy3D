import React from 'react';
import { useNavigate } from 'react-router-dom'; // เพิ่มตัวเปลี่ยนหน้า
import { useCart } from '../../context/CartContext';
import { XMarkIcon, TrashIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline';

const CartDrawer = () => {
  const { 
    cartItems, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    updateQuantity, 
    totalPrice 
  } = useCart();

  const navigate = useNavigate(); // สร้างตัวแปรสำหรับนำทาง

  // ฟังก์ชันสำหรับไปหน้า Checkout
  const handleCheckout = () => {
    setIsCartOpen(false); // ปิด Drawer ก่อนเปลี่ยนหน้า
    navigate('/checkout'); // ไปที่หน้าชำระเงิน
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      {/* Overlay Background */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity" 
        onClick={() => setIsCartOpen(false)} 
      />
      
      {/* Side Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-left">
        
        {/* Header - POP MART Style */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-black text-white">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-black uppercase italic tracking-tighter">My Cart</h2>
            <span className="bg-yellow-400 text-black text-[10px] font-black px-2 py-0.5 rounded-full">
              {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </div>
          <button 
            onClick={() => setIsCartOpen(false)} 
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
          {cartItems.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-6xl mb-4 opacity-10">📦</div>
              <p className="text-gray-400 font-black uppercase text-xs tracking-widest">Your cart is empty</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex gap-4 group animate-fade-in bg-white p-4 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                
                {/* Image / 3D Model View Area */}
                <div className="w-28 h-28 bg-gradient-to-tr from-gray-100 to-white rounded-2xl flex-shrink-0 overflow-hidden relative border border-gray-50 shadow-inner">
                  {item.image.toLowerCase().endsWith('.glb') ? (
                    <model-viewer
                      src={item.image} 
                      alt={item.name}
                      auto-rotate
                      camera-controls
                      disable-zoom
                      rotation-per-second="40deg"
                      touch-action="pan-y"
                      shadow-intensity="1"
                      environment-image="neutral"
                      style={{ width: '100%', height: '100%' }}
                    />
                  ) : (
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  )}
                </div>

                {/* Details Area */}
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <h3 className="font-black uppercase text-[10px] text-yellow-500 mb-0.5 tracking-widest">
                      {item.category || 'Limited Edition'}
                    </h3>
                    <div className="flex justify-between items-start">
                      <h4 className="font-black uppercase italic text-sm text-gray-800 leading-tight mb-1">
                        {item.name}
                      </h4>
                    </div>
                    {/* จำนวนสต็อกคงเหลือ */}
                    <p className="text-[9px] font-bold text-gray-400 uppercase">
                      Stock: <span className={item.stock <= 5 ? "text-red-500" : ""}>{item.stock} available</span>
                    </p>
                  </div>

                  <div className="flex justify-between items-end">
                    {/* Quantity Controls */}
                    <div className="flex items-center bg-gray-100 rounded-xl p-1 scale-90 origin-left border border-gray-200">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)} 
                        className="w-7 h-7 flex items-center justify-center bg-white rounded-lg shadow-sm hover:bg-black hover:text-white transition-all disabled:opacity-30"
                        disabled={item.quantity <= 1}
                      >
                        <MinusIcon className="w-3 h-3 stroke-[3px]"/>
                      </button>
                      
                      <span className="px-4 font-black text-xs text-gray-700">{item.quantity}</span>
                      
                      <button 
                        onClick={() => updateQuantity(item.id, 1)} 
                        disabled={item.quantity >= item.stock}
                        className={`w-7 h-7 flex items-center justify-center rounded-lg shadow-sm transition-all ${
                          item.quantity >= item.stock 
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50' 
                            : 'bg-white text-black hover:bg-black hover:text-white active:scale-90'
                        }`}
                        title={item.quantity >= item.stock ? "Maximum stock reached" : "Add more"}
                      >
                        <PlusIcon className="w-3 h-3 stroke-[3px]"/>
                      </button>
                    </div>

                    <div className="text-right">
                       <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Subtotal</p>
                       <p className="font-black text-md text-black">
                        ฿{(Number(item.price) * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Remove Icon */}
                <button 
                  onClick={() => removeFromCart(item.id)} 
                  className="text-gray-200 hover:text-red-500 self-start pt-1 transition-colors"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Section */}
        <div className="p-8 border-t border-gray-100 bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
          <div className="flex justify-between items-center mb-6">
            <span className="text-gray-400 font-black uppercase text-xs tracking-widest">Order Total</span>
            <span className="text-3xl font-black italic tracking-tighter">
              ฿{totalPrice.toLocaleString()}
            </span>
          </div>

          <button 
            onClick={handleCheckout} // เรียกใช้ฟังก์ชันนำทาง
            className="w-full bg-yellow-400 hover:bg-black hover:text-white text-black font-black py-5 rounded-3xl uppercase italic tracking-tighter transition-all shadow-xl shadow-yellow-400/20 active:scale-[0.97] disabled:bg-gray-200 disabled:shadow-none disabled:text-gray-400 disabled:cursor-not-allowed" 
            disabled={cartItems.length === 0}
          >
            Checkout Now
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-left {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-left {
          animation: slide-left 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default CartDrawer;