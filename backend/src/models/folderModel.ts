import sanitize from 'sanitize-filename';
import { mapMimeType } from '../utils/mapMimeType.js';
import DOMPurify from "isomorphic-dompurify";
import prisma from '../lib/prisma.js'

export const createFolder = async (name: string, parentId: string | null, userId: string) => {
    
    if (!name || !userId) {
        throw new Error('Missing required fields')
    }

    if (typeof name !== 'string' || typeof userId !== 'string' || (parentId && typeof parentId !== 'string')) {
        throw new Error('Invalid fields value format')
    }

    if (name.length < 1 || name.length > 60) {
        throw new Error('Folder name must be between 1 and 60 characters')
    }

    const sanitizedFolderName = DOMPurify.sanitize(name)
    const folderName = sanitize(sanitizedFolderName)

    if (!folderName.trim()) {
        throw new Error('Invalid folder name')
    }

    try {
        await prisma.folder.create({
            data: {
                name: folderName,
                createdBy: userId,
                parentId: parentId || null
            }
        })
    } catch (error) {
        throw new Error('Something went wrong')
    }
}

export const getFolders = async (folderId: string | null, userId: string) => {
    
    if (folderId !== null && typeof folderId !== 'string') {
        throw new Error('Invalid fields value format')
    }

    try {
        return await prisma.folder.findMany({
            where: { 
                parentId: folderId,
                createdBy: userId
            },
            include: {
              user: {
                select: { email: true }
              }
            }
        })
    } catch (error) {
        throw new Error('Something went wrong')
    }
}

export const renameFolder = async (folderId: string | null, userId: string, itemName: string) => {
    
    if (!folderId || !itemName || !userId) {
        throw new Error('Missing required fields')
    }

    if (typeof folderId !== 'string' || typeof itemName !== 'string' || typeof userId !== 'string') {
        throw new Error('Invalid fields value format')
    }

    if (itemName.length < 1 || itemName.length > 60) {
        throw new Error('Folder name must be between 1 and 60 characters')
    }

    const sanitizedFolderName = DOMPurify.sanitize(itemName);
    const folderName = sanitize(sanitizedFolderName)

    if (!folderName.trim()) {
        throw new Error('Invalid folder name')
    }

    try {
        await prisma.folder.update({
            where: {
                id: folderId,
                createdBy: userId
            },
            data: {
                name: folderName,
            }
        })
    } catch (error) {
        throw new Error('Something went wrong')
    }
}

export const deleteFolder = async (folderId: string, userId: string) => {
    
    if (!folderId || !userId) {
        throw new Error('Missing required fields')
    }

    if (typeof folderId !== 'string' || typeof userId !== 'string') {
        throw new Error('Invalid fields value format')
    }

    try {
        await prisma.folder.delete({
            where: {
                id: folderId
            },
        })
    } catch (error) {
        throw new Error('Something went wrong')
    }
}

export const getFolderHierarchy = async (folderId: string, userId: string) => {
    
    if (!folderId || !userId) {
        throw new Error('Missing required fields')
    }

    if (typeof folderId !== 'string' || typeof userId !== 'string') {
        throw new Error('Invalid fields value format')
    }

    try {
        const folderHierarchy = [];
        let currentFolder = await prisma.folder.findFirst({
            where: {
                id: folderId,
                createdBy: userId
            }
        })

        // If folder not found or user doesn't have access
        if (!currentFolder) {
            throw new Error('Folder not found or access denied')
        }

        // Build the hierarchy from current folder up to root
        while (currentFolder) {
            folderHierarchy.unshift({
                id: currentFolder.id,
                name: currentFolder.name
            });
            
            if (currentFolder.parentId) {
                currentFolder = await prisma.folder.findFirst({
                    where: {
                        id: currentFolder.parentId,
                        createdBy: userId
                    }
                });
            } else {
                currentFolder = null;
            }
        }

        return folderHierarchy
    } catch(err) {
        throw new Error('Something went wrong')
    }
}