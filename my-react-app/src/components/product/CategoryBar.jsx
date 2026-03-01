import React, { useState } from 'react';
import { Search, X } from 'lucide-react'; // นำเข้าไอคอนสำหรับค้นหา

const categories = [
  { id: 'all', name: 'All Collection' },
  { id: 'The Monsters', name: 'The Monsters' },
  { id: 'Molly', name: 'Molly' },
  { id: 'Skullpanda', name: 'Skullpanda' },
  { id: 'Dimoo', name: 'Dimoo' },
  { id: 'Crybaby', name: 'Crybaby' },
  { id: 'Other', name: 'Other Items' },
];

const CategoryBar = ({ onSelectCategory, onSearchChange }) => {
  const [activeId, setActiveId] = useState('all');
  const [searchValue, setSearchValue] = useState('');

  const handleSelect = (id) => {
    setActiveId(id);
    if (onSelectCategory) onSelectCategory(id);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    if (onSearchChange) onSearchChange(value);
  };

  const clearSearch = () => {
    setSearchValue('');
    if (onSearchChange) onSearchChange('');
  };

  return (
    <div className="w-full bg-white/70 backdrop-blur-md py-3 border-b border-gray-100 sticky top-[80px] z-40 transition-all duration-300">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          
          {/* ส่วนที่เพิ่มใหม่: Search Input ดีไซน์ Minimal */}
          <div className="relative w-full md:w-64 group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-yellow-500 transition-colors">
              <Search size={16} strokeWidth={3} />
            </div>
            <input
              type="text"
              value={searchValue}
              onChange={handleSearch}
              placeholder="SEARCH PRODUCTS..."
              className="w-full bg-gray-50 border-none rounded-xl py-2.5 pl-10 pr-10 text-[10px] font-black tracking-widest focus:ring-2 focus:ring-yellow-400/50 transition-all outline-none placeholder:text-gray-300"
            />
            {searchValue && (
              <button 
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* แถบเลื่อนหมวดหมู่ (ปรับให้เลื่อนได้ในพื้นที่ที่เหลือ) */}
          <div className="flex-1 flex items-center justify-start overflow-x-auto no-scrollbar py-2 space-x-2 md:space-x-6">
            <div className="h-4 w-[1px] bg-gray-200 mx-2 hidden md:block"></div> {/* เส้นคั่นเล็กๆ */}
            
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleSelect(cat.id)}
                className="relative group px-3 py-2 whitespace-nowrap outline-none flex-shrink-0"
              >
                <span className={`
                  text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300
                  ${activeId === cat.id 
                    ? 'text-black' 
                    : 'text-gray-400 group-hover:text-gray-600'
                  }
                `}>
                  {cat.name}
                </span>

                {/* เส้นใต้ดีไซน์แบบ Minimal */}
                <div className="absolute bottom-0 left-0 w-full flex justify-center items-center h-[2px]">
                  <span className={`
                    transition-all duration-500 ease-out bg-yellow-400 rounded-full
                    ${activeId === cat.id 
                      ? 'w-full h-[2.5px] shadow-[0_0_8px_rgba(250,204,21,0.4)]' 
                      : 'w-0 h-[2px] group-hover:w-3'
                    }
                  `} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default CategoryBar;