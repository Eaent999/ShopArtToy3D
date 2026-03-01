import React from "react";
import { Link } from "react-router-dom"; // อย่าลืมติดตั้ง react-router-dom

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "ช่วยเหลือ",
      links: [
        { name: "วิธีการสั่งซื้อ", path: "/how-to-buy" },
        { name: "การจัดส่ง", path: "/shipping" },
        { name: "นโยบายการคืนสินค้า", path: "/return-policy" },
        { name: "ตรวจสอบสถานะ", path: "/order-history" },
      ],
    },
    {
      title: "เกี่ยวกับเรา",
      links: [
        { name: "รู้จัก K&M 3D", path: "/about" },
        { name: "ติดต่อเรา", path: "/contact" },
      ],
    },
  ];

  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/">
              <h2 className="text-2xl font-bold tracking-tighter mb-4 cursor-pointer">
                K&M <span className="text-yellow-400">3D</span>
              </h2>
            </Link>

            <p className="text-gray-500 mb-6 max-w-xs">
              ประสบการณ์ใหม่ในการสะสม Art Toy หมุนชมโมเดล 3D แบบเรียลไทม์ก่อนตัดสินใจจุ่ม!
            </p>

            {/* Social Links */}
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-yellow-400 transition-colors text-xs font-medium"
              >
                FB
              </a>

              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-yellow-400 transition-colors text-xs font-medium"
              >
                IG
              </a>

              <a
                href="https://www.tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-yellow-400 transition-colors text-xs font-medium"
              >
                TT
              </a>
            </div>
          </div>

          {/* Links Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-bold text-gray-900 mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-gray-500 hover:text-yellow-500 transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>© {currentYear} K&M 3D Store. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy-policy" className="hover:text-gray-600">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-gray-600">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;