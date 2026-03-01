import React from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({ products, isLoading }) => {
  const skeletons = Array(8).fill(0);

  return (
    <section className="py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
        {isLoading ? (
          skeletons.map((_, index) => (
            <div key={index} className="flex flex-col animate-pulse">
              <div className="bg-gray-100 aspect-square rounded-[2.5rem] mb-6 shadow-inner"></div>
              <div className="space-y-3 px-2">
                <div className="h-4 bg-gray-100 rounded-full w-3/4"></div>
                <div className="h-3 bg-gray-50 rounded-full w-1/2"></div>
                <div className="flex justify-between items-center pt-2">
                   <div className="h-6 bg-gray-100 rounded-lg w-20"></div>
                   <div className="h-8 bg-gray-100 rounded-full w-8"></div>
                </div>
              </div>
            </div>
          ))
        ) : products && products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="transition-all duration-500 hover:-translate-y-2">
              {/* ส่งข้อมูล product ที่เราแมปราคามาจากหน้า Shop แล้วเข้าไป */}
              <ProductCard product={product} />
            </div>
          ))
        ) : (
          <div className="col-span-full py-24 text-center bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-100">
            <div className="text-6xl mb-6 grayscale opacity-40 animate-bounce">📦</div>
            <h3 className="text-2xl font-black text-gray-300 uppercase italic tracking-tighter mb-2">
              Items Not Found
            </h3>
            <p className="text-gray-400 text-sm font-medium">
              ไม่พบสินค้าที่คุณกำลังมองหา <br/> ลองเปลี่ยนหมวดหมู่หรือคำค้นหาดูใหม่อีกครั้ง
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;