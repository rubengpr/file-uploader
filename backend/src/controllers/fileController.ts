import { Request, Response } from 'express'
import * as fileModel from '../models/fileModel.js'
import { getErrorMessage } from '../utils/errorHandler.js'

interface AuthenticatedRequest extends Request {
  user: { id: string }
}

export const createFile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, size, folderId, type } = req.body
    const userId = req.user.id

    await fileModel.createFile({ name, size, folderId, type, userId })
    
    res.status(200).json({ message: 'File uploaded successfully' })
  } catch (error) {
    const errorMessage = getErrorMessage(error)
    res.status(500).json({ message: errorMessage })
  }
}

export const getFiles = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { folderId } = req.params
        const actualFolderId = folderId === 'root' ? null : folderId
        const userId = req.user.id

        const files = await fileModel.getFiles(actualFolderId, userId)

        res.status(200).json(files)
    } catch (error) {
        const errorMessage = getErrorMessage(error)
        res.status(500).json({ message: errorMessage })
    }
}

export const renameFile = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { fileId, itemName } = req.body
        const userId = req.user.id

        await fileModel.renameFile(fileId, userId, itemName)

        res.status(200).json({ message: 'File renamed successfully' })
    } catch (error) {
        const errorMessage = getErrorMessage(error)
        res.status(500).json({ message: errorMessage })
    }
}

export const deleteFile = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { fileId } = req.body
        const userId = req.user.id

        await fileModel.deleteFile(fileId, userId)


    } catch (error) {
        const errorMessage = getErrorMessage(error)
        res.status(500).json({ message: errorMessage })
    }
}