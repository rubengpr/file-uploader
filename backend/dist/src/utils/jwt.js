import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET;
export function signToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
}
//# sourceMappingURL=jwt.js.map