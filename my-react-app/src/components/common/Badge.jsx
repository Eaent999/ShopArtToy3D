import React from 'react';

const Badge = ({ children, variant = 'default', className = '' }) => {
  // การตั้งค่าสีตามประเภท (Variants)
  const variants = {
    default: "bg-gray-100 text-gray-800 border-gray-200",
    new: "bg-green-100 text-green-700 border-green-200",
    hot: "bg-red-100 text-red-700 border-red-200",
    limited: "bg-purple-100 text-purple-700 border-purple-200",
    soldout: "bg-gray-500 text-white border-gray-600",
    popmart: "bg-yellow-400 text-black border-yellow-500 font-bold", // สีเหลืองสไตล์ Popmart
  };

  return (
    <span className={`
      inline-flex items-center 
      px-2.5 py-0.5 
      rounded-full 
      text-xs font-medium 
      border 
      transition-all duration-200
      ${variants[variant] || variants.default} 
      ${className}
    `}>
      {children}
    </span>
  );
};

export default Badge;