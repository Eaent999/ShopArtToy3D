import React from 'react';
import { X } from 'lucide-react';

const FilterSidebar = ({ 
  priceRange, 
  setPriceRange, 
  availability, 
  setAvailability,
  isOpen, 
  onClose 
}) => {
  
  // ฟังก์ชันจัดการการเลือก Availability
  const handleAvailabilityChange = (status) => {
    const updated = availability.includes(status)
      ? availability.filter(item => item !== status)
      : [...availability, status];
    setAvailability(updated);
  };

  return (
    <>
      {/* Mobile Overlay (พื้นหลังดำจางๆ ตอนเปิดในมือถือ) */}
      <div className={`fixed inset-0 bg-black/50 z-[100] transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />

      {/* Sidebar Container */}
      <aside className={`
        fixed md:relative top-0 left-0 h-full md:h-auto w-[280px] md:w-full bg-white md:bg-transparent z-[101] md:z-0
        transition-transform duration-300 transform p-6 md:p-0 border-r md:border-r-0 border-gray-100
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        
        {/* Header (Mobile Only) */}
        <div className="flex items-center justify-between mb-8 md:hidden">
          <h2 className="text-xl font-black uppercase italic">Filters</h2>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full"><X size={20} /></button>
        </div>

        <div className="space-y-12">
          
          {/* Section 1: Price Range */}
          <div className="space-y-6">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-black flex items-center gap-2">
              <span className="w-1 h-3 bg-yellow-400"></span>
              Price Range
            </h3>
            <div className="px-2">
              <input 
                type="range" 
                min="0" 
                max="15000" 
                step="500"
                value={priceRange[1]} 
                onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                className="w-full h-1.5 bg-gray-100 appearance-none cursor-pointer accent-black rounded-full"
              />
              <div className="flex justify-between mt-4">
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-gray-400 uppercase">Min</span>
                  <span className="text-xs font-black">฿0</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[9px] font-bold text-gray-400 uppercase">Max</span>
                  <span className="text-xs font-black text-yellow-500">฿{priceRange[1].toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Availability */}
          <div className="space-y-6">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-black flex items-center gap-2">
              <span className="w-1 h-3 bg-yellow-400"></span>
              Availability
            </h3>
            <div className="space-y-3">
              {[
                { id: 'in-stock', label: 'In Stock' },
                { id: 'on-sale', label: 'On Sale' },
                { id: 'pre-order', label: 'Pre-Order' }
              ].map((item) => (
                <label key={item.id} className="flex items-center justify-between group cursor-pointer">
                  <span className={`text-[11px] font-bold uppercase transition-colors ${availability.includes(item.id) ? 'text-black' : 'text-gray-400 group-hover:text-black'}`}>
                    {item.label}
                  </span>
                  <div className="relative flex items-center">
                    <input 
                      type="checkbox" 
                      className="sr-only" 
                      checked={availability.includes(item.id)}
                      onChange={() => handleAvailabilityChange(item.id)}
                    />
                    <div className={`w-4 h-4 border-2 rounded transition-all ${availability.includes(item.id) ? 'bg-black border-black' : 'border-gray-200'}`}>
                      {availability.includes(item.id) && <X size={12} className="text-white" strokeWidth={4} />}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Section 3: Quick Settings (Mobile Only) */}
          <div className="pt-6 md:hidden">
            <button 
              onClick={onClose}
              className="w-full bg-black text-white font-black py-4 rounded-2xl uppercase text-[11px] tracking-widest shadow-xl shadow-black/20"
            >
              Apply Filters
            </button>
          </div>

        </div>
      </aside>
    </>
  );
};

export default FilterSidebar;