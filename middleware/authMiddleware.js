const jwt = require("jsonwebtoken")

/**
 * Authentication Middleware
 * Verifies token and attaches user ID and role to request
 */
export const Authentication = async (req, res, next) => {
    try {
        let token = req.headers.authorization || req.headers.Authorization;

        if (!token) {
            return res.status(403).json({ error: 'Authorization token is required' });
        }

        if (token.startsWith('Bearer ')) {
            token = token.slice(7).trim();
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id || decoded._id; // depending on your JWT payload
        req.userRole = decoded.role;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired, please log in again' });
        } else if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token, access denied' });
        } else {
            console.error('Authentication error:', err);
            return res.status(403).json({ error: 'Authentication failed' });
        }
    }
};

/**
 * Authorization Middleware
 * Ensures the userId in request matches the one in JWT token
 */
export const Authorization = async (req, res, next) => {
    try {
        let token = req.headers.authorization || req.headers.Authorization;

        if (token && token.startsWith('Bearer ')) {
            token = token.slice(7);
        } else {
            return res.status(403).json({ error: 'No Authorization token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const decodedUserId = decoded.id || decoded._id;

        // authId can come from body, query, or headers
        const userIdFromRequest =
            req.body.authId || req.query.authId || req.headers.authid;

        if (userIdFromRequest && userIdFromRequest !== decodedUserId) {
            return res.status(401).json({ error: 'User not authorized' });
        }

        next();
    } catch (error) {
        console.error('Authorization Error:', error);
        return res.status(500).json({ error: 'Authorization failed' });
    }
};
