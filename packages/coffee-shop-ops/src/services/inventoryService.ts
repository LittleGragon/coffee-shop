import { executeQuery } from '@/lib/db';
import { InventoryItem, InventoryTransaction } from '@/types/models';

export class InventoryService {
  /**
   * Get all inventory items with optional filtering
   */
  async getAllItems(options?: { category?: string; lowStock?: boolean }): Promise<InventoryItem[]> {
    let query = 'SELECT * FROM inventory_items';
    const params: any[] = [];
    
    // Apply filters if provided
    if (options) {
      const conditions: string[] = [];
      
      if (options.category) {
        conditions.push('category = $1');
        params.push(options.category);
      }
      
      if (options.lowStock) {
        const paramIndex = params.length + 1;
        conditions.push(`current_stock <= minimum_stock`);
      }
      
      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }
    }
    
    query += ' ORDER BY category, name';
    
    return executeQuery<InventoryItem>(query, params);
  }
  
  /**
   * Get an inventory item by ID
   */
  async getItemById(id: string): Promise<InventoryItem | null> {
    const items = await executeQuery<InventoryItem>('SELECT * FROM inventory_items WHERE id = $1', [id]);
    return items.length > 0 ? items[0] : null;
  }
  
  /**
   * Add a new inventory item
   */
  async addItem(item: Omit<InventoryItem, 'id' | 'created_at' | 'updated_at'>): Promise<InventoryItem> {
    const { 
      name, sku, category, current_stock, minimum_stock, unit, 
      cost_per_unit, supplier, last_restock_date, expiry_date 
    } = item;
    
    const items = await executeQuery<InventoryItem>(
      `INSERT INTO inventory_items 
        (name, sku, category, current_stock, minimum_stock, unit, cost_per_unit, supplier, last_restock_date, expiry_date) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
       RETURNING *`,
      [
        name, sku, category, current_stock, minimum_stock, unit, 
        cost_per_unit, supplier || null, last_restock_date || null, expiry_date || null
      ]
    );
    
    return items[0];
  }
  
  /**
   * Update an existing inventory item
   */
  async updateItem(id: string, updates: Partial<InventoryItem>): Promise<InventoryItem | null> {
    // First check if the item exists
    const existingItem = await this.getItemById(id);
    if (!existingItem) {
      return null;
    }
    
    // Build the update query dynamically based on provided fields
    const fields: string[] = [];
    const values: any[] = [];
    let paramCounter = 1;
    
    // Add each field that needs to be updated
    for (const [key, value] of Object.entries(updates)) {
      // Skip id, created_at, and updated_at as they shouldn't be updated
      if (['id', 'created_at', 'updated_at'].includes(key)) {
        continue;
      }
      
      fields.push(`${key} = $${paramCounter}`);
      values.push(value);
      paramCounter++;
    }
    
    // Always update the updated_at timestamp
    fields.push(`updated_at = NOW()`);
    
    // Add the id as the last parameter for the WHERE clause
    values.push(id);
    
    const query = `
      UPDATE inventory_items 
      SET ${fields.join(', ')} 
      WHERE id = $${paramCounter} 
      RETURNING *
    `;
    
    const items = await executeQuery<InventoryItem>(query, values);
    return items.length > 0 ? items[0] : null;
  }
  
  /**
   * Delete an inventory item
   */
  async deleteItem(id: string): Promise<boolean> {
    const result = await executeQuery<{ id: string }>('DELETE FROM inventory_items WHERE id = $1 RETURNING id', [id]);
    return result.length > 0;
  }
  
  /**
   * Record an inventory transaction (restock, usage, etc.)
   */
  async recordTransaction(transaction: Omit<InventoryTransaction, 'id' | 'created_at'>): Promise<InventoryTransaction> {
    const { 
      inventory_item_id, type, quantity, unit_cost, 
      total_cost, reason, reference_id, created_by 
    } = transaction;
    
    // Start a transaction
    const client = await global.pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Insert the transaction record
      const transactionResult = await client.query(
        `INSERT INTO inventory_transactions 
          (inventory_item_id, type, quantity, unit_cost, total_cost, reason, reference_id, created_by) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
         RETURNING *`,
        [
          inventory_item_id, type, quantity, unit_cost || null, 
          total_cost || null, reason || null, reference_id || null, created_by
        ]
      );
      
      // Update the inventory item's current stock
      if (type === 'restock') {
        await client.query(
          `UPDATE inventory_items 
           SET current_stock = current_stock + $1, 
               last_restock_date = NOW(),
               updated_at = NOW()
           WHERE id = $2`,
          [quantity, inventory_item_id]
        );
      } else if (type === 'usage' || type === 'waste' || type === 'adjustment') {
        await client.query(
          `UPDATE inventory_items 
           SET current_stock = current_stock - $1,
               updated_at = NOW()
           WHERE id = $2`,
          [quantity, inventory_item_id]
        );
      }
      
      await client.query('COMMIT');
      return transactionResult.rows[0] as InventoryTransaction;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error recording inventory transaction:', error);
      throw error;
    } finally {
      client.release();
    }
  }
  
  /**
   * Get all inventory transactions for an item
   */
  async getItemTransactions(itemId: string): Promise<InventoryTransaction[]> {
    return executeQuery<InventoryTransaction>(
      'SELECT * FROM inventory_transactions WHERE inventory_item_id = $1 ORDER BY created_at DESC',
      [itemId]
    );
  }
  
  /**
   * Get all unique categories
   */
  async getAllCategories(): Promise<string[]> {
    const result = await executeQuery<{ category: string }>(
      'SELECT DISTINCT category FROM inventory_items ORDER BY category'
    );
    return result.map(row => row.category);
  }
  
  /**
   * Get low stock items (where current_stock <= minimum_stock)
   */
  async getLowStockItems(): Promise<InventoryItem[]> {
    return executeQuery<InventoryItem>(
      'SELECT * FROM inventory_items WHERE current_stock <= minimum_stock ORDER BY category, name'
    );
  }
}

export default new InventoryService();