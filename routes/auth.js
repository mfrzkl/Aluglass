// routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('../middlewares/passportStrategies');

const router = express.Router();

// Google OAuth routes (tidak berubah)
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', (req, res, next) => {
    passport.authenticate('google', (err, user, info) => {
        if (err || !user) {
            return res.redirect('/login?error=authentication_failed');
        }
        const token = jwt.sign({ username: user.username, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('authToken', token, { 
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600000 // 1 hour in milliseconds
        });
        return res.redirect('/dashboard');
    })(req, res, next);
});

// GitHub OAuth routes (tidak berubah)
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/github/callback', (req, res, next) => {
    passport.authenticate('github', (err, user, info) => {
        if (err || !user) {
            return res.redirect('/login?error=authentication_failed');
        }
        const token = jwt.sign({ username: user.username, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('authToken', token, { 
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600000 // 1 hour in milliseconds
        });
        return res.redirect('/dashboard');
    })(req, res, next);
});

// Local login route (diperbaiki)
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === 'admin' && password === 'admin123') {
        const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        // Set cookie seperti OAuth routes
        res.cookie('authToken', token, { 
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 3600000 // 1 hour
        });

        return res.json({ 
            success: true,
            message: 'Login berhasil'
        });
    }

    return res.status(401).json({ 
        success: false,
        message: 'Username atau password salah' 
    });
});

// Tambahkan route untuk check auth
router.get('/check-auth', (req, res) => {
    const token = req.cookies.authToken;
    
    if (!token) {
        return res.status(401).json({ 
            authenticated: false,
            message: 'No token found' 
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return res.json({ 
            authenticated: true,
            user: decoded 
        });
    } catch (err) {
        return res.status(401).json({ 
            authenticated: false,
            message: 'Invalid or expired token' 
        });
    }
});

// Tambahkan route untuk logout
router.get('/logout', (req, res) => {
    res.clearCookie('authToken');
    res.json({ 
        success: true,
        message: 'Logged out successfully' 
    });
});

module.exports = router;