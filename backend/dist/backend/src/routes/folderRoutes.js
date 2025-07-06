import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import sanitize from 'sanitize-filename';
import authenticateToken from '../middleware/authMiddleware.js';
import DOMPurify from "isomorphic-dompurify";
const router = Router();
const prisma = new PrismaClient();
router.use(authenticateToken);
router.post('/create', async (req, res) => {
    const { name, parentId } = req.body;
    if (!name) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    if (typeof name !== 'string' || (parentId && typeof parentId !== 'string')) {
        return res.status(400).json({ error: 'Invalid fields value format' });
    }
    if (name.length < 1 || name.length > 60) {
        return res.status(400).json({ error: "Folder name must be between 1 and 60 characters" });
    }
    const sanitizedFolderName = DOMPurify.sanitize(name);
    const folderName = sanitize(sanitizedFolderName);
    if (!folderName.trim()) {
        return res.status(400).json({ error: "Invalid folder name" });
    }
    try {
        if (parentId) {
            const parentFolder = await prisma.folder.findFirst({
                where: {
                    id: parentId,
                    createdBy: req.user.id
                }
            });
            if (!parentFolder) {
                return res.status(404).json({ error: "Access denied" });
            }
        }
        await prisma.folder.create({
            data: {
                name: folderName,
                createdBy: req.user.id,
                parentId: parentId || null
            }
        });
        res.status(201).json({ message: "Folder created successfully" });
    }
    catch (err) {
        res.status(500).json({ error: "Something went wrong" });
    }
});
router.get('/get/:folderId', async (req, res) => {
    const { folderId } = req.params;
    const actualFolderId = folderId === 'root' ? null : folderId;
    if (!folderId) {
        res.status(400).json({ message: "Missing required fields" });
        return;
    }
    if (typeof folderId !== 'string') {
        return res.status(400).json({ error: 'Invalid fields value format' });
    }
    try {
        const folders = await prisma.folder.findMany({
            where: {
                parentId: actualFolderId,
                createdBy: req.user.id
            },
            include: {
                user: {
                    select: { email: true }
                }
            }
        });
        res.status(200).json(folders);
    }
    catch (error) {
        res.status(500).json({ error: "Something went wrong" });
    }
});
router.patch('/rename', async (req, res) => {
    const { folderId, itemName } = req.body;
    if (!folderId || !itemName) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    if (typeof folderId !== 'string' || typeof itemName !== 'string') {
        return res.status(400).json({ error: 'Invalid fields value format' });
    }
    if (itemName.length < 1 || itemName.length > 60) {
        return res.status(400).json({ error: "Folder name must be between 1 and 60 characters" });
    }
    const sanitizedFolderName = DOMPurify.sanitize(itemName);
    const folderName = sanitize(sanitizedFolderName);
    if (!folderName.trim()) {
        return res.status(400).json({ error: "Invalid folder name" });
    }
    try {
        const folder = await prisma.folder.findFirst({
            where: {
                id: folderId,
                createdBy: req.user.id
            }
        });
        if (!folder) {
            return res.status(404).json({ error: "Folder not found or access denied" });
        }
        await prisma.folder.update({
            where: {
                id: folderId
            },
            data: {
                name: folderName,
            }
        });
        res.status(200).json({ message: "Folder renamed successfully" });
    }
    catch (err) {
        res.status(500).json({ error: "Something went wrong" });
    }
});
router.delete('/delete', async (req, res) => {
    const { folderId } = req.body;
    if (!folderId) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    if (typeof folderId !== 'string') {
        return res.status(400).json({ error: 'Invalid fields value format' });
    }
    try {
        const folder = await prisma.folder.findFirst({
            where: {
                id: folderId,
                createdBy: req.user.id
            }
        });
        if (!folder) {
            return res.status(404).json({ error: "Folder not found or access denied" });
        }
        await prisma.folder.delete({
            where: {
                id: folderId
            },
        });
        res.status(200).json({ message: "Folder deleted successfully" });
    }
    catch (err) {
        res.status(500).json({ error: "Something went wrong" });
    }
});
export default router;
//# sourceMappingURL=folderRoutes.js.map