import jwt from 'jsonwebtoken';

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

type RefreshPayload = {
    id: string;
    iat: number;
    exp: number;
  };
  
  export function verifyRefreshToken(token: string): RefreshPayload {
    return jwt.verify(token, JWT_REFRESH_SECRET) as RefreshPayload;
  }