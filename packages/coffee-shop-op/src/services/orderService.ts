import { executeQuery } from '@/lib/db';
import { Order, OrderItem } from '@/types/models';

export class OrderService {
  /**
   * Get all orders with optional filtering
   */
  async getAllOrders(options?: { status?: string; userId?: string }): Promise<Order[]> {
    let query = 'SELECT * FROM orders';
    const params: any[] = [];
    
    // Apply filters if provided
    if (options) {
      const conditions: string[] = [];
      
      if (options.status) {
        conditions.push('status = $1');
        params.push(options.status);
      }
      
      if (options.userId) {
        const paramIndex = params.length + 1;
        conditions.push(`user_id = $${paramIndex}`);
        params.push(options.userId);
      }
      
      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }
    }
    
    query += ' ORDER BY created_at DESC';
    
    return executeQuery<Order>(query, params);
  }
  
  /**
   * Get an order by ID
   */
  async getOrderById(id: string): Promise<Order | null> {
    const orders = await executeQuery<Order>('SELECT * FROM orders WHERE id = $1', [id]);
    return orders.length > 0 ? orders[0] : null;
  }
  
  /**
   * Get order items for an order
   */
  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    return executeQuery<OrderItem>(
      'SELECT * FROM order_items WHERE order_id = $1',
      [orderId]
    );
  }
  
  /**
   * Create a new order with items
   */
  async createOrder(
    orderData: Omit<Order, 'id' | 'created_at'>,
    orderItems: Array<Omit<OrderItem, 'id' | 'order_id'>>
  ): Promise<Order> {
    // Start a transaction
    const client = await global.pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Insert the order
      const { user_id, total_amount, status, order_type, customization } = orderData;
      
      const orderResult = await client.query(
        `INSERT INTO orders (user_id, total_amount, status, order_type, customization) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING *`,
        [user_id || null, total_amount, status || 'pending', order_type || 'standard', customization || null]
      );
      
      const order = orderResult.rows[0] as Order;
      
      // Insert order items
      for (const item of orderItems) {
        await client.query(
          `INSERT INTO order_items (order_id, menu_item_id, quantity, price_at_time) 
           VALUES ($1, $2, $3, $4)`,
          [order.id, item.menu_item_id, item.quantity, item.price_at_time]
        );
      }
      
      await client.query('COMMIT');
      return order;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error creating order:', error);
      throw error;
    } finally {
      client.release();
    }
  }
  
  /**
   * Update an order's status
   */
  async updateOrderStatus(id: string, status: string): Promise<Order | null> {
    const orders = await executeQuery<Order>(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    
    return orders.length > 0 ? orders[0] : null;
  }
  
  /**
   * Get orders by status
   */
  async getOrdersByStatus(status: string): Promise<Order[]> {
    return executeQuery<Order>(
      'SELECT * FROM orders WHERE status = $1 ORDER BY created_at DESC',
      [status]
    );
  }
  
  /**
   * Get orders for a specific user
   */
  async getUserOrders(userId: string): Promise<Order[]> {
    return executeQuery<Order>(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
  }
  
  /**
   * Get order count by status
   */
  async getOrderCountByStatus(): Promise<{ status: string; count: number }[]> {
    return executeQuery<{ status: string; count: number }>(
      'SELECT status, COUNT(*) as count FROM orders GROUP BY status'
    );
  }
}

export default new OrderService();