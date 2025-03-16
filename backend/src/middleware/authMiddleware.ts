// src/middleware/authMiddleware.ts
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export default function authenticateToken (req: any, res: any) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return res.status(200).json({ success: "You can now use the app!" })
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};