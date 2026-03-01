import React, { useState, useEffect } from 'react';
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { orderAPI, paymentAPI } from '../../services/api';
import { 
  CreditCard, ShoppingBag, ArrowLeft, ShieldCheck,
  Smartphone, CheckCircle2, QrCode, Upload, X
} from "lucide-react";
import '@google/model-viewer'; // มั่นใจว่าได้รัน npm install @google/model-viewer แล้ว

const Checkout = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrCodeImg, setQrCodeImg] = useState('');
  const [slipFile, setSlipFile] = useState(null);
  
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', province: '', district: '', zipCode: '',
    paymentMethod: 'transfer'
  });

  // ดึงข้อมูลที่อยู่ล่าสุดของผู้ใช้
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    if (currentUser) {
      orderAPI.getLastShipping(currentUser.id)
        .then(res => {
          if (res.data) {
            setFormData(prev => ({
              ...prev,
              firstName: res.data.first_name || '',
              lastName: res.data.last_name || '',
              email: res.data.email || '',
              phone: res.data.phone || '',
              address: res.data.address || '',
              district: res.data.district || '',
              province: res.data.province || '',
              zipCode: res.data.zip_code || ''
            }));
          }
        }).catch(() => {});
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleProceedToPayment = async (e) => {
    e.preventDefault();
    if (formData.paymentMethod === 'transfer') {
      try {
        const res = await paymentAPI.generateQR(totalPrice);
        setQrCodeImg(res.data.qrCode);
        setShowQRModal(true);
      } catch (err) {
        alert("ไม่สามารถสร้าง QR Code ได้");
      }
    } else {
      alert("ขออภัย ระบบบัตรเครดิตยังไม่เปิดใช้งาน");
    }
  };

  const handleFinalSubmit = async () => {
    if (!slipFile) return alert("กรุณาแนบหลักฐานการโอนเงิน (สลิป)");
    
    setIsSubmitting(true);
    const currentUser = JSON.parse(localStorage.getItem('user'));
    
    const orderData = {
      customer: { ...formData, userId: currentUser?.id },
      items: cartItems.map(item => ({
        id: item.product_id || item.id,
        quantity: item.quantity,
        price: item.flash_price || item.price 
      })),
      totalAmount: totalPrice
    };

    const submitData = new FormData();
    submitData.append('slip', slipFile);
    submitData.append('orderData', JSON.stringify(orderData));

    try {
      const res = await orderAPI.createWithSlip(submitData);
      if (res.data.status === "success") {
        alert("🎉 ส่งหลักฐานเรียบร้อย! กรุณารอแอดมินตรวจสอบ");
        clearCart();
        navigate('/');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "เกิดข้อผิดพลาดในการส่งข้อมูล";
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ฟังก์ชันช่วยสร้าง URL ที่ถูกต้อง
  const getFullUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/300';
    return path.startsWith('/') ? `http://localhost:5000${path}` : `http://localhost:5000/${path}`;
  };

  if (cartItems.length === 0) return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <ShoppingBag size={60} className="text-gray-800 mb-6" />
      <h2 className="text-2xl font-black uppercase italic tracking-tighter">Your cart is empty</h2>
      <button onClick={() => navigate('/')} className="mt-6 text-yellow-400 font-bold hover:underline">Return to Shop</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans">
      {/* QR MODAL */}
      {showQRModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-[#111] border border-white/10 p-8 rounded-[3rem] max-w-md w-full relative text-center shadow-2xl">
            <button onClick={() => setShowQRModal(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"><X /></button>
            <h2 className="text-2xl font-black uppercase italic mb-2 tracking-tighter">PromptPay Scan</h2>
            <p className="text-gray-400 text-xs mb-6 uppercase tracking-widest">Scan to pay ฿{totalPrice.toLocaleString()}</p>
            
            <div className="bg-white p-4 rounded-3xl inline-block mb-6 shadow-xl">
              <img src={qrCodeImg} alt="PromptPay QR" className="w-64 h-64" />
            </div>

            <div className="space-y-4">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/10 rounded-3xl cursor-pointer hover:bg-white/5 transition-all group">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="text-yellow-400 mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-[10px] font-black uppercase tracking-widest">
                    {slipFile ? slipFile.name : "Upload Payment Slip"}
                  </p>
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={(e) => setSlipFile(e.target.files[0])} />
              </label>

              <button 
                onClick={handleFinalSubmit}
                disabled={isSubmitting || !slipFile}
                className={`w-full py-4 rounded-full font-black uppercase transition-all shadow-lg ${!slipFile ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-green-500 text-black hover:scale-105 active:scale-95'}`}
              >
                {isSubmitting ? "Verifying..." : "Confirm & Send Slip"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="border-b border-white/5 p-6 bg-black/80 backdrop-blur-xl sticky top-0 z-[100]">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft size={18} /> <span className="text-[10px] font-black uppercase tracking-widest">Back</span>
          </button>
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-green-500" />
            <h1 className="text-sm font-black uppercase tracking-widest">Secure Checkout</h1>
          </div>
          <div className="w-10"></div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Form Section */}
          <div className="lg:col-span-7">
            <form id="checkout-form" onSubmit={handleProceedToPayment} className="space-y-12">
              <section className="space-y-8">
                <h2 className="text-2xl font-black uppercase italic tracking-tighter"><span className="text-white/10 mr-4">01</span>Shipping</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input required name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleInputChange} className="bg-white/[0.03] border border-white/10 p-4 rounded-2xl outline-none focus:border-yellow-400 transition-all" />
                  <input required name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleInputChange} className="bg-white/[0.03] border border-white/10 p-4 rounded-2xl outline-none focus:border-yellow-400 transition-all" />
                  <input required type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} className="md:col-span-2 bg-white/[0.03] border border-white/10 p-4 rounded-2xl outline-none focus:border-yellow-400 transition-all" />
                  <input required name="phone" placeholder="Phone" value={formData.phone} onChange={handleInputChange} className="md:col-span-2 bg-white/[0.03] border border-white/10 p-4 rounded-2xl outline-none focus:border-yellow-400 transition-all" />
                  <textarea required name="address" placeholder="Address" value={formData.address} rows="3" onChange={handleInputChange} className="md:col-span-2 bg-white/[0.03] border border-white/10 p-4 rounded-2xl outline-none focus:border-yellow-400 resize-none transition-all"></textarea>
                  <input required name="district" placeholder="District" value={formData.district} onChange={handleInputChange} className="bg-white/[0.03] border border-white/10 p-4 rounded-2xl outline-none focus:border-yellow-400 transition-all" />
                  <input required name="province" placeholder="Province" value={formData.province} onChange={handleInputChange} className="bg-white/[0.03] border border-white/10 p-4 rounded-2xl outline-none focus:border-yellow-400 transition-all" />
                  <input required name="zipCode" placeholder="Zip Code" value={formData.zipCode} onChange={handleInputChange} className="md:col-span-2 bg-white/[0.03] border border-white/10 p-4 rounded-2xl outline-none focus:border-yellow-400 transition-all" />
                </div>
              </section>

              <section className="space-y-8">
                <h2 className="text-2xl font-black uppercase italic tracking-tighter"><span className="text-white/10 mr-4">02</span>Payment Method</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className={`cursor-pointer p-6 rounded-[2rem] border transition-all flex items-start gap-4 ${formData.paymentMethod === 'transfer' ? 'border-yellow-400 bg-yellow-400/5 shadow-lg shadow-yellow-400/5' : 'border-white/5 bg-white/5'}`}>
                    <input type="radio" name="paymentMethod" value="transfer" checked={formData.paymentMethod === 'transfer'} onChange={handleInputChange} className="mt-1 accent-yellow-400" />
                    <div><Smartphone className="mb-2 text-yellow-400" size={24} /><p className="font-black uppercase text-sm tracking-tight">PromptPay QR</p></div>
                  </label>
                  <label className="opacity-40 p-6 rounded-[2rem] border border-white/5 bg-white/5 flex items-start gap-4 cursor-not-allowed">
                    <CreditCard className="mb-2 text-gray-500" size={24} />
                    <div><p className="font-black uppercase text-sm tracking-tight">Credit Card (Soon)</p></div>
                  </label>
                </div>
              </section>
            </form>
          </div>

          {/* Summary Section with 3D Support */}
          <div className="lg:col-span-5">
            <div className="bg-[#111] p-8 rounded-[3rem] border border-white/5 sticky top-32 shadow-2xl">
              <h3 className="text-xl font-black uppercase italic mb-8 border-b border-white/5 pb-4 tracking-tighter">Summary</h3>
              
              <div className="space-y-4 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map((item) => {
                  const is3DModel = item.image_url?.toLowerCase().endsWith('.glb');
                  const productUrl = getFullUrl(item.image_url);

                  return (
                    <div key={item.product_id || item.id} className="flex gap-5 bg-white/[0.03] p-4 rounded-3xl border border-white/5 items-center hover:bg-white/[0.05] transition-all group">
                      {/* Container สำหรับสื่อ (3D หรือ Image) */}
                      <div className="w-20 h-20 bg-black rounded-2xl overflow-hidden border border-white/10 shrink-0 relative shadow-inner">
                        {is3DModel ? (
                          <model-viewer
                            src={productUrl}
                            alt={item.name}
                            auto-rotate
                            camera-controls
                            interaction-prompt="none"
                            shadow-intensity="1"
                            style={{ width: '100%', height: '100%', backgroundColor: '#000' }}
                          />
                        ) : (
                          <img 
                            src={productUrl} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                            alt={item.name} 
                          />
                        )}
                      </div>

                      <div className="flex-grow">
                        <h4 className="font-black text-[11px] uppercase text-gray-200 tracking-tight leading-none mb-1">
                          {item.name}
                        </h4>
                        <p className="text-[9px] text-gray-500 font-bold uppercase mb-2 tracking-widest">Qty: {item.quantity}</p>
                        <p className="text-sm font-black italic text-yellow-400">
                          ฿{(item.flash_price || item.price).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-6 border-t border-white/10 space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black uppercase text-gray-600 tracking-widest text-left leading-none">Total<br/>Amount</span>
                  <span className="text-4xl font-black italic text-yellow-400 leading-none">฿{totalPrice.toLocaleString()}</span>
                </div>
                <button 
                  form="checkout-form" 
                  className="w-full mt-6 py-5 rounded-[2rem] bg-yellow-400 text-black font-black uppercase text-sm flex items-center justify-center gap-3 hover:bg-white hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-yellow-400/10"
                >
                  Pay with PromptPay <QrCode size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;