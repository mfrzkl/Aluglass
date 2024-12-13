const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { jwtSecret, jwtExpiresIn } = require('../config');
const { findByUsername } = require('../models/user');

const router = express.Router();

// Fungsi untuk membuat token JWT dengan role
const generateToken = (user) => {
    return jwt.sign({ id: user.id, role: user.role }, jwtSecret, { expiresIn: jwtExpiresIn });
};

// Halaman login sederhana
router.get('/login', (req, res) => {
    res.send(`
        <html>
        <head>
            <title>Login</title>
        </head>
        <body>
            <h1>Login</h1>
            <form method="POST" action="/api/auth/login">
                <label for="username">Username:</label>
                <input type="text" id="username" name="username" required><br>
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" required><br>
                <button type="submit">Login</button>
            </form>
        </body>
        </html>
    `);
});

// Endpoint untuk login
router.post('/login', (req, res) => {
    const router = express.Router();

    const generateToken = (user) => {
        return jwt.sign({ id: user.id, role: user.role }, jwtSecret, { expiresIn: jwtExpiresIn });
    };
    
    router.post('/login', (req, res) => {
        const { username, password } = req.body;
        const user = findByUsername(username);
    
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
    
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
    
        const token = generateToken(user);
        res.json({ message: 'Login successful', token });
    });
    
    module.exports = router;
});

// Middleware untuk memverifikasi JWT
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, jwtSecret, (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'Forbidden: Invalid token' });
            }

            req.user = user;
            next();
        });
    } else {
        res.status(401).json({ message: 'Unauthorized: Token missing' });
    }
};

// Rute yang dilindungi
router.get('/protected', authenticateJWT, (req, res) => {
    res.json({ message: 'This is protected data', user: req.user });
});

module.exports = router;
// module.exports = { router, authenticateJWT };
