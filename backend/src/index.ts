import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.ts';
import emailRoutes from './routes/emailRoutes.ts'

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/email', emailRoutes);

const PORT = 4000
app.listen(PORT, () => {
    console.log(`Server listening coming requests from port ${PORT}`);
})