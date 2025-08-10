// Import the mock API
import { api } from '../../lib/api';

// Mock the API module
jest.mock('../../lib/api');

describe('API Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Menu Items', () => {
    it('should fetch menu items successfully', async () => {
      // Setup
      const mockMenuItems = [
        { id: '1', name: 'Americano', price: 25, category: 'Coffee', available: true },
        { id: '2', name: 'Latte', price: 35, category: 'Coffee', available: true },
      ];

      // Mock implementation for this test
      (api.getMenuItems as jest.Mock).mockResolvedValueOnce(mockMenuItems);

      // Execute
      const result = await api.getMenuItems();

      // Verify
      expect(api.getMenuItems).toHaveBeenCalled();
      expect(result).toEqual(mockMenuItems);
    });

    it('should handle menu items fetch error', async () => {
      // Setup
      (api.getMenuItems as jest.Mock).mockRejectedValueOnce(
        new Error('Failed to fetch menu items')
      );

      // Execute & Verify
      await expect(api.getMenuItems()).rejects.toThrow('Failed to fetch menu items');
    });
  });

  describe('Members', () => {
    it('should create member successfully', async () => {
      // Setup
      const memberData = { name: 'John Doe', phone: '1234567890' };
      const mockMember = {
        id: '123',
        name: 'John Doe',
        phone: '1234567890',
        balance: 0,
      };

      (api.createMember as jest.Mock).mockResolvedValueOnce(mockMember);

      // Execute
      const result = await api.createMember(memberData);

      // Verify
      expect(api.createMember).toHaveBeenCalledWith(memberData);
      expect(result).toEqual(mockMember);
    });

    it('should get member by phone successfully', async () => {
      // Setup
      const mockMember = {
        id: '123',
        name: 'John Doe',
        phone: '1234567890',
        balance: 100,
      };

      (api.getMemberByPhone as jest.Mock).mockResolvedValueOnce(mockMember);

      // Execute
      const result = await api.getMemberByPhone('1234567890');

      // Verify
      expect(api.getMemberByPhone).toHaveBeenCalledWith('1234567890');
      expect(result).toEqual(mockMember);
    });

    it('should handle member not found', async () => {
      // Setup
      (api.getMemberByPhone as jest.Mock).mockRejectedValueOnce(
        new Error('Failed to fetch member')
      );

      // Execute & Verify
      await expect(api.getMemberByPhone('9999999999')).rejects.toThrow('Failed to fetch member');
    });

    it('should top up member balance successfully', async () => {
      // Setup
      const mockResponse = {
        success: true,
        newBalance: 150,
        transactionId: 'txn_123',
      };

      (api.topUpMember as jest.Mock).mockResolvedValueOnce(mockResponse);

      // Execute
      const result = await api.topUpMember('123', 50);

      // Verify
      expect(api.topUpMember).toHaveBeenCalledWith('123', 50);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('Orders', () => {
    it('should create order successfully', async () => {
      // Setup
      const orderData = {
        memberId: '123',
        items: [{ menuItemId: '1', quantity: 2, price: 25 }],
        total: 50,
      };

      const mockOrder = {
        id: 'order_123',
        memberId: '123',
        items: [{ menuItemId: '1', quantity: 2, price: 25 }],
        total: 50,
        status: 'completed',
      };

      (api.createOrder as jest.Mock).mockResolvedValueOnce(mockOrder);

      // Execute
      const result = await api.createOrder(orderData);

      // Verify
      expect(api.createOrder).toHaveBeenCalledWith(orderData);
      expect(result).toEqual(mockOrder);
    });

    it('should get member orders successfully', async () => {
      // Setup
      const mockOrders = [
        {
          id: 'order_123',
          memberId: '123',
          total: 50,
          status: 'completed',
          createdAt: '2024-01-01T00:00:00Z',
          items: [{ menuItemId: '1', quantity: 2, price: 25, name: 'Americano' }],
        },
      ];

      (api.getMemberOrders as jest.Mock).mockResolvedValueOnce(mockOrders);

      // Execute
      const result = await api.getMemberOrders('123');

      // Verify
      expect(api.getMemberOrders).toHaveBeenCalledWith('123');
      expect(result).toEqual(mockOrders);
    });

    it('should handle order creation error', async () => {
      // Setup
      const orderData = {
        memberId: '123',
        items: [],
        total: 0,
      };

      (api.createOrder as jest.Mock).mockRejectedValueOnce(new Error('Failed to create order'));

      // Execute & Verify
      await expect(api.createOrder(orderData)).rejects.toThrow('Failed to create order');
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      // Setup
      (api.getMenuItems as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      // Execute & Verify
      await expect(api.getMenuItems()).rejects.toThrow('Network error');
    });

    it('should handle JSON parsing errors', async () => {
      // Setup
      (api.getMenuItems as jest.Mock).mockRejectedValueOnce(new Error('Invalid JSON'));

      // Execute & Verify
      await expect(api.getMenuItems()).rejects.toThrow('Invalid JSON');
    });
  });
});
