import { Router } from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { signToken } from '../utils/jwt.ts';

const router = Router();
const prisma = new PrismaClient();

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Find the user
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }

        // 2. Compare passwords
        const isMatch = await bcrypt.compare(password, user.hashedPassword);
        if (!isMatch) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }

        // 3. Generate token
        const token = signToken({ id: user.id, email: user.email });

        // 4. Send token
        res.status(200).json({ token });
    } catch (err) {
        res.status(500).json({ error: 'Something went wrong. Try again, or contact us' });
    }
});

router.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Check if user already exists
        const existingEmail = await prisma.user.findUnique({ where: { email } });
        if (existingEmail) {
            res.status(400).json({ error: 'Email is already registered' });
            return;
        }

        // 2. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Create user
        const user = await prisma.user.create({
            data: {
                email,
                hashedPassword,
            },
        });

        // 4. Create JWT token
        const token = signToken({ id: user.id, email: user.email });

        // 5. Respond with token
        res.status(201).json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Signup failed' });
    }
});

export default router;