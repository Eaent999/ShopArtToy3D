import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Zap, Loader2, CheckCircle2 } from 'lucide-react';
import { useCart } from "../../context/CartContext"; 

const FlashSale = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState("00:00:00");
  const [campaign, setCampaign] = useState(null);
  const navigate = useNavigate();
  
  const { addToCart, cartItems } = useCart();

  const fetchData = async () => {
    try {
      const itemsRes = await axios.get('http://localhost:5000/api/flash-sale');
      setItems(itemsRes.data);
      const campaignRes = await axios.get('http://localhost:5000/api/flash-sale/active-campaign');
      if (campaignRes.data) setCampaign(campaignRes.data);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  const handleAddToCart = (item) => {
    addToCart({
      id: item.product_id,
      name: item.name,
      price: item.flash_price, 
      stock: Number(item.flash_stock || item.stock_limit || 0), 
      is_on_flash_sale: 1,
      image_url: item.image_url
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!campaign?.end_time) return;
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const endTime = new Date(campaign.end_time).getTime();
      const distance = endTime - now;
      if (distance < 0) {
        setTimeLeft("00:00:00");
        clearInterval(timer);
        return;
      }
      const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((distance % (1000 * 60)) / 1000);
      setTimeLeft(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(timer);
  }, [campaign]);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Loader2 className="text-yellow-400 animate-spin" size={48} />
    </div>
  );

  return (
    /* 🟢 แก้ไขจุดที่ 1: เพิ่ม pt-[80px] เพื่อดันหน้า Flash Sale ลงมาให้พ้น Navbar */
    <div className="min-h-screen bg-black text-white font-sans pt-[80px]">
      
      {/* Hero Banner: ปรับ h-[45vh] ให้สูงขึ้นนิดหน่อยเพื่อให้ดูอลังการหลังขยับลงมา */}
      <div className="relative h-[45vh] flex items-center justify-center border-b border-white/10">
        <div className="text-center z-10">
          <span className="bg-red-600 px-4 py-1 rounded-full text-[10px] font-black animate-pulse uppercase tracking-widest">
            Flash Sale is Live
          </span>
          <h1 className="text-6xl md:text-8xl font-black italic uppercase mt-4">
            {campaign?.campaign_name || "FLASH"} <span className="text-yellow-400">SALE</span>
          </h1>
          <div className="mt-6 bg-white/5 border border-white/10 p-4 rounded-2xl inline-block">
            <p className="text-yellow-400 text-4xl font-black font-mono tracking-tighter">{timeLeft}</p>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {items.map((item) => {
            const is3D = item.image_url?.toLowerCase().endsWith('.glb');
            const fileUrl = `http://localhost:5000${item.image_url}`;
            const soldPercentage = (item.sold_count / item.stock_limit) * 100;

            const itemInCart = cartItems.find((cart) => cart.id === item.product_id);
            const qtyInCart = itemInCart ? itemInCart.quantity : 0;
            const limit = Number(item.flash_stock || item.stock_limit || 0);
            const isLimitReached = qtyInCart >= limit;
            const isReallyOutOfStock = item.sold_count >= item.stock_limit;

            return (
              <div key={item.id} className="group">
                <div className={`relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-[#111] border transition-all duration-500 
                  ${isLimitReached ? 'border-white/20' : 'border-white/5 group-hover:border-yellow-400/50'}`}>
                  
                  <div className="w-full h-full cursor-pointer" onClick={() => navigate(`/product/${item.product_id}`)}>
                    {is3D ? (
                      <model-viewer
                        src={fileUrl}
                        alt={item.name}
                        auto-rotate
                        camera-controls
                        style={{ width: '100%', height: '100%' }}
                      ></model-viewer>
                    ) : (
                      <img 
                        src={fileUrl} 
                        className={`w-full h-full object-cover transition-all duration-700 
                          ${isLimitReached ? 'opacity-30 grayscale' : 'opacity-80 group-hover:opacity-100 group-hover:scale-110'}`} 
                        alt={item.name} 
                      />
                    )}
                  </div>

                  <div className={`absolute bottom-6 left-0 right-0 px-6 transition-all transform duration-300 
                    ${isLimitReached ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100'}`}>
                    
                    <button 
                      disabled={isLimitReached || isReallyOutOfStock}
                      onClick={() => handleAddToCart(item)}
                      className={`w-full font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-2xl
                        ${isLimitReached || isReallyOutOfStock
                          ? 'bg-white/10 text-white/40 cursor-not-allowed' 
                          : 'bg-yellow-400 text-black hover:bg-white active:scale-95'}`}
                    >
                      {isReallyOutOfStock ? (
                        "OUT OF STOCK"
                      ) : isLimitReached ? (
                        <><CheckCircle2 size={20} /> IN CART (MAX)</>
                      ) : (
                        <><ShoppingBag size={20} /> GRAB IT NOW</>
                      )}
                    </button>
                  </div>
                </div>

                <div className="mt-6 space-y-2 text-center md:text-left">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-black uppercase italic truncate flex-1">{item.name}</h3>
                    {qtyInCart > 0 && (
                      <span className="text-[10px] bg-yellow-400 text-black px-2 py-0.5 rounded-md font-bold ml-2">
                        {qtyInCart} IN CART
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-3">
                    <span className="text-2xl font-black text-red-500 italic">฿{Number(item.flash_price).toLocaleString()}</span>
                    <span className="text-sm text-gray-600 line-through italic">฿{Number(item.original_price).toLocaleString()}</span>
                  </div>
                  
                  <div className="mt-4 space-y-1">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter mb-1">
                      <span className={soldPercentage >= 80 ? 'text-red-500 animate-pulse' : 'text-gray-500'}>
                        {soldPercentage >= 100 ? 'SOLD OUT' : soldPercentage >= 80 ? 'ALMOST GONE' : 'SELLING FAST'}
                      </span>
                      <span className="text-gray-400">{Math.round(soldPercentage)}% SOLD</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${soldPercentage >= 80 ? 'bg-red-600' : 'bg-yellow-400'}`} 
                        style={{ width: `${Math.min(soldPercentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FlashSale;