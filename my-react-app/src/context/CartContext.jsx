import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../services/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // ดึงข้อมูล User จาก localStorage
  const getUser = () => {
    const savedUser = localStorage.getItem('user');
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      return null;
    }
  };

  // --- 1. ฟังก์ชันดึงข้อมูลและ "รวมสินค้าที่ซ้ำกัน" (Grouping Logic) ---
  const fetchCart = async () => {
    const user = getUser();
    if (!user) {
      setCartItems([]);
      return;
    }

    try {
      const res = await cartAPI.get(user.id);
      
      // รวมสินค้า product_id เดียวกัน (ป้องกันราคาลด/ราคาเต็มแยกแถวกัน)
      const grouped = res.data.reduce((acc, current) => {
        const existing = acc.find(item => item.product_id === current.product_id);
        if (existing) {
          existing.quantity += current.quantity;
          if (current.is_on_flash_sale === 1) {
            existing.flash_price = current.flash_price;
            existing.is_on_flash_sale = 1;
            existing.flash_stock = current.flash_stock;
          }
        } else {
          acc.push({ ...current });
        }
        return acc;
      }, []);

      const formattedData = grouped.map(item => {
        const hasValidFlash = item.is_on_flash_sale === 1 && item.flash_price > 0;
        return {
          ...item,
          id: item.product_id,
          // ปรับโครงสร้างรูปภาพให้พร้อมแสดงผล
          image: item.image_url ? `${API_BASE_URL}${item.image_url}` : '/img/placeholder.png',
          price: hasValidFlash ? Number(item.flash_price) : Number(item.price),
          originalPrice: Number(item.price),
          isOnSale: hasValidFlash,
          stock: hasValidFlash ? Number(item.flash_stock ?? item.stock_limit) : Number(item.stock ?? 0)
        };
      });

      setCartItems(formattedData);
    } catch (error) {
      console.error("Fetch cart error:", error);
    }
  };

  // --- 2. เพิ่มสินค้าลงตะกร้า ---
  const addToCart = async (product) => {
    if (isAdding) return;
    
    const user = getUser();
    if (!user) {
      alert("กรุณาเข้าสู่ระบบก่อนเพิ่มสินค้า");
      return;
    }

    setIsAdding(true);

    try {
      await cartAPI.add({
        user_id: user.id,
        product_id: product.id,
        quantity: 1
      });
      
      await fetchCart();
      setIsCartOpen(true); // เปิดตะกร้าแสดงผลทันที
    } catch (error) {
      console.error("Add to cart error:", error);
    } finally {
      setIsAdding(false);
    }
  };

  // --- 3. ปรับจำนวนสินค้า (เพิ่ม/ลด) ---
  const updateQuantity = async (productId, amount) => {
    const user = getUser();
    if (!user) return;

    const item = cartItems.find(i => i.id === productId);
    if (!item) return;

    const newQuantity = item.quantity + amount;
    if (amount > 0 && newQuantity > item.stock) {
      alert(`สต็อกจำกัดเพียง ${item.stock} ชิ้น`);
      return;
    }
    if (newQuantity < 1) return;

    try {
      const action = amount > 0 ? 'increase' : 'decrease';
      await cartAPI.update({
        user_id: user.id,
        product_id: productId,
        action: action
      });
      await fetchCart();
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  // --- 4. ลบสินค้าออกจากตะกร้า ---
  const removeFromCart = async (productId) => {
    const user = getUser();
    if (!user) return;

    try {
      await cartAPI.remove({
        user_id: user.id,
        product_id: productId
      });
      await fetchCart();
    } catch (error) {
      console.error("Remove error:", error);
    }
  };

  // --- 5. ล้างตะกร้า (ใช้หลังจากจ่ายเงินเสร็จ) ---
  const clearCart = () => {
    setCartItems([]);
    setIsCartOpen(false);
  };

  // คำนวณราคาทั้งหมด
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      totalPrice, 
      isCartOpen, 
      setIsCartOpen,
      fetchCart,
      clearCart,
      itemCount: cartItems.length // เพิ่มจำนวนชิ้นสินค้าทั้งหมดในตะกร้า
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};