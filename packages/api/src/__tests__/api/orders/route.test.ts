import { GET, POST } from '../../../app/api/orders/route';
import { query } from '../../../lib/db';

// Mock the database query function
jest.mock('../../../lib/db', () => ({
  query: jest.fn(),
}));

const mockQuery = query as jest.MockedFunction<typeof query>;

describe('/api/orders', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should get orders for a member', async () => {
      const mockOrders = [
        {
          id: 'order-1',
          customer_name: 'John Doe',
          member_id: 'member-1',
          total_amount: '13.50',
          status: 'pending',
          order_type: 'takeout',
          created_at: '2024-01-15',
          items: [
            {
              id: 'item-1',
              menu_item_name: 'Latte',
              quantity: 2,
              unit_price: 4.5,
              subtotal: 9.0
            }
          ]
        }
      ];

      mockQuery.mockResolvedValueOnce({ rows: mockOrders } as any);

      const request = new Request('http://localhost:3001/api/orders?memberId=member-1');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data[0].customer_name).toBe('John Doe');
      expect(data[0].total_amount).toBe(13.5);
    });

    it('should get all orders when no memberId provided', async () => {
      const mockOrders = [
        { id: 'order-1', customer_name: 'John', total_amount: '10.00', items: [] },
        { id: 'order-2', customer_name: 'Jane', total_amount: '15.00', items: [] }
      ];

      mockQuery.mockResolvedValueOnce({ rows: mockOrders } as any);

      const request = new Request('http://localhost:3001/api/orders');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data).toHaveLength(2);
    });
  });

  describe('POST', () => {
    it('should create a new order successfully', async () => {
      const mockOrder = {
        id: 'new-order-id',
        customer_name: 'John Doe',
        total_amount: '9.50',
        status: 'pending',
        order_type: 'takeout',
        points_earned: 9,
        created_at: '2024-01-15'
      };

      // Mock the order creation
      mockQuery.mockResolvedValueOnce({ rows: [mockOrder] } as any);
      // Mock order items creation
      mockQuery.mockResolvedValue({ rows: [] } as any);

      const orderData = {
        customer_name: 'John Doe',
        customer_email: 'john@example.com',
        member_id: 'member-1',
        items: [
          { id: 'item-1', name: 'Latte', price: 4.75, quantity: 2 }
        ],
        order_type: 'takeout',
        notes: 'Test order'
      };

      const request = new Request('http://localhost:3001/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.order.customer_name).toBe('John Doe');
      expect(data.message).toBe('Order placed successfully');
    });

    it('should return 400 for missing required fields', async () => {
      const request = new Request('http://localhost:3001/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: 'John Doe'
          // missing items
        })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Customer name and items are required');
    });

    it('should return 400 for empty items array', async () => {
      const request = new Request('http://localhost:3001/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: 'John Doe',
          items: []
        })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Customer name and items are required');
    });
  });
});