import { GET, POST } from '@/app/api/inventory/route'
import inventoryService from '@/services/inventoryService'
import { InventoryItem } from '@/types/models'

// Mock the inventory service
jest.mock('@/services/inventoryService')
const mockInventoryService = inventoryService as jest.Mocked<typeof inventoryService>

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

describe('/api/inventory', () => {
  const mockInventoryItem: InventoryItem = {
    id: 'inv-item-1',
    name: 'Coffee Beans',
    sku: 'CB-001',
    category: 'Raw Materials',
    current_stock: 100,
    minimum_stock: 20,
    unit: 'kg',
    cost_per_unit: 15.50,
    supplier: 'Coffee Supplier Co.',
    last_restock_date: new Date('2024-01-01T00:00:00Z'),
    expiry_date: new Date('2024-12-31T00:00:00Z'),
    created_at: new Date('2024-01-01T00:00:00Z'),
    updated_at: new Date('2024-01-01T00:00:00Z')
  }

  const mockInventoryItems: InventoryItem[] = [
    mockInventoryItem,
    {
      id: 'inv-item-2',
      name: 'Milk',
      sku: 'ML-001',
      category: 'Dairy',
      current_stock: 50,
      minimum_stock: 10,
      unit: 'liters',
      cost_per_unit: 2.50,
      supplier: 'Dairy Farm Ltd.',
      last_restock_date: new Date('2024-01-02T00:00:00Z'),
      expiry_date: new Date('2024-01-10T00:00:00Z'),
      created_at: new Date('2024-01-01T00:00:00Z'),
      updated_at: new Date('2024-01-01T00:00:00Z')
    }
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/inventory', () => {
    it('should return all inventory items without filters', async () => {
      mockInventoryService.getAllItems.mockResolvedValue(mockInventoryItems)

      const request = createMockNextRequest('http://localhost:3000/api/inventory')
      const response = await GET(request)

      expect(mockInventoryService.getAllItems).toHaveBeenCalledWith({})
      expect(response.status).toBe(200)
      
      const responseData = JSON.parse(response.body)
      expect(responseData).toEqual(mockInventoryItems.map(toResponseShape))
    })

    it('should filter by category', async () => {
      mockInventoryService.getAllItems.mockResolvedValue([mockInventoryItem])

      const request = createMockNextRequest('http://localhost:3000/api/inventory?category=Raw%20Materials')
      const response = await GET(request)

      expect(mockInventoryService.getAllItems).toHaveBeenCalledWith({
        category: 'Raw Materials',
        lowStock: undefined
      })
      expect(response.status).toBe(200)
      
      const responseData = JSON.parse(response.body)
      expect(responseData).toEqual([toResponseShape(mockInventoryItem)])
    })

    it('should filter by low stock', async () => {
      const lowStockItems = [
        { ...mockInventoryItem, current_stock: 15, minimum_stock: 20 }
      ]
      mockInventoryService.getAllItems.mockResolvedValue(lowStockItems)

      const request = createMockNextRequest('http://localhost:3000/api/inventory?lowStock=true')
      const response = await GET(request)

      expect(mockInventoryService.getAllItems).toHaveBeenCalledWith({
        category: undefined,
        lowStock: true
      })
      expect(response.status).toBe(200)
      
      const responseData = JSON.parse(response.body)
      expect(responseData).toEqual(lowStockItems.map(toResponseShape))
    })

    it('should filter by both category and low stock', async () => {
      const filteredItems = [mockInventoryItem]
      mockInventoryService.getAllItems.mockResolvedValue(filteredItems)

      const request = createMockNextRequest('http://localhost:3000/api/inventory?category=Raw%20Materials&lowStock=true')
      const response = await GET(request)

      expect(mockInventoryService.getAllItems).toHaveBeenCalledWith({
        category: 'Raw Materials',
        lowStock: true
      })
      expect(response.status).toBe(200)
    })

    it('should handle service errors', async () => {
      const mockError = new Error('Service error')
      mockInventoryService.getAllItems.mockRejectedValue(mockError)

      const request = createMockNextRequest('http://localhost:3000/api/inventory')
      const response = await GET(request)

      expect(response.status).toBe(500)
      
      const responseData = JSON.parse(response.body)
      expect(responseData).toEqual({ error: 'Failed to fetch inventory items' })
    })

    it('should handle lowStock=false parameter', async () => {
      mockInventoryService.getAllItems.mockResolvedValue(mockInventoryItems)

      const request = createMockNextRequest('http://localhost:3000/api/inventory?lowStock=false')
      const response = await GET(request)

      expect(mockInventoryService.getAllItems).toHaveBeenCalledWith({
        category: undefined,
        lowStock: false
      })
    })
  })

  describe('POST /api/inventory', () => {
    it('should create new inventory item with all fields', async () => {
      const newItemData = {
        name: 'Sugar',
        sku: 'SG-001',
        category: 'Ingredients',
        current_stock: 25,
        minimum_stock: 5,
        unit: 'kg',
        cost_per_unit: 1.20,
        supplier: 'Sugar Co.',
        last_restock_date: new Date('2024-01-01T00:00:00Z'),
        expiry_date: new Date('2024-12-31T00:00:00Z')
      }

      const createdItem = { ...newItemData, id: 'new-item-id', created_at: new Date(), updated_at: new Date() }
      mockInventoryService.addItem.mockResolvedValue(createdItem)

      const request = createMockNextRequest('http://localhost:3000/api/inventory', {
        method: 'POST',
        body: JSON.stringify(newItemData),
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await POST(request)

      const expectedData = {
        ...newItemData,
        last_restock_date: newItemData.last_restock_date.toISOString(),
        expiry_date: newItemData.expiry_date.toISOString(),
      };

      expect(mockInventoryService.addItem).toHaveBeenCalledWith(expectedData)
      expect(response.status).toBe(201)
      
      const responseData = JSON.parse(response.body)
      expect(responseData).toEqual(toResponseShape(createdItem))
    })

    it('should create new inventory item with minimal fields', async () => {
      const newItemData = {
        name: 'Basic Item',
        sku: 'BI-001',
        category: 'Basic',
        current_stock: 10,
        minimum_stock: 2,
        unit: 'pieces',
        cost_per_unit: 5.00
      }

      const createdItem = { ...newItemData, id: 'new-item-id', created_at: new Date(), updated_at: new Date() }
      mockInventoryService.addItem.mockResolvedValue(createdItem)

      const request = createMockNextRequest('http://localhost:3000/api/inventory', {
        method: 'POST',
        body: JSON.stringify(newItemData),
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await POST(request)

      expect(mockInventoryService.addItem).toHaveBeenCalledWith(newItemData)
      expect(response.status).toBe(201)
    })

    it('should return 400 when name is missing', async () => {
      const invalidData = {
        sku: 'TEST-001',
        category: 'Test',
        current_stock: 10,
        minimum_stock: 2,
        unit: 'pieces',
        cost_per_unit: 5.00
      }

      const request = createMockNextRequest('http://localhost:3000/api/inventory', {
        method: 'POST',
        body: JSON.stringify(invalidData),
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await POST(request)

      expect(response.status).toBe(400)
      
      const responseData = JSON.parse(response.body)
      expect(responseData).toEqual({ error: 'Missing required fields for inventory item' })
      expect(mockInventoryService.addItem).not.toHaveBeenCalled()
    })

    it('should return 400 when sku is missing', async () => {
      const invalidData = {
        name: 'Test Item',
        category: 'Test',
        current_stock: 10,
        minimum_stock: 2,
        unit: 'pieces',
        cost_per_unit: 5.00
      }

      const request = createMockNextRequest('http://localhost:3000/api/inventory', {
        method: 'POST',
        body: JSON.stringify(invalidData),
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await POST(request)

      expect(response.status).toBe(400)
      
      const responseData = JSON.parse(response.body)
      expect(responseData).toEqual({ error: 'Missing required fields for inventory item' })
    })

    it('should return 400 when category is missing', async () => {
      const invalidData = {
        name: 'Test Item',
        sku: 'TEST-001',
        current_stock: 10,
        minimum_stock: 2,
        unit: 'pieces',
        cost_per_unit: 5.00
      }

      const request = createMockNextRequest('http://localhost:3000/api/inventory', {
        method: 'POST',
        body: JSON.stringify(invalidData),
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await POST(request)

      expect(response.status).toBe(400)
    })

    it('should return 400 when current_stock is missing', async () => {
      const invalidData = {
        name: 'Test Item',
        sku: 'TEST-001',
        category: 'Test',
        minimum_stock: 2,
        unit: 'pieces',
        cost_per_unit: 5.00
      }

      const request = createMockNextRequest('http://localhost:3000/api/inventory', {
        method: 'POST',
        body: JSON.stringify(invalidData),
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await POST(request)

      expect(response.status).toBe(400)
    })

    it('should return 400 when minimum_stock is missing', async () => {
      const invalidData = {
        name: 'Test Item',
        sku: 'TEST-001',
        category: 'Test',
        current_stock: 10,
        unit: 'pieces',
        cost_per_unit: 5.00
      }

      const request = createMockNextRequest('http://localhost:3000/api/inventory', {
        method: 'POST',
        body: JSON.stringify(invalidData),
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await POST(request)

      expect(response.status).toBe(400)
    })

    it('should return 400 when unit is missing', async () => {
      const invalidData = {
        name: 'Test Item',
        sku: 'TEST-001',
        category: 'Test',
        current_stock: 10,
        minimum_stock: 2,
        cost_per_unit: 5.00
      }

      const request = createMockNextRequest('http://localhost:3000/api/inventory', {
        method: 'POST',
        body: JSON.stringify(invalidData),
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await POST(request)

      expect(response.status).toBe(400)
    })

    it('should return 400 when cost_per_unit is missing', async () => {
      const invalidData = {
        name: 'Test Item',
        sku: 'TEST-001',
        category: 'Test',
        current_stock: 10,
        minimum_stock: 2,
        unit: 'pieces'
      }

      const request = createMockNextRequest('http://localhost:3000/api/inventory', {
        method: 'POST',
        body: JSON.stringify(invalidData),
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await POST(request)

      expect(response.status).toBe(400)
    })

    it('should accept current_stock as 0', async () => {
      const newItemData = {
        name: 'Empty Item',
        sku: 'EI-001',
        category: 'Test',
        current_stock: 0,
        minimum_stock: 5,
        unit: 'pieces',
        cost_per_unit: 1.00
      }

      const createdItem = { ...newItemData, id: 'new-item-id', created_at: new Date(), updated_at: new Date() }
      mockInventoryService.addItem.mockResolvedValue(createdItem)

      const request = createMockNextRequest('http://localhost:3000/api/inventory', {
        method: 'POST',
        body: JSON.stringify(newItemData),
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await POST(request)

      expect(response.status).toBe(201)
      expect(mockInventoryService.addItem).toHaveBeenCalledWith(newItemData)
    })

    it('should accept minimum_stock as 0', async () => {
      const newItemData = {
        name: 'No Min Item',
        sku: 'NM-001',
        category: 'Test',
        current_stock: 10,
        minimum_stock: 0,
        unit: 'pieces',
        cost_per_unit: 1.00
      }

      const createdItem = { ...newItemData, id: 'new-item-id', created_at: new Date(), updated_at: new Date() }
      mockInventoryService.addItem.mockResolvedValue(createdItem)

      const request = createMockNextRequest('http://localhost:3000/api/inventory', {
        method: 'POST',
        body: JSON.stringify(newItemData),
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await POST(request)

      expect(response.status).toBe(201)
      expect(mockInventoryService.addItem).toHaveBeenCalledWith(newItemData)
    })

    it('should accept cost_per_unit as 0', async () => {
      const newItemData = {
        name: 'Free Item',
        sku: 'FI-001',
        category: 'Test',
        current_stock: 10,
        minimum_stock: 2,
        unit: 'pieces',
        cost_per_unit: 0
      }

      const createdItem = { ...newItemData, id: 'new-item-id', created_at: new Date(), updated_at: new Date() }
      mockInventoryService.addItem.mockResolvedValue(createdItem)

      const request = createMockNextRequest('http://localhost:3000/api/inventory', {
        method: 'POST',
        body: JSON.stringify(newItemData),
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await POST(request)

      expect(response.status).toBe(201)
      expect(mockInventoryService.addItem).toHaveBeenCalledWith(newItemData)
    })

    it('should handle service errors', async () => {
      const mockError = new Error('Service error')
      mockInventoryService.addItem.mockRejectedValue(mockError)

      const validData = {
        name: 'Test Item',
        sku: 'TEST-001',
        category: 'Test',
        current_stock: 10,
        minimum_stock: 2,
        unit: 'pieces',
        cost_per_unit: 5.00
      }

      const request = createMockNextRequest('http://localhost:3000/api/inventory', {
        method: 'POST',
        body: JSON.stringify(validData),
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await POST(request)

      expect(response.status).toBe(500)
      
      const responseData = JSON.parse(response.body)
      expect(responseData).toEqual({ error: 'Failed to create inventory item' })
    })

    it('should handle invalid JSON', async () => {
      const request = createMockNextRequest('http://localhost:3000/api/inventory', {
        method: 'POST',
        body: 'invalid json',
        headers: { 'Content-Type': 'application/json' }
      })

      // Mock request.json() to throw an error
      request.json = jest.fn().mockRejectedValue(new Error('Invalid JSON'))

      const response = await POST(request)

      expect(response.status).toBe(500)
      
      const responseData = JSON.parse(response.body)
      expect(responseData).toEqual({ error: 'Failed to create inventory item' })
    })

    it('should handle empty request body', async () => {
      const request = createMockNextRequest('http://localhost:3000/api/inventory', {
        method: 'POST',
        body: JSON.stringify({}),
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await POST(request)

      expect(response.status).toBe(400)
      
      const responseData = JSON.parse(response.body)
      expect(responseData).toEqual({ error: 'Missing required fields for inventory item' })
    })
  })
})