import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import sanitize from 'sanitize-filename';
import { mapMimeType } from '../utils/mapMimeType.js';
import authenticateToken from '../middleware/authMiddleware.js';
import DOMPurify from "isomorphic-dompurify";

const router = Router()
const prisma = new PrismaClient()

router.use(authenticateToken)

router.post('/create', async (req: any, res: any) => {
    const { name, size, folderId, type } = req.body
    const createdBy = req.user.id

    if (!name || !size || !createdBy || !type) {
        res.status(400).json({ message: "Missing required fields" })
        return
    }

    if (typeof name !== 'string' || typeof size !== 'number' || typeof createdBy !== 'string' || typeof type !== 'string') {
        return res.status(400).json({ error: 'Invalid fields value format' })
    }

    if (name.length < 1 || name.length > 60) {
        return res.status(400).json({ message: "File name must be between 1 and 60 characters" })
    }

    if (size > 20 * 1024 * 1024) {
        res.status(400).json({ message: "Max file size is 20MB" })
        return
    }

    const getFileExtension = (filename: string) => {
        return filename.split('.').pop()?.toLowerCase();
    };
    
    const allowedExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv', 'txt', 'jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];
    const fileExtension = getFileExtension(name);
    
    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
        return res.status(400).json({ message: "File extension not supported" });
    }

    if (folderId) {
        const folder = await prisma.folder.findFirst({
            where: { 
                id: folderId,
                createdBy: req.user.id,
            }
        });
        
        if (!folder) {
            return res.status(403).json({ message: "Access denied to folder" });
        }
    }
    
    const sanitizedName = DOMPurify.sanitize(name)
    const filename = sanitize(sanitizedName)

    if (!filename.trim()) {
        return res.status(400).json({ message: "Invalid file name" });
    }

    const fileType = mapMimeType(type)

    try {
        await prisma.file.create({
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
})

router.get('/get/:folderId', async (req: any, res: any) => {
    const { folderId } = req.params;
    const actualFolderId = folderId === 'root' ? null : folderId;

    if (!folderId) {
        res.status(400).json({ message: "Missing required fields" })
        return
    }

    if (typeof folderId !== 'string') {
        return res.status(400).json({ error: 'Invalid fields value format' })
    }
  
    try {
        if (actualFolderId) {
            const folder = await prisma.folder.findFirst({
              where: { 
                id: actualFolderId,
                createdBy: req.user.id,
              }
            });
            
            if (!folder) {
              return res.status(403).json({ message: "Access denied to folder" });
            }
          }

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
})

router.patch('/rename', async (req: any, res: any) => {
    const { fileId, itemName } = req.body;

    if (!fileId || !itemName) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    if (typeof fileId !== 'string' || typeof itemName !== 'string') {
        return res.status(400).json({ error: 'Invalid fields value format' })
    }

    if (itemName.length < 1 || itemName.length > 60) {
        return res.status(400).json({ message: "File name must be between 1 and 60 characters" })
    }

    const sanitizedFileName = DOMPurify.sanitize(itemName);

    try {
        // Check if user owns the file before allowing rename
        const file = await prisma.file.findFirst({
            where: {
                id: fileId,
                createdBy: req.user.id,
            }
        });

        if (!file) {
            return res.status(403).json({ message: "Access denied to file" });
        }

        await prisma.file.update({
            where: {
                id: fileId,
            },
            data: {
                name: sanitizedFileName,
            },
        });

        res.status(200).json({ message: "File renamed successfully" });
    } catch(error) {
        res.status(500).json({ message: "Something went wrong" });
    }
})

router.delete('/delete', async (req: any, res: any) => {
    const { fileId } = req.body;

    if (!fileId) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    if (typeof fileId !== 'string') {
        return res.status(400).json({ error: 'Invalid fields value format' })
    }

    try {
        // Check if user owns the file before allowing deletion
        const file = await prisma.file.findFirst({
            where: {
                id: fileId,
                createdBy: req.user.id,
            }
        });

        if (!file) {
            return res.status(403).json({ message: "Access denied to file" });
        }

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

router.use('*', (req, res) => {
    res.status(405).json({ 
      message: 'Method not allowed',
      allowedMethods: ['GET', 'POST', 'PATCH', 'DELETE']
    })
})

export default router