import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm z-20">
      <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-sm font-bold text-gray-600 animate-pulse">กำลังโหลดโมเดล 3D...</p>
    </div>
  );
};

export default LoadingSpinner;