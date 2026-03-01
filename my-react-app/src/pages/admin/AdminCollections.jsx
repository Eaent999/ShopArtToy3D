import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // เพิ่มตัวนี้เพื่อใช้ย้อนกลับ
import { 
  PlusIcon, 
  TrashIcon, 
  PencilSquareIcon, 
  CloudArrowUpIcon, 
  CheckCircleIcon, 
  XMarkIcon,
  CubeIcon,
  ArrowLeftIcon // เพิ่มไอคอนลูกศรย้อนกลับ
} from '@heroicons/react/24/outline';

const AdminCollections = () => {
  const navigate = useNavigate(); // สร้างฟังก์ชันสำหรับเปลี่ยนหน้า
  const [collections, setCollections] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    series: '',
    rarity: 'Common',
    card_color: 'bg-pink-100'
  });

  // 1. ดึงข้อมูลทั้งหมดจาก API
  const fetchCollections = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/collections');
      setCollections(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  // 2. จัดการ Input ทั่วไป
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. จัดการเมื่อเลือกไฟล์ 3D จากเครื่อง
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && !file.name.endsWith('.glb')) {
      alert("กรุณาเลือกไฟล์นามสกุล .glb เท่านั้น");
      return;
    }
    setSelectedFile(file);
  };

  // 4. บันทึกข้อมูล (Add หรือ Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('series', formData.series);
    data.append('rarity', formData.rarity);
    data.append('card_color', formData.card_color);
    
    if (selectedFile) {
      data.append('model_file', selectedFile);
    }

    try {
      if (formData.id) {
        await axios.put(`http://localhost:5000/api/collections/${formData.id}`, data);
      } else {
        await axios.post('http://localhost:5000/api/collections', data);
      }
      
      setIsModalOpen(false);
      resetForm();
      fetchCollections();
      alert("บันทึกข้อมูลสำเร็จ!");
    } catch (err) {
      console.error("Save error:", err);
      alert("เกิดข้อผิดพลาด: " + (err.response?.data?.message || "ไม่สามารถติดต่อ Server ได้"));
    } finally {
      setLoading(false);
    }
  };

  // 5. ลบข้อมูล
  const handleDelete = async (id) => {
    if (window.confirm("คุณแน่ใจหรือไม่ที่จะลบไอเทมนี้ออกจากตู้โชว์?")) {
      try {
        await axios.delete(`http://localhost:5000/api/collections/${id}`);
        fetchCollections();
      } catch (err) {
        alert("ลบข้อมูลไม่สำเร็จ");
      }
    }
  };

  const resetForm = () => {
    setFormData({ id: null, name: '', series: '', rarity: 'Common', card_color: 'bg-pink-100' });
    setSelectedFile(null);
  };

  const openEditModal = (item) => {
    setFormData({
      id: item.id,
      name: item.name,
      series: item.series,
      rarity: item.rarity,
      card_color: item.card_color
    });
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 lg:p-10 bg-gray-50 min-h-screen pt-24 font-sans text-gray-900">
      <div className="max-w-7xl mx-auto">
        
        {/* Navigation & Header */}
        <div className="mb-8">
          <button 
            onClick={() => navigate(-1)} // สั่งให้ย้อนกลับไปหน้าก่อนหน้า
            className="flex items-center gap-2 text-gray-400 hover:text-black font-black uppercase text-xs tracking-widest transition-colors mb-6 group"
          >
            <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
            Back to Dashboard
          </button>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <h1 className="text-4xl font-black italic tracking-tighter uppercase text-gray-900 leading-none">Showcase Manager</h1>
              <p className="text-gray-500 font-bold mt-2">จัดการ Art Toy และไฟล์ 3D (.glb)</p>
            </div>
            <button 
              onClick={() => { resetForm(); setIsModalOpen(true); }} 
              className="bg-black text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-yellow-400 hover:text-black transition-all shadow-lg active:scale-95"
            >
              <PlusIcon className="w-6 h-6" /> ADD NEW ITEM
            </button>
          </div>
        </div>

        {/* Table List */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-gray-100">
                <tr>
                  <th className="px-8 py-6">Preview</th>
                  <th className="px-8 py-6">Product Info</th>
                  <th className="px-8 py-6">Rarity</th>
                  <th className="px-8 py-6">Theme Color</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {collections.length > 0 ? (
                  collections.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-8 py-5">
                        <div className={`w-14 h-16 ${item.card_color} rounded-xl border-2 border-white shadow-sm flex items-center justify-center`}>
                          <CubeIcon className="w-6 h-6 text-black/20" />
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <p className="font-black text-gray-900 uppercase italic text-lg tracking-tight">{item.name}</p>
                        <p className="text-xs text-gray-400 font-bold">{item.series || 'No Series'}</p>
                      </td>
                      <td className="px-8 py-5">
                        <span className="bg-black text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase">
                          {item.rarity}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-gray-500 font-bold text-xs uppercase">
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full ${item.card_color} border border-gray-200`}></div>
                          {item.card_color.replace('bg-', '')}
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right space-x-1">
                        <button 
                          onClick={() => openEditModal(item)} 
                          className="p-3 text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                        >
                          <PencilSquareIcon className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)} 
                          className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-8 py-20 text-center text-gray-400 font-bold uppercase italic tracking-widest">
                      No data found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-y-auto max-h-[95vh]">
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-8 right-8 text-gray-400 hover:text-black transition-colors"
            >
              <XMarkIcon className="w-8 h-8" />
            </button>

            <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-8 text-gray-900">
              {formData.id ? 'Edit Item' : 'Add New Item'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Product Name</label>
                  <input 
                    name="name" 
                    placeholder="e.g. Labubu" 
                    value={formData.name} 
                    onChange={handleChange} 
                    className="w-full bg-gray-50 p-4 rounded-2xl font-bold border-none outline-none focus:ring-2 focus:ring-yellow-400 transition-all" 
                    required 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Series</label>
                  <input 
                    name="series" 
                    placeholder="e.g. The Monsters" 
                    value={formData.series} 
                    onChange={handleChange} 
                    className="w-full bg-gray-50 p-4 rounded-2xl font-bold border-none outline-none focus:ring-2 focus:ring-yellow-400 transition-all" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Rarity</label>
                  <select 
                    name="rarity" 
                    value={formData.rarity} 
                    onChange={handleChange} 
                    className="w-full bg-gray-50 p-4 rounded-2xl font-bold border-none outline-none focus:ring-2 focus:ring-yellow-400"
                  >
                    <option value="Common">Common</option>
                    <option value="Rare">Rare</option>
                    <option value="SR">SR</option>
                    <option value="Legendary">Legendary</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Card Theme</label>
                  <select 
                    name="card_color" 
                    value={formData.card_color} 
                    onChange={handleChange} 
                    className="w-full bg-gray-50 p-4 rounded-2xl font-bold border-none outline-none focus:ring-2 focus:ring-yellow-400"
                  >
                    <option value="bg-pink-100">Pink Pastel</option>
                    <option value="bg-blue-100">Blue Pastel</option>
                    <option value="bg-purple-100">Purple Pastel</option>
                    <option value="bg-cyan-100">Cyan Pastel</option>
                    <option value="bg-yellow-100">Yellow Pastel</option>
                    <option value="bg-stone-200">Stone Grey</option>
                  </select>
                </div>
              </div>

              {/* Upload 3D File */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-gray-400 ml-2">3D Model (.glb)</label>
                <div className="relative border-4 border-dashed border-gray-100 rounded-[2rem] p-10 text-center hover:border-yellow-400 transition-all group bg-gray-50/50">
                  <input 
                    type="file" 
                    accept=".glb" 
                    onChange={handleFileChange} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="flex flex-col items-center">
                    <CloudArrowUpIcon className="w-10 h-10 text-gray-300 group-hover:text-yellow-400 mb-2" />
                    <p className="text-sm font-black text-gray-900 uppercase italic">
                      {selectedFile ? selectedFile.name : "Select 3D File (.glb)"}
                    </p>
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className={`w-full ${loading ? 'bg-gray-400' : 'bg-black'} text-white py-6 rounded-3xl font-black uppercase italic hover:bg-yellow-400 hover:text-black transition-all flex items-center justify-center gap-2 shadow-xl shadow-black/10`}
              >
                {loading ? (
                   <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <CheckCircleIcon className="w-7 h-7" />
                    <span>{formData.id ? 'Save Changes' : 'Confirm & Add'}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCollections;