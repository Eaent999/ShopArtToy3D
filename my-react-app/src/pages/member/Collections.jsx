import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Trophy, Star, Eye, Loader2, Trash2, ArrowLeft } from 'lucide-react';
import '@google/model-viewer';

const Collections = () => {
  const navigate = useNavigate();
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/collections');
      setCollections(res.data);
    } catch (err) {
      console.error("Error fetching collections:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleDelete = async (id, name, e) => {
    e.stopPropagation(); 
    if (window.confirm(`Remove "${name}" from your vault?`)) {
      try {
        await axios.delete(`http://localhost:5000/api/collections/${id}`);
        setCollections(collections.filter(item => item.id !== id));
      } catch (err) {
        alert("Delete failed: " + (err.response?.data?.message || err.message));
      }
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8F8FA]">
      <div className="relative flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-black" />
        <div className="absolute inset-0 scale-150 blur-xl bg-black/5 rounded-full animate-pulse"></div>
      </div>
      <p className="font-black text-gray-400 tracking-[0.4em] uppercase italic mt-6 text-[10px]">Accessing Vault...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F8FA] pb-20 antialiased">
      
      {/* Dynamic Header */}
      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-6 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="group flex items-center gap-3 font-black text-[10px] uppercase tracking-widest text-gray-400 hover:text-black transition-all">
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
              <ArrowLeft size={14} />
            </div>
            Back
          </button>
          <div className="flex gap-3">
             <div className="flex items-center gap-2 bg-black text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg shadow-black/10">
                <Trophy size={12}/> {collections.length} ASSETS
             </div>
          </div>
        </div>
      </nav>

      {/* Main Content: ปรับ pt-16 เป็น pt-8 เพื่อขยับขึ้น */}
      <div className="max-w-7xl mx-auto px-6 pt-8"> 
        {/* Title Section: ปรับ mb-16 เป็น mb-10 เพื่อลดช่องว่างล่าง */}
        <div className="mb-10">
          <h1 className="text-7xl font-black italic tracking-tighter leading-none uppercase">
            <span className="text-black">Rare Item of the Month</span>
          </h1>
          <div className="flex items-center gap-4 mt-4"> {/* ลด mt-6 เป็น mt-4 */}
            <div className="h-1 w-20 bg-black rounded-full"></div>
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.4em]">Personal Artifacts & Collectibles</p>
          </div>
        </div>

        {/* Collection Grid */}
        {collections.length === 0 ? (
          <div className="text-center py-40 bg-white rounded-[4rem] border border-gray-100 shadow-sm">
            <Box size={48} className="mx-auto text-gray-100 mb-6" />
            <p className="text-gray-300 font-black uppercase tracking-widest text-xs">Your vault is currently empty.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
            {collections.map((item) => (
              <div key={item.id} className="group flex flex-col">
                
                {/* Showcase Card */}
                <div className={`relative aspect-[4/5] ${item.card_color || 'bg-[#ECECEC]'} rounded-[3.5rem] overflow-hidden transition-all duration-700 group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] group-hover:-translate-y-4`}>
                  
                  {/* Action Buttons Layer */}
                  <div className="absolute top-6 left-6 right-6 z-20 flex justify-between items-center">
                    <div className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-sm">
                      {item.rarity}
                    </div>
                    
                  </div>

                  {/* 3D Model Display */}
                  <div className="absolute inset-0 flex items-center justify-center p-8">
                    <model-viewer
                      src={item.model_url ? `http://localhost:5000${item.model_url}` : ""}
                      alt={item.name}
                      auto-rotate
                      rotation-per-second="30deg"
                      camera-controls
                      interaction-prompt="none"
                      style={{ width: '100%', height: '100%', outline: 'none' }}
                      className="drop-shadow-[0_20px_50px_rgba(0,0,0,0.2)]"
                    />
                  </div>

                  {/* Glass Overlay on Hover */}
                  <div className="absolute inset-x-0 bottom-0 p-8 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <button className="w-full bg-white text-black font-black uppercase italic py-4 rounded-[2rem] text-[10px] tracking-widest flex items-center justify-center gap-2 shadow-2xl">
                      <Eye size={16} /> Inspect Asset
                    </button>
                  </div>
                </div>

                {/* Info Text */}
                <div className="mt-8 px-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-black text-2xl text-black uppercase italic tracking-tighter leading-none mb-2">
                        {item.name}
                      </h3>
                      <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
                        {item.series}
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Decorative Background Text */}
      <div className="mt-40 pointer-events-none select-none overflow-hidden h-40 flex items-center">
        <p className="text-[15rem] font-black text-black/[0.03] whitespace-nowrap italic tracking-tighter translate-x-10">
          THE ART TOY COLLECTION 2026
        </p>
      </div>

    </div>
  );
};

export default Collections;