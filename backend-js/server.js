import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './config/db.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import generatePayload from 'promptpay-qr'; 
import qrcode from 'qrcode'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// --- [MULTER SETUP] ---
const modelDir = path.join(__dirname, 'uploads/models');
const slipDir = path.join(__dirname, 'uploads/slips');

[modelDir, slipDir].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === 'slip') cb(null, 'uploads/slips');
        else cb(null, 'uploads/models');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const allowedExtensions = ['.glb', '.jpg', '.jpeg', '.png', '.webp'];
        if (!allowedExtensions.includes(ext)) {
            return cb(new Error('รองรับเฉพาะไฟล์โมเดล .glb หรือรูปภาพเท่านั้น'), false);
        }
        cb(null, true);
    }
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// =========================================================
// 1. [SECTION: FLASH SALE & CAMPAIGNS]
// =========================================================

app.get('/api/flash-sale/active-campaign', async (req, res) => {
    try {
        const query = `SELECT * FROM flash_sale_campaigns WHERE is_active = 1 AND end_time > NOW() ORDER BY id DESC LIMIT 1`;
        const [rows] = await db.query(query);
        if (rows.length > 0) res.json(rows[0]);
        else res.status(404).json({ status: "error", message: "No active campaign" });
    } catch (error) { res.status(500).json({ status: "error", message: error.message }); }
});

app.put('/api/admin/flash-sale-campaign', async (req, res) => {
    const { campaign_name, end_time, is_active } = req.body;
    try {
        const query = `
            INSERT INTO flash_sale_campaigns (id, campaign_name, start_time, end_time, is_active)
            VALUES (1, ?, NOW(), ?, ?)
            ON DUPLICATE KEY UPDATE 
                campaign_name = VALUES(campaign_name), end_time = VALUES(end_time), is_active = VALUES(is_active)
        `;
        await db.query(query, [campaign_name, end_time, is_active || 1]);
        res.json({ status: "success", message: "Campaign data updated" });
    } catch (error) { res.status(500).json({ status: "error", message: error.message }); }
});

app.get('/api/flash-sale', async (req, res) => {
    try {
        const query = `
            SELECT fs.*, p.name, p.price as original_price, p.image_url 
            FROM flash_sale_items fs 
            JOIN products p ON fs.product_id = p.id 
            ORDER BY fs.id DESC
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (error) { res.status(500).json({ status: "error", message: error.message }); }
});

app.post('/api/flash-sale', async (req, res) => {
    const { product_id, flash_price, stock_limit } = req.body;
    try {
        await db.query("INSERT INTO flash_sale_items (product_id, flash_price, flash_stock) VALUES (?, ?, ?)", [product_id, flash_price, stock_limit]);
        res.status(201).json({ status: "success" });
    } catch (error) { res.status(500).json({ status: "error", message: error.message }); }
});

app.delete('/api/flash-sale/:id', async (req, res) => {
    try {
        await db.query("DELETE FROM flash_sale_items WHERE id = ?", [req.params.id]);
        res.json({ status: "success" });
    } catch (error) { res.status(500).json({ status: "error", message: error.message }); }
});

// =========================================================
// 2. [SECTION: CART SYSTEM]
// =========================================================

app.get('/api/cart/:user_id', async (req, res) => {
    const { user_id } = req.params;
    try {
        const query = `
            SELECT cart.quantity, p.id as product_id, p.name, p.price, p.image_url, p.category, p.stock,
                   fs.flash_price, fs.flash_stock,
                   CASE WHEN c.id IS NOT NULL THEN 1 ELSE 0 END as is_on_flash_sale
            FROM cart 
            JOIN products p ON cart.product_id = p.id 
            LEFT JOIN flash_sale_items fs ON p.id = fs.product_id
            LEFT JOIN flash_sale_campaigns c ON c.is_active = 1 AND c.end_time > NOW()
            WHERE cart.user_id = ?
        `;
        const [rows] = await db.query(query, [user_id]);
        res.json(rows);
    } catch (error) { res.status(500).json({ status: "error", message: error.message }); }
});

app.post('/api/cart/add', async (req, res) => {
    const { user_id, product_id, quantity } = req.body;
    try {
        const [existing] = await db.query("SELECT * FROM cart WHERE user_id = ? AND product_id = ?", [user_id, product_id]);
        if (existing.length > 0) {
            await db.query("UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?", [quantity || 1, user_id, product_id]);
        } else {
            await db.query("INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)", [user_id, product_id, quantity || 1]);
        }
        res.json({ status: "success" });
    } catch (error) { res.status(500).json({ status: "error", message: error.message }); }
});

app.put('/api/cart/update', async (req, res) => {
    const { user_id, product_id, action } = req.body;
    try {
        if (action === 'increase') {
            await db.query("UPDATE cart SET quantity = quantity + 1 WHERE user_id = ? AND product_id = ?", [user_id, product_id]);
        } else {
            await db.query("UPDATE cart SET quantity = GREATEST(1, quantity - 1) WHERE user_id = ? AND product_id = ?", [user_id, product_id]);
        }
        res.json({ status: "success" });
    } catch (error) { res.status(500).json({ status: "error", message: error.message }); }
});

app.delete('/api/cart/remove', async (req, res) => {
    const { user_id, product_id } = req.body;
    try {
        await db.query("DELETE FROM cart WHERE user_id = ? AND product_id = ?", [user_id, product_id]);
        res.json({ status: "success", message: "Item removed" });
    } catch (error) { res.status(500).json({ status: "error", message: error.message }); }
});

// =========================================================
// 3. [SECTION: PRODUCT MANAGEMENT]
// =========================================================

app.get('/api/products', async (req, res) => {
    try {
        const query = `
            SELECT p.*, fs.flash_price, fs.flash_stock,
                   CASE WHEN c.id IS NOT NULL THEN 1 ELSE 0 END as is_on_flash_sale
            FROM products p
            LEFT JOIN flash_sale_items fs ON p.id = fs.product_id
            LEFT JOIN flash_sale_campaigns c ON c.is_active = 1 AND c.end_time > NOW()
            ORDER BY p.id DESC
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (error) { res.status(500).json({ status: "error", message: error.message }); }
});

app.post('/api/products', upload.single('modelFile'), async (req, res) => {
    const { name, series, category, description, price, rarity, stock } = req.body;
    const file_url = req.file ? `/uploads/models/${req.file.filename}` : null;
    try {
        const query = `INSERT INTO products (name, series, category, description, price, rarity, stock, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const [result] = await db.query(query, [name, series || '', category, description, price, rarity || 'Common', stock, file_url]);
        res.status(201).json({ status: "success", id: result.insertId });
    } catch (error) { res.status(500).json({ status: "error", message: error.message }); }
});

app.put('/api/products/:id', upload.single('modelFile'), async (req, res) => {
    const { id } = req.params;
    const { name, series, category, description, price, rarity, stock } = req.body;
    const new_file_url = req.file ? `/uploads/models/${req.file.filename}` : null;

    try {
        if (new_file_url) {
            const query = `UPDATE products SET name=?, series=?, category=?, description=?, price=?, rarity=?, stock=?, image_url=? WHERE id=?`;
            await db.query(query, [name, series || '', category, description, price, rarity, stock, new_file_url, id]);
        } else {
            const query = `UPDATE products SET name=?, series=?, category=?, description=?, price=?, rarity=?, stock=? WHERE id=?`;
            await db.query(query, [name, series || '', category, description, price, rarity, stock, id]);
        }
        res.json({ status: "success", message: "Product updated" });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

app.get('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
            SELECT p.*, fs.flash_price, fs.flash_stock,
                   CASE WHEN c.id IS NOT NULL THEN 1 ELSE 0 END as is_on_flash_sale
            FROM products p
            LEFT JOIN flash_sale_items fs ON p.id = fs.product_id
            LEFT JOIN flash_sale_campaigns c ON c.is_active = 1 AND c.end_time > NOW()
            WHERE p.id = ?
        `;
        const [rows] = await db.query(query, [id]);
        if (rows.length > 0) res.json(rows[0]);
        else res.status(404).json({ status: "error", message: "Product not found" });
    } catch (error) { res.status(500).json({ status: "error", message: error.message }); }
});

app.delete('/api/products/:id', async (req, res) => {
    try {
        await db.query("DELETE FROM products WHERE id = ?", [req.params.id]);
        res.json({ status: "success", message: "Product deleted" });
    } catch (error) { res.status(500).json({ status: "error", message: error.message }); }
});

// =========================================================
// 4. [SECTION: COLLECTIONS & USER]
// =========================================================

app.get('/api/collections', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM collections ORDER BY id DESC");
        res.json(rows);
    } catch (error) { res.status(500).json({ status: "error", message: error.message }); }
});

app.post('/api/collections', upload.single('model_file'), async (req, res) => {
    const { name, series, rarity, card_color } = req.body;
    const model_url = req.file ? `/uploads/models/${req.file.filename}` : null;
    try {
        await db.query("INSERT INTO collections (name, series, rarity, card_color, model_url) VALUES (?, ?, ?, ?, ?)", [name, series, rarity, card_color, model_url]);
        res.status(201).json({ status: "success" });
    } catch (error) { res.status(500).json({ status: "error", message: error.message }); }
});

app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;
    
    // Input validation
    if (!username || !email || !password) {
        return res.status(400).json({ status: "error", message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ status: "error", message: "รูปแบบอีเมลไม่ถูกต้อง" });
    }
    
    if (password.length < 6) {
        return res.status(400).json({ status: "error", message: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" });
    }
    
    try {
        const [existing] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (existing.length > 0) {
            return res.status(400).json({ status: "error", message: "Email นี้ถูกใช้งานแล้ว" });
        }
        const [result] = await db.query("INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, 'user')", [username, email, password]);
        res.status(201).json({ status: "success", message: "ลงทะเบียนสำเร็จ", userId: result.insertId });
    } catch (error) { 
        console.error("Register error:", error);
        res.status(500).json({ status: "error", message: error.message }); 
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    
    // Input validation
    if (!email || !password) {
        return res.status(400).json({ status: "error", message: "กรุณากรอกอีเมลและรหัสผ่าน" });
    }
    
    try {
        const [rows] = await db.query("SELECT id, username, email, role FROM users WHERE email=? AND password=?", [email, password]);
        if (rows.length > 0) {
            res.json({ status: "success", user: rows[0] });
        } else {
            res.status(401).json({ status: "error", message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });
        }
    } catch (error) { 
        console.error("Login error:", error);
        res.status(500).json({ status: "error", message: error.message }); 
    }
});

// =========================================================
// 5. [SECTION: PAYMENT & DYNAMIC QR]
// =========================================================

app.post('/api/generate-qr', async (req, res) => {
    const { amount } = req.body;
    const mobileNumber = "0823840219"; 
    try {
        const payload = generatePayload(mobileNumber, { amount: Number(amount) });
        const qrImage = await qrcode.toDataURL(payload);
        res.json({ status: 'success', qrCode: qrImage });
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Failed to generate QR' });
    }
});

// =========================================================
// 6. [SECTION: ORDER & SLIP VERIFICATION]
// =========================================================

app.get('/api/admin/pending-orders', async (req, res) => {
    try {
        const query = `
            SELECT o.*, s.first_name, s.last_name, s.phone 
            FROM orders o 
            JOIN shipping_details s ON o.id = s.order_id 
            WHERE o.slip_url IS NOT NULL 
            AND o.status NOT IN ('paid', 'on_delivery', 'completed', 'cancelled')
            ORDER BY o.created_at DESC
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (error) { 
        res.status(500).json({ error: error.message }); 
    }
});

app.put('/api/admin/approve-order/:id', async (req, res) => {
    const orderId = req.params.id;
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
        const [updateResult] = await connection.execute(
            "UPDATE orders SET status = 'paid' WHERE id = ? AND status NOT IN ('paid', 'cancelled')",
            [orderId]
        );

        if (updateResult.affectedRows === 0) throw new Error("ไม่พบออเดอร์หรือออเดอร์นี้ถูกตรวจสอบไปแล้ว");

        const [items] = await connection.execute("SELECT product_id, quantity FROM order_items WHERE order_id = ?", [orderId]);

        for (const item of items) {
            await connection.execute("UPDATE products SET stock = GREATEST(0, stock - ?) WHERE id = ?", [item.quantity, item.product_id]);
        }

        await connection.commit();
        res.json({ status: "success", message: "Order approved and stock updated" });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ status: "error", message: error.message });
    } finally {
        connection.release();
    }
});

app.post('/api/orders/create-with-slip', upload.single('slip'), async (req, res) => {
    const { orderData } = req.body;
    const parsedOrder = JSON.parse(orderData);
    const { customer, items, totalAmount } = parsedOrder;
    const userId = customer.userId || 1;

    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
        const [orderResult] = await connection.execute(
            `INSERT INTO orders (user_id, total_amount, status, payment_method, slip_url, created_at) 
             VALUES (?, ?, 'pending', 'promptpay', ?, NOW())`, 
            [userId, totalAmount, `/uploads/slips/${req.file.filename}`]
        );
        const orderId = orderResult.insertId;

        for (const item of items) {
            await connection.execute(
                `INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?)`, 
                [orderId, item.id, item.quantity, item.price]
            );
        }

        await connection.execute(
            `INSERT INTO shipping_details (order_id, first_name, last_name, email, phone, address, district, province, zip_code) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [orderId, customer.firstName, customer.lastName, customer.email, customer.phone, customer.address, customer.district, customer.province, customer.zipCode]
        );

        await connection.execute(`DELETE FROM cart WHERE user_id = ?`, [userId]);
        await connection.commit();
        res.status(201).json({ status: "success", orderId: orderId });
    } catch (error) {
        await connection.rollback();
        if (req.file) fs.unlinkSync(req.file.path);
        res.status(500).json({ status: "error", message: error.message });
    } finally {
        connection.release();
    }
});

// =========================================================
// 7. [SECTION: DASHBOARD & ANALYTICS]
// =========================================================

app.get('/api/admin/dashboard-summary', async (req, res) => {
    try {
        const [revenue] = await db.query("SELECT SUM(total_amount) as total FROM orders WHERE status IN ('paid', 'on_delivery', 'completed')");
        const [pendingOrders] = await db.query("SELECT COUNT(*) as count FROM orders WHERE slip_url IS NOT NULL AND status = 'pending'");
        const [users] = await db.query("SELECT COUNT(*) as count FROM users WHERE role = 'user'");
        const [lowStock] = await db.query("SELECT id, name, stock FROM products WHERE stock < 5 ORDER BY stock ASC");

        const [chartRows] = await db.query(`
            SELECT DATE_FORMAT(created_at, '%a') as day, SUM(total_amount) as sales 
            FROM orders 
            WHERE status IN ('paid', 'on_delivery', 'completed') AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
            GROUP BY day
            ORDER BY MIN(created_at) ASC
        `);

        res.json({
            totalRevenue: revenue[0].total || 0,
            newOrdersCount: pendingOrders[0].count || 0,
            totalUsers: users[0].count || 0,
            lowStockProducts: lowStock,
            chartData: chartRows.length > 0 ? chartRows : [
                { day: 'Mon', sales: 0 }, { day: 'Tue', sales: 0 }, { day: 'Wed', sales: 0 }, 
                { day: 'Thu', sales: 0 }, { day: 'Fri', sales: 0 }, { day: 'Sat', sales: 0 }, { day: 'Sun', sales: 0 }
            ]
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

// =========================================================
// 8. [SECTION: USER ORDERS & TRACKING]
// =========================================================

app.get('/api/orders/user/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const [orders] = await db.query(
            "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC", 
            [userId]
        );

        const ordersWithItems = await Promise.all(orders.map(async (order) => {
            const [items] = await db.query(`
                SELECT oi.*, p.name, p.image_url 
                FROM order_items oi 
                JOIN products p ON oi.product_id = p.id 
                WHERE oi.order_id = ?`, [order.id]);
            return { ...order, items };
        }));

        res.json(ordersWithItems);
    } catch (error) { 
        console.error("Fetch Orders Error:", error);
        res.status(500).json({ error: error.message }); 
    }
});

app.get('/api/orders/track/:orderId', async (req, res) => {
    try {
        const [order] = await db.query("SELECT * FROM orders WHERE id = ?", [req.params.orderId]);
        const [items] = await db.query(`
            SELECT oi.*, p.name, p.image_url 
            FROM order_items oi 
            JOIN products p ON oi.product_id = p.id 
            WHERE oi.order_id = ?`, [req.params.orderId]);
        if (order.length > 0) res.json({ ...order[0], items });
        else res.status(404).json({ message: "ไม่พบคำสั่งซื้อ" });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.put('/api/admin/shipped-order/:id', async (req, res) => {
    const { id } = req.params;
    const { tracking_number } = req.body;
    try {
        await db.query("UPDATE orders SET status = 'on_delivery', tracking_number = ? WHERE id = ?", [tracking_number, id]);
        res.json({ status: "success", message: "จัดส่งเรียบร้อย" });
    } catch (error) { res.status(500).json({ status: "error", message: error.message }); }
});

app.get('/api/admin/orders-to-ship', async (req, res) => {
    try {
        const query = `
            SELECT o.id, o.total_amount, o.status, s.first_name, s.last_name, s.phone, s.address, s.district, s.province, s.zip_code
            FROM orders o
            LEFT JOIN shipping_details s ON o.id = s.order_id
            WHERE o.status = 'paid' AND (o.tracking_number IS NULL OR o.tracking_number = '')
            ORDER BY o.created_at DESC
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.get('/api/orders/last-shipping/:userId', async (req, res) => {
    try {
        const query = `SELECT s.* FROM shipping_details s JOIN orders o ON s.order_id = o.id WHERE o.user_id = ? ORDER BY o.created_at DESC LIMIT 1`;
        const [rows] = await db.query(query, [req.params.userId]);
        res.json(rows[0] || null);
    } catch (error) { res.status(500).json({ status: "error", message: error.message }); }
});

// =========================================================
// 9. [SECTION: ON-DELIVERY & RECEIVED HISTORY]
// =========================================================

// 9.1 ดึงรายการที่กำลังจัดส่ง (สำหรับหน้าจัดส่ง)
app.get('/api/admin/orders/on-delivery', async (req, res) => {
    try {
        const query = `
            SELECT 
                o.id, 
                o.total_amount, 
                o.tracking_number, 
                o.status,
                CONCAT(s.first_name, ' ', s.last_name) as customer_name,
                CONCAT(s.address, ' ', s.district, ' ', s.province, ' ', s.zip_code) as shipping_address,
                s.phone
            FROM orders o
            LEFT JOIN shipping_details s ON o.id = s.order_id
            WHERE o.status = 'on_delivery'
            ORDER BY o.created_at DESC
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

// 9.2 อัปเดตสถานะออเดอร์ (เช่น จาก on_delivery เป็น completed)
app.put('/api/admin/orders/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; 

    try {
        const query = "UPDATE orders SET status = ? WHERE id = ?";
        const [result] = await db.query(query, [status, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ status: "error", message: "Order not found" });
        }

        res.json({ status: "success", message: `Order updated to ${status}` });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

// 9.3 ดึงประวัติรายการที่ปิดงานแล้ว (Status: completed)
app.get('/api/admin/orders/received-history', async (req, res) => {
    try {
        const query = `
            SELECT o.id, o.total_amount, o.created_at as completed_at,
                   CONCAT(s.first_name, ' ', s.last_name) as customer_name,
                   o.tracking_number,
                   o.status
            FROM orders o
            JOIN shipping_details s ON o.id = s.order_id
            WHERE o.status = 'completed'
            ORDER BY o.created_at DESC
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

// ลบไอเทมออกจากคอลเลกชันตาม ID
app.delete('/api/collections/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query("DELETE FROM collections WHERE id = ?", [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                status: "error", 
                message: "ไม่พบข้อมูลที่ต้องการลบ" 
            });
        }

        res.status(200).json({ 
            status: "success", 
            message: "ลบไอเทมออกจากคอลเลกชันเรียบร้อยแล้ว" 
        });
    } catch (error) {
        console.error("Error deleting from database:", error);
        res.status(500).json({ 
            status: "error", 
            message: "ไม่สามารถลบข้อมูลได้เนื่องจากข้อผิดพลาดของระบบ" 
        });
    }
});


// =========================================================
// FINAL: Error Handling & Server Startup
// =========================================================

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    
    // Multer error handling
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ 
            status: "error", 
            message: `File upload error: ${err.message}` 
        });
    }
    
    // Validation error
    if (err.name === 'ValidationError') {
        return res.status(400).json({ 
            status: "error", 
            message: err.message 
        });
    }
    
    // Default error
    res.status(err.status || 500).json({ 
        status: "error", 
        message: err.message || "Internal server error" 
    });
});

// 404 handler - must be after all routes
app.use((req, res) => {
    res.status(404).json({ status: "error", message: "Route not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on: http://localhost:${PORT}`));