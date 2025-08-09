require('@testing-library/jest-dom')

// Mock environment variables
process.env.DATABASE_URL = 'postgres://test:test@localhost:5432/test_db'
process.env.NODE_ENV = 'test'

// Note: Database mocking is handled in individual test files to avoid path resolution issues
require('@testing-library/jest-dom');

// Mock environment variables
process.env.DATABASE_URL = 'postgres://test:test@localhost:5432/test_db'
process.env.NODE_ENV = 'test'

// Mock the database module
jest.mock('@/lib/db', () => ({
  executeQuery: jest.fn(),
  testConnection: jest.fn(),
  __esModule: true,
  default: {
    connect: jest.fn(),
    end: jest.fn(),
  },
}))

// Mock Next.js request/response objects
global.Request = class MockRequest {
  constructor(url, options = {}) {
    this.url = url
    this.method = options.method || 'GET'
    this.headers = new Map(Object.entries(options.headers || {}))
    this.body = options.body
  }

  async json() {
    return JSON.parse(this.body || '{}')
  }
}

global.Response = class MockResponse {
  constructor(body, options = {}) {
    this.body = body
    this.status = options.status || 200
    this.headers = new Map(Object.entries(options.headers || {}))
  }

  static json(data, options = {}) {
    return new MockResponse(JSON.stringify(data), {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })
  }
}

// Mock NextRequest and NextResponse
jest.mock('next/server', () => ({
  NextRequest: global.Request,
  NextResponse: global.Response,
}))

// Mock file upload functionality
jest.mock('fs', () => ({
  promises: {
    writeFile: jest.fn().mockResolvedValue(undefined),
    mkdir: jest.fn().mockResolvedValue(undefined),
  },
}))

// Mock UUID generation for consistent testing
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid-123'),
}))

// Setup test environment
beforeEach(() => {
  // Clear all mocks before each test
  jest.clearAllMocks()
})

// Global test utilities
global.createMockNextRequest = (url, options = {}) => {
  const request = new global.Request(url, options)
  request.nextUrl = {
    searchParams: new URLSearchParams(new URL(url).search),
  }
  return request
}

global.mockDbResponse = (data) => {
  const { executeQuery } = require('@/lib/db')
  executeQuery.mockResolvedValue(data)
}

global.mockDbError = (error) => {
  const { executeQuery } = require('@/lib/db')
  executeQuery.mockRejectedValue(error)
}