import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
export function signToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
}
export function supabaseToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h', audience: 'authenticated' });
}
export function signRefreshToken(payload) {
    return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '60d' });
}
//# sourceMappingURL=jwt.js.map