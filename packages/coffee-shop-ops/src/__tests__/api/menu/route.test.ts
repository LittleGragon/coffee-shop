import { GET, POST } from '@/app/api/menu/route'
import menuService from '@/services/menuService'
import { MenuItem } from '@/types/models'

// Mock the menu service
jest.mock('@/services/menuService')
const mockMenuService = menuService as jest.Mocked<typeof menuService>

// Helper to convert date objects to ISO strings for response comparison
const toResponseShape = (item: any) => {
  const newItem = { ...item };
  for (const key in newItem) {
    if (newItem[key] instanceof Date) {
      newItem[key] = newItem[key].toISOString();
    }
  }
  return newItem;
};

describe('/api/menu', () => {
  const mockMenuItem: MenuItem = {
    id: 'menu-item-1',
    name: 'Americano',
    price: 25,
    category: 'Coffee',
    description: 'Rich espresso with hot water',
    image_url: '/images/americano.jpg',
    is_available: true,
    created_at: new Date('2024-01-01T00:00:00Z'),
    updated_at: new Date('2024-01-01T00:00:00Z')
  }

  const mockMenuItems: MenuItem[] = [
    mockMenuItem,
    {
      id: 'menu-item-2',
      name: 'Latte',
      price: 35,
      category: 'Coffee',
      description: 'Espresso with steamed milk',
      image_url: '/images/latte.jpg',
      is_available: true,
      created_at: new Date('2024-01-01T00:00:00Z'),
      updated_at: new Date('2024-01-01T00:00:00Z')
    }
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/menu', () => {
    it('should return all menu items without filters', async () => {
      mockMenuService.getAllItems.mockResolvedValue(mockMenuItems)

      const request = createMockNextRequest('http://localhost:3000/api/menu')
      const response = await GET(request)

      expect(mockMenuService.getAllItems).toHaveBeenCalledWith({})
      expect(response.status).toBe(200)
      
      const responseData = JSON.parse(response.body)
      expect(responseData).toEqual(mockMenuItems.map(toResponseShape))
    })

    it('should filter by category', async () => {
      mockMenuService.getAllItems.mockResolvedValue([mockMenuItem])

      const request = createMockNextRequest('http://localhost:3000/api/menu?category=Coffee')
      const response = await GET(request)

      expect(mockMenuService.getAllItems).toHaveBeenCalledWith({
        category: 'Coffee',
        isAvailable: undefined
      })
      expect(response.status).toBe(200)
      
      const responseData = JSON.parse(response.body)
      expect(responseData).toEqual([toResponseShape(mockMenuItem)])
    })

    it('should filter by availability', async () => {
      mockMenuService.getAllItems.mockResolvedValue(mockMenuItems)

      const request = createMockNextRequest('http://localhost:3000/api/menu?available=true')
      const response = await GET(request)

      expect(mockMenuService.getAllItems).toHaveBeenCalledWith({
        category: undefined,
        isAvailable: true
      })
      expect(response.status).toBe(200)
    })

    it('should filter by both category and availability', async () => {
      mockMenuService.getAllItems.mockResolvedValue([mockMenuItem])

      const request = createMockNextRequest('http://localhost:3000/api/menu?category=Coffee&available=true')
      const response = await GET(request)

      expect(mockMenuService.getAllItems).toHaveBeenCalledWith({
        category: 'Coffee',
        isAvailable: true
      })
      expect(response.status).toBe(200)
    })

    it('should handle service errors', async () => {
      const mockError = new Error('Service error')
      mockMenuService.getAllItems.mockRejectedValue(mockError)

      const request = createMockNextRequest('http://localhost:3000/api/menu')
      const response = await GET(request)

      expect(response.status).toBe(500)
      
      const responseData = JSON.parse(response.body)
      expect(responseData).toEqual({ error: 'Failed to fetch menu items' })
    })

    it('should handle available=false parameter', async () => {
      mockMenuService.getAllItems.mockResolvedValue([])

      const request = createMockNextRequest('http://localhost:3000/api/menu?available=false')
      const response = await GET(request)

      expect(mockMenuService.getAllItems).toHaveBeenCalledWith({
        category: undefined,
        isAvailable: false
      })
    })
  })

  describe('POST /api/menu', () => {
    it('should create new menu item with all fields', async () => {
      const newItemData = {
        name: 'Cappuccino',
        price: 30,
        category: 'Coffee',
        description: 'Espresso with steamed milk foam',
        image_url: '/images/cappuccino.jpg',
        is_available: true
      }

      const createdItem = { ...newItemData, id: 'new-item-id', created_at: new Date(), updated_at: new Date() }
      mockMenuService.addItem.mockResolvedValue(createdItem)

      const request = createMockNextRequest('http://localhost:3000/api/menu', {
        method: 'POST',
        body: JSON.stringify(newItemData),
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await POST(request)

      expect(mockMenuService.addItem).toHaveBeenCalledWith(newItemData)
      expect(response.status).toBe(201)
      
      const responseData = JSON.parse(response.body)
      expect(responseData).toEqual(toResponseShape(createdItem))
    })

    it('should create new menu item with minimal fields', async () => {
      const newItemData = {
        name: 'Simple Coffee',
        price: 20,
        category: 'Coffee'
      }

      const createdItem = { ...newItemData, id: 'new-item-id', created_at: new Date(), updated_at: new Date() }
      mockMenuService.addItem.mockResolvedValue(createdItem)

      const request = createMockNextRequest('http://localhost:3000/api/menu', {
        method: 'POST',
        body: JSON.stringify(newItemData),
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await POST(request)

      expect(mockMenuService.addItem).toHaveBeenCalledWith(newItemData)
      expect(response.status).toBe(201)
    })

    it('should return 400 when name is missing', async () => {
      const invalidData = {
        price: 25,
        category: 'Coffee'
      }

      const request = createMockNextRequest('http://localhost:3000/api/menu', {
        method: 'POST',
        body: JSON.stringify(invalidData),
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await POST(request)

      expect(response.status).toBe(400)
      
      const responseData = JSON.parse(response.body)
      expect(responseData).toEqual({ error: 'Name, price, and category are required' })
      expect(mockMenuService.addItem).not.toHaveBeenCalled()
    })

    it('should return 400 when price is missing', async () => {
      const invalidData = {
        name: 'Test Item',
        category: 'Coffee'
      }

      const request = createMockNextRequest('http://localhost:3000/api/menu', {
        method: 'POST',
        body: JSON.stringify(invalidData),
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await POST(request)

      expect(response.status).toBe(400)
      
      const responseData = JSON.parse(response.body)
      expect(responseData).toEqual({ error: 'Name, price, and category are required' })
    })

    it('should return 400 when category is missing', async () => {
      const invalidData = {
        name: 'Test Item',
        price: 25
      }

      const request = createMockNextRequest('http://localhost:3000/api/menu', {
        method: 'POST',
        body: JSON.stringify(invalidData),
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await POST(request)

      expect(response.status).toBe(400)
      
      const responseData = JSON.parse(response.body)
      expect(responseData).toEqual({ error: 'Name, price, and category are required' })
    })

    it('should handle service errors', async () => {
      const mockError = new Error('Service error')
      mockMenuService.addItem.mockRejectedValue(mockError)

      const validData = {
        name: 'Test Item',
        price: 25,
        category: 'Coffee'
      }

      const request = createMockNextRequest('http://localhost:3000/api/menu', {
        method: 'POST',
        body: JSON.stringify(validData),
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await POST(request)

      expect(response.status).toBe(500)
      
      const responseData = JSON.parse(response.body)
      expect(responseData).toEqual({ error: 'Failed to create menu item' })
    })

    it('should handle invalid JSON', async () => {
      const request = createMockNextRequest('http://localhost:3000/api/menu', {
        method: 'POST',
        body: 'invalid json',
        headers: { 'Content-Type': 'application/json' }
      })

      // Mock request.json() to throw an error
      request.json = jest.fn().mockRejectedValue(new Error('Invalid JSON'))

      const response = await POST(request)

      expect(response.status).toBe(500)
      
      const responseData = JSON.parse(response.body)
      expect(responseData).toEqual({ error: 'Failed to create menu item' })
    })

    it('should handle empty request body', async () => {
      const request = createMockNextRequest('http://localhost:3000/api/menu', {
        method: 'POST',
        body: JSON.stringify({}),
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await POST(request)

      expect(response.status).toBe(400)
      
      const responseData = JSON.parse(response.body)
      expect(responseData).toEqual({ error: 'Name, price, and category are required' })
    })
  })
})