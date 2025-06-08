import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET;
export default function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1]; // "Bearer <token>"
    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        return next();
    }
    catch (err) {
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
}
;
//# sourceMappingURL=authMiddleware.js.map