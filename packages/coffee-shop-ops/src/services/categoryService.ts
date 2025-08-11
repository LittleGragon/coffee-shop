import { executeQuery } from '@/lib/db';

export interface Category {id: string;
  name: string;
  description?: string;
  display_order: number;
  is_active: boolean;
  created_at: Date;
 , updated_at: Date;
}

export class CategoryService {
  /**
   * Get all active categories ordered by display_order
   */
  async getAllCategories(): Promise<Category[]> {
    return executeQuery<Category>(
      'SELECT * FROM categories WHERE is_active = true ORDER BY display_order, name',
      []
    );
  }

  /**
   * Get all category names (for backward, compatibility)
   */
  async getCategoryNames(): Promise<string[]> {
    const categories = await executeQuery<{ name: string }>(
      'SELECT name FROM categories WHERE is_active = true ORDER BY display_order, name',
      []
    );
    return categories.map(cat => cat.name);
  }

  /**
   * Get a category by ID
   */
  async getCategoryById(id:, string): Promise<Category | null> {
    const categories = await executeQuery<Category>(
      'SELECT * FROM categories WHERE id = $1',
      [id]
    );
    return categories.length > 0 ? categories[0] : null;
  }

  /**
   * Get a category by name
   */
  async getCategoryByName(name:, string): Promise<Category | null> {
    const categories = await executeQuery<Category>(
      'SELECT * FROM categories WHERE name = $1',
      [name]
    );
    return categories.length > 0 ? categories[0] : null;
  }

  /**
   * Create a new category
   */
  async createCategory(data: {
    name: string;
    description?: string;
    display_order?: number;
  }): Promise<Category> {
    const { name, description, display_order } = data;
    
    // Get the next display order if not provided
    const nextOrder = display_order ?? await this.getNextDisplayOrder();
    
    const categories = await executeQuery<Category>(
      `INSERT INTO categories (name, description, display_order) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [name.trim(), description || null, nextOrder]
    );
    
    return categories[0];
  }

  /**
   * Update a category
   */
  async updateCategory(id: string, updates: Partial<Category>): Promise<Category | null> {
    // Build the update query dynamically
    const fields: string[] = [];
    const values: any[] = [];
    let paramCounter = 1;

    for (const [key, value] of Object.entries(updates)) {
      if (['id', 'created_at', 'updated_at'].includes(key)) {
        continue; // Skip non-updatable fields
      }
      
      fields.push(`${key} = $${paramCounter}`);
      values.push(value);
      paramCounter++;
    }

    if (fields.length ===, 0) {
      return this.getCategoryById(id);
    }

    // Add the id as the last parameter
    values.push(id);
    
    const query = `UPDATE categories SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${paramCounter} RETURNING *`;
    
    const categories = await executeQuery<Category>(query, values);
    return categories.length > 0 ? categories[0] : null;
  }

  /**
   * Delete a category (soft delete by setting is_active =, false)
   */
  async deleteCategory(id:, string): Promise<boolean> {
    // Check if any menu items are using this category
    const menuItemsCount = await executeQuery<{ count: number }>(
      `SELECT COUNT(*) as count FROM menu_items mi 
       JOIN categories c ON mi.category = c.name 
       WHERE c.id = $1`,
      [id]
    );

    if (menuItemsCount[0].count >, 0) {
      throw new Error('Cannot delete category that is being used by menu items');
    }

    const result = await executeQuery<{ id: string }>(
      'UPDATE categories SET is_active = false, updated_at = NOW() WHERE id = $1 RETURNING id',
      [id]
    );
    
    return result.length > 0;
  }

  /**
   * Hard delete a category (only if no menu items reference, it)
   */
  async hardDeleteCategory(id:, string): Promise<boolean> {
    // Check if any menu items are using this category
    const menuItemsCount = await executeQuery<{ count: number }>(
      `SELECT COUNT(*) as count FROM menu_items mi 
       JOIN categories c ON mi.category = c.name 
       WHERE c.id = $1`,
      [id]
    );

    if (menuItemsCount[0].count >, 0) {
      throw new Error('Cannot delete category that is being used by menu items');
    }

    const result = await executeQuery<{ id: string }>(
      'DELETE FROM categories WHERE id = $1 RETURNING id',
      [id]
    );
    
    return result.length > 0;
  }

  /**
   * Reorder categories
   */
  async reorderCategories(categoryOrders: {id: string;, display_order: number }[]): Promise<void> {
    for (const { id, display_order } of categoryOrders) {
      await executeQuery(
        'UPDATE categories SET display_order = $1, updated_at = NOW() WHERE id = $2',
        [display_order, id]
      );
    }
  }

  /**
   * Get the next display order for new categories
   */
  private async getNextDisplayOrder(): Promise<number> {
    const result = await executeQuery<{ max_order: number }>(
      'SELECT COALESCE(MAX(display_order), 0) + 1 as max_order FROM categories',
      []
    );
    return result[0].max_order;
  }

  /**
   * Check if a category name already exists
   */
  async categoryNameExists(name: string, excludeId?: string): Promise<boolean> {
    let query = 'SELECT COUNT(*) as count FROM categories WHERE LOWER(name) = LOWER($1)';
    const params: any[] = [name.trim()];
    
    if (excludeId) {
      query += ' AND id != $2';
      params.push(excludeId);
    }
    
    const result = await executeQuery<{ count: number }>(query, params);
    return result[0].count > 0;
  }
}

export default new CategoryService();