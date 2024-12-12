const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const fs = require('fs-extra');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const path = require('path');
const httpProxy = require('http-proxy');
const authRoutes = require('./routes/auth');
const { port } = require('./config');

const app = express();
const apiProxy = httpProxy.createProxyServer();

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

// Terapkan rate limit pada semua endpoint API
app.use('/api', apiLimiter);

// Middleware untuk logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} request to ${req.url}`);
    next();
});

// Routing untuk autentikasi
app.use('/api/auth', authRoutes);

// Routing untuk Sales Order
app.use('/sales-orders', (req, res) => {
    apiProxy.web(req, res, { target: salesOrderService }, (error) => {
        console.error(`Error proxying to Sales Order Service: ${error.message}`);
        res.status(500).send('Error proxying to Sales Order Service');
    });
});

// Routing untuk Delivery Order
app.use('/api/delivery-orders', (req, res) => {
    apiProxy.web(req, res, { target: deliveryOrderService }, (error) => {
        console.error(`Error proxying to Delivery Order Service: ${error.message}`);
        res.status(500).send('Error proxying to Delivery Order Service');
    });
});

// Routing untuk Inventory
app.use('/inventory', (req, res) => {
    apiProxy.web(req, res, { target: inventoryService }, (error) => {
        console.error(`Error proxying to Inventory Service: ${error.message}`);
        res.status(500).send('Error proxying to Inventory Service');
    });
});

// Routing untuk Shipments
app.use('/shipments', (req, res) => {
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