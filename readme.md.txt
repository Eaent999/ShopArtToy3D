```md
# 🎮 SmartGuns Blind Box E-Commerce Platform

## 📌 Project Title & Description

**SmartGuns Shop** คือแพลตฟอร์ม E-Commerce ที่ผสานระบบร้านค้าออนไลน์เข้ากับระบบสุ่มสินค้า (Blind Box / Gacha System) พร้อมระบบจัดการหลังบ้าน (Admin Dashboard) แบบครบวงจร

โปรเจกต์นี้พัฒนาด้วยสถาปัตยกรรม Full-Stack แบ่งเป็น Frontend และ Backend โดยรองรับฟีเจอร์หลักดังนี้:

- 🛒 ระบบร้านค้า (Standard Shop)
- 🎁 ระบบสุ่ม Blind Box พร้อม Animation
- 💰 ระบบ Coin ภายในแพลตฟอร์ม
- 📦 ระบบติดตามออเดอร์
- 🧾 อัปโหลดและตรวจสอบสลิป
- 📊 Admin Dashboard พร้อมกราฟสถิติ

---

# ⚙️ System Architecture

```

Frontend (React + Vite)
│
▼
REST API (Node.js + Express)
│
▼
MySQL Database

````

---

# 💻 Installation Instructions

## 1️⃣ System Requirements

- Node.js (v18+ recommended)
- npm หรือ yarn
- MySQL (v8+)
- Git

ตรวจสอบเวอร์ชัน:

```bash
node -v
npm -v
mysql --version
````

---

## 2️⃣ Clone Repository

```bash
git clone https://github.com/your-username/smartguns-shop.git
cd smartguns-shop
```

---

## 3️⃣ Frontend Installation

```bash
cd frontend
npm install
npm run dev
```

Frontend จะรันที่:

```
http://localhost:5173
```

---

## 4️⃣ Backend Installation

```bash
cd backend
npm install
npm run dev
```

Backend จะรันที่:

```
http://localhost:5000
```

---

## 5️⃣ Database Setup

สร้างฐานข้อมูล:

```sql
CREATE DATABASE smartguns_db;
```

ตั้งค่าไฟล์ `.env` ในโฟลเดอร์ backend:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=smartguns_db
JWT_SECRET=your_secret_key
```

---

# 📦 Dependencies

## Frontend

* react
* react-dom
* vite
* react-router-dom
* tailwindcss
* axios
* framer-motion
* three
* @react-three/fiber
* @react-three/drei
* @google/model-viewer
* recharts
* canvas-confetti

ติดตั้ง:

```bash
npm install react react-dom react-router-dom axios framer-motion three @react-three/fiber @react-three/drei recharts canvas-confetti
```

---

## Backend

* express
* mysql2
* dotenv
* cors
* jsonwebtoken
* multer (สำหรับอัปโหลดสลิป)

ติดตั้ง:

```bash
npm install express mysql2 dotenv cors jsonwebtoken multer
```

---

# 🚀 Usage

## 🛒 Standard Shop

* เข้าเมนู Shop
* เลือกสินค้า
* เพิ่มลงตะกร้า
* ชำระเงิน

---

## 🎁 Blind Box

* เติม Coin
* เลือกตู้สุ่ม
* กด "Open"
* ระบบจะสุ่มสินค้าฝั่ง Backend
* แสดง Animation พร้อม Confetti หากได้ Rare

ตัวอย่างโค้ดสุ่มสินค้า (Backend):

```js
function drawItem(pool) {
   const totalWeight = pool.reduce((sum, item) => sum + item.rarity, 0);
   let random = Math.random() * totalWeight;

   for (let item of pool) {
      if (random < item.rarity) return item;
      random -= item.rarity;
   }
}
```

---

## 📦 Order Tracking

ลูกค้าสามารถตรวจสอบสถานะ:

* Pending
* Slip Uploaded
* Approved
* Shipped
* Delivered

---

# ✨ Features

## 👤 Member Features

* ระบบร้านค้าออนไลน์
* ระบบสุ่ม Blind Box
* ระบบ Coin
* คอลเลกชันส่วนตัว
* ตะกร้าและ Checkout
* อัปโหลดสลิป
* ติดตามออเดอร์

---

## 🛠 Admin Features

* จัดการสินค้า (CRUD)
* จัดการ Blind Box Pool
* ตั้งค่า Rarity
* Flash Sale Campaign
* ตรวจสอบสลิป
* กรอก Tracking Number
* Dashboard แสดงกราฟยอดขาย

---

# 🔧 Configuration

## JWT Authentication

Backend ใช้ JWT สำหรับ Authentication

```js
const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
  expiresIn: "7d",
});
```

---

## Upload Slip Configuration (Multer)

```js
const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
```

---

## Flash Sale Logic

```js
if (currentTime >= startTime && currentTime <= endTime) {
   finalPrice = originalPrice * 0.8;
}
```

---

# 📸 Screenshot Example

## 🏠 Homepage

```
[ Banner + Featured Products + Flash Sale Countdown ]
```

## 🎁 Blind Box Animation

```
[ 3D Box Spin Animation + Confetti Effect ]
```

## 📊 Admin Dashboard

```
[ Sales Chart + Orders Summary + Inventory Status ]
```

---

# 🧠 Security Considerations

* ใช้ Prepared Statements ป้องกัน SQL Injection
* ตรวจสอบ file type ตอนอัปโหลด
* จำกัดขนาดไฟล์
* Blind Box Random ต้องทำฝั่ง Backend เท่านั้น
* Admin Routes ต้องมี Middleware ตรวจสอบสิทธิ์

---

# 👨‍💻 Credit and Acknowledgements

พัฒนาโดยทีม SmartGuns Development

เทคโนโลยีที่ใช้:

* React Ecosystem
* Node.js
* MySQL
* Tailwind CSS
* Three.js
* Framer Motion

---

# 📞 Contact Information

📧 Email: [support@smartguns.art](mailto:support@smartguns.art)
🌐 Website: [https://shop.smartguns.art](https://shop.smartguns.art)
📍 Location: Thailand

---

# 📄 License

This project is licensed under the MIT License.

---

# 🎯 Future Improvements

* Payment Gateway Integration (PromptPay API)
* Real-time Notification (WebSocket)
* Cloud Storage (AWS S3)
* Docker Deployment
* CI/CD Pipeline

---

> SmartGuns Shop – Where Shopping Meets Gamification 🎁

```
```
