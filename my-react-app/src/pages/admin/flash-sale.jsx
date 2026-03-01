import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeftIcon, BoltIcon, TrashIcon, PlusIcon, 
  ClockIcon, ArchiveBoxIcon
} from '@heroicons/react/24/outline';
import '@google/model-viewer'; // นำเข้าไลบรารีสำหรับแสดงผล 3D

const FlashSaleAdmin = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]); 
  const [activeItems, setActiveItems] = useState([]); 
  const [campaignData, setCampaignData] = useState({
    campaign_name: '',
    end_time: '',
    is_active: 1
  });

  const [itemFormData, setItemFormData] = useState({
    product_id: '',
    original_price: '', 
    flash_price: '',
    stock_limit: ''
  });

  useEffect(() => { fetchInitialData(); }, []);

  const fetchInitialData = async () => {
    try {
      const [prodRes, flashItemRes, campaignRes] = await Promise.all([
        axios.get('http://localhost:5000/api/products'),
        axios.get('http://localhost:5000/api/flash-sale'),
        axios.get('http://localhost:5000/api/flash-sale/active-campaign').catch(() => ({ data: null }))
      ]);
      setProducts(prodRes.data);
      setActiveItems(flashItemRes.data);
      if (campaignRes.data) {
        const date = new Date(campaignRes.data.end_time);
        setCampaignData({
          campaign_name: campaignRes.data.campaign_name,
          end_time: date.toISOString().slice(0, 16),
          is_active: 1
        });
      }
    } catch (error) { console.error(error); }
  };

  const handleProductChange = (e) => {
    const selectedId = e.target.value;
    const product = products.find(p => p.id === parseInt(selectedId));
    
    setItemFormData({
      ...itemFormData,
      product_id: selectedId,
      original_price: product ? product.price : ''
    });
  };

  const handleUpdateCampaign = async (e) => {
    e.preventDefault();
    try {
      await axios.put('http://localhost:5000/api/admin/flash-sale-campaign', campaignData);
      alert("Updated Campaign successfully!");
    } catch (error) { alert("Error updating"); }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/flash-sale', itemFormData);
      setItemFormData({ product_id: '', original_price: '', flash_price: '', stock_limit: '' });
      fetchInitialData(); 
    } catch (error) { alert("Error adding product"); }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm("Remove this deal? (Warning: If this product has orders, delete might fail due to system logs)")) return;
    try {
      await axios.delete(`http://localhost:5000/api/flash-sale/${id}`);
      fetchInitialData();
    } catch (error) { 
        alert("ไม่สามารถลบได้ เนื่องจากมีการใช้งานอยู่ในคำสั่งซื้อ (Foreign Key Constraint)"); 
    }
  };

  // Helper ฟังก์ชันตรวจสอบว่าเป็นไฟล์ 3D หรือไม่
  const is3DModel = (url) => url?.toLowerCase().match(/\.(glb|gltf)$/);
  const getFullUrl = (path) => path?.startsWith('/') ? `http://localhost:5000${path}` : `http://localhost:5000/${path}`;

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 font-sans antialiased pb-20">
      <nav className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/admin')} className="p-2 hover:bg-indigo-50 rounded-full transition-all group">
              <ArrowLeftIcon className="w-5 h-5 text-slate-500 group-hover:text-indigo-600" />
            </button>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-slate-900 uppercase">Flash Sale Manager</h1>
              <div className="h-0.5 w-12 bg-indigo-500 rounded-full mt-0.5"></div>
            </div>
          </div>
          <div className="bg-rose-50 px-3 py-1.5 rounded-full border border-rose-100 flex items-center gap-2">
            <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-bold text-rose-600 uppercase tracking-widest">Live Now</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 mt-8 space-y-6">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <section className="bg-white border border-indigo-100 rounded-3xl p-6 shadow-sm">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-indigo-900/50 mb-6 flex items-center gap-2">
              <ClockIcon className="w-4 h-4" /> Schedule Settings
            </h3>
            <form onSubmit={handleUpdateCampaign} className="flex flex-wrap md:flex-nowrap items-end gap-4">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 ml-1 uppercase">Name</label>
                <input 
                  type="text" value={campaignData.campaign_name}
                  onChange={(e) => setCampaignData({...campaignData, campaign_name: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm focus:ring-2 ring-indigo-500/20 outline-none transition-all"
                />
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 ml-1 uppercase">Ends At</label>
                <input 
                  type="datetime-local" value={campaignData.end_time}
                  onChange={(e) => setCampaignData({...campaignData, end_time: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm focus:ring-2 ring-indigo-500/20 outline-none transition-all" 
                />
              </div>
              <button type="submit" className="px-6 py-3 bg-indigo-600 text-white text-[11px] font-bold rounded-2xl hover:bg-indigo-700 transition-all uppercase shadow-lg shadow-indigo-100">
                Update
              </button>
            </form>
          </section>

          <section className="bg-white border border-rose-100 rounded-3xl p-6 shadow-sm">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-rose-900/50 mb-6 flex items-center gap-2">
              <PlusIcon className="w-4 h-4" /> Quick Add Deal
            </h3>
            <form onSubmit={handleAddItem} className="flex flex-wrap lg:flex-nowrap items-end gap-3">
              <div className="flex-[2] min-w-[150px]">
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 ml-1 uppercase">Product (Price)</label>
                <select 
                  required value={itemFormData.product_id}
                  onChange={handleProductChange}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 ring-rose-500/20 transition-all appearance-none"
                >
                  <option value="">Choose Product...</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (฿{p.price})</option>
                  ))}
                </select>
              </div>
              <div className="flex-1 min-w-[80px]">
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 ml-1 uppercase">Full Price</label>
                <input type="number" readOnly value={itemFormData.original_price} className="w-full bg-slate-100 border border-slate-100 rounded-2xl px-4 py-3 text-sm text-slate-400 outline-none cursor-not-allowed" />
              </div>
              <div className="flex-1 min-w-[80px]">
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 ml-1 uppercase">Sale Price</label>
                <input type="number" required placeholder="0" value={itemFormData.flash_price} onChange={(e) => setItemFormData({...itemFormData, flash_price: e.target.value})} className="w-full bg-slate-50 border border-rose-200 rounded-2xl px-4 py-3 text-sm font-bold text-rose-600 outline-none focus:ring-2 ring-rose-500/20 transition-all" />
              </div>
              <div className="flex-1 min-w-[80px]">
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 ml-1 uppercase">Stock</label>
                <input type="number" required placeholder="Qty" value={itemFormData.stock_limit} onChange={(e) => setItemFormData({...itemFormData, stock_limit: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 ring-rose-500/20 transition-all" />
              </div>
              <button type="submit" className="p-3.5 bg-rose-500 text-white rounded-2xl hover:bg-rose-600 transition-all shadow-lg shadow-rose-200">
                <PlusIcon className="w-5 h-5 stroke-[3px]" />
              </button>
            </form>
          </section>
        </div>

        <section className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
              <BoltIcon className="w-4 h-4 text-amber-500 fill-amber-500" /> Live Deals
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Product</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pricing</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sold Progress</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeItems.map((item) => (
                  <tr key={item.id} className="group hover:bg-indigo-50/30 transition-all">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        {/* 3D Container ในตาราง Admin */}
                        <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 shadow-sm flex items-center justify-center">
                          {is3DModel(item.image_url) ? (
                            <model-viewer
                              src={getFullUrl(item.image_url)}
                              auto-rotate
                              camera-controls
                              interaction-prompt="none"
                              style={{ width: '100%', height: '100%', backgroundColor: '#f8fafc' }}
                            />
                          ) : (
                            <img src={getFullUrl(item.image_url)} className="w-full h-full object-cover" alt="" />
                          )}
                        </div>
                        <span className="text-sm font-bold text-slate-700">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-rose-600">฿{item.flash_price}</span>
                        <span className="text-[10px] text-slate-300 line-through italic font-bold">฿{item.original_price}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 max-w-[100px] h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-indigo-500 to-rose-500" 
                            style={{ width: `${(item.sold_count/item.stock_limit)*100}%` }}
                          ></div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 italic">{item.sold_count}/{item.stock_limit}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button onClick={() => handleDeleteItem(item.id)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {activeItems.length === 0 && (
            <div className="py-20 text-center text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              <ArchiveBoxIcon className="w-10 h-10 mx-auto mb-3 opacity-20" /> No active deals
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default FlashSaleAdmin;