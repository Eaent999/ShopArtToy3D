import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import { 
  PlusIcon, TrashIcon, CloudArrowUpIcon, 
  ArchiveBoxIcon, DocumentIcon, DocumentTextIcon, 
  TagIcon, ArrowLeftIcon, PencilSquareIcon,
  CubeIcon, MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import '@google/model-viewer';

const Inventory = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const CATEGORIES = [
    "The Monsters", "Molly", "Skullpanda", "Dimoo", "Crybaby", "labubu", "Other"
  ];

  const [formData, setFormData] = useState({
    name: '', series: '', category: 'The Monsters', 
    description: '', price: '', rarity: 'Common', stock: ''
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleFileChange = (file) => {
    if (file && file.name.endsWith('.glb')) setSelectedFile(file);
    else alert("กรุณาเลือกไฟล์ .glb เท่านั้น");
  };

  const is3DModel = (url) => url?.toLowerCase().match(/\.(glb|gltf)$/);
  const getFullUrl = (path) => path?.startsWith('/') ? `http://localhost:5000${path}` : `http://localhost:5000/${path}`;

  const handleEdit = (item) => {
    setIsEditing(true);
    setCurrentId(item.id);
    setFormData({
      name: item.name, series: item.series, category: item.category,
      description: item.description || '', price: item.price, 
      rarity: item.rarity, stock: item.stock
    });
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setFormData({ name: '', series: '', category: 'The Monsters', description: '', price: '', rarity: 'Common', stock: '' });
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (selectedFile) data.append('modelFile', selectedFile);

    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/products/${currentId}`, data);
      } else {
        await axios.post('http://localhost:5000/api/products', data);
      }
      handleCloseModal();
      fetchProducts();
    } catch (err) { alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล"); }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 font-sans antialiased pb-20">
      {/* Navigation */}
      <nav className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/admin')} className="p-2 hover:bg-slate-100 rounded-full transition-all group">
              <ArrowLeftIcon className="w-5 h-5 text-slate-500 group-hover:text-black" />
            </button>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-slate-900 uppercase">Inventory Control</h1>
              <div className="h-0.5 w-12 bg-black rounded-full mt-0.5"></div>
            </div>
          </div>
          <Button icon={PlusIcon} onClick={() => setIsModalOpen(true)} className="bg-black text-white rounded-xl px-6 py-2.5 text-[11px] font-bold uppercase tracking-widest shadow-lg shadow-slate-200">
            Add New Item
          </Button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 mt-10 space-y-8">
        <div>
          <h2 className="text-4xl font-black italic uppercase tracking-tighter text-black">Asset Vault</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1 ml-1">Total {products.length} Collectibles in Database</p>
        </div>

        {/* Table Section */}
        <section className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100 bg-slate-50/30">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
              <ArchiveBoxIcon className="w-4 h-4 text-black" /> Master Collection List
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Product Asset</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Classification</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Price Tag</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((item) => (
                  <tr key={item.id} className="group hover:bg-slate-50/80 transition-all">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden border border-slate-200 flex items-center justify-center">
                          {is3DModel(item.image_url) ? (
                            <model-viewer src={getFullUrl(item.image_url)} auto-rotate camera-controls interaction-prompt="none" style={{ width: '100%', height: '100%' }} />
                          ) : (
                            <img src={getFullUrl(item.image_url)} className="w-full h-full object-cover" alt="" />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-slate-900 uppercase italic leading-tight">{item.name}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{item.series}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="bg-white text-black px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-sm font-black text-slate-800">฿{Number(item.price).toLocaleString()}</span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleEdit(item)} className="p-2 text-slate-300 hover:text-black hover:bg-slate-100 rounded-xl transition-all">
                          <PencilSquareIcon className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={isEditing ? "Modify Asset" : "Vault Entry"}>
        <div className="space-y-5 max-h-[70vh] overflow-y-auto px-1 scrollbar-hide">
           <div>
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1 mb-1.5 block">Asset Name</label>
              <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm focus:ring-2 ring-black/5 outline-none font-bold" />
           </div>
           
           <div className="grid grid-cols-2 gap-4">
              <Input label="SERIES" value={formData.series} onChange={e => setFormData({...formData, series: e.target.value})} />
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">CATEGORY</label>
                <div className="relative group">
                  <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 ring-black/5 cursor-pointer appearance-none" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <TagIcon className="w-4 h-4" />
                  </div>
                </div>
              </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <Input label="PRICE (฿)" type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
              <Input label="INITIAL STOCK" type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
           </div>

           {/* เพิ่มช่อง DESCRIPTION ตรงนี้ครับ */}
           <div>
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1 mb-1.5 block">Description / Details</label>
              <textarea 
                rows="3"
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm focus:ring-2 ring-black/5 outline-none font-medium resize-none"
                placeholder="Share the story of this art toy..."
              />
           </div>

           <div className="border-2 border-dashed border-slate-200 rounded-[2rem] p-8 text-center bg-slate-50/50 group hover:border-black transition-all cursor-pointer" onClick={() => fileInputRef.current.click()}>
              <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => handleFileChange(e.target.files[0])} />
              <CloudArrowUpIcon className="w-10 h-10 mx-auto mb-2 text-slate-300 group-hover:text-black" />
              <p className="text-[10px] font-black text-slate-400 uppercase group-hover:text-black tracking-widest">
                {selectedFile ? selectedFile.name : "Tap to update 3D Source (.glb)"}
              </p>
           </div>

           <button onClick={handleSaveProduct} className="w-full py-4 bg-black text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] transition-all active:scale-95">
             Confirm Storage
           </button>
        </div>
      </Modal>
    </div>
  );
};
  
export default Inventory;