const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
    const publicPaths = ['/auth/login', '/auth/google', '/auth/github'];
    if (publicPaths.includes(req.path)) return next();

    const token = req.cookies?.authToken;
    if (!token) {
        return req.accepts('html')
            ? res.redirect('/auth/login')
            : res.status(401).json({ message: 'Authentication required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.clearCookie('authToken');
        return req.accepts('html')
            ? res.redirect('/auth/login')
            : res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = verifyJWT;