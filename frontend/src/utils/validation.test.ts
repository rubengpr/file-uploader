import { describe, test, expect } from "vitest";
import { validateEmail, validatePassword } from "./validation";

describe('validateEmail', () => {
    test('validates correct email addresses', () => {
        expect(validateEmail('test@example.com')).toBe(true)
        expect(validateEmail('user.name@domain.co.uk')).toBe(true)
        expect(validateEmail('user+tag@example.org')).toBe(true)
        expect(validateEmail('user.name@domain.co.uk.es.it.arg')).toBe(true)
        expect(validateEmail('thisisaverylongemailthatweshouldnowallowtoinform@thisisaverylongemailthatweshouldnowallowtoinform.co')).toBe(true)
    })

    test('rejects invalid email addresses', () => {
        expect(validateEmail('invalid-email')).toBe(false)
        expect(validateEmail('test@')).toBe(false)
        expect(validateEmail('@example.com')).toBe(false)
        expect(validateEmail('')).toBe(false)
    })
})

describe('validatePassword', () => {
    test('validates correct passwords', () => {
        expect(validatePassword('Password123!')).toBe(true)
        expect(validatePassword('Mypass1@')).toBe(true)
        expect(validatePassword('wEiRdPaSsWorD1!,.')).toBe(true)
    })
    
    test('validates passwords at length boundaries', () => {
        // Minimum length (8 characters)
        expect(validatePassword('Pass1!@')).toBe(true)
        // Maximum length (128 characters) - create a valid 128-char password
        const maxLengthPassword = 'A'.repeat(125) + '1!@' // 125 A's + 1 number + 2 special chars = 128
        expect(validatePassword(maxLengthPassword)).toBe(true)
    })
    
    test('rejects passwords that are too short or too long', () => {
        // Too short (7 characters)
        expect(validatePassword('Pass1!')).toBe(false)
        // Too long (129 characters)
        const tooLongPassword = 'A'.repeat(126) + '1!@' // 126 A's + 1 number + 2 special chars = 129
        expect(validatePassword(tooLongPassword)).toBe(false)
        // Very long password (existing test case)
        expect(validatePassword('thisisaveryveryvery!longpasswordthatshouldbeallowedanywaybecauseIthasEverythingthevalidationreggexneedssowearenotvalidatingforpasswordlength')).toBe(false)
    })
    
    test('rejects invalid passwords', () => {
        expect(validatePassword('pass')).toBe(false)
        expect(validatePassword('password')).toBe(false)
        expect(validatePassword('Pass')).toBe(false)
        expect(validatePassword('Password')).toBe(false)
        expect(validatePassword('thisisapassword')).toBe(false)
        expect(validatePassword('Thisisapassword')).toBe(false)
        expect(validatePassword('12345678')).toBe(false)
        expect(validatePassword('_+\-=[\]{};:"\\|,.<>/?')).toBe(false)
    })
})