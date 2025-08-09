import menuService from '@/services/menuService'
import { executeQuery } from '@/lib/db'
import { MenuItem } from '@/types/models'

// Mock the database
jest.mock('@/lib/db')
const mockExecuteQuery = executeQuery as jest.MockedFunction<typeof executeQuery>

describe('MenuService', () => {
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

  describe('getAllItems', () => {
    it('should get all menu items without filters', async () => {
      mockExecuteQuery.mockResolvedValue(mockMenuItems)

      const result = await menuService.getAllItems()

      expect(mockExecuteQuery).toHaveBeenCalledWith(
        'SELECT * FROM menu_items ORDER BY category, name',
        []
      )
      expect(result).toEqual(mockMenuItems)
    })

    it('should filter by category', async () => {
      mockExecuteQuery.mockResolvedValue([mockMenuItem])

      const result = await menuService.getAllItems({ category: 'Coffee' })

      expect(mockExecuteQuery).toHaveBeenCalledWith(
        'SELECT * FROM menu_items WHERE category = $1 ORDER BY category, name',
        ['Coffee']
      )
      expect(result).toEqual([mockMenuItem])
    })

    it('should filter by availability', async () => {
      mockExecuteQuery.mockResolvedValue(mockMenuItems)

      const result = await menuService.getAllItems({ isAvailable: true })

      expect(mockExecuteQuery).toHaveBeenCalledWith(
        'SELECT * FROM menu_items WHERE is_available = $1 ORDER BY category, name',
        [true]
      )
      expect(result).toEqual(mockMenuItems)
    })

    it('should filter by both category and availability', async () => {
      mockExecuteQuery.mockResolvedValue([mockMenuItem])

      const result = await menuService.getAllItems({ 
        category: 'Coffee', 
        isAvailable: true 
      })

      expect(mockExecuteQuery).toHaveBeenCalledWith(
        'SELECT * FROM menu_items WHERE category = $1 AND is_available = $2 ORDER BY category, name',
        ['Coffee', true]
      )
      expect(result).toEqual([mockMenuItem])
    })

    it('should handle database errors', async () => {
      const mockError = new Error('Database error')
      mockExecuteQuery.mockRejectedValue(mockError)

      await expect(menuService.getAllItems()).rejects.toThrow('Database error')
    })
  })

  describe('getItemById', () => {
    it('should return menu item when found', async () => {
      mockExecuteQuery.mockResolvedValue([mockMenuItem])

      const result = await menuService.getItemById('menu-item-1')

      expect(mockExecuteQuery).toHaveBeenCalledWith(
        'SELECT * FROM menu_items WHERE id = $1',
        ['menu-item-1']
      )
      expect(result).toEqual(mockMenuItem)
    })

    it('should return null when item not found', async () => {
      mockExecuteQuery.mockResolvedValue([])

      const result = await menuService.getItemById('non-existent')

      expect(result).toBeNull()
    })

    it('should handle database errors', async () => {
      const mockError = new Error('Database error')
      mockExecuteQuery.mockRejectedValue(mockError)

      await expect(menuService.getItemById('menu-item-1')).rejects.toThrow('Database error')
    })
  })

  describe('addItem', () => {
    it('should add new menu item with all fields', async () => {
      const newItemData = {
        name: 'Cappuccino',
        price: 30,
        category: 'Coffee',
        description: 'Espresso with steamed milk foam',
        image_url: '/images/cappuccino.jpg',
        is_available: true
      }

      const expectedItem = { ...newItemData, id: 'new-item-id', created_at: new Date(), updated_at: new Date() }
      mockExecuteQuery.mockResolvedValue([expectedItem])

      const result = await menuService.addItem(newItemData)

      expect(mockExecuteQuery).toHaveBeenCalledWith(
        'INSERT INTO menu_items (name, price, category, description, image_url, is_available) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        ['Cappuccino', 30, 'Coffee', 'Espresso with steamed milk foam', '/images/cappuccino.jpg', true]
      )
      expect(result).toEqual(expectedItem)
    })

    it('should add new menu item with minimal fields', async () => {
      const newItemData = {
        name: 'Simple Coffee',
        price: 20,
        category: 'Coffee'
      }

      const expectedItem = { ...newItemData, id: 'new-item-id', created_at: new Date(), updated_at: new Date() }
      mockExecuteQuery.mockResolvedValue([expectedItem])

      const result = await menuService.addItem(newItemData)

      expect(mockExecuteQuery).toHaveBeenCalledWith(
        'INSERT INTO menu_items (name, price, category, description, image_url, is_available) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        ['Simple Coffee', 20, 'Coffee', null, null, true]
      )
      expect(result).toEqual(expectedItem)
    })

    it('should handle database errors', async () => {
      const mockError = new Error('Insert failed')
      mockExecuteQuery.mockRejectedValue(mockError)

      const newItemData = {
        name: 'Test Item',
        price: 25,
        category: 'Test'
      }

      await expect(menuService.addItem(newItemData)).rejects.toThrow('Insert failed')
    })
  })

  describe('updateItem', () => {
    it('should update existing menu item', async () => {
      // Mock getItemById to return existing item
      mockExecuteQuery
        .mockResolvedValueOnce([mockMenuItem]) // getItemById call
        .mockResolvedValueOnce([{ ...mockMenuItem, name: 'Updated Americano' }]) // update call

      const updates = { name: 'Updated Americano', price: 30 }
      const result = await menuService.updateItem('menu-item-1', updates)

      expect(mockExecuteQuery).toHaveBeenCalledWith(
        'SELECT * FROM menu_items WHERE id = $1',
        ['menu-item-1']
      )
      expect(mockExecuteQuery).toHaveBeenCalledWith(
        `UPDATE menu_items SET name = $1, price = $2, updated_at = NOW() WHERE id = $3 RETURNING *`,
        ['Updated Americano', 30, 'menu-item-1']
      )
      expect(result).toEqual({ ...mockMenuItem, name: 'Updated Americano' })
    })

    it('should return null when item does not exist', async () => {
      mockExecuteQuery.mockResolvedValueOnce([]) // getItemById returns empty

      const result = await menuService.updateItem('non-existent', { name: 'Test' })

      expect(result).toBeNull()
    })

    it('should skip protected fields in updates', async () => {
      mockExecuteQuery
        .mockResolvedValueOnce([mockMenuItem])
        .mockResolvedValueOnce([mockMenuItem])

      const updates = { 
        name: 'Updated Name',
        id: 'should-be-ignored',
        created_at: new Date(),
        updated_at: new Date()
      }

      await menuService.updateItem('menu-item-1', updates)

      expect(mockExecuteQuery).toHaveBeenCalledWith(
        `UPDATE menu_items SET name = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
        ['Updated Name', 'menu-item-1']
      )
    })

    it('should handle database errors', async () => {
      const mockError = new Error('Update failed')
      mockExecuteQuery
        .mockResolvedValueOnce([mockMenuItem])
        .mockRejectedValueOnce(mockError)

      await expect(menuService.updateItem('menu-item-1', { name: 'Test' })).rejects.toThrow('Update failed')
    })
  })

  describe('deleteItem', () => {
    it('should delete existing item and return true', async () => {
      mockExecuteQuery.mockResolvedValue([{ id: 'menu-item-1' }])

      const result = await menuService.deleteItem('menu-item-1')

      expect(mockExecuteQuery).toHaveBeenCalledWith(
        'DELETE FROM menu_items WHERE id = $1 RETURNING id',
        ['menu-item-1']
      )
      expect(result).toBe(true)
    })

    it('should return false when item does not exist', async () => {
      mockExecuteQuery.mockResolvedValue([])

      const result = await menuService.deleteItem('non-existent')

      expect(result).toBe(false)
    })

    it('should handle database errors', async () => {
      const mockError = new Error('Delete failed')
      mockExecuteQuery.mockRejectedValue(mockError)

      await expect(menuService.deleteItem('menu-item-1')).rejects.toThrow('Delete failed')
    })
  })

  describe('toggleItemAvailability', () => {
    it('should toggle availability and return updated item', async () => {
      const toggledItem = { ...mockMenuItem, is_available: false }
      mockExecuteQuery.mockResolvedValue([toggledItem])

      const result = await menuService.toggleItemAvailability('menu-item-1')

      expect(mockExecuteQuery).toHaveBeenCalledWith(
        'UPDATE menu_items SET is_available = NOT is_available, updated_at = NOW() WHERE id = $1 RETURNING *',
        ['menu-item-1']
      )
      expect(result).toEqual(toggledItem)
    })

    it('should return null when item does not exist', async () => {
      mockExecuteQuery.mockResolvedValue([])

      const result = await menuService.toggleItemAvailability('non-existent')

      expect(result).toBeNull()
    })

    it('should handle database errors', async () => {
      const mockError = new Error('Toggle failed')
      mockExecuteQuery.mockRejectedValue(mockError)

      await expect(menuService.toggleItemAvailability('menu-item-1')).rejects.toThrow('Toggle failed')
    })
  })

  describe('getAllCategories', () => {
    it('should return all unique categories', async () => {
      const mockCategories = [
        { category: 'Coffee' },
        { category: 'Tea' },
        { category: 'Pastry' }
      ]
      mockExecuteQuery.mockResolvedValue(mockCategories)

      const result = await menuService.getAllCategories()

      expect(mockExecuteQuery).toHaveBeenCalledWith(
        'SELECT DISTINCT category FROM menu_items ORDER BY category'
      )
      expect(result).toEqual(['Coffee', 'Tea', 'Pastry'])
    })

    it('should handle empty categories', async () => {
      mockExecuteQuery.mockResolvedValue([])

      const result = await menuService.getAllCategories()

      expect(result).toEqual([])
    })

    it('should handle database errors', async () => {
      const mockError = new Error('Categories fetch failed')
      mockExecuteQuery.mockRejectedValue(mockError)

      await expect(menuService.getAllCategories()).rejects.toThrow('Categories fetch failed')
    })
  })

  describe('getItemsByCategory', () => {
    it('should return items for specific category', async () => {
      mockExecuteQuery.mockResolvedValue(mockMenuItems)

      const result = await menuService.getItemsByCategory('Coffee')

      expect(mockExecuteQuery).toHaveBeenCalledWith(
        'SELECT * FROM menu_items WHERE category = $1 ORDER BY name',
        ['Coffee']
      )
      expect(result).toEqual(mockMenuItems)
    })

    it('should handle database errors', async () => {
      const mockError = new Error('Category fetch failed')
      mockExecuteQuery.mockRejectedValue(mockError)

      await expect(menuService.getItemsByCategory('Coffee')).rejects.toThrow('Category fetch failed')
    })
  })

  describe('getAvailableItems', () => {
    it('should return only available items', async () => {
      mockExecuteQuery.mockResolvedValue(mockMenuItems)

      const result = await menuService.getAvailableItems()

      expect(mockExecuteQuery).toHaveBeenCalledWith(
        'SELECT * FROM menu_items WHERE is_available = true ORDER BY category, name'
      )
      expect(result).toEqual(mockMenuItems)
    })

    it('should handle database errors', async () => {
      const mockError = new Error('Available items fetch failed')
      mockExecuteQuery.mockRejectedValue(mockError)

      await expect(menuService.getAvailableItems()).rejects.toThrow('Available items fetch failed')
    })
  })
})