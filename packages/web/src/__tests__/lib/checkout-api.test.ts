import { placeOrder } from '@/lib/api';

// Mock fetch globally
global.fetch = jest.fn();

// Mock the fetchMemberData function
const mockFetchMemberData = jest.fn();
jest.mock('@/lib/api', () => ({
  ...jest.requireActual('@/lib/api'),
  fetchMemberData: mockFetchMemberData,
}));

describe('Checkout API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
    mockFetchMemberData.mockClear();
  });

  describe('placeOrder', () => {
    const mockOrderData = {
      customer_name: 'John Doe',
      customer_email: 'john@example.com',
      items: [
        { id: '1', name: 'Latte', price: 4.50, quantity: 2 },
        { id: '2', name: 'Croissant', price: 2.50, quantity: 1 }
      ],
      order_type: 'takeout',
      notes: 'Extra hot',
      payment_method: 'wechat_pay'
    };

    const mockMemberData = {
      id: 'member_123',
      email: 'john@example.com',
      name: 'John Doe'
    };

    const mockApiResponse = {
      id: 'order_456',
      user_id: 'member_123',
      total_amount: 11.50,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    it('should successfully place an order', async () => {
      // Setup mocks
      mockFetchMemberData.mockResolvedValue(mockMemberData);
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockApiResponse)
      });

      // Execute
      const result = await placeOrder(mockOrderData);

      // Verify
      expect(mockFetchMemberData).toHaveBeenCalled();
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/orders',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderData: {
              user_id: 'member_123',
              total_amount: 11.50,
              status: 'pending',
              order_type: 'takeout',
              customization: JSON.stringify({
                customer_name: 'John Doe',
                notes: 'Extra hot',
                payment_method: 'wechat_pay'
              })
            },
            orderItems: [
              { menu_item_id: 1, quantity: 2, price_at_time: 4.50 },
              { menu_item_id: 2, quantity: 1, price_at_time: 2.50 }
            ]
          })
        })
      );

      expect(result).toEqual({
        success: true,
        order: {
          id: 'order_456',
          total_amount: 11.50
        },
        message: 'Order placed successfully'
      });
    });

    it('should handle API errors gracefully', async () => {
      // Setup mocks
      mockFetchMemberData.mockResolvedValue(mockMemberData);
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ message: 'Internal server error' })
      });

      // Execute
      const result = await placeOrder(mockOrderData);

      // Verify
      expect(result).toEqual({
        success: false,
        message: 'Internal server error'
      });
    });

    it('should handle member data fetch errors', async () => {
      // Setup mocks
      mockFetchMemberData.mockRejectedValue(new Error('Member not found'));

      // Execute
      const result = await placeOrder(mockOrderData);

      // Verify
      expect(result).toEqual({
        success: false,
        message: 'Member not found'
      });
    });

    it('should calculate total amount correctly', async () => {
      // Setup mocks
      mockFetchMemberData.mockResolvedValue(mockMemberData);
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockApiResponse)
      });

      const orderWithMultipleItems = {
        ...mockOrderData,
        items: [
          { id: '1', name: 'Latte', price: 4.50, quantity: 3 },
          { id: '2', name: 'Croissant', price: 2.50, quantity: 2 },
          { id: '3', name: 'Americano', price: 3.00, quantity: 1 }
        ]
      };

      // Execute
      await placeOrder(orderWithMultipleItems);

      // Verify total calculation: (4.50 * 3) + (2.50 * 2) + (3.00 * 1) = 21.50
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/orders',
        expect.objectContaining({
          body: expect.stringContaining('"total_amount":21.5')
        })
      );
    });

    it('should transform item IDs to integers', async () => {
      // Setup mocks
      mockFetchMemberData.mockResolvedValue(mockMemberData);
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockApiResponse)
      });

      // Execute
      await placeOrder(mockOrderData);

      // Verify that string IDs are converted to integers
      const callArgs = (global.fetch as jest.Mock).mock.calls[0][1];
      const body = JSON.parse(callArgs.body);
      
      expect(body.orderItems[0].menu_item_id).toBe(1);
      expect(body.orderItems[1].menu_item_id).toBe(2);
      expect(typeof body.orderItems[0].menu_item_id).toBe('number');
      expect(typeof body.orderItems[1].menu_item_id).toBe('number');
    });

    it('should use default values for optional fields', async () => {
      // Setup mocks
      mockFetchMemberData.mockResolvedValue(mockMemberData);
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockApiResponse)
      });

      const minimalOrderData = {
        customer_name: 'Jane Doe',
        items: [
          { id: '1', name: 'Coffee', price: 3.00, quantity: 1 }
        ]
      };

      // Execute
      await placeOrder(minimalOrderData);

      // Verify defaults
      const callArgs = (global.fetch as jest.Mock).mock.calls[0][1];
      const body = JSON.parse(callArgs.body);
      
      expect(body.orderData.order_type).toBe('takeout');
      expect(body.orderData.status).toBe('pending');
      
      const customization = JSON.parse(body.orderData.customization);
      expect(customization.payment_method).toBe('wechat_pay');
    });
  });
});