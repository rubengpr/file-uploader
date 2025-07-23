import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'
import { rateLimit } from 'express-rate-limit'

import authRoutes from './routes/auth.js';
import fileRoutes from './routes/fileRoutes.js';
import folderRoutes from './routes/folderRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import stripeRoutes from './routes/stripeRoutes.js'

dotenv.config();
const app = express();
app.set('trust proxy', 1);

const isProd = process.env.NODE_ENV === 'production';

  const corsOptions = {
    origin: function (origin, callback) {
      const allowedOrigins = isProd
        ? ['https://folded.me']
        : ['https://folded.me', 'http://localhost:5173'];
  
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn('Blocked by CORS:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Custom-Header'],
  credentials: true,
};

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 300, // Limit each IP to 300 requests per `window` (here, per 15 minutes)
  message: 'Too many requests', //Error handler message
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

app.use(limiter)
app.use(cookieParser())
app.use(cors(corsOptions))
app.options('*', cors(corsOptions))
app.use(express.json())
app.use(express.json({ limit: '10kb' })); // Limit JSON payload size
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});


app.use('/api/auth', authRoutes);
app.use('/api/file', fileRoutes);
app.use('/api/folder', folderRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/stripe', stripeRoutes);

// Catch-all for unknown routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not Found' });
});


// ✅ Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
