import { test, expect, describe } from 'vitest'
import { formatFileSize } from './formatFileSize'

describe('formatFileSize', () => {
    test('formats bytes correctly', () => {
        expect(formatFileSize(500)).toBe('500 B')
    })

    test('formats kilobytes correctly', () => {
        expect(formatFileSize(1500)).toBe('1.5 KB')
    })

    test('formats megabytes correctly', () => {
        expect(formatFileSize(1500000)).toBe('1.4 MB')
    })

    test('formats gigabytes correctly', () => {
        expect(formatFileSize(1500000000)).toBe('1.4 GB')
    })
})