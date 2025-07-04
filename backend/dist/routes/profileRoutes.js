import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import authenticateToken from '../middleware/authMiddleware.js';
import sanitizeInput from '../utils/sanitizeInput.js';
const router = Router();
const prisma = new PrismaClient();
router.use(authenticateToken);
router.get('/me', async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
                email: true,
                fullname: true,
                country: true,
                role: true,
                language: true,
                timezone: true,
            }
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user });
    }
    catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
});
router.patch('/update', async (req, res) => {
    const requestingUserId = req.user.id;
    const { draftFullname, draftCountry, draftLanguage, draftTimezone } = req.body;
    const sanitizedFullname = sanitizeInput(draftFullname);
    const sanitizedCountry = sanitizeInput(draftCountry);
    const sanitizedLanguage = sanitizeInput(draftLanguage);
    const sanitizedTimezone = sanitizeInput(draftTimezone);
    if (!sanitizedFullname || !sanitizedCountry || !sanitizedLanguage || !sanitizedTimezone) {
        return res.status(400).json({ error: "Invalid field names" });
    }
    try {
        await prisma.user.update({
            where: {
                id: requestingUserId
            },
            data: {
                fullname: sanitizedFullname,
                country: sanitizedCountry,
                language: sanitizedLanguage,
                timezone: sanitizedTimezone,
            },
        });
        res.status(200).json({ message: "User updated successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
});
export default router;
//# sourceMappingURL=profileRoutes.js.map