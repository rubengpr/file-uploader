import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import sanitize from 'sanitize-filename'

const router = Router();
const prisma = new PrismaClient();

router.post('/create', async (req, res) => {
    const { name, size, createdBy, folderId } = req.body;

    const filename = sanitize(name);

    try {
        const uploadFile = await prisma.file.create({
            data: {
                name: filename,
                size,
                createdBy,
                folderId,
            }
        });

        res.status(200).json({ message: "File uploaded successfully" })
    } catch(error) {
        res.status(500).json({ message: "Something went wrong" })
    }
});

router.get('/get/:folderId', async (req, res) => {
    const { folderId } = req.params;
    const actualFolderId = folderId === 'root' ? null : folderId;
  
    try {
      const files = await prisma.file.findMany({
        where: { folderId: actualFolderId },
        include: {
          user: {
            select: { email: true },
          },
        },
      });
  
      res.status(200).json(files);
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  });

router.patch('/rename', async (req, res) => {
    const { fileId, newItemName } = req.body;

    try {
        const renameFile = await prisma.file.update({
            where: {
                id: fileId,
            },
            data: {
                name: newItemName
            },
        });

        res.status(200).json({ message: "File renamed successfully" });
    } catch(error) {
        res.status(500).json({ message: "Something went wrong" });
    }
});

router.delete('/delete', async (req, res) => {
    const { fileId, userId } = req.body;

    try {
        await prisma.file.delete({
            where: {
                id: fileId
            }
        })
        res.status(200).json({ message: "File deleted successfully" })
    } catch(error) {
        res.status(500).json({ message: "Something went wrong" });
    }
})

export default router;