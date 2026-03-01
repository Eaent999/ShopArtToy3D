import React, { useState } from 'react';
import { authAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await authAPI.register(formData);
      if (res.data.status === 'success') {
        alert('ลงทะเบียนสำเร็จ! กรุณาเข้าสู่ระบบ');
        navigate('/login');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'เกิดข้อผิดพลาด';
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F7] px-4">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black italic">JOIN THE CLUB</h2>
          <p className="text-gray-400 font-medium mt-2">สร้างบัญชีเพื่อสะสม Art Toys ของคุณ</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" placeholder="Username" 
              className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-popmart-yellow outline-none"
              onChange={(e) => setFormData({...formData, username: e.target.value})}
            />
          </div>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="email" placeholder="Email Address" 
              className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-popmart-yellow outline-none"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="password" placeholder="Password" 
              className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-popmart-yellow outline-none"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="btn-popmart w-full text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <UserPlus size={20} /> {isLoading ? 'กำลังลงทะเบียน...' : 'REGISTER NOW'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;