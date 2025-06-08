import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import sanitize from 'sanitize-filename';
const router = Router();
const prisma = new PrismaClient();
router.post('/create', async (req, res) => {
    //receive variables to create folder
    const { name, createdBy } = req.body;
    const folderName = sanitize(name);
    //create folder in database
    try {
        await prisma.folder.create({
            data: {
                name: folderName,
                createdBy,
            }
        });
        res.status(200).json({ message: "Folder has been created successfully" });
    }
    catch (err) {
        res.status(500).json({ message: "Something went wrong" });
    }
});
router.get('/get/:folderId', async (req, res) => {
    const { folderId } = req.params;
    const actualFolderId = folderId === 'root' ? null : folderId;
    try {
        const folders = await prisma.folder.findMany({
            where: { parentId: actualFolderId },
            include: {
                user: {
                    select: { email: true }
                }
            }
        });
        res.status(200).json(folders);
    }
    catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
});
router.patch('/rename', async (req, res) => {
    const { folderId, itemName } = req.body;
    const sanitizedItemName = sanitize(itemName);
    try {
        const renameFolder = await prisma.folder.update({
            where: {
                id: folderId
            },
            data: {
                name: sanitizedItemName,
            }
        });
        res.status(200).json({ message: "Folder renamed successfully" });
    }
    catch (err) {
        res.status(500).json({ message: "Something went wrong" });
    }
});
router.delete('/delete', async (req, res) => {
    const { folderId } = req.body;
    try {
        const deleteFolder = await prisma.folder.delete({
            where: {
                id: folderId
            },
        });
        res.status(200).json({ message: "Folder deleted successfully" });
    }
    catch (err) {
        res.status(500).json({ message: "Something went wrong" });
    }
});
export default router;
//# sourceMappingURL=folderRoutes.js.map