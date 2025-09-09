import { Request, Response } from 'express'
import * as profileModel from '../models/profileModel.js'
import { handleError } from '../utils/errorHandler.js'

interface AuthenticatedRequest extends Request {
    user: { id: string }
}

export const getUser = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user.id

        const user = await profileModel.getUser(userId)

        res.status(200).json({ user })
    } catch (error) {
        const { message, statusCode } = handleError(error)
        res.status(statusCode).json({ message })
    }
}

export const updateUser = async (req: AuthenticatedRequest, res: Response) => {

    try {
        const userId = req.user.id;
        const { draftFullname, draftCountry, draftLanguage, draftTimezone } = req.body

        await profileModel.updateUser(userId, draftFullname, draftCountry, draftLanguage, draftTimezone)

        res.status(200).json({ message: 'User updated successfully' })
    } catch (error) {
        const { message, statusCode } = handleError(error)
        res.status(statusCode).json({ message })
    }
}