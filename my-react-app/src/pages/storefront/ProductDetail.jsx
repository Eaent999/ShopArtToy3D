import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../context/CartContext';
import { 
  ShoppingBagIcon, 
  ChevronLeftIcon, 
  CubeIcon, 
  ShieldCheckIcon, 
  TruckIcon,
  FireIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import '@google/model-viewer';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // --- Logic การจัดการราคาและสต็อก (Flash Sale Ready) ---
  const hasValidFlashPrice = product?.flash_price !== null && Number(product?.flash_price) > 0;
  const isOnSale = product?.is_on_flash_sale === 1 && hasValidFlashPrice;
  
  // ราคาที่จะใช้แสดงผลและส่งเข้าตะกร้า
  const displayPrice = isOnSale ? Number(product.flash_price) : Number(product?.price || 0);
  const originalPrice = Number(product?.price || 0);

  // เช็คสต็อก (ถ้าลดราคาอยู่ให้ดู flash_stock ถ้ามี)
  const currentStock = isOnSale && product.flash_stock !== null ? product.flash_stock : (product?.stock || 0);
  const itemInCart = cartItems.find(item => item.id === parseInt(id));
  const currentQtyInCart = itemInCart ? itemInCart.quantity : 0;
  const isMaxStockReached = currentQtyInCart >= currentStock;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-gray-100 border-t-black rounded-full animate-spin"></div>
        <p className="font-black italic text-xl animate-pulse uppercase">Loading Model...</p>
      </div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center font-black uppercase tracking-widest text-gray-400">
      Product not found
    </div>
  );

  const modelUrl = `http://localhost:5000${product.image_url}`;

  return (
    <div className="min-h-screen bg-white pt-24 pb-12">
      <div className="container mx-auto px-6">
        
        {/* Navigation - Back Button */}
        <div className="mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-gray-400 hover:text-black transition-all font-black uppercase text-[10px] tracking-[0.2em]"
          >
            <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all border border-gray-100">
              <ChevronLeftIcon className="w-4 h-4" />
            </div>
            Back to Shop
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* Left: 3D Viewer Section */}
          <div className="w-full lg:w-3/5 bg-[#f6f6f6] rounded-[3rem] aspect-square lg:aspect-auto lg:h-[700px] overflow-hidden relative border border-gray-100 shadow-inner group/viewer">
            {isOnSale && (
              <div className="absolute top-8 right-8 z-20">
                <div className="bg-red-600 text-white px-5 py-2 rounded-2xl font-black italic text-[12px] tracking-widest uppercase shadow-2xl flex items-center gap-2 animate-bounce">
                  <FireIcon className="w-4 h-4" /> Flash Sale
                </div>
              </div>
            )}

            <model-viewer
              src={modelUrl}
              alt={product.name}
              auto-rotate
              camera-controls
              shadow-intensity="2"
              exposure="1"
              environment-image="neutral"
              ar
              style={{ width: '100%', height: '100%', outline: 'none' }}
            >
              <button slot="ar-button" className="absolute bottom-6 left-6 bg-white border-none rounded-2xl px-4 py-2 font-black text-[10px] shadow-lg flex items-center gap-2 hover:bg-black hover:text-white transition-all active:scale-95">
                <CubeIcon className="w-4 h-4" /> VIEW IN AR
              </button>
            </model-viewer>
            
            <div className="absolute top-8 left-8">
              <span className="bg-black text-white px-6 py-2 rounded-full font-black italic text-[10px] tracking-widest uppercase shadow-xl">
                {product.rarity || 'Standard'} EDITION
              </span>
            </div>
          </div>

          {/* Right: Product Info Section */}
          <div className="w-full lg:w-2/5 space-y-8">
            <div>
              <p className="text-yellow-500 font-black uppercase tracking-[0.3em] text-[10px] mb-2">
                {product.series} • {product.category}
              </p>
              <h1 className="text-5xl font-black text-gray-900 uppercase italic leading-[0.9] tracking-tighter mb-6">
                {product.name}
              </h1>

              {/* Price Section */}
              <div className="flex flex-col gap-2">
                {isOnSale ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-red-600 font-black text-[11px] uppercase tracking-widest">
                      <ClockIcon className="w-4 h-4" /> Limited Time Deal
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-5xl font-black text-red-600 italic">
                        ฿{displayPrice.toLocaleString()}
                      </span>
                      <span className="text-2xl font-bold text-gray-300 line-through italic">
                        ฿{originalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ) : (
                  <span className="text-5xl font-black text-gray-900 italic">
                    ฿{displayPrice.toLocaleString()}
                  </span>
                )}
                
                <div className="mt-4">
                  {currentStock > 0 ? (
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                      isOnSale ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'
                    }`}>
                      {isOnSale ? `Flash Stock: ${currentStock}` : `In Stock: ${currentStock}`}
                    </span>
                  ) : (
                    <span className="bg-red-50 text-red-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-red-100">
                      Sold Out
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="h-px bg-gray-100 w-full" />

            <div className="space-y-4">
              <p className="text-gray-500 leading-relaxed font-bold text-sm">
                {product.description || "พบกับคอลเลกชันสุดพิเศษที่เหล่านักสะสมต้องมี มาพร้อมกับรายละเอียดที่ประณีตและดีไซน์ที่เป็นเอกลักษณ์เฉพาะตัว"}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 pt-4">
              <button 
                onClick={() => addToCart({ ...product, price: displayPrice })}
                disabled={currentStock <= 0 || isMaxStockReached}
                className={`w-full py-6 rounded-[2rem] font-black uppercase italic tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95 ${
                  currentStock > 0 && !isMaxStockReached
                  ? (isOnSale ? 'bg-red-600 text-white hover:bg-black shadow-xl shadow-red-100' : 'bg-yellow-400 text-black hover:bg-black hover:text-white shadow-xl shadow-yellow-100')
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                }`}
              >
                <ShoppingBagIcon className="w-6 h-6" />
                {currentStock <= 0 
                  ? 'Out of Stock' 
                  : isMaxStockReached 
                    ? 'Limit Reached' 
                    : isOnSale ? 'Grab Flash Deal' : 'Add to Collection'}
              </button>
              
              {isMaxStockReached && currentStock > 0 && (
                <p className="text-[10px] text-center font-black text-red-500 uppercase tracking-widest animate-pulse">
                  คุณเพิ่มสินค้าชิ้นนี้เข้าตะกร้าครบตามจำนวนที่มีแล้ว
                </p>
              )}
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 pt-8">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100/50">
                <ShieldCheckIcon className="w-6 h-6 text-gray-400" />
                <span className="text-[10px] font-black uppercase text-gray-500 tracking-tighter leading-tight">
                  100% Authentic<br/>Guaranteed
                </span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100/50">
                <TruckIcon className="w-6 h-6 text-gray-400" />
                <span className="text-[10px] font-black uppercase text-gray-500 tracking-tighter leading-tight">
                  Fast & Secure<br/>Shipping
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;