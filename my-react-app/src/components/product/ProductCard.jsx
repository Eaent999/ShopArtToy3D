import React from 'react';
import { ShoppingBagIcon, FireIcon, CheckIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();

  // 1. ตรวจสอบเงื่อนไขสต็อก
  const isModel = product.image_url?.toLowerCase().endsWith('.glb');
  const isOutOfStock = product.stock <= 0;

  // 2. ตรวจสอบว่าในตะกร้ามีสินค้านี้กี่ชิ้นแล้ว
  const itemInCart = cartItems.find((item) => item.id === product.id);
  const quantityInCart = itemInCart ? itemInCart.quantity : 0;
  
  // 3. เช็คว่ากดเพิ่มได้อีกไหม (ถ้าจำนวนในตะกร้า >= สต็อกที่มี แปลว่าเต็มแล้ว)
  const isLimitReached = quantityInCart >= product.stock;

  return (
    <div className="group relative flex flex-col">
      {/* 1. Image/Model Container */}
      <div className="relative aspect-square rounded-[2.5rem] overflow-hidden bg-[#f9f9f9] border border-gray-100 transition-all duration-500 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]">
        
        {/* แสดงป้าย Sold Out ถ้าของหมด */}
        {isOutOfStock && (
          <div className="absolute top-5 right-5 z-20 bg-gray-500/80 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg italic uppercase tracking-widest">
            Sold Out
          </div>
        )}

        {/* Flash Sale Badge */}
        {product.isOnSale && !isOutOfStock && (
          <div className="absolute top-5 left-5 z-20 flex items-center gap-1 bg-red-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg italic animate-pulse">
            <FireIcon className="w-3 h-3" /> FLASH SALE
          </div>
        )}

        {/* View Detail Link */}
        <div 
          className="w-full h-full cursor-pointer"
          onClick={() => navigate(`/product/${product.id}`)}
        >
          {isModel ? (
            <model-viewer
              src={`http://localhost:5000${product.image_url}`}
              alt={product.name}
              auto-rotate
              camera-controls
              touch-action="pan-y"
              style={{ width: '100%', height: '100%' }}
              className="bg-transparent"
            ></model-viewer>
          ) : (
            <img
              src={product.image}
              alt={product.name}
              className={`w-full h-full object-cover transition-transform duration-700 ${!isOutOfStock && 'group-hover:scale-110'}`}
            />
          )}
        </div>

        {/* 🛒 ปุ่มตะกร้า (ปรับปรุงใหม่): ตรวจสอบทั้งสต็อกร้านและจำนวนในตะกร้า */}
        {!isOutOfStock && (
          <button
            disabled={isLimitReached}
            onClick={(e) => {
              e.stopPropagation();
              if (!isLimitReached) {
                addToCart(product);
              }
            }}
            className={`absolute bottom-5 right-5 z-30 p-4 rounded-2xl transition-all duration-500 flex items-center gap-2 shadow-xl
              ${isLimitReached 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed translate-y-0 opacity-100' 
                : 'bg-black text-white opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-yellow-400 hover:text-black active:scale-90'
              }`}
          >
            {isLimitReached ? (
              <>
                <CheckIcon className="w-5 h-5" />
                <span className="text-[9px] font-black uppercase italic">Maxed</span>
              </>
            ) : (
              <ShoppingBagIcon className="w-5 h-5" />
            )}
          </button>
        )}
      </div>

      {/* 2. Product Info */}
      <div className="mt-6 px-2">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              {product.category}
            </span>
            {/* แสดงจำนวนที่อยู่ในตะกร้าขนาดเล็กๆ */}
            {quantityInCart > 0 && (
              <span className="text-[9px] font-bold bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                In Cart: {quantityInCart}
              </span>
            )}
          </div>
          <h3 
            className="text-lg font-black text-gray-900 truncate hover:text-yellow-500 cursor-pointer transition-colors uppercase italic"
            onClick={() => navigate(`/product/${product.id}`)}
          >
            {product.name}
          </h3>
        </div>

        {/* 3. Price Display */}
        <div className="flex items-center gap-3 mt-3">
          {product.isOnSale ? (
            <>
              <span className="text-xl font-black text-red-600 italic">
                ฿{product.price.toLocaleString()}
              </span>
              <span className="text-sm font-bold text-gray-400 line-through opacity-60 italic">
                ฿{product.originalPrice.toLocaleString()}
              </span>
            </>
          ) : (
            <span className="text-xl font-black text-gray-900 italic">
              ฿{product.price.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;