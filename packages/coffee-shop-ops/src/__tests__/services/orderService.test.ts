import OrderService from '@/services/orderService';
import { executeQuery } from '@/lib/db';

// Mock the database module
jest.mock('@/lib/db');
const mockExecuteQuery = executeQuery as jest.MockedFunction<typeof executeQuery>;

describe('OrderService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createOrder', () => {
    const mockOrderData = {
      user_id: 'user_123',
      total_amount: 15.50,
      status: 'pending',
      order_type: 'takeout',
      customization: JSON.stringify({ notes: 'Extra hot' })
    };

    const mockOrderItems = [
      { menu_item_id: 1, quantity: 2, price_at_time: 4.50 },
      { menu_item_id: 2, quantity: 1, price_at_time: 6.50 }
    ];

    const mockCreatedOrder = {
      id: 'order_456',
      ...mockOrderData,
      created_at: new Date().toISOString()
    };

    it('should create an order successfully', async () => {
      // Setup mocks
      mockExecuteQuery
        .mockResolvedValueOnce([mockCreatedOrder]) // Order creation
        .mockResolvedValue([]); // Order items creation

      // Execute
      const result = await OrderService.createOrder(mockOrderData, mockOrderItems);

      // Verify
      expect(mockExecuteQuery).toHaveBeenCalledTimes(3); // 1 order + 2 items
      
      // Verify order creation call
      expect(mockExecuteQuery).toHaveBeenNthCalledWith(1,
        expect.stringContaining('INSERT INTO orders'),
        ['user_123', 15.50, 'pending', 'takeout', mockOrderData.customization]
      );

      // Verify order items creation calls
      expect(mockExecuteQuery).toHaveBeenNthCalledWith(2,
        expect.stringContaining('INSERT INTO order_items'),
        ['order_456', 1, 2, 4.50]
      );

      expect(mockExecuteQuery).toHaveBeenNthCalledWith(3,
        expect.stringContaining('INSERT INTO order_items'),
        ['order_456', 2, 1, 6.50]
      );

      expect(result).toEqual(mockCreatedOrder);
    });

    it('should handle database errors', async () => {
      // Setup mocks
      mockExecuteQuery.mockRejectedValue(new Error('Database connection failed'));

      // Execute & Verify
      await expect(OrderService.createOrder(mockOrderData, mockOrderItems))
        .rejects.toThrow('Failed to create order: Database connection failed');
    });

    it('should use default values for optional fields', async () => {
      // Setup mocks
      const orderDataWithDefaults = {
        user_id: 'user_123',
        total_amount: 10.00
      };

      mockExecuteQuery
        .mockResolvedValueOnce([{ ...mockCreatedOrder, ...orderDataWithDefaults }])
        .mockResolvedValue([]);

      // Execute
      await OrderService.createOrder(orderDataWithDefaults, mockOrderItems);

      // Verify defaults are applied
      expect(mockExecuteQuery).toHaveBeenNthCalledWith(1,
        expect.stringContaining('INSERT INTO orders'),
        ['user_123', 10.00, 'pending', 'takeout', null]
      );
    });

    it('should handle null user_id', async () => {
      // Setup mocks
      const orderDataWithNullUser = {
        ...mockOrderData,
        user_id: undefined
      };

      mockExecuteQuery
        .mockResolvedValueOnce([mockCreatedOrder])
        .mockResolvedValue([]);

      // Execute
      await OrderService.createOrder(orderDataWithNullUser, mockOrderItems);

      // Verify null is passed for undefined user_id
      expect(mockExecuteQuery).toHaveBeenNthCalledWith(1,
        expect.stringContaining('INSERT INTO orders'),
        [null, 15.50, 'pending', 'takeout', mockOrderData.customization]
      );
    });
  });

  describe('getAllOrders', () => {
    it('should get all orders without filters', async () => {
      const mockOrders = [
        { id: '1', status: 'completed', user_id: 'user_1' },
        { id: '2', status: 'pending', user_id: 'user_2' }
      ];

      mockExecuteQuery.mockResolvedValue(mockOrders);

      const result = await OrderService.getAllOrders();

      expect(mockExecuteQuery).toHaveBeenCalledWith(
        'SELECT * FROM orders ORDER BY created_at DESC',
        []
      );
      expect(result).toEqual(mockOrders);
    });

    it('should filter orders by status', async () => {
      const mockOrders = [{ id: '1', status: 'completed' }];
      mockExecuteQuery.mockResolvedValue(mockOrders);

      await OrderService.getAllOrders({ status: 'completed' });

      expect(mockExecuteQuery).toHaveBeenCalledWith(
        'SELECT * FROM orders WHERE status = $1 ORDER BY created_at DESC',
        ['completed']
      );
    });

    it('should filter orders by userId', async () => {
      const mockOrders = [{ id: '1', user_id: 'user_123' }];
      mockExecuteQuery.mockResolvedValue(mockOrders);

      await OrderService.getAllOrders({ userId: 'user_123' });

      expect(mockExecuteQuery).toHaveBeenCalledWith(
        'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
        ['user_123']
      );
    });

    it('should filter orders by both status and userId', async () => {
      const mockOrders = [{ id: '1', status: 'pending', user_id: 'user_123' }];
      mockExecuteQuery.mockResolvedValue(mockOrders);

      await OrderService.getAllOrders({ status: 'pending', userId: 'user_123' });

      expect(mockExecuteQuery).toHaveBeenCalledWith(
        'SELECT * FROM orders WHERE status = $1 AND user_id = $2 ORDER BY created_at DESC',
        ['pending', 'user_123']
      );
    });
  });
});