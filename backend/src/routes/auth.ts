import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { signToken } from '../utils/jwt.ts';

const router = Router();
const prisma = new PrismaClient();

router.post('/', async (req: any, res: any) => {
    const { email, password } = req.body;
    console.log(email, password);

    try {
        // 1. Check if user already exists
        const existingUser = await prisma.user.findUnique({where: { email } });
        console.log(existingUser);
        if (existingUser) return res.status(400).json({ error: 'User already exists' });

        // 2. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Create user
        const user = await prisma.user.create({
        data: {
            email,
            hashedPassword
        }
        });

        // 4. Create JWT token
        const token = signToken({ id: user.id, email: user.email });

        // 5. Respond with token
        return res.status(201).json({ token });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Signup failed' });
  }
});

export default router;