import jwt from 'jsonwebtoken';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
export function verifyRefreshToken(token) {
    return jwt.verify(token, JWT_REFRESH_SECRET);
}
//# sourceMappingURL=tokenUtils.js.map