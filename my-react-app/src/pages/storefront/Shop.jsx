import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CategoryBar from '../../components/product/CategoryBar';
import ProductGrid from '../../components/product/ProductGrid';
import ProductFilters from '../../components/product/ProductFilters';
import FilterSidebar from '../../components/product/FilterSidebar';
import { useCart } from '../../context/CartContext'; 
import { ShoppingBagIcon, FireIcon } from '@heroicons/react/24/outline';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // --- State สำหรับ Filter & Search ---
  const [searchQuery, setSearchQuery] = useState(''); // รับค่าจาก CategoryBar
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState([0, 15000]);
  const [availability, setAvailability] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { setIsCartOpen, cartItems } = useCart();

  // --- 1. ดึงข้อมูลสินค้าจาก API ---
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/products');
      
      const formattedData = res.data.map(item => {
        const hasValidFlashPrice = item.flash_price !== null && Number(item.flash_price) > 0;
        const isOnSale = item.is_on_flash_sale === 1 && hasValidFlashPrice;
        
        return {
          ...item,
          image: item.image_url 
            ? `http://localhost:5000${item.image_url}` 
            : 'https://via.placeholder.com/300',
          originalPrice: Number(item.price),
          price: isOnSale ? Number(item.flash_price) : Number(item.price),
          isOnSale: isOnSale,
          category: item.category || 'Other',
          created_at: item.created_at || new Date().toISOString()
        };
      });

      setProducts(formattedData);
    } catch (err) {
      console.error("❌ Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // --- 2. Logic การกรองสินค้า (Search + Category + Price + Availability) ---
  const filteredProducts = products
    .filter(product => {
      // ค้นหาจากชื่อสินค้า (รองรับตัวพิมพ์เล็ก-ใหญ่)
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      // กรองตามหมวดหมู่
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      
      // กรองตามช่วงราคา
      const matchesPrice = product.price <= priceRange[1];
      
      // กรองตามสถานะสินค้า
      let matchesStock = true;
      if (availability.length > 0) {
        if (availability.includes('on-sale')) matchesStock = matchesStock && product.isOnSale;
        if (availability.includes('in-stock')) matchesStock = matchesStock && product.stock > 0;
      }

      return matchesSearch && matchesCategory && matchesPrice && matchesStock;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'newest') return new Date(b.created_at) - new Date(a.created_at);
      return 0;
    });

  // ส่วนแสดง Badges ใน ProductFilters
  const activeFilters = [];
  if (priceRange[1] < 15000) activeFilters.push({ label: `Under ฿${priceRange[1].toLocaleString()}`, type: 'price' });
  if (availability.includes('on-sale')) activeFilters.push({ label: 'On Sale', type: 'sale' });

  const handleRemoveFilter = (filter) => {
    if (filter.type === 'price') setPriceRange([0, 15000]);
    if (filter.type === 'sale') setAvailability(availability.filter(a => a !== 'on-sale'));
  };

  return (
    <div className="min-h-screen bg-white pt-[80px]">
      
      {/* Floating Cart Button */}
      {cartItems.length > 0 && (
        <button 
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-8 right-8 z-50 bg-black text-white p-4 rounded-full shadow-2xl lg:hidden flex items-center justify-center animate-bounce-slow"
        >
          <ShoppingBagIcon className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
            {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
          </span>
        </button>
      )}

      {/* Header Section (เอาช่อง Search เดิมออกจากตรงนี้เพื่อให้ไปแสดงใน CategoryBar แทน) */}
      <div className="py-12 bg-gray-50/50 border-b border-gray-100">
        <div className="container mx-auto px-6 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
             <h1 className="text-4xl font-black text-gray-900 uppercase italic tracking-tighter">
               Explore All Toys
             </h1>
             {products.some(p => p.isOnSale) && (
                <span className="bg-red-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full animate-pulse flex items-center gap-1 shadow-lg shadow-red-100 uppercase">
                  <FireIcon className="w-3.5 h-3.5" /> Hot Deals
                </span>
             )}
          </div>
          <p className="text-gray-500 font-medium text-sm">
            ค้นพบคอลเลกชันล่าสุด {selectedCategory !== 'all' && `ในหมวด ${selectedCategory}`} พร้อมฟีเจอร์ชมโมเดล 3D
          </p>
        </div>
      </div>

      {/* Toolbar Area: เชื่อมต่อ CategoryBar กับระบบค้นหา */}
      <div className="sticky top-[80px] z-40">
        <CategoryBar 
          onSelectCategory={setSelectedCategory} 
          onSearchChange={setSearchQuery} // รับค่า Search จากคอมโพเนนต์ CategoryBar
        />
        <ProductFilters 
          totalItems={filteredProducts.length}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onOpenFilter={() => setIsSidebarOpen(true)}
          activeFilters={activeFilters}
          onRemoveFilter={handleRemoveFilter}
        />
      </div>

      <div className="container mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row gap-12">
          
          {/* Filter Sidebar */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <FilterSidebar 
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              availability={availability}
              setAvailability={setAvailability}
            />
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <ProductGrid products={filteredProducts} isLoading={loading} />
            
            {/* Empty State เมื่อค้นหาไม่พบ */}
            {!loading && filteredProducts.length === 0 && (
              <div className="py-24 text-center bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-100">
                <div className="mb-6 text-6xl grayscale opacity-20">🔎</div>
                <h3 className="text-xl font-black text-gray-400 uppercase italic mb-2">No results found</h3>
                <p className="text-gray-400 text-sm mb-6">ไม่พบสินค้าที่ตรงกับคำค้นหาหรือหมวดหมู่ที่คุณเลือก</p>
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setPriceRange([0, 15000]);
                    setAvailability([]);
                  }}
                  className="bg-black text-white px-8 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-yellow-400 hover:text-black transition-all"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <FilterSidebar 
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        availability={availability}
        setAvailability={setAvailability}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Shop;