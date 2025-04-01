import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.post('/create', async (req, res) => {
    const { name, size, createdBy } = req.body;

    try {
        const uploadFile = await prisma.file.create({
            data: {
                name,
                size,
                createdBy,
            }
        });

        res.status(200).json({ message: "File uploaded successfully" })
    } catch(error) {
        res.status(500).json({ message: "Something went wrong" })
    }
});

router.get('/get', async (req, res) => {
    try {
        const files = await prisma.file.findMany();
        res.status(200).json(files);
    } catch(error) {
        res.status(500).json({ message: "Something went wrong" });
    }
})

export default router;