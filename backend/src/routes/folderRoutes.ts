import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.post('/create', async (req, res) => {
    //receive variables to create folder
    const {name, createdBy} = req.body;

    //create folder in database
    try {
        await prisma.folder.create({
            data: {
                name,
                createdBy,
            }
        });
        
        res.status(200).json({ message: "Folder has been created successfully" });
    } catch(err) {
        res.status(500).json({ message: "Something went wrong" })
    }
});

router.get('/get', async (req, res) => {
    try {
        const folders = await prisma.folder.findMany({
            include: {
              user: {
                select: { email: true }
              }
            }
          });
        res.status(200).json(folders);
    } catch(error) {
        res.status(500).json({ message: "Something went wrong" });
    }
});

export default router;