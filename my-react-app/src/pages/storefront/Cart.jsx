import React, { useState } from 'react';
import Button from '../../components/common/Button';
import { TrashIcon, MinusSmallIcon, PlusSmallIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';

const Cart = () => {
  // ข้อมูลสมมติในตะกร้า (ในโปรเจกต์จริงจะดึงมาจาก Zustand หรือ Redux)
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Labubu Catch Me If You Can", price: 550, qty: 2, image: "/models/thumbnails/labubu.jpg", category: "Vinyl Figure" },
    { id: 2, name: "Molly Space 100% Series 2", price: 420, qty: 1, image: "/models/thumbnails/molly.jpg", category: "Blind Box" },
  ]);

  // คำนวณราคาสรุป
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const shipping = subtotal > 2000 ? 0 : 50; // ส่งฟรีเมื่อซื้อครบ 2,000 บาท
  const total = subtotal + shipping;

  const updateQty = (id, delta) => {
    setCartItems(prev => prev.map(item => 
      item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
    ));
  };

  const removeItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center pt-24">
        <ShoppingBagIcon className="w-20 h-20 text-gray-200 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">ตะกร้าของคุณยังว่างอยู่</h2>
        <p className="text-gray-500 mb-8 text-center">ลองเลือกชมสินค้าที่น่าสนใจ แล้วหยิบใส่ตะกร้าดูสิ!</p>
        <a href="/shop">
          <Button variant="primary">ไปช้อปปิ้งกันเลย</Button>
        </a>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 pt-28 pb-20">
      <h1 className="text-3xl font-black mb-10">ตะกร้าสินค้าของคุณ ({cartItems.length})</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* รายการสินค้า (Left Column) */}
        <div className="lg:col-span-2 space-y-6">
          {cartItems.map((item) => (
            <div key={item.id} className="flex gap-4 md:gap-6 p-4 bg-white rounded-3xl border border-gray-100 shadow-sm transition-hover hover:shadow-md">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
              </div>
              
              <div className="flex-grow flex flex-col justify-between py-1">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.category}</p>
                    <h3 className="text-lg font-bold text-gray-900 leading-tight">{item.name}</h3>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex justify-between items-end mt-4">
                  {/* ตัวปรับจำนวน */}
                  <div className="flex items-center border border-gray-200 rounded-full px-2 py-1">
                    <button onClick={() => updateQty(item.id, -1)} className="p-1 hover:bg-gray-100 rounded-full">
                      <MinusSmallIcon className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center text-sm font-bold">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)} className="p-1 hover:bg-gray-100 rounded-full">
                      <PlusSmallIcon className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-xs text-gray-400">รวม</p>
                    <p className="text-lg font-black text-gray-900">฿{(item.price * item.qty).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* สรุปราคา (Right Column) */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl border border-gray-100 p-8 sticky top-28 shadow-sm">
            <h3 className="text-xl font-bold mb-6">สรุปคำสั่งซื้อ</h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-500">
                <span>ยอดรวมสินค้า</span>
                <span>฿{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>ค่าจัดส่ง</span>
                <span>{shipping === 0 ? <span className="text-green-500 font-bold">ฟรี</span> : `฿${shipping}`}</span>
              </div>
              {shipping > 0 && (
                <p className="text-[10px] text-yellow-600 bg-yellow-50 p-2 rounded-lg font-medium">
                  ช้อปอีก ฿{(2000 - subtotal).toLocaleString()} เพื่อรับสิทธิ์ส่งฟรี!
                </p>
              )}
              <div className="border-t pt-4 flex justify-between items-center text-xl font-black text-gray-900">
                <span>ยอดสุทธิ</span>
                <span>฿{total.toLocaleString()}</span>
              </div>
            </div>

            <Button variant="primary" size="full" className="py-4 shadow-xl shadow-yellow-200">
              ไปที่หน้าชำระเงิน
            </Button>

            <div className="mt-6 flex flex-col gap-2">
              <p className="text-[10px] text-gray-400 text-center uppercase tracking-tighter">Secure Checkout Guarantee</p>
              <div className="flex justify-center gap-3 grayscale opacity-50">
                {/* ใส่ Icon Payment เล็กๆ */}
                <div className="h-4 w-8 bg-gray-200 rounded"></div>
                <div className="h-4 w-8 bg-gray-200 rounded"></div>
                <div className="h-4 w-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;