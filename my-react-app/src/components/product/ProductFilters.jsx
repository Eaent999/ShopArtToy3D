import React from 'react';
import { ChevronDown, SlidersHorizontal, X, LayoutGrid, List } from 'lucide-react';

const ProductFilters = ({ 
  totalItems, 
  sortBy, 
  setSortBy, 
  onOpenFilter, 
  activeFilters = [], // เช่น [{ label: '฿0 - ฿5,000', type: 'price' }]
  onRemoveFilter 
}) => {
  
  // แปลงค่า Sort Value เป็นชื่อที่อ่านง่าย
  const getSortLabel = (val) => {
    switch (val) {
      case 'newest': return 'Newest Arrivals';
      case 'price-low': return 'Price: Low to High';
      case 'price-high': return 'Price: High to Low';
      default: return 'Sort By';
    }
  };

  return (
    <div className="w-full bg-white border-b border-gray-100 py-4">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* ส่วนซ้าย: Mobile Filter Button & Item Count */}
          <div className="flex items-center justify-between w-full md:w-auto gap-6">
            <button 
              onClick={onOpenFilter}
              className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl hover:bg-yellow-400 hover:text-black transition-all md:hidden"
            >
              <SlidersHorizontal size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Filters</span>
            </button>
            
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
              <p className="text-gray-400 text-[11px] font-black uppercase tracking-widest">
                Showing <span className="text-black">{totalItems}</span> Products
              </p>
            </div>
          </div>

          {/* ส่วนกลาง: Active Filters (Badges) - แสดงเฉพาะจอใหญ่ */}
          <div className="hidden lg:flex flex-1 items-center justify-center gap-2 px-10">
            {activeFilters.map((filter, index) => (
              <div 
                key={index}
                className="flex items-center gap-2 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full group hover:border-red-200 transition-colors"
              >
                <span className="text-[9px] font-black uppercase tracking-tighter text-gray-500 group-hover:text-red-500">
                  {filter.label}
                </span>
                <button 
                  onClick={() => onRemoveFilter(filter)}
                  className="text-gray-300 group-hover:text-red-500"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>

          {/* ส่วนขวา: Sort Dropdown & View Toggles */}
          <div className="flex items-center justify-between w-full md:w-auto gap-8">
            
            {/* Sort Dropdown */}
            <div className="relative group flex-1 md:flex-none">
              <div className="flex items-center justify-end gap-3 cursor-pointer">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Sort:</span>
                <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.2em] text-black border-b-2 border-black pb-1">
                  {getSortLabel(sortBy)}
                  <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
                </div>
              </div>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-2xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[60]">
                {[
                  { label: 'Newest Arrivals', value: 'newest' },
                  { label: 'Price: Low to High', value: 'price-low' },
                  { label: 'Price: High to Low', value: 'price-high' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSortBy(option.value)}
                    className={`w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all
                      ${sortBy === option.value 
                        ? 'bg-yellow-400 text-black' 
                        : 'text-gray-500 hover:bg-gray-50 hover:text-black'
                      }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* View Toggle (Grid/List) - เพิ่มเพื่อให้ดูโปรมากขึ้น */}
            <div className="hidden sm:flex items-center border-l border-gray-100 pl-8 gap-4">
              <button className="text-black"><LayoutGrid size={18} /></button>
              <button className="text-gray-300 hover:text-black transition-colors"><List size={18} /></button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;