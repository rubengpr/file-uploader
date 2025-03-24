import { Router } from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { signToken } from '../utils/jwt';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail';
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
    }
    catch (err) {
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
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Signup failed' });
    }
});
router.post('/recover-password', async (req, res) => {
    //1. Get email input value
    const { email } = req.body;
    //2. Look up in the database if the email exists
    const user = await prisma.user.findUnique({ where: { email } });
    //If not, end the process and return a 200 status
    if (user) {
        //If so, create a randomized crypto token
        const token = crypto.randomBytes(32).toString("hex");
        //Optional: hash token to store it in the database
        //Set expiration date
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60);
        //Create a new row in the PasswordResetToken table
        const passwordToken = await prisma.passwordResetToken.create({
            data: {
                token,
                userId: user.id,
                expiresAt,
            }
        });
        //Add the token to the URL button & send an email to email value
        sendEmail(email, token);
    }
    //Return a 200 success status, no matter if email exists
    res.status(200).json({ message: "We've sent you an email" });
});
router.post('/change-password', async (req, res) => {
    //Get token value from frontend
    const { password, token } = req.body;
    //Check if token exists in PasswordResetToken table
    const checkToken = await prisma.passwordResetToken.findUnique({ where: { token } });
    //If it does not, return an error
    if (!checkToken) {
        res.status(400).json({ message: "Password recovery request not found" });
    }
    //If it does, check expiresAt date and compare with Date
    if (checkToken && checkToken.expiresAt < new Date()) {
        res.status(400).json({ message: "Token expired. Request a new password recovery" });
    }
    //If token exists and is not expired, hash the inputted password value
    const hashedPassword = await bcrypt.hash(password, 10);
    //Update the hashed password into the right user (from the token table, userId)
    const updatePassword = await prisma.user.update({
        where: {
            id: checkToken?.userId
        },
        data: {
            hashedPassword,
        }
    });
    res.status(200).json({ message: "Password changed successfully" });
    //If something's wrong, return an error
});
export default router;
//# sourceMappingURL=auth.js.map