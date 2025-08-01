import { Router } from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { signToken, signRefreshToken, supabaseToken } from '../utils/jwt.js';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail.js'
import { verifyRefreshToken } from '../utils/tokenUtils.js';
import DOMPurify from "isomorphic-dompurify";
import sanitizeInput from '../utils/sanitizeInput.js';
import { validateEmail, validatePassword } from '../utils/validation.js';

const router = Router()
const prisma = new PrismaClient()

router.post('/login', async (req: any, res: any) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ error: 'Missing required fields' })
    }

    if (typeof email !== 'string' || typeof password !== 'string') {
        return res.status(400).json({ error: 'Invalid fields value format' })
    }

    const purifiedEmail = DOMPurify.sanitize(email)
    const sanitizedEmail = sanitizeInput(purifiedEmail)

    if (!validateEmail(sanitizedEmail)) {
        return res.status(400).json({ error: 'Invalid email format' })
    }

    if (!validatePassword(password)) {
        return res.status(400).json({ error: 'Invalid password format' })
    }

    try {
        // 1. Find the user
        const user = await prisma.user.findUnique({ where: { email: sanitizedEmail } })
        if (!user) {
            res.status(401).json({ error: 'Invalid email or password' })
            return
        }

        // 2. Compare passwords
        const isMatch = await bcrypt.compare(password, user.hashedPassword)
        if (!isMatch) {
            res.status(401).json({ error: 'Invalid email or password' })
            return
        }

        // 3. Generate token
        const token = signToken({ id: user.id, email: user.email });
        const refreshToken = signRefreshToken({ id: user.id });

        //4. Supabase token
        const stoken = supabaseToken({ sub: user.id, email: user.email, role: 'authenticated' });
        
        // 5. Send token
        const userId = user.id
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 7 * 24 * 60 * 60 * 1000 });
        res.status(200).json({ token, stoken, userId });
    } catch (err) {
        res.status(500).json({ error: 'Something went wrong. Try again, or contact us' });
    }
})

router.post('/signup', async (req: any, res: any) => {
    
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    if (typeof email !== 'string' || typeof password !== 'string') {
        return res.status(400).json({ error: 'Invalid fields value format' })
    }

    const purifiedEmail = DOMPurify.sanitize(email)
    const sanitizedEmail = sanitizeInput(purifiedEmail)

    if (!validateEmail(sanitizedEmail)) {
        return res.status(400).json({ error: 'Invalid email format' })
    }

    if (!validatePassword(password)) {
        return res.status(400).json({ error: 'Invalid password format' })
    }

    try {
        // 1. Check if user already exists
        const existingEmail = await prisma.user.findUnique({ where: { email: sanitizedEmail } });
        if (existingEmail) {
            return res.status(400).json({ error: 'Email is already registered' });
        }

        // 2. Hash password with salt
        const hashedPassword = await bcrypt.hash(password, 12);

        // 3. Create user and plan in a transaction
        const result = await prisma.$transaction(async (tx) => {
            // Create user
            const user = await tx.user.create({
                data: {
                    email: sanitizedEmail,
                    hashedPassword,
                    role: 'admin',
                    currentPlan: 'free',
                },
            });

            // Create plan record
            const plan = await tx.plan.create({
                data: {
                    userId: user.id,
                    planType: 'free',
                    status: 'active',
                },
            });

            return { user, plan };
        });

        // 4. Generate tokens (consistent with login)
        const token = signToken({ id: result.user.id, email: result.user.email });
        const refreshToken = signRefreshToken({ id: result.user.id });
        const stoken = supabaseToken({ sub: result.user.id, email: result.user.email, role: 'authenticated' });

        // 5. Respond with token
        res.status(201).json({ token, stoken });
    } catch (err) {
        res.status(500).json({ error: 'Signup failed' });
    }
})

router.post('/recover-password', async (req: any, res: any) => {
    const { email } = req.body;

    // 1. Input validation
    if (!email) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    if (typeof email !== 'string') {
        return res.status(400).json({ error: 'Invalid fields value format' });
    }

    // 2. Input sanitization
    const purifiedEmail = DOMPurify.sanitize(email);
    const sanitizedEmail = sanitizeInput(purifiedEmail);

    // 3. Email validation
    if (!validateEmail(sanitizedEmail)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    try {
        // 4. Find the user
        const user = await prisma.user.findUnique({ where: { email: sanitizedEmail } });

        // 5. Process password recovery if user exists
        if (user) {
            // Create a randomized crypto token
            const token = crypto.randomBytes(32).toString("hex");
            
            // Set expiration date (1 hour from now)
            const expiresAt = new Date(Date.now() + 1000 * 60 * 60);

            // Create a new row in the PasswordResetToken table
            const passwordToken = await prisma.passwordResetToken.create({
                data: {
                    token,
                    userId: user.id,
                    expiresAt,
                }
            });

            // Send email with the token
            sendEmail(sanitizedEmail, token);
        }

        // Return a 200 success status, no matter if email exists (security through obscurity)
        res.status(200).json({ message: "We've sent you an email" });
    } catch (err) {
        res.status(500).json({ error: 'Something went wrong. Try again, or contact us' });
    }
})

router.post('/change-password', async (req: any, res: any) => {
    const { password, token } = req.body;

    // 1. Input validation
    if (!password || !token) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    if (typeof password !== 'string' || typeof token !== 'string') {
        return res.status(400).json({ error: 'Invalid fields value format' });
    }

    // 2. Password validation
    if (!validatePassword(password)) {
        return res.status(400).json({ error: 'Invalid password format' });
    }

    // 3. Token validation (ensure it's a valid hex string)
    if (!/^[a-f0-9]{64}$/.test(token)) {
        return res.status(400).json({ error: 'Invalid token format' });
    }

    try {
        // 4. Verify the reset token
        const checkToken = await prisma.passwordResetToken.findUnique({ 
            where: { token } 
        });

        if (!checkToken) {
            return res.status(400).json({ error: 'Invalid or expired password reset token' });
        }

        // 5. Check token expiration
        if (checkToken.expiresAt < new Date()) {
            return res.status(400).json({ error: 'Password reset token has expired' });
        }

        // 6. Hash the new password
        const hashedPassword = await bcrypt.hash(password, 12);

        // 7. Update user password
        await prisma.user.update({
            where: {
                id: checkToken.userId
            },
            data: {
                hashedPassword,
            }
        });

        // 8. Clean up used token
        await prisma.passwordResetToken.delete({
            where: {
                id: checkToken.id
            }
        });

        // 9. Find user info for token generation
        const user = await prisma.user.findUnique({ 
            where: { id: checkToken.userId } 
        });

        if (!user) {
            return res.status(500).json({ error: 'User not found' });
        }

        // 10. Generate a new auth token
        const authToken = signToken({ id: user.id, email: user.email });

        res.status(200).json({ message: "Password changed successfully", authToken });
    } catch (err) {
        res.status(500).json({ error: 'Something went wrong. Try again, or contact us' });
    }
})

router.post('/refresh', async (req: any, res: any) => {
    const refreshToken = req.cookies.refreshToken;

    // 1. Check if refresh token exists
    if (!refreshToken) {
        return res.status(401).json({ error: 'No refresh token found' });
    }

    // 2. Validate token format (basic string validation)
    if (typeof refreshToken !== 'string' || refreshToken.trim().length === 0) {
        return res.status(401).json({ error: 'Invalid refresh token format' });
    }

    try {
        // 3. Verify the refresh token
        const payload = verifyRefreshToken(refreshToken);
        
        if (!payload || !payload.id) {
            return res.status(401).json({ error: 'Invalid refresh token' });
        }

        // 4. Find the user
        const user = await prisma.user.findUnique({ 
            where: { id: payload.id } 
        });

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        // 5. Generate new access token
        const token = signToken({ id: user.id, email: user.email });

        // 6. Generate new refresh token (optional - for better security)
        const newRefreshToken = signRefreshToken({ id: user.id });

        // 7. Set new refresh token cookie
        res.cookie('refreshToken', newRefreshToken, { 
            httpOnly: true, 
            secure: true, 
            sameSite: 'none', 
            maxAge: 7 * 24 * 60 * 60 * 1000 
        });

        res.status(200).json({ token });
    } catch (err) {
        // 8. Clear invalid refresh token cookie
        res.clearCookie('refreshToken');
        res.status(401).json({ error: 'Invalid or expired refresh token' });
    }
})

router.use('*', (req, res) => {
    res.status(405).json({ 
      message: 'Method not allowed',
      allowedMethods: ['POST']
    })
})

export default router;