import sanitize from 'sanitize-filename';
import { mapMimeType } from '../utils/mapMimeType.js';
import DOMPurify from "isomorphic-dompurify";
import prisma from '../lib/prisma.js'

export const createFolder = async (name: string, parentId: string | null, userId: string) => {
    
    if (!name || !userId) {
        throw { message: 'Missing required fields', statusCode: 400 };
    }

    if (typeof name !== 'string' || typeof userId !== 'string' || (parentId && typeof parentId !== 'string')) {
        throw { message: 'Invalid fields value format', statusCode: 400 };
    }

    if (name.length < 1 || name.length > 60) {
        throw { message: 'Folder name must be between 1 and 60 characters', statusCode: 400 };
    }

    if (!/^[a-zA-Z0-9\s\-_\.]+$/.test(name)) {
        throw { message: 'Invalid folder name', statusCode: 400 };
    }

    try {
        await prisma.folder.create({
            data: {
                name: name,
                createdBy: userId,
                parentId: parentId || null
            }
        })
    } catch (error) {
        throw { message: 'Something went wrong', statusCode: 500 };
    }
}

export const getFolders = async (folderId: string | null, userId: string) => {
    
    if (folderId !== null && typeof folderId !== 'string') {
        throw { message: 'Invalid fields value format', statusCode: 400 };
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
        throw { message: 'Something went wrong', statusCode: 500 };
    }
}

export const renameFolder = async (folderId: string | null, userId: string, itemName: string) => {
    
    if (!folderId || !itemName || !userId) {
        throw { message: 'Missing required fields', statusCode: 400 }
    }

    if (typeof folderId !== 'string' || typeof itemName !== 'string' || typeof userId !== 'string') {
        throw { message: 'Invalid fields value format', statusCode: 400 }
    }

    if (itemName.length < 1 || itemName.length > 60) {
        throw { message: 'Folder name must be between 1 and 60 characters', statusCode: 400 }
    }

    const sanitizedFolderName = DOMPurify.sanitize(itemName);
    const folderName = sanitize(sanitizedFolderName)

    if (!folderName.trim()) {
        throw { message: 'Invalid folder name', statusCode: 400 }
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
        throw { message: 'Something went wrong', statusCode: 500 }
    }
}

export const deleteFolder = async (folderId: string, userId: string) => {
    
    if (!folderId || !userId) {
        throw { message: 'Missing required fields', statusCode: 400 };
    }

    if (typeof folderId !== 'string' || typeof userId !== 'string') {
        throw { message: 'Invalid fields value format', statusCode: 400 };
    }

    try {
        await prisma.folder.delete({
            where: {
                id: folderId
            },
        })
    } catch (error) {
        throw { message: 'Something went wrong', statusCode: 500 };
    }
}

export const getFolderHierarchy = async (folderId: string, userId: string) => {
    
    if (!folderId || !userId) {
        throw { message: 'Missing required fields', statusCode: 400 }
    }

    if (typeof folderId !== 'string' || typeof userId !== 'string') {
        throw { message: 'Invalid fields value format', statusCode: 400 }
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
            throw { message: 'Folder not found or access denied', statusCode: 400 }
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
        throw { message: 'Something went wrong', statusCode: 500 }
    }
}