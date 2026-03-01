import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  isLoading = false, 
  icon: Icon, // รับ Component ไอคอนมาแสดง
  className = '', 
  ...props 
}) => {
  
  // สไตล์พื้นฐาน
  const baseStyles = "inline-flex items-center justify-center rounded-full font-semibold transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";
  
  // ขนาดของปุ่ม
  const sizes = {
    sm: "px-4 py-1.5 text-sm",
    md: "px-6 py-2.5 text-base",
    lg: "px-8 py-3.5 text-lg",
    full: "w-full py-3 text-base"
  };

  // สีและสไตล์ (Theme Popmart)
  const variants = {
    primary: "bg-yellow-400 text-black hover:bg-yellow-500 shadow-sm active:scale-95", // สีหลัก Popmart
    secondary: "bg-black text-white hover:bg-gray-900 active:scale-95",
    outline: "border-2 border-black text-black hover:bg-black hover:text-white",
    danger: "bg-red-500 text-white hover:bg-red-600",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100"
  };

  return (
    <button
      className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {/* ถ้ากำลังโหลด ให้แสดง Spinner แทนไอคอนหรือข้อความ */}
      {isLoading ? (
        <svg className="animate-spin h-5 w-5 text-current mr-2" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : (
        <>
          {Icon && <Icon className="mr-2 w-5 h-5" />}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;