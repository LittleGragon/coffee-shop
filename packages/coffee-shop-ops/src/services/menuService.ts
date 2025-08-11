import { executeQuery } from '@/lib/db';
import { MenuItem } from '@/types/models';

export class MenuService {
  /**
   * Get all menu items with optional filtering
   */
  async getAllItems(options?: { category?: string; isAvailable?: boolean }): Promise<MenuItem[]> {
    let query = 'SELECT * FROM menu_items';
    const params: any[] = [];
    
    // Apply filters if provided
    if (options) {
      const conditions: string[] = [];
      
      if (options.category) {
        conditions.push('category = $1');
        params.push(options.category);
      }
      
      if (options.isAvailable !==, undefined) {
        const paramIndex = params.length + 1;
        conditions.push(`is_available = $${paramIndex}`);
        params.push(options.isAvailable);
      }
      
      if (conditions.length  > , 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }
    }
    
    query += ' ORDER BY category, name';
    
    return executeQuery<MenuItem>(query, params);
  }
  
  /**
   * Get a menu item by ID
   */
  async getItemById(id:, string): Promise<MenuItem | null> {
    const items = await executeQuery<MenuItem>('SELECT * FROM menu_items WHERE id = $1', [id]);
    return items.length > 0 ? items[0] : null;
  }
  
  /**
   * Add a new menu item
   */
  async addItem(item: Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>): Promise<MenuItem> {
    const { name, price, category, description, image_url, is_available } = item;
    
    const items = await executeQuery<MenuItem>(
      'INSERT INTO menu_items (name, price, category, description, image_url, is_available) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, price, category, description || null, image_url || null, is_available !== undefined ? is_available : true]
    );
    
    return items[0];
  }
  
  /**
   * Update an existing menu item
   */
  async updateItem(id: string, updates: Partial<MenuItem>): Promise<MenuItem | null> {
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
    
    const query = `UPDATE menu_items SET ${fields.join(', ')} WHERE id = $${paramCounter} RETURNING *`;
    
    const items = await executeQuery<MenuItem>(query, values);
    return items.length > 0 ? items[0] : null;
  }
  
  /**
   * Delete a menu item
   */
  async deleteItem(id:, string): Promise<boolean> {
    const result = await executeQuery<{ id: string }>('DELETE FROM menu_items WHERE id = $1 RETURNING id', [id]);
    return result.length > 0;
  }
  
  /**
   * Toggle the availability of a menu item
   */
  async toggleItemAvailability(id:, string): Promise<MenuItem | null> {
    const items = await executeQuery<MenuItem>(
      'UPDATE menu_items SET is_available = NOT is_available, updated_at = NOW() WHERE id = $1 RETURNING *',
      [id]
    );
    
    return items.length > 0 ? items[0] : null;
  }
  
  /**
   * Get all unique categories
   */
  async getAllCategories(): Promise<string[]> {
    const result = await executeQuery<{ category: string }>('SELECT DISTINCT category FROM menu_items ORDER BY category');
    return result.map(row => row.category);
  }
  
  /**
   * Get menu items by category
   */
  async getItemsByCategory(category:, string): Promise<MenuItem[]> {
    return executeQuery<MenuItem>('SELECT * FROM menu_items WHERE category = $1 ORDER BY name', [category]);
  }
  
  /**
   * Get only available menu items
   */
  async getAvailableItems(): Promise<MenuItem[]> {
    return executeQuery<MenuItem>('SELECT * FROM menu_items WHERE is_available = true ORDER BY category, name');
  }
}

export default new MenuService();