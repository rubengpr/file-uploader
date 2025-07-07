import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import authenticateToken from '../middleware/authMiddleware.js';
import DOMPurify from "isomorphic-dompurify";
import { getValidCountryValues, getValidLanguageValues, getValidTimezoneValues } from '../constants/index.js';
const router = Router();
const prisma = new PrismaClient();
// Valid dropdown values
const validCountries = getValidCountryValues();
const validLanguages = getValidLanguageValues();
const validTimezones = getValidTimezoneValues();
router.use(authenticateToken);
router.get('/me', async (req, res) => {
    const userId = req.user.id;
    if (!userId) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    if (typeof userId !== 'string') {
        return res.status(400).json({ error: 'Invalid fields value format' });
    }
    try {
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
    const userId = req.user.id;
    const { draftFullname, draftCountry, draftLanguage, draftTimezone } = req.body;
    if (!draftFullname || !draftCountry || !draftLanguage || !draftTimezone) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    if (!userId) {
        return res.status(400).json({ message: "No userId found" });
    }
    if (typeof draftFullname !== 'string' || typeof draftCountry !== 'string' ||
        typeof draftLanguage !== 'string' || typeof draftTimezone !== 'string') {
        return res.status(400).json({ error: 'Invalid fields value format' });
    }
    if (draftFullname.length < 2 || draftFullname.length > 50) {
        return res.status(400).json({ message: "Full name must be between 2 and 50 characters" });
    }
    const fullnameRegex = /^[a-zA-ZÀ-ÿ\s\-']+$/;
    if (!fullnameRegex.test(draftFullname)) {
        return res.status(400).json({ message: "Full name contains invalid characters" });
    }
    if (!validCountries.includes(draftCountry)) {
        return res.status(400).json({ message: "Invalid country selection" });
    }
    if (!validLanguages.includes(draftLanguage)) {
        return res.status(400).json({ message: "Invalid language selection" });
    }
    if (!validTimezones.includes(draftTimezone)) {
        return res.status(400).json({ message: "Invalid timezone selection" });
    }
    const sanitizedFullname = DOMPurify.sanitize(draftFullname);
    const sanitizedCountry = DOMPurify.sanitize(draftCountry);
    const sanitizedLanguage = DOMPurify.sanitize(draftLanguage);
    const sanitizedTimezone = DOMPurify.sanitize(draftTimezone);
    if (!sanitizedFullname || !sanitizedCountry || !sanitizedLanguage || !sanitizedTimezone) {
        return res.status(400).json({ message: "Invalid fields value format" });
    }
    try {
        await prisma.user.update({
            where: {
                id: userId
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