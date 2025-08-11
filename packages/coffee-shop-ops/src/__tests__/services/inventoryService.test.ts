import inventoryService from '@/services/inventoryService';
import { executeQuery } from '@/lib/db';
import pool from '@/lib/db'; // Import the actual pool to mock its methods
import { InventoryItem,, InventoryTransaction } from '@/types/models';

// Mock the database modules
jest.mock('@/lib/db', () => ({
  __esModule: true,
  ...jest.requireActual('@/lib/db'), // Keep actual implementations
  executeQuery: jest.fn(), // Mock executeQuery
  default: { // Mock the default export (pool)
    connect: jest.fn(),
  },
}));

const mockExecuteQuery = executeQuery as jest.Mock;
const mockPoolConnect = pool.connect as jest.Mock;

describe('InventoryService', () => {
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
    updated_at: new Date('2024-01-01T00:00:00Z'),
  };

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
      updated_at: new Date('2024-01-01T00:00:00Z'),
    },
  ];

  const mockTransaction: InventoryTransaction = {
    id: 'txn-1',
    inventory_item_id: 'inv-item-1',
    type: 'restock',
    quantity: 50,
    unit_cost: 15.50,
    total_cost: 775.00,
    reason: 'Regular restock',
    reference_id: 'PO-001',
    created_by: 'admin',
    created_at: new Date('2024-01-01T00:00:00Z'),
  };
  
  // Create a mock client for transaction tests
  const mockClient = {
    query: jest.fn(),
    release: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Whenever pool.connect is called in a test, it returns our mock client
    mockPoolConnect.mockResolvedValue(mockClient);
  });

  // ... (keep all other describe blocks for getAllItems, getItemById, etc., as they are)
  describe('getAllItems', () => {
    it('should get all inventory items without filters', async () => {
      mockExecuteQuery.mockResolvedValue(mockInventoryItems)

      const result = await inventoryService.getAllItems()

      expect(mockExecuteQuery).toHaveBeenCalledWith(
        'SELECT * FROM inventory_items ORDER BY category, name',
        []
      )
      expect(result).toEqual(mockInventoryItems)
    })

    it('should filter by category', async () => {
      mockExecuteQuery.mockResolvedValue([mockInventoryItem])

      const result = await inventoryService.getAllItems({ category: 'Raw Materials' })

      expect(mockExecuteQuery).toHaveBeenCalledWith(
        'SELECT * FROM inventory_items WHERE category = $1 ORDER BY category, name',
        ['Raw Materials']
      )
      expect(result).toEqual([mockInventoryItem])
    })

    it('should filter by low stock', async () => {
      mockExecuteQuery.mockResolvedValue(mockInventoryItems)

      const result = await inventoryService.getAllItems({ lowStock: true })

      expect(mockExecuteQuery).toHaveBeenCalledWith(
        'SELECT * FROM inventory_items WHERE current_stock <= minimum_stock ORDER BY category, name',
        []
      )
      expect(result).toEqual(mockInventoryItems)
    })

    it('should filter by both category and low stock', async () => {
      mockExecuteQuery.mockResolvedValue([mockInventoryItem])

      const result = await inventoryService.getAllItems({ 
        category: 'Raw Materials', 
        lowStock: true 
      })

      expect(mockExecuteQuery).toHaveBeenCalledWith(
        'SELECT * FROM inventory_items WHERE category = $1 AND current_stock <= minimum_stock ORDER BY category, name',
        ['Raw Materials']
      )
      expect(result).toEqual([mockInventoryItem])
    })

    it('should handle database errors', async () => {
      const mockError = new Error('Database error')
      mockExecuteQuery.mockRejectedValue(mockError)

      await expect(inventoryService.getAllItems()).rejects.toThrow('Database error')
    })
  })

  describe('getItemById', () => {
    it('should return inventory item when found', async () => {
      mockExecuteQuery.mockResolvedValue([mockInventoryItem])

      const result = await inventoryService.getItemById('inv-item-1')

      expect(mockExecuteQuery).toHaveBeenCalledWith(
        'SELECT * FROM inventory_items WHERE id = $1',
        ['inv-item-1']
      )
      expect(result).toEqual(mockInventoryItem)
    })

    it('should return null when item not found', async () => {
      mockExecuteQuery.mockResolvedValue([])

      const result = await inventoryService.getItemById('non-existent')

      expect(result).toBeNull()
    })

    it('should handle database errors', async () => {
      const mockError = new Error('Database error')
      mockExecuteQuery.mockRejectedValue(mockError)

      await expect(inventoryService.getItemById('inv-item-1')).rejects.toThrow('Database error')
    })
  })

  describe('addItem', () => {
    it('should add new inventory item with all fields', async () => {
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

      const expectedItem = { ...newItemData, id: 'new-item-id', created_at: new Date(), updated_at: new Date() }
      mockExecuteQuery.mockResolvedValue([expectedItem])

      const result = await inventoryService.addItem(newItemData)

      expect(mockExecuteQuery).toHaveBeenCalledWith(
        'INSERT INTO inventory_items (name, sku, category, current_stock, minimum_stock, unit, cost_per_unit, supplier, last_restock_date, expiry_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
        ['Sugar', 'SG-001', 'Ingredients', 25, 5, 'kg', 1.20, 'Sugar Co.', newItemData.last_restock_date, newItemData.expiry_date]
      )
      expect(result).toEqual(expectedItem)
    })

    it('should add new inventory item with minimal fields', async () => {
      const newItemData = {
        name: 'Basic Item',
        sku: 'BI-001',
        category: 'Basic',
        current_stock: 10,
        minimum_stock: 2,
        unit: 'pieces',
        cost_per_unit: 5.00
      }

      const expectedItem = { ...newItemData, id: 'new-item-id', created_at: new Date(), updated_at: new Date() }
      mockExecuteQuery.mockResolvedValue([expectedItem])

      const result = await inventoryService.addItem(newItemData)

      expect(mockExecuteQuery).toHaveBeenCalledWith(
        'INSERT INTO inventory_items (name, sku, category, current_stock, minimum_stock, unit, cost_per_unit, supplier, last_restock_date, expiry_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
        ['Basic Item', 'BI-001', 'Basic', 10, 2, 'pieces', 5.00, null, null, null]
      )
      expect(result).toEqual(expectedItem)
    })

    it('should handle database errors', async () => {
      const mockError = new Error('Insert failed')
      mockExecuteQuery.mockRejectedValue(mockError)

      const newItemData = {
        name: 'Test Item',
        sku: 'TI-001',
        category: 'Test',
        current_stock: 1,
        minimum_stock: 1,
        unit: 'piece',
        cost_per_unit: 1.00
      }

      await expect(inventoryService.addItem(newItemData)).rejects.toThrow('Insert failed')
    })
  })

  describe('updateItem', () => {
    it('should update existing inventory item', async () => {
      // Mock getItemById to return existing item
      mockExecuteQuery
        .mockResolvedValueOnce([mockInventoryItem]) // getItemById call
        .mockResolvedValueOnce([{ ...mockInventoryItem, current_stock: 150 }]) // update call

      const updates = { current_stock: 150, cost_per_unit: 16.00 }
      const result = await inventoryService.updateItem('inv-item-1', updates)

      expect(mockExecuteQuery).toHaveBeenCalledWith(
        'SELECT * FROM inventory_items WHERE id = $1',
        ['inv-item-1']
      )
      expect(mockExecuteQuery).toHaveBeenCalledWith(
        'UPDATE inventory_items SET current_stock = $1, cost_per_unit = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
        [150, 16.00, 'inv-item-1']
      )
      expect(result).toEqual({ ...mockInventoryItem, current_stock: 150 })
    })

    it('should return null when item does not exist', async () => {
      mockExecuteQuery.mockResolvedValueOnce([]) // getItemById returns empty

      const result = await inventoryService.updateItem('non-existent', { current_stock: 100 })

      expect(result).toBeNull()
    })

    it('should skip protected fields in updates', async () => {
      mockExecuteQuery
        .mockResolvedValueOnce([mockInventoryItem])
        .mockResolvedValueOnce([mockInventoryItem])

      const updates = { 
        current_stock: 200,
        id: 'should-be-ignored',
        created_at: new Date(),
        updated_at: new Date()
      }

      await inventoryService.updateItem('inv-item-1', updates)

      expect(mockExecuteQuery).toHaveBeenCalledWith(
        'UPDATE inventory_items SET current_stock = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
        [200, 'inv-item-1']
      )
    })

    it('should handle database errors', async () => {
      const mockError = new Error('Update failed')
      mockExecuteQuery
        .mockResolvedValueOnce([mockInventoryItem])
        .mockRejectedValueOnce(mockError)

      await expect(inventoryService.updateItem('inv-item-1', { current_stock: 100 })).rejects.toThrow('Update failed')
    })
  })

  describe('deleteItem', () => {
    it('should delete existing item and return true', async () => {
      mockExecuteQuery.mockResolvedValue([{ id: 'inv-item-1' }])

      const result = await inventoryService.deleteItem('inv-item-1')

      expect(mockExecuteQuery).toHaveBeenCalledWith(
        'DELETE FROM inventory_items WHERE id = $1 RETURNING id',
        ['inv-item-1']
      )
      expect(result).toBe(true)
    })

    it('should return false when item does not exist', async () => {
      mockExecuteQuery.mockResolvedValue([])

      const result = await inventoryService.deleteItem('non-existent')

      expect(result).toBe(false)
    })

    it('should handle database errors', async () => {
      const mockError = new Error('Delete failed')
      mockExecuteQuery.mockRejectedValue(mockError)

      await expect(inventoryService.deleteItem('inv-item-1')).rejects.toThrow('Delete failed')
    })
  })

  describe('recordTransaction', () => {
    it('should record restock transaction and update stock', async () => {
      const transactionData = {
        inventory_item_id: 'inv-item-1',
        type: 'restock',
        quantity: 50,
        unit_cost: 15.50,
        total_cost: 775.00,
        reason: 'Regular restock',
        reference_id: 'PO-001',
        created_by: 'admin',
      };

      // Chain the mock query results
      mockClient.query
        .mockResolvedValueOnce(undefined) // BEGIN
        .mockResolvedValueOnce({ rows: [mockTransaction] }) // INSERT
        .mockResolvedValueOnce(undefined) // UPDATE
        .mockResolvedValueOnce(undefined); // COMMIT

      const result = await inventoryService.recordTransaction(transactionData);

      expect(pool.connect).toHaveBeenCalledTimes(1);
      expect(mockClient.query).toHaveBeenCalledWith('BEGIN');
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO inventory_transactions'),
        expect.any(Array)
      );
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE inventory_items'),
        expect.any(Array)
      );
      expect(mockClient.query).toHaveBeenCalledWith('COMMIT');
      expect(mockClient.release).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockTransaction);
    });

    it('should record usage transaction and decrease stock', async () => {
      const transactionData = {
        inventory_item_id: 'inv-item-1',
        type: 'usage',
        quantity: 10,
        reason: 'Coffee production',
        created_by: 'barista',
      };
      
      mockClient.query
        .mockResolvedValueOnce(undefined) // BEGIN
        .mockResolvedValueOnce({ rows: [{ ...mockTransaction, type: 'usage' }] }) // INSERT
        .mockResolvedValueOnce(undefined) // UPDATE
        .mockResolvedValueOnce(undefined); // COMMIT

      await inventoryService.recordTransaction(transactionData);

      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE inventory_items SET current_stock = current_stock - $1'),
        [10, 'inv-item-1']
      );
    });

    it('should rollback on error', async () => {
      const transactionData = {
        inventory_item_id: 'inv-item-1',
        type: 'restock',
        quantity: 50,
        created_by: 'admin',
      };
      const mockError = new Error('Transaction failed');
      
      mockClient.query
        .mockResolvedValueOnce(undefined) // BEGIN
        .mockRejectedValueOnce(mockError); // INSERT fails

      await expect(inventoryService.recordTransaction(transactionData)).rejects.toThrow('Transaction failed');
      
      expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK');
      expect(mockClient.release).toHaveBeenCalledTimes(1);
    });
  });

  describe('getItemTransactions', () => {
    it('should return transactions for specific item', async () => {
      mockExecuteQuery.mockResolvedValue([mockTransaction])

      const result = await inventoryService.getItemTransactions('inv-item-1')

      expect(mockExecuteQuery).toHaveBeenCalledWith(
        'SELECT * FROM inventory_transactions WHERE inventory_item_id = $1 ORDER BY created_at DESC',
        ['inv-item-1']
      )
      expect(result).toEqual([mockTransaction])
    })

    it('should handle database errors', async () => {
      const mockError = new Error('Transactions fetch failed')
      mockExecuteQuery.mockRejectedValue(mockError)

      await expect(inventoryService.getItemTransactions('inv-item-1')).rejects.toThrow('Transactions fetch failed')
    })
  })

  describe('getAllCategories', () => {
    it('should return all unique categories', async () => {
      const mockCategories = [
        { category: 'Raw Materials' },
        { category: 'Dairy' },
        { category: 'Ingredients' }
      ]
      mockExecuteQuery.mockResolvedValue(mockCategories)

      const result = await inventoryService.getAllCategories()

      expect(mockExecuteQuery).toHaveBeenCalledWith(
        'SELECT DISTINCT category FROM inventory_items ORDER BY category'
      )
      expect(result).toEqual(['Raw Materials', 'Dairy', 'Ingredients'])
    })

    it('should handle empty categories', async () => {
      mockExecuteQuery.mockResolvedValue([])

      const result = await inventoryService.getAllCategories()

      expect(result).toEqual([])
    })

    it('should handle database errors', async () => {
      const mockError = new Error('Categories fetch failed')
      mockExecuteQuery.mockRejectedValue(mockError)

      await expect(inventoryService.getAllCategories()).rejects.toThrow('Categories fetch failed')
    })
  })

  describe('getLowStockItems', () => {
    it('should return items with low stock', async () => {
      const lowStockItems = [
        { ...mockInventoryItem, current_stock: 15, minimum_stock: 20 }
      ]
      mockExecuteQuery.mockResolvedValue(lowStockItems)

      const result = await inventoryService.getLowStockItems()

      expect(mockExecuteQuery).toHaveBeenCalledWith(
        'SELECT * FROM inventory_items WHERE current_stock <= minimum_stock ORDER BY category, name'
      )
      expect(result).toEqual(lowStockItems)
    })

    it('should handle database errors', async () => {
      const mockError = new Error('Low stock fetch failed')
      mockExecuteQuery.mockRejectedValue(mockError)

      await expect(inventoryService.getLowStockItems()).rejects.toThrow('Low stock fetch failed')
    })
  })
});