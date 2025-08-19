import { Request, Response } from 'express'
import * as folderModel from '../models/folderModel.js'
import { handleError } from '../utils/errorHandler.js'

interface AuthenticatedRequest extends Request {
    user: { id: string }
}

export const createFolder = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { name, parentId } = req.body
        const userId = req.user.id

        await folderModel.createFolder(name, parentId, userId)

        res.status(200).json({ message: 'Folder created successfully' })
    } catch (error) {
        const { message, statusCode } = handleError(error)
        res.status(statusCode).json({ message })
    }
}

export const getFolders = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { folderId } = req.params
        const actualFolderId = folderId === 'root' ? null : folderId
        const userId = req.user.id

        const folders = await folderModel.getFolders(actualFolderId, userId)

        res.status(200).json(folders)
    } catch (error) {
        const { message, statusCode } = handleError(error)
        res.status(statusCode).json({ message })
    }
}

export const renameFolder = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { folderId, itemName } = req.body
        const userId = req.user.id

        await folderModel.renameFolder(folderId, userId, itemName)

        res.status(200).json({ message: 'Folder renamed successfully' })
    } catch (error) {
        const { message, statusCode } = handleError(error)
        res.status(statusCode).json({ message })
    }
}

export const deleteFolder = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { folderId } = req.body
        const userId = req.user.id

        await folderModel.deleteFolder(folderId, userId)

        res.status(200).json({ message: 'Folder deleted successfully' })
    } catch (error) {
        const { message, statusCode } = handleError(error)
        res.status(statusCode).json({ message })
    }
}

export const getFolderHierarchy = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { folderId } = req.params
        const userId = req.user.id

        const folderHierarchy = await folderModel.getFolderHierarchy(folderId, userId)

        res.status(200).json(folderHierarchy)
    } catch (error) {
        const { message, statusCode } = handleError(error)
        res.status(statusCode).json({ message })
    }
}