import prisma from '../lib/prisma.js'
import { getValidCountryValues, getValidLanguageValues, getValidTimezoneValues } from '../constants/index.js'
import DOMPurify from 'dompurify'

export const getUser = async (userId: string) => {

    if (!userId) {
        throw { message: 'Missing required fields', statusCode: 400 }
    }

    if (typeof userId !== 'string') {
        throw { message: 'Invalid fields value format', statusCode: 400 }
    }
    
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
                email: true,
                fullname: true,
                country: true,
                role: true,
                language: true,
                timezone: true,
                currentPlan: true,
            }
        })
        
        if (!user) {
            throw { message: 'User not found', statusCode: 400 }
        }
        
        return { user }
    } catch (error) {
        throw { message: 'Something went wrong', statusCode: 500 }
    }
}

export const updateUser = async (userId: string, draftFullname: string, draftCountry: string, draftLanguage: string, draftTimezone: string) => {

    // Valid dropdown values
    const validCountries = getValidCountryValues()
    const validLanguages = getValidLanguageValues()
    const validTimezones = getValidTimezoneValues()
    
    if (!userId || !draftFullname || !draftCountry || !draftLanguage || !draftTimezone) {
        throw { message: 'Missing required fields', statusCode: 400 }
    }

    if (typeof draftFullname !== 'string' || typeof draftCountry !== 'string' || typeof draftLanguage !== 'string' || typeof draftTimezone !== 'string') {
        throw { message: 'Invalid fields value format', statusCode: 400 }
    }

    if (draftFullname.length < 2 || draftFullname.length > 50) {
        throw { message: 'Full name must be between 2 and 50 characters', statusCode: 400 }
    }

    const fullnameRegex = /^[a-zA-ZÀ-ÿ\s\-']+$/
    if (!fullnameRegex.test(draftFullname)) {
        throw { message: 'Full name contains invalid characters', statusCode: 400 }
    }

    if (!validCountries.includes(draftCountry)) {
        throw { message: 'Invalid country selection', statusCode: 400 }
    }

    if (!validLanguages.includes(draftLanguage)) {
        throw { message: 'Invalid language selection', statusCode: 400 }
    }

    if (!validTimezones.includes(draftTimezone)) {
        throw { message: 'Invalid timezone selection', statusCode: 400 }
    }

    const sanitizedFullname = DOMPurify.sanitize(draftFullname)
    const sanitizedCountry = DOMPurify.sanitize(draftCountry)
    const sanitizedLanguage = DOMPurify.sanitize(draftLanguage)
    const sanitizedTimezone = DOMPurify.sanitize(draftTimezone)

    if (!sanitizedFullname || !sanitizedCountry || !sanitizedLanguage || !sanitizedTimezone) {
        throw { message: 'Invalid fields value format', statusCode: 400 }
    }

    try {
        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                fullname: sanitizedFullname,
                country: sanitizedCountry,
                language: sanitizedLanguage,
                timezone: sanitizedTimezone,
            },
        })
    } catch (error) {
        throw { message: 'Something went wrong', statusCode: 500 }
    }
}