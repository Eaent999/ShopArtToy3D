import React from 'react';

const Input = ({ 
  label, 
  error, 
  id, 
  type = 'text', 
  className = '', 
  ...props 
}) => {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {/* ส่วนแสดงชื่อหัวข้อของ Input */}
      {label && (
        <label 
          htmlFor={id} 
          className="text-sm font-semibold text-gray-700 ml-1"
        >
          {label}
        </label>
      )}

      {/* ตัว Input หลัก */}
      <input
        id={id}
        type={type}
        className={`
          w-full px-4 py-2.5 rounded-xl border transition-all duration-200
          outline-none text-gray-800 placeholder:text-gray-400
          ${error 
            ? 'border-red-500 focus:ring-1 focus:ring-red-500 bg-red-50' 
            : 'border-gray-200 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 bg-white'
          }
          disabled:bg-gray-50 disabled:text-gray-400
        `}
        {...props}
      />

      {/* ส่วนแสดงข้อความแจ้งเตือน Error */}
      {error && (
        <p className="text-xs text-red-500 ml-1 mt-0.5">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;