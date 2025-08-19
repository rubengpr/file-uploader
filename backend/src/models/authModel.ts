import bcrypt from 'bcrypt'
import prisma from '../lib/prisma.js'
import { signToken, signRefreshToken, supabaseToken } from '../utils/jwt.js'
import crypto from 'crypto'
import sendEmail from '../utils/sendEmail.js'
import { verifyRefreshToken } from '../utils/tokenUtils.js'
import DOMPurify from "isomorphic-dompurify"
import sanitizeInput from '../utils/sanitizeInput.js'
import { validateEmail, validatePassword } from '../utils/validation.js'

export const login = async (email: string, password: string) => {

    if (!email || !password) {
        throw { message: 'Missing required fields', statusCode: 400 }
    }

    if (typeof email !== 'string' || typeof password !== 'string') {
        throw { message: 'Invalid fields value format', statusCode: 400 }
    }

    const purifiedEmail = DOMPurify.sanitize(email)
    const sanitizedEmail = sanitizeInput(purifiedEmail)

    if (!validateEmail(sanitizedEmail)) {
        throw { message: 'Invalid email format', statusCode: 400 }
    }

    if (!validatePassword(password)) {
        throw { message: 'Invalid password format', statusCode: 400 }
    }

    try {
        const user = await prisma.user.findUnique({ where: { email: sanitizedEmail } })
        if (!user) {
            throw { message: 'Invalid email or password', statusCode: 401 }
        }

        const isMatch = await bcrypt.compare(password, user.hashedPassword)
        if (!isMatch) {
            throw { message: 'Invalid email or password', statusCode: 401 }
        }

        const token = signToken({ id: user.id, email: user.email })
        const refreshToken = signRefreshToken({ id: user.id })

        const stoken = supabaseToken({ sub: user.id, email: user.email, role: 'authenticated' })

        const userId = user.id
        return { token, stoken, refreshToken, userId }
    } catch (error) {
        throw { message: 'Something went wrong', statusCode: 500 }
    }
}

export const signup = async (email: string, password: string) => {
    
    if (!email || !password) {
        throw { message: 'Missing required fields', statusCode: 400 }
    }

    if (typeof email !== 'string' || typeof password !== 'string') {
        throw { message: 'Invalid fields value format', statusCode: 400 }
    }

    const purifiedEmail = DOMPurify.sanitize(email)
    const sanitizedEmail = sanitizeInput(purifiedEmail)

    if (!validateEmail(sanitizedEmail)) {
        throw { message: 'Invalid email format', statusCode: 400 }
    }

    if (!validatePassword(password)) {
        throw { message: 'Invalid password format', statusCode: 400 }
    }

    try {
        const existingEmail = await prisma.user.findUnique({ where: { email: sanitizedEmail } })
        if (existingEmail) {
            throw { message: 'Email is already registered', statusCode: 400 }
        }

        const hashedPassword = await bcrypt.hash(password, 12)

        const result = await prisma.$transaction(async (tx) => {

            const user = await tx.user.create({
                data: {
                    email: sanitizedEmail,
                    hashedPassword,
                    role: 'admin',
                    currentPlan: 'free',
                },
            })

            const plan = await tx.plan.create({
                data: {
                    userId: user.id,
                    planType: 'free',
                    status: 'active',
                },
            })

            return { user, plan }
        })

        const token = signToken({ id: result.user.id, email: result.user.email })
        const refreshToken = signRefreshToken({ id: result.user.id })
        const stoken = supabaseToken({ sub: result.user.id, email: result.user.email, role: 'authenticated' })

        return { token, stoken, refreshToken }
    } catch (error) {
        throw { message: 'Something went wrong', statusCode: 500 }
    }
}

export const recoverPassword = async (email: string) => {

    if (!email) {
        throw { message: 'Missing required fields', statusCode: 400 }
    }

    if (typeof email !== 'string') {
        throw { message: 'Invalid fields value format', statusCode: 400 }
    }

    const purifiedEmail = DOMPurify.sanitize(email)
    const sanitizedEmail = sanitizeInput(purifiedEmail)

    if (!validateEmail(sanitizedEmail)) {
        throw { message: 'Invalid email format', statusCode: 400 }
    }

    const user = await prisma.user.findUnique({ where: { email: sanitizedEmail } })

    // No tr/catch block for security reasons
    if (user) {
        const token = crypto.randomBytes(32).toString("hex")
        
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60)

        try {
            await prisma.passwordResetToken.create({
                data: {
                    token,
                    userId: user.id,
                    expiresAt,
                }
            })
    
            sendEmail(sanitizedEmail, token)
        } catch (error) {
            throw { message: 'Something went wrong', statusCode: 500 }
        }
    }
}

export const changePassword = async (password: string, token: string) => {
     
     if (!password || !token) {
        throw { message: 'Missing required fields', statusCode: 400 }
    }

    if (typeof password !== 'string' || typeof token !== 'string') {
        throw { message: 'Invalid fields value format', statusCode: 400 }
    }

    if (!validatePassword(password)) {
        throw { message: 'Invalid password format', statusCode: 400 }
    }

    //Token validation (ensure it's a valid hex string)
    if (!/^[a-f0-9]{64}$/.test(token)) {
        throw { message: 'Invalid token format', statusCode: 400 }
    }

    try {
        const checkToken = await prisma.passwordResetToken.findUnique({ 
            where: { token } 
        })

        if (!checkToken) {
            throw { message: 'Invalid or expired password reset token', statusCode: 400 }
        }

        if (checkToken.expiresAt < new Date()) {
            throw { message: 'Password reset token has expired', statusCode: 400 }
        }

        const hashedPassword = await bcrypt.hash(password, 12)

        await prisma.user.update({
            where: {
                id: checkToken.userId
            },
            data: {
                hashedPassword,
            }
        })

        //Clean up used token
        await prisma.passwordResetToken.delete({
            where: {
                id: checkToken.id
            }
        })

        const user = await prisma.user.findUnique({ 
            where: { id: checkToken.userId } 
        })

        if (!user) {
            throw { message: 'User not found', statusCode: 400 }
        }

        const authToken = signToken({ id: user.id, email: user.email })

        return { authToken }
    } catch (error) {
        throw { message: 'Something went wrong', statusCode: 500 }
    }
}

export const refreshToken = async (refreshToken: string) => {
    
    if (!refreshToken) {
        throw { message: 'No refresh token found', statusCode: 401 }
    }

    if (typeof refreshToken !== 'string' || refreshToken.trim().length === 0) {
        throw { message: 'Invalid refresh token format', statusCode: 401 }
    }

    try {
        const payload = verifyRefreshToken(refreshToken)
        
        if (!payload || !payload.id) {
            throw { message: 'Invalid refresh token', statusCode: 401 }
        }

        const user = await prisma.user.findUnique({ 
            where: { id: payload.id } 
        })

        if (!user) {
            throw { message: 'User not found', statusCode: 401 }
        }

        const token = signToken({ id: user.id, email: user.email })

        //Generate new refresh token (optional - for better security)
        const newRefreshToken = signRefreshToken({ id: user.id })

        return { token, newRefreshToken }
    } catch (err) {
        throw { message: 'Invalid or expired refresh token', statusCode: 401 }
    }
}