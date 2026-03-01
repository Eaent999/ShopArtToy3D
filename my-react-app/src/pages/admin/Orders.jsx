import React, { useState } from 'react';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { EyeIcon, PrinterIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const Orders = () => {
  // ข้อมูลสมมติของออเดอร์
  const [orders] = useState([
    { 
      id: 'ORD-2026-001', 
      customer: 'คุณธนพล ใจดี', 
      date: '14 ม.ค. 2026', 
      items: 3, 
      total: 1650, 
      status: 'pending', 
      payment: 'โอนเงิน' 
    },
    { 
      id: 'ORD-2026-002', 
      customer: 'คุณรินดา สวยงาม', 
      date: '13 ม.ค. 2026', 
      items: 1, 
      total: 550, 
      status: 'shipped', 
      payment: 'บัตรเครดิต' 
    },
    { 
      id: 'ORD-2026-003', 
      customer: 'คุณวิชัย ร่ำรวย', 
      date: '12 ม.ค. 2026', 
      items: 12, 
      total: 6600, 
      status: 'processing', 
      payment: 'โอนเงิน' 
    },
  ]);

  // ฟังก์ชันกำหนดสี Badge ตามสถานะ
  const getStatusVariant = (status) => {
    switch (status) {
      case 'pending': return 'hot';      // สีแดง/ส้ม สำหรับรอตรวจสอบ
      case 'processing': return 'popmart'; // สีเหลือง สำหรับกำลังแพ็ค
      case 'shipped': return 'new';      // สีเขียว สำหรับส่งแล้ว
      default: return 'default';
    }
  };

  return (
    <div className="p-6 lg:p-10 bg-gray-50 min-h-screen">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-gray-900">รายการสั่งซื้อ (Orders)</h1>
          <p className="text-gray-500">ติดตามและจัดการสถานะการจัดส่งสินค้าให้ลูกค้า</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" icon={PrinterIcon}>พิมพ์รายงาน</Button>
        </div>
      </div>

      {/* Order List Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100 text-gray-400 text-xs uppercase font-bold">
            <tr>
              <th className="px-6 py-4">Order ID / วันที่</th>
              <th className="px-6 py-4">ลูกค้า</th>
              <th className="px-6 py-4 text-center">จำนวน</th>
              <th className="px-6 py-4 font-black">ยอดรวม</th>
              <th className="px-6 py-4 text-center">สถานะ</th>
              <th className="px-6 py-4 text-right">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-900">{order.id}</div>
                  <div className="text-xs text-gray-400">{order.date}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-700">{order.customer}</div>
                  <div className="text-xs text-gray-400">{order.payment}</div>
                </td>
                <td className="px-6 py-4 text-center text-sm font-bold text-gray-600">
                  {order.items} ชิ้น
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-black text-gray-900">฿{order.total.toLocaleString()}</div>
                </td>
                <td className="px-6 py-4 text-center">
                  <Badge variant={getStatusVariant(order.status)}>
                    {order.status.toUpperCase()}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 hover:bg-yellow-100 rounded-full text-yellow-600 transition-all transform group-hover:scale-110">
                    <EyeIcon className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Simple */}
      <div className="mt-6 flex justify-center gap-2">
        <button className="px-4 py-2 bg-white border rounded-xl text-sm disabled:opacity-50" disabled>ก่อนหน้า</button>
        <button className="px-4 py-2 bg-white border rounded-xl text-sm hover:bg-gray-50">1</button>
        <button className="px-4 py-2 bg-white border rounded-xl text-sm hover:bg-gray-50 text-yellow-600 font-bold">2</button>
        <button className="px-4 py-2 bg-white border rounded-xl text-sm hover:bg-gray-50">ถัดไป</button>
      </div>
    </div>
  );
};

export default Orders;