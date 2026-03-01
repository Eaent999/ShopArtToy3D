import React, { useState } from 'react';
import { authAPI } from '../../services/api';
import { LogIn, Mail, Lock, UserPlus } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await authAPI.login(formData);
      if (res.data.status === 'success') {
        localStorage.setItem('user', JSON.stringify(res.data.user)); 
        
        // แจ้งเตือนแบบสวยๆ หรือใช้ Alert ปกติ
        alert('ยินดีต้อนรับกลับมา!');
        
        // ส่ง event ไปยังหน้าอื่นให้รู้ว่ามีการเปลี่ยนสถานะ login
        window.dispatchEvent(new Event("storage"));
        
        navigate('/collections'); 
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Email หรือ Password ไม่ถูกต้อง';
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F7] px-4 pt-20">
      <div className="max-w-md w-full bg-white rounded-[3rem] p-10 shadow-2xl shadow-gray-200/50 border-b-[12px] border-yellow-400">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-400 rounded-3xl mb-4 rotate-3 shadow-lg shadow-yellow-200">
            <LogIn size={32} className="text-black" />
          </div>
          <h2 className="text-4xl font-black italic tracking-tighter">WELCOME BACK</h2>
          <p className="text-gray-400 font-bold text-sm mt-2 uppercase tracking-widest">Collector Login</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="group">
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-yellow-500 transition-colors" size={20} />
              <input 
                required
                type="email" 
                placeholder="collector@popmart.com" 
                className="w-full bg-gray-50 border-2 border-transparent rounded-[1.5rem] py-4 pl-14 pr-4 focus:bg-white focus:border-yellow-400 outline-none transition-all font-bold"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="group">
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4 mb-1">Secret Password</label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-yellow-500 transition-colors" size={20} />
              <input 
                required
                type="password" 
                placeholder="••••••••" 
                className="w-full bg-gray-50 border-2 border-transparent rounded-[1.5rem] py-4 pl-14 pr-4 focus:bg-white focus:border-yellow-400 outline-none transition-all font-bold"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-black text-white hover:bg-yellow-400 hover:text-black font-black py-5 rounded-[1.5rem] flex items-center justify-center gap-3 transition-all duration-300 shadow-xl shadow-gray-200 active:scale-95 mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogIn size={20} /> 
            <span>{isLoading ? 'กำลังเข้าสู่ระบบ...' : 'GO TO COLLECTION'}</span>
          </button>
        </form>

        {/* Divider & Register Link */}
        <div className="mt-10 pt-8 border-t border-gray-100 text-center">
          <p className="text-gray-400 font-bold text-sm">ยังไม่มีบัญชีนักสะสม?</p>
          <Link 
            to="/register" 
            className="inline-flex items-center gap-2 text-black font-black mt-2 hover:text-yellow-500 transition-colors group"
          >
            <UserPlus size={18} className="group-hover:animate-bounce" /> 
            CREATE NEW ACCOUNT
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;