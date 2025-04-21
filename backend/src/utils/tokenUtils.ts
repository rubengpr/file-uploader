import jwt from 'jsonwebtoken';

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export function verifyRefreshToken(token: string) {
    return jwt.verify(token, JWT_REFRESH_SECRET) as { id: string };
};