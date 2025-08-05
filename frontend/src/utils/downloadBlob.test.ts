import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { downloadBlob } from './downloadBlob'

// Mock DOM APIs
const mockCreateElement = vi.fn()
const mockAppendChild = vi.fn()
const mockRemove = vi.fn()
const mockClick = vi.fn()
const mockCreateObjectURL = vi.fn()
const mockRevokeObjectURL = vi.fn()

describe('downloadBlob', () => {
  beforeEach(() => {
    // Setup DOM mocks
    global.document = {
      createElement: mockCreateElement,
      body: {
        appendChild: mockAppendChild,
      },
    } as any

    global.URL = {
      createObjectURL: mockCreateObjectURL,
      revokeObjectURL: mockRevokeObjectURL,
    } as any

    // Reset mocks
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('creates download link and triggers download', () => {
    // Arrange
    const mockBlob = new Blob(['test content'], { type: 'text/plain' })
    const filename = 'test.txt'
    const mockUrl = 'blob:mock-url'
    const mockLink = {
      href: '',
      download: '',
      click: mockClick,
      remove: mockRemove,
    }

    mockCreateObjectURL.mockReturnValue(mockUrl)
    mockCreateElement.mockReturnValue(mockLink)

    // Act
    downloadBlob(mockBlob, filename)

    // Assert
    expect(mockCreateObjectURL).toHaveBeenCalledWith(mockBlob)
    expect(mockCreateElement).toHaveBeenCalledWith('a')
    expect(mockLink.href).toBe(mockUrl)
    expect(mockLink.download).toBe(filename)
    expect(mockAppendChild).toHaveBeenCalledWith(mockLink)
    expect(mockClick).toHaveBeenCalled()
    expect(mockRemove).toHaveBeenCalled()
    expect(mockRevokeObjectURL).toHaveBeenCalledWith(mockUrl)
  })
})