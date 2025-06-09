import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
const router = Router();
const prisma = new PrismaClient();
router.get('/get/:email', async (req, res) => {
    const { email } = req.params;
    try {
        const user = await prisma.user.findUnique({
            where: {
                email,
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
        res.status(200).json({ user });
    }
    catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
});
router.patch('/update', async (req, res) => {
    //get variables from frontend
    const { userId, draftFullname, draftCountry, draftLanguage, draftTimezone } = req.body;
    //Create the query to patch the user
    try {
        const updateUser = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                fullname: draftFullname,
                country: draftCountry,
                language: draftLanguage,
                timezone: draftTimezone,
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