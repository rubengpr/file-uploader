import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export function signToken(payload: object): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '2s' });
  }

export function supabaseToken(payload: object): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h', audience: 'authenticated' });
}

export function signRefreshToken(payload: object): string {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '5s' })
}