import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'

import authRoutes from './routes/auth.js';
import fileRoutes from './routes/fileRoutes.js';
import folderRoutes from './routes/folderRoutes.js';

dotenv.config();
const app = express();

const isProd = process.env.NODE_ENV === 'production';

const allowedOrigins = isProd
  ? ['https://folded.me']
  : ['https://folded.me', 'http://localhost:5173'];

const corsOptions = {
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Custom-Header'],
  credentials: true,
};

app.use(cookieParser());

app.use(cors(corsOptions));

app.options('*', cors(corsOptions));

app.use(express.json());

app.use((req, res, next) => {
  next();
});


app.use('/api/auth', authRoutes);
app.use('/api/file', fileRoutes);
app.use('/api/folder', folderRoutes);

// ✅ Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
