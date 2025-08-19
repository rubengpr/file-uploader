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
        throw { message: 'Missing required fields', statusCode: 400 }
    }

    if (typeof name !== 'string' || typeof size !== 'number' || typeof userId !== 'string' || typeof type !== 'string') {
        throw { message: 'Invalid fields value format', statusCode: 400 }
    }

    if (name.length < 1 || name.length > 60) {
        throw { message: 'File name must be between 1 and 60 characters', statusCode: 400 }
    }

    if (size > 20 * 1024 * 1024) {
        throw { message: 'Max file size is 20MB', statusCode: 400 }
    }
    
    const allowedExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv', 'txt', 'jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];
    const fileExtension = getFileExtension(name)
    
    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
        throw { message: 'File extension not supported', statusCode: 400 }
    }

    if (folderId) {
        const folder = await prisma.folder.findFirst({
            where: { 
                id: folderId,
                createdBy: userId,
            }
        });
        
        if (!folder) {
            throw { message: 'Access denied to folder', statusCode: 403 }
        }
    }
    
    const sanitizedName = DOMPurify.sanitize(name)
    const filename = sanitize(sanitizedName)

    if (!filename.trim()) {
        throw { message: 'Invalid file name', statusCode: 400 }
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
        throw { message: 'Something went wrong', statusCode: 500 }
    }
}

export const getFiles = async (folderId: string | null, userId: string) => {
    
    if (folderId !== null && typeof folderId !== 'string') {
        throw { message: 'Invalid fields value format', statusCode: 400 }
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
                throw { message: 'Access denied to folder', statusCode: 403 }
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
        throw { message: 'Failed to fetch files', statusCode: 500 }
    }
}

export const renameFile = async (fileId: string, userId: string, itemName: string) => {
    
    if (!fileId || !itemName || !userId) {
        throw { message: 'Missing required fields', statusCode: 400 }
    }

    if (typeof fileId !== 'string' || typeof itemName !== 'string' || typeof userId !== 'string') {
        throw { message: 'Invalid fields value format', statusCode: 400 }
    }

    if (itemName.length < 1 || itemName.length > 60) {
        throw { message: 'File name must be between 1 and 60 characters', statusCode: 400 }
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
            throw { message: 'Access denied to file', statusCode: 403 }
        }

        await prisma.file.update({
            where: { id: fileId },
            data: { name: sanitizedFileName }
        })
    } catch (error) {
        throw { message: 'Something went wrong', statusCode: 500 }
    }
}

export const deleteFile = async (fileId: string, userId: string) => {
    if (!fileId) {
        throw { message: 'Missing required fields', statusCode: 400 }
    }

    if (typeof fileId !== 'string') {
        throw { message: 'Invalid fields value format', statusCode: 400 }
    }

    try {
        await prisma.file.delete({
            where: { 
                id: fileId,
                createdBy: userId
            }
        })
    } catch (error) {
        throw { message: 'Something went wrong', statusCode: 500 }
    }
}