import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Trash2, 
  Package, 
  ArrowLeft,
  LayoutDashboard
} from 'lucide-react';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', series: '', price: '', rarity: 'Common', image_url: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data);
    } catch (err) { console.error(err); }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/products', newProduct);
      setShowModal(false);
      fetchProducts();
      alert('เพิ่มสินค้าสำเร็จ!');
    } catch (err) { alert('เพิ่มไม่สำเร็จ'); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('คุณแน่ใจนะว่าจะลบชิ้นนี้?')) {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      fetchProducts();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-10 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Navigation - ปุ่มย้อนกลับรูปแบบเดียวกับหน้า Inventory */}
        <div className="mb-6">
          <button 
            onClick={() => navigate('/')} 
            className="group flex items-center gap-2 text-gray-400 hover:text-black transition-all font-black uppercase text-[10px] tracking-[0.2em]"
          >
            <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
              <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            </div>
            Back to Shop
          </button>
        </div>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-black rounded-2xl shadow-lg">
              <LayoutDashboard size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black italic uppercase tracking-tighter text-black leading-none">Admin Panel</h1>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">จัดการสต็อกสินค้า Popmart ของคุณ</p>
            </div>
          </div>

          <button 
            onClick={() => setShowModal(true)}
            className="bg-black text-white px-8 py-4 rounded-2xl font-black italic flex items-center gap-2 hover:bg-yellow-400 hover:text-black transition-all shadow-2xl active:scale-95 border-none text-sm"
          >
            <Plus size={20} strokeWidth={3} /> ADD NEW ITEM
          </button>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-[2.5rem] shadow-sm overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-gray-100">
                  <th className="px-8 py-6">Product Item</th>
                  <th className="px-8 py-6">Series</th>
                  <th className="px-8 py-6">Price</th>
                  <th className="px-8 py-6">Rarity</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center font-black text-gray-400 overflow-hidden shadow-inner border border-gray-50">
                          {item.image_url ? (
                              <img src={item.image_url} alt={item.name} className="object-cover w-full h-full" />
                          ) : (
                              <Package size={20} />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black uppercase italic text-gray-800 tracking-tight">{item.name}</span>
                          <span className="text-[10px] text-gray-400 font-bold uppercase">ID: #{item.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="bg-white text-black px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        {item.series}
                      </span>
                    </td>
                    <td className="px-8 py-5 font-black text-black">฿{item.price.toLocaleString()}</td>
                    <td className="px-8 py-5">
                      <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase border ${
                        item.rarity === 'Secret' ? 'bg-purple-100 border-purple-200 text-purple-700' : 
                        item.rarity === 'Rare' ? 'bg-orange-100 border-orange-200 text-orange-700' : 'bg-yellow-100 border-yellow-200 text-yellow-700'
                      }`}>
                        {item.rarity}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button 
                        onClick={() => handleDelete(item.id)} 
                        className="p-2 text-gray-200 hover:text-red-500 transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-24 text-center">
                      <div className="flex flex-col items-center gap-2 opacity-20">
                        <Package size={48} />
                        <p className="font-black uppercase tracking-widest text-xs">No products in stock</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal - เพิ่มสินค้า */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-2 h-8 bg-yellow-400 rounded-full" />
              <h2 className="text-2xl font-black uppercase italic tracking-tighter">Add New Drop</h2>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-5">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 ml-1 uppercase tracking-widest">Product Name</label>
                <input required type="text" placeholder="e.g. Labubu Macaron" className="w-full bg-gray-50 p-4 rounded-2xl border-2 border-transparent focus:border-yellow-400 focus:bg-white outline-none font-bold transition-all" 
                  onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 ml-1 uppercase tracking-widest">Series Name</label>
                <input required type="text" placeholder="e.g. The Monsters" className="w-full bg-gray-50 p-4 rounded-2xl border-2 border-transparent focus:border-yellow-400 focus:bg-white outline-none font-bold transition-all" 
                  onChange={e => setNewProduct({...newProduct, series: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 ml-1 uppercase tracking-widest">Price (THB)</label>
                  <input required type="number" placeholder="550" className="w-full bg-gray-50 p-4 rounded-2xl border-2 border-transparent focus:border-yellow-400 focus:bg-white outline-none font-bold transition-all" 
                    onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 ml-1 uppercase tracking-widest">Rarity</label>
                  <div className="relative">
                    <select className="w-full bg-gray-50 p-4 rounded-2xl border-2 border-transparent focus:border-yellow-400 focus:bg-white outline-none font-bold transition-all appearance-none cursor-pointer"
                      onChange={e => setNewProduct({...newProduct, rarity: e.target.value})}>
                      <option value="Common">Common</option>
                      <option value="Rare">Rare</option>
                      <option value="Secret">Secret</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 ml-1 uppercase tracking-widest">Image URL</label>
                <input type="text" placeholder="https://example.com/image.png" className="w-full bg-gray-50 p-4 rounded-2xl border-2 border-transparent focus:border-yellow-400 focus:bg-white outline-none font-bold transition-all" 
                  onChange={e => setNewProduct({...newProduct, image_url: e.target.value})} />
              </div>
              
              <div className="flex gap-4 pt-6">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="flex-1 font-black text-gray-400 hover:text-black transition-colors uppercase tracking-widest text-xs"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-[2] bg-yellow-400 text-black font-black py-4 rounded-2xl shadow-xl shadow-yellow-100 hover:bg-black hover:text-white transition-all active:scale-95 uppercase italic tracking-tighter"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;