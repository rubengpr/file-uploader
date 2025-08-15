import sanitize from 'sanitize-filename';
import { mapMimeType } from '../utils/mapMimeType.js';
import DOMPurify from "isomorphic-dompurify";
import prisma from '../lib/prisma.js'
import { getFileExtension } from '../utils/fileExtension.js';

export interface CreateFileData {
    name: string
    size: number
    userId: string
    folderId?: string
    type: string
}

export interface FileValidationResult {
    isValid: boolean
    error?: string
}

export const createFile = async (data: CreateFileData) => {
    const { name, size, userId, type, folderId } = data

    if (!name || !size || !userId || !type) {
        throw new Error('Missing required fields')
    }

    if (typeof name !== 'string' || typeof size !== 'number' || typeof userId !== 'string' || typeof type !== 'string') {
        throw new Error('Invalid fields value format')
    }

    if (name.length < 1 || name.length > 60) {
        throw new Error('File name must be between 1 and 60 characters')
    }

    if (size > 20 * 1024 * 1024) {
        throw new Error('Max file size is 20MB')
    }
    
    const allowedExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv', 'txt', 'jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];
    const fileExtension = getFileExtension(name)
    
    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
        throw new Error('File extension not supported')
    }

    if (folderId) {
        const folder = await prisma.folder.findFirst({
            where: { 
                id: folderId,
                createdBy: userId,
            }
        });
        
        if (!folder) {
            throw new Error('Access denied to folder')
        }
    }
    
    const sanitizedName = DOMPurify.sanitize(name)
    const filename = sanitize(sanitizedName)

    if (!filename.trim()) {
        throw new Error('Invalid file name')
    }

    const fileType = mapMimeType(type)

    try {
        await prisma.file.create({
            data: {
                name: filename,
                size,
                createdBy: userId,
                folderId,
                type: fileType,
            }
        })
    } catch(error) {
        throw new Error('Something went wrong')
    }
}

export const getFiles = async (folderId: string | null, userId: string) => {
    
    if (folderId !== null && typeof folderId !== 'string') {
        throw new Error('Invalid fields value format')
    }
    
    try {
        if (folderId) {
            const folder = await prisma.folder.findFirst({
              where: { 
                id: folderId,
                createdBy: userId,
              }
            });
            
            if (!folder) {
                throw new Error('Access denied to folder')
            }
        }

        return await prisma.file.findMany({
            where: { folderId },
            include: {
                user: {
                    select: { email: true },
                },
            },
        });
    } catch (error) {
        throw new Error('Failed to fetch files')
    }
}

export const renameFile = async (fileId: string, userId: string, itemName: string) => {
    
    if (!fileId || !itemName || !userId) {
        throw new Error('Missing required fields')
    }

    if (typeof fileId !== 'string' || typeof itemName !== 'string' || typeof userId !== 'string') {
        throw new Error('Invalid fields value format')
    }

    if (itemName.length < 1 || itemName.length > 60) {
        throw new Error('File name must be between 1 and 60 characters')
    }

    const sanitizedFileName = DOMPurify.sanitize(itemName);

    try {
        // Check if user owns the file before allowing rename
        const file = await prisma.file.findFirst({
            where: {
                id: fileId,
                createdBy: userId,
            }
        });

        if (!file) {
            throw new Error('Access denied to file')
        }

        await prisma.file.update({
            where: { id: fileId },
            data: { name: sanitizedFileName }
        })
    } catch (error) {
        throw new Error('Something went wrong')
    }
}

export const deleteFile = async (fileId: string, userId: string) => {
    if (!fileId) {
        throw new Error('Missing required fields')
    }

    if (typeof fileId !== 'string') {
        throw new Error('Invalid fields value format')
    }

    try {
        await prisma.file.delete({
            where: { 
                id: fileId,
                createdBy: userId
            }
        })
    } catch (error) {
        throw new Error('Something went wrong')
    }
}