import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import fileRoutes from './routes/fileRoutes.js';

dotenv.config();
const app = express();

app.use(cors({ origin: 'https://folded.me' }));

app.options('*', cors({ origin: 'https://folded.me' }));

app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
});


app.use('/api/auth', authRoutes);
app.use('/api/file', fileRoutes);

// ✅ Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
