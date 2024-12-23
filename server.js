const express = require('express');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const { createProxyMiddleware } = require('http-proxy-middleware');
const amqp = require('amqplib/callback_api');
const path = require('path');
// const fs = require('fs');
// const https = require('https');
// const http = require('http');

const app = express();

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

// Middleware untuk verifikasi JWT
app.use((req, res, next) => {
    if (req.path === '/auth/login' || req.path === '/dashboard') return next();

    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(403).json({ message: 'Anda perlu login!' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(403).json({ message: 'Token required' });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token expired' });
            }
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.user = decoded;
        next();
    });
});

// Setup Passport strategies
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: '/auth/github/callback',
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

app.use(passport.initialize());

// Google OAuth routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
}));

// GitHub OAuth routes
app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));
app.get('/auth/github/callback', passport.authenticate('github', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
}));

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

app.get('/auth/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/login.html'));
});

// RabbitMQ setup
// const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
// const QUEUE_NAME = 'email_notifications';

// amqp.connect(RABBITMQ_URL, (err, connection) => {
//     if (err) throw err;

//     connection.createChannel((err, channel) => {
//         if (err) throw err;

//         channel.assertQueue(QUEUE_NAME, { durable: false });

//         console.log(`RabbitMQ: Waiting for messages in queue: ${QUEUE_NAME}`);
//         channel.consume(QUEUE_NAME, (msg) => {
//             console.log(`Received: ${msg.content.toString()}`);
//         }, { noAck: true });
//     });
// });

// app.post('/notify', (req, res) => {
//     amqp.connect(RABBITMQ_URL, (err, connection) => {
//         if (err) return res.status(500).send('RabbitMQ connection failed.');

//         connection.createChannel((err, channel) => {
//             if (err) return res.status(500).send('Failed to create channel.');

//             const message = 'Example email notification';
//             channel.sendToQueue(QUEUE_NAME, Buffer.from(message));
//             console.log(`RabbitMQ: Sent message to queue: ${message}`);
//             res.send('Notification queued.');
//         });
//     });
// });

app.use(express.urlencoded({ extended: true }));

// Auth Route
app.post('/auth/login', (req, res) => {
    const { username, password } = req.body;

    if (username === 'admin' && password === 'admin123') {
        const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.json({ token });
        // res.redirect('/dashboard');
        // return token;
    }
    return res.status(401).json({ message: 'Invalid credentials' });
});

// Route to serve dashboard.html
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/inventory', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'inventory.html'));
});

// // SSL setup
// let server;
// if (fs.existsSync('./ssl/server.key') && fs.existsSync('./ssl/server.crt')) {
//     const privateKey = fs.readFileSync('./ssl/server.key', 'utf8');
//     const certificate = fs.readFileSync('./ssl/server.crt', 'utf8');
//     const credentials = { key: privateKey, cert: certificate };
//     server = https.createServer(credentials, app);
//     console.log('HTTPS server is running.');
// } else {
//     server = http.createServer(app);
//     console.log('Fallback to HTTP server.');
// }

// Jalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});