const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const httpProxy = require('http-proxy');
const authRoutes = require('./routes/auth');
const authenticateJWT = require('./routes/auth')
const { jwtSecret, jwtExpiresIn, port } = require('./config');

const app = express();
// const apiProxy = httpProxy.createProxyServer();

// URL layanan backend
const salesOrderService = 'http://localhost:3001';
const deliveryOrderService = 'http://localhost:3002';
const inventoryService = 'http://localhost:3003';
const shipmentsService = 'http://localhost:3004';

// Middleware untuk parsing JSON dari body request
app.use(bodyParser.json());

// Konfigurasi Rate Limiting untuk semua rute API
const apiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // Jendela waktu 1 jam
    max: 100, // Maksimal 100 permintaan per IP dalam 1 jam
    message: 'Terlalu banyak permintaan, coba lagi setelah 1 jam', // Pesan jika limit terlampaui
    standardHeaders: true, // Menambahkan header RateLimit-* ke response
    legacyHeaders: false, // Menonaktifkan X-RateLimit-* header
});

const {
    createProxyMiddleware
} = require('http-proxy-middleware')

// Terapkan rate limit pada semua endpoint API
app.use('/api', apiLimiter);

// Middleware untuk logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} request to ${req.url}`);
    next();
});

// Middleware untuk verifikasi JWT
// const authenticateJWT = (req, res, next) => {
//     const authHeader = req.headers.authorization;
//     if (authHeader) {
//         const token = authHeader.split(' ')[1];

//         jwt.verify(token, jwtSecret, (err, user) => {
//             if (err) {
//                 return res.status(403).json({ message: 'Forbidden' });
//             }
//             req.user = user;
//             next();
//         });
//     } else {
//         res.status(401).json({ message: 'Unauthorized' });
//     }
// };

// Middleware untuk otorisasi berdasarkan role
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.users.role)) {
            return res.status(403).json({ message: 'Forbidden: Insufficient role' });
        }
        next();
    };
};

// Routing untuk autentikasi
app.use('/api/auth', authRoutes);

// Routing untuk Inventory (hanya Staff Gudang)
app.use('/api/inventory', authenticateJWT, authorizeRoles('Staff'), (req, res) => {
    createProxyMiddleware(req, res, { 
        target: inventoryService 
    }, (error) => {
        console.error(`Error proxying to Inventory Service: ${error.message}`);
        res.status(500).send('Error proxying to Inventory Service');
    });
});

// Routing untuk Sales Order (hanya Sales)
app.use('/sales-orders', authenticateJWT, authorizeRoles('Sales'), (req, res) => {
    apiProxy.web(req, res, { 
        target: salesOrderService 
    }, (error) => {
        console.error(`Error proxying to Sales Order Service: ${error.message}`);
        res.status(500).send('Error proxying to Sales Order Service');
    });
});

// Routing untuk Delivery Order (Operasional dan Sales)
app.use('/delivery-orders', authenticateJWT, authorizeRoles('ops', 'Sales'), (req, res) => {
    apiProxy.web(req, res, { target: deliveryOrderService 
    }, (error) => {
        console.error(`Error proxying to Delivery Order Service: ${error.message}`);
        res.status(500).send('Error proxying to Delivery Order Service');
    });
});

// Routing untuk Shipments (hanya Operasional)
app.use('/shipments', authenticateJWT, authorizeRoles('ops'), (req, res) => {
    apiProxy.web(req, res, { target: shipmentsService }, (error) => {
        console.error(`Error proxying to Shipments Service: ${error.message}`);
        res.status(500).send('Error proxying to Shipments Service');
    });
});

// Menjalankan API Gateway
const PORT = port || 3000;
app.listen(PORT, () => {
    console.log(`API Gateway berjalan di http://localhost:${PORT}`);
});
