import React, { useEffect } from 'react';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer, 
  size = 'md' 
}) => {
  // ป้องกันการเลื่อนหน้าเว็บด้านหลังเมื่อ Modal เปิดอยู่
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  // กำหนดความกว้างของ Modal
  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl"
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      {/* Background Overlay (คลิกเพื่อปิด) */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className={`
        relative bg-white w-full ${sizes[size]} 
        rounded-3xl shadow-2xl overflow-hidden
        animate-in fade-in zoom-in duration-300
        flex flex-col max-h-[90vh]
      `}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body (Scrollable) */}
        <div className="p-6 overflow-y-auto">
          {children}
        </div>

        {/* Footer (Optional) */}
        {footer && (
          <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;