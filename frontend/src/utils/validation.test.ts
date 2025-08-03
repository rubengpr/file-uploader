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