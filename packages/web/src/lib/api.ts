// /src/lib/api.ts
import {
  mockFetchMenuItems,
  mockSubmitCakeOrder,
  mockSubmitReservation,
  mockFetchMemberData,
  mockProcessTopUp,
  mockPlaceOrder,
} from './mock-api';

// Handle both Vite environment and Jest environment
let USE_MOCK_DATA = false;
let API_BASE_URL = 'http://localhost:3001/api';

// In test environment
if (process.env.NODE_ENV === 'test') {
  USE_MOCK_DATA = true;
} 
// In browser/Vite environment
else {
  try {
    // Safely check for import.meta
    if (typeof window !== 'undefined' && 
        typeof globalThis.import !== 'undefined' && 
        typeof globalThis.import.meta !== 'undefined' && 
        globalThis.import.meta.env) {
      USE_MOCK_DATA = globalThis.import.meta.env?.VITE_USE_MOCK_DATA === 'true';
      API_BASE_URL = globalThis.import.meta.env?.VITE_API_BASE_URL || API_BASE_URL;
    }
  } catch (e) {
    // Ignore errors when import.meta is not available
  }
}

// Helper function to handle fetch responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Create an API object that matches the test expectations
export const api = {
  // Menu Items
  getMenuItems: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/menu`);
      if (!response.ok) {
        throw new Error('Failed to fetch menu items');
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  // Members
  createMember: async (memberData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memberData)
      });
      if (!response.ok) {
        throw new Error('Failed to create member');
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  getMemberByPhone: async (phone: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/members?phone=${phone}`);
      if (!response.ok) {
        throw new Error('Failed to fetch member');
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  topUpMember: async (memberId: string, amount: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/members/topup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId, amount })
      });
      if (!response.ok) {
        throw new Error('Failed to top up member balance');
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  // Orders
  createOrder: async (orderData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      if (!response.ok) {
        throw new Error('Failed to create order');
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  getMemberOrders: async (memberId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/member?memberId=${memberId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch member orders');
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  }
};

// Original functions for backward compatibility
export const fetchMenuItems = async (category: 'coffee' | 'tea' | 'pastries') => {
  if (USE_MOCK_DATA) {
    return mockFetchMenuItems(category);
  }
  
  // Map frontend categories to API categories
  const categoryMap = {
    'coffee': 'Coffee',
    'tea': 'Tea', 
    'pastries': 'Pastry'
  };
  
  const apiCategory = categoryMap[category];
  const response = await fetch(`${API_BASE_URL}/menu?category=${apiCategory}`);
  const data = await handleResponse(response);
  
  // Transform API data to match frontend expectations
  const transformedData = Array.isArray(data) ? data.map((item: any) => ({
    id: item.id,
    name: item.name,
    category: item.category,
    price: parseFloat(item.price),
    description: item.description,
    image: item.image_url || '/api/placeholder/300/200', // Fallback image
    is_available: item.is_available
  })) : [];
  
  return transformedData;
};

export const submitCakeOrder = async (customization: any) => {
  if (USE_MOCK_DATA) {
    return mockSubmitCakeOrder(customization);
  }
  const response = await fetch(`${API_BASE_URL}/cake-orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(customization),
  });
  return handleResponse(response);
};

export const submitReservation = async (details: any) => {
  if (USE_MOCK_DATA) {
    return mockSubmitReservation(details);
  }
  const response = await fetch(`${API_BASE_URL}/reservations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(details),
  });
  return handleResponse(response);
};

export const fetchMemberData = async (email: string = 'john.doe@example.com') => {
  if (USE_MOCK_DATA) {
    return mockFetchMemberData();
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/members?email=${encodeURIComponent(email)}`);
    const member = await handleResponse(response);
    
    // Fetch real order history
    const orders = await fetchMemberOrders(member.id);
    const orderHistory = orders.map((order: any) => ({
      id: order.id.substring(0, 8).toUpperCase(),
      date: new Date(order.created_at).toLocaleDateString(),
      items: order.items.map((item: any) => `${item.menu_item_name} (x${item.quantity})`).join(', '),
      total: order.total_amount
    }));

    return {
      id: member.id,
      name: member.name,
      email: member.email,
      balance: member.balance,
      memberSince: new Date(member.member_since).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
      }),
      orderHistory: orderHistory
    };
  } catch (error) {
    // console.error('Error fetching member data:', error);
    // Fallback to mock data if API fails
    return mockFetchMemberData();
  }
};

export const processTopUp = async (amount: number, memberId: string | null = null) => {
  if (USE_MOCK_DATA) {
    return mockProcessTopUp(amount);
  }
  
  try {
    // If no memberId provided, get the default member
    let targetMemberId = memberId;
    if (!targetMemberId) {
      const memberData = await fetchMemberData();
      targetMemberId = (memberData as any).id;
    }

    const response = await fetch(`${API_BASE_URL}/members/topup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        memberId: targetMemberId,
        amount: amount,
        description: `Top-up of $${amount.toFixed(2)}`
      }),
    });

    return await handleResponse(response);
  } catch (error) {
    // console.error('Error processing top-up:', error);
    return {
      success: false,
      message: (error as Error).message || 'Failed to process top-up'
    };
  }
};

export const placeOrder = async (orderData: {
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  order_type?: string;
  notes?: string;
  payment_method?: string;
}) => {
  if (USE_MOCK_DATA) {
    return mockPlaceOrder(orderData);
  }

  try {
    // Get member data to associate with order
    const memberData = await fetchMemberData();
    
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...orderData,
        member_id: (memberData as any).id,
        customer_email: (memberData as any).email
      }),
    });

    return await handleResponse(response);
  } catch (error) {
    // console.error('Error placing order:', error);
    return {
      success: false,
      message: (error as Error).message || 'Failed to place order'
    };
  }
};

export const fetchMemberOrders = async (memberId?: string) => {
  if (USE_MOCK_DATA) {
    return [];
  }

  try {
    let targetMemberId = memberId;
    if (!targetMemberId) {
      const memberData = await fetchMemberData();
      targetMemberId = (memberData as any).id;
    }

    const response = await fetch(`${API_BASE_URL}/orders/member?memberId=${targetMemberId}&limit=20`);
    return await handleResponse(response);
  } catch (error) {
    // console.error('Error fetching member orders:', error);
    return [];
  }
};