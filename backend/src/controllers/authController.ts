import { Request, Response } from 'express'
import * as authModel from '../models/authModel.js'
import { handleError } from '../utils/errorHandler.js'

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body

        const { token, stoken, refreshToken, userId } = await authModel.login(email, password)

        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 7 * 24 * 60 * 60 * 1000 })
        res.status(200).json({ token, stoken, userId })
    } catch (error) {
        const { message, statusCode } = handleError(error)
        res.status(statusCode).json({ message })
    }
}

export const signup = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body

        const { token, stoken, refreshToken } = await authModel.signup(email, password)

        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 7 * 24 * 60 * 60 * 1000 })
        res.status(201).json({ token, stoken })
    } catch (error) {
        const { message, statusCode } = handleError(error)
        res.status(statusCode).json({ message })
    }
}

export const recoverPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body

        await authModel.recoverPassword(email)
        
        res.status(200).json({ message: "We've sent you an email" })
    } catch (error) {
        const { message, statusCode } = handleError(error)
        res.status(statusCode).json({ message })
    }
}

export const changePassword = async (req: Request, res: Response) => {
    try {
        const { password, token } = req.body

        const { authToken } = await authModel.changePassword(password, token)

        res.status(200).json({ message: "Password changed successfully", authToken })
    } catch (error) {
        const { message, statusCode } = handleError(error)
        res.status(statusCode).json({ message })
    }
}

export const refreshToken = async (req: Request, res: Response) => {
    try {
        const refreshToken = req.cookies.refreshToken

        const { token, newRefreshToken } = await authModel.refreshToken(refreshToken)

        res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 7 * 24 * 60 * 60 * 1000 })
        res.status(200).json({ token })
    } catch (error) {
        res.clearCookie('refreshToken')
        const { message, statusCode } = handleError(error)
        res.status(statusCode).json({ message })
    }
}