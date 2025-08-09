// Mock API implementation for testing
export const api = {
  // Menu Items
  getMenuItems: jest.fn().mockImplementation(async () => {
    return [
      { id: '1', name: 'Americano', price: 25, category: 'Coffee', available: true },
      { id: '2', name: 'Latte', price: 35, category: 'Coffee', available: true }
    ];
  }),

  // Members
  createMember: jest.fn().mockImplementation(async (memberData) => {
    return {
      id: '123',
      name: memberData.name,
      phone: memberData.phone,
      balance: 0
    };
  }),

  getMemberByPhone: jest.fn().mockImplementation(async (phone) => {
    return {
      id: '123',
      name: 'John Doe',
      phone,
      balance: 100
    };
  }),

  topUpMember: jest.fn().mockImplementation(async (memberId, amount) => {
    return {
      success: true,
      newBalance: 150,
      transactionId: 'txn_123'
    };
  }),

  // Orders
  createOrder: jest.fn().mockImplementation(async (orderData) => {
    return {
      id: 'order_123',
      memberId: orderData.memberId,
      items: orderData.items,
      total: orderData.total,
      status: 'completed'
    };
  }),

  getMemberOrders: jest.fn().mockImplementation(async (memberId) => {
    return [
      {
        id: 'order_123',
        memberId,
        total: 50,
        status: 'completed',
        createdAt: '2024-01-01T00:00:00Z',
        items: [{ menuItemId: '1', quantity: 2, price: 25, name: 'Americano' }]
      }
    ];
  })
};

// Export the mock functions for testing
export default api;