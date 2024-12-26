//server.js
const express = require('express');
const app = express();
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const dotenv = require('dotenv');
const passport = require('passport');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// Load environment variables
dotenv.config();

const apiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // Jendela waktu 1 jam
    max: 100, // Maksimal 100 permintaan per IP dalam 1 jam
    message: 'Terlalu banyak permintaan, coba lagi setelah 1 jam',
    standardHeaders: true,
    legacyHeaders: false,
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api', apiLimiter);

// Import route auth
const authRoutes = require('./routes/auth');

// Gunakan route auth
app.use('/auth', authRoutes);

// Middleware verifyJWT untuk protected routes
const verifyJWT = require('./middlewares/verifyJWT');

app.use(passport.initialize());

app.get('/auth/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/login.html'));
});

app.use(express.static(path.join(__dirname, 'public')));
app.use('/inventory', express.static(path.join(__dirname, 'services/inventory/public')));
app.get('/inventory', (req, res) => {
    res.sendFile(path.join(__dirname, 'services/inventory/public/inventory.html'));
});

app.use('/delivery-order', express.static(path.join(__dirname, 'services/delivery-order/public')))
app.get('/delivery-order', (req, res) => {
    res.sendFile(path.join(__dirname, 'services/delivery-order/public/delivery-order.html'))
})

app.use('/sales-order', express.static(path.join(__dirname, 'services/sales-order/public')))
app.get('/sales-order', (req, res) => {
    res.sendFile(path.join(__dirname, 'services/sales-order/public/sales-order.html'))
})

app.use(verifyJWT);
app.use(express.urlencoded({ extended: true }));

const services = {
    '/delivery-order': 'http://localhost:3003/',
    '/inventory': 'http://localhost:3001/',
    '/invoice': 'http://localhost:3004/',
    '/sales-order': 'http://localhost:3002/',
    '/shipments': 'http://localhost:3005/',
};

Object.entries(services).forEach(([path, target]) => {
    app.use(path, createProxyMiddleware({ target, changeOrigin: true }));
});

// Route to serve dashboard.html
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});