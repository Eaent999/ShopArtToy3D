import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';

// Providers
import { CartProvider } from './context/CartContext'; 

// Layouts & Global Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import CartDrawer from './components/cart/CartDrawer'; 

// Storefront Pages
import Home from './pages/storefront/Home';
import Shop from './pages/storefront/Shop';
import ProductDetail from './pages/storefront/ProductDetail';
import Cart from './pages/storefront/Cart';
import Checkout from './pages/storefront/Checkout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import NewArrivals from './pages/storefront/NewArrivals';

// Member & Information Pages
import Collections from './pages/member/Collections';
import OrderTracking from './pages/member/OrderTracking'; 
import ReturnPolicy from './pages/member/return-policy';
import TrackOrder from './pages/member/track-order';
import Shipping from './pages/member/shipping';
import HowToBuy from './pages/member/how-to-buy'; 
import About from './pages/member/about';   // <--- เพิ่มหน้า About
import Contact from './pages/member/contact'; // <--- เพิ่มหน้า Contact

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import Inventory from './pages/admin/Inventory';
import Orders from './pages/admin/Orders';
import AdminCollections from './pages/admin/AdminCollections'; 
import VerifySlips from './pages/admin/VerifySlips';
import FlashSaleAdmin from './pages/admin/flash-sale'; 
import OnDeliveryAdmin from './pages/admin/on_delivery';
import ReceivedAdmin from './pages/admin/Received';

// --- 1. Guard สำหรับตรวจสอบสถานะ Login ---
const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// --- 2. Guard สำหรับ Admin เท่านั้น ---
const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return children;
};

// --- 3. Layout สำหรับหน้าบ้าน (ลูกค้า) ---
const MainLayout = () => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <CartDrawer /> 
    <main className="flex-grow"> 
      <Outlet />
    </main>
    <Footer />
  </div>
);

// --- 4. Layout สำหรับหลังบ้าน (Admin) ---
const AdminLayout = () => (
  <div className="flex min-h-screen bg-gray-50">
    <div className="flex-grow">
      <Outlet />
    </div>
  </div>
);

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          
          {/* กลุ่มหน้าสำหรับลูกค้าและสมาชิกทั่วไป */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/new-arrivals" element={<NewArrivals />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* ข้อมูลทั่วไป (Public Pages - ใครก็ดูได้) */}
            <Route path="/return-policy" element={<ReturnPolicy />} />
            <Route path="/how-to-buy" element={<HowToBuy />} />
            <Route path="/about" element={<About />} />      {/* <--- เพิ่ม Route นี้ */}
            <Route path="/contact" element={<Contact />} />  {/* <--- เพิ่ม Route นี้ */}

            {/* หน้าที่ต้องล็อกอินก่อน (Member Pages) */}
            <Route path="/collections" element={
              <ProtectedRoute>
                <Collections />
              </ProtectedRoute>
            } />

            <Route path="/order-history" element={
              <ProtectedRoute>
                <OrderTracking />
              </ProtectedRoute>
            } />

            <Route path="/shipping" element={
              <ProtectedRoute>
                <Shipping />
              </ProtectedRoute>
            } />

            <Route path="/track-order" element={
              <ProtectedRoute>
                <TrackOrder />
              </ProtectedRoute>
            } />

            <Route path="/track/:orderId" element={
              <ProtectedRoute>
                <OrderTracking />
              </ProtectedRoute>
            } />
            
            <Route path="/checkout" element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            } />
          </Route>
      
          {/* กลุ่มหน้าสำหรับผู้ดูแลระบบ (Admin Only) */}
          <Route path="/admin" element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="orders" element={<Orders />} />
            <Route path="collections" element={<AdminCollections />} />
            <Route path="verify-slips" element={<VerifySlips />} />
            <Route path="flash-sale" element={<FlashSaleAdmin />} />
            <Route path="on_delivery" element={<OnDeliveryAdmin />} />
            <Route path="received" element={<ReceivedAdmin />} /> 
          </Route>

          {/* 404 Page */}
          <Route path="*" element={
            <div className="h-screen flex flex-col items-center justify-center font-bold bg-[#F5F5F7] p-6 text-center">
              <h1 className="text-9xl text-black italic opacity-10">404</h1>
              <p className="text-2xl mt-4 font-black uppercase italic tracking-tighter">Oops! ของจุ่มหายไปไหน?</p>
              <p className="text-gray-400 mt-2">ไม่พบหน้าที่คุณต้องการ คาดว่าน้องน่าจะถูกแกะกล่องไปหมดแล้ว</p>
              <a href="/" className="mt-8 bg-yellow-400 text-black px-8 py-3 rounded-2xl font-black uppercase italic shadow-xl hover:scale-105 transition-transform">
                กลับหน้าหลัก (Go Home)
              </a>
            </div>
          } />

        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;