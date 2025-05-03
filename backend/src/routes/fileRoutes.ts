import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import sanitize from 'sanitize-filename'
import { mapMimeType } from '../utils/mapMimeType.js';

const router = Router();
const prisma = new PrismaClient();

router.post('/create', async (req, res) => {
    const { name, size, createdBy, folderId, type } = req.body;

    const allowedTypes = [
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv',
        'text/plain',
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/bmp',
        'image/svg+xml'
      ];

    if (!allowedTypes.includes(type)) {
    res.status(400).json({ message: "File type not supported" })
    return;
    }
      
    
    if (size > 20 * 1024 * 1024) {
        res.status(400).json({ message: "Max file size is 20MB" });
        return
      }
    
    const filename = sanitize(name);

    const fileType = mapMimeType(type);

    try {
        const uploadFile = await prisma.file.create({
            data: {
                name: filename,
                size,
                createdBy,
                folderId,
                type: fileType,
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
    const { fileId, itemName } = req.body;

    const sanitizedItemName = sanitize(itemName);

    try {
        const renameFile = await prisma.file.update({
            where: {
                id: fileId,
            },
            data: {
                name: sanitizedItemName,
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