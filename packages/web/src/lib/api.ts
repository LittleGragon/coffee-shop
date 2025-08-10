// /src/lib/api.ts

import type {
  CakeOrderRequest,
  CreateOrderRequest,
  MenuItem,
  Order,
  OrderItem,
  OrderItemResponse,
  OrderWithItems,
  ReservationRequest,
} from '../../shared/src/api-types';
import {
  mockFetchMemberData,
  mockFetchMenuItems,
  mockPlaceOrder,
  mockProcessTopUp,
  mockSubmitCakeOrder,
  mockSubmitReservation,
} from './mock-api';

// Handle both Vite environment and Jest environment
let USE_MOCK_DATA = false;
let API_BASE_URL = '/api';

// In test environment
if (process.env.NODE_ENV === 'test') {
  USE_MOCK_DATA = true;
}
// In browser/Vite environment
else {
  try {
    // Safely check for import.meta
    if (typeof window !== 'undefined') {
      // Direct access to import.meta if available
      if (typeof import.meta !== 'undefined' && import.meta.env) {
        USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';
        API_BASE_URL = import.meta.env.VITE_API_BASE_URL || API_BASE_URL;
        // Environment variables loaded
      }
    }
  } catch (_e) {
    // Error accessing environment variables
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
    const response = await fetch(`${API_BASE_URL}/menu`);
    if (!response.ok) {
      throw new Error('Failed to fetch menu items');
    }
    return await response.json();
  },

  // Categories
  getCategories: async () => {
    const response = await fetch(`${API_BASE_URL}/categories`);
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    return await response.json();
  },

  // Members
  createMember: async (memberData: CreateMemberRequest) => {
    const response = await fetch(`${API_BASE_URL}/members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(memberData),
    });
    if (!response.ok) {
      throw new Error('Failed to create member');
    }
    return await response.json();
  },

  getMemberByPhone: async (phone: string) => {
    const response = await fetch(`${API_BASE_URL}/members?phone=${phone}`);
    if (!response.ok) {
      throw new Error('Failed to fetch member');
    }
    return await response.json();
  },

  topUpMember: async (memberId: string, amount: number) => {
    const response = await fetch(`${API_BASE_URL}/members/topup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memberId, amount }),
    });
    if (!response.ok) {
      throw new Error('Failed to top up member balance');
    }
    return await response.json();
  },

  // Orders
  createOrder: async (orderData: CreateOrderRequest) => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    if (!response.ok) {
      throw new Error('Failed to create order');
    }
    return await response.json();
  },

  getMemberOrders: async (memberId: string) => {
    const response = await fetch(`${API_BASE_URL}/orders/member?memberId=${memberId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch member orders');
    }
    return await response.json();
  },
};

// Fetch categories from database
export const fetchCategories = async () => {
  if (USE_MOCK_DATA) {
    return ['Coffee', 'Tea', 'Pastries'];
  }

  try {
    const response = await fetch(`${API_BASE_URL}/categories`);
    return await handleResponse(response);
  } catch (_error) {
    // Error fetching categories
    return ['Coffee', 'Tea', 'Pastries']; // Fallback
  }
};

// Original functions for backward compatibility
export const fetchMenuItems = async (category: 'coffee' | 'tea' | 'pastries') => {
  if (USE_MOCK_DATA) {
    return mockFetchMenuItems(category);
  }

  try {
    // Map frontend categories to API categories
    const categoryMap = {
      coffee: 'Coffee',
      tea: 'Tea',
      pastries: 'Pastry',
    };

    const apiCategory = categoryMap[category];
    const response = await fetch(`${API_BASE_URL}/menu?category=${apiCategory}`);

    if (!response.ok) {
      // API error fetching menu items, falling back to mock data
      return mockFetchMenuItems(category);
    }

    const data = await handleResponse(response);

    // Transform API data to match frontend expectations
    const transformedData = Array.isArray(data)
      ? data.map((item: MenuItem) => ({
          id: item.id,
          name: item.name,
          category: item.category,
          price: parseFloat(item.price),
          description: item.description,
          image: item.image_url || '/api/placeholder/300/200', // Fallback image
          is_available: item.is_available,
        }))
      : [];

    return transformedData;
  } catch (_error) {
    // Error fetching menu items, falling back to mock data
    return mockFetchMenuItems(category);
  }
};

export const submitCakeOrder = async (customization: CakeOrderRequest) => {
  if (USE_MOCK_DATA) {
    return mockSubmitCakeOrder(customization);
  }

  try {
    // Submitting cake order
    const response = await fetch(`${API_BASE_URL}/cake-orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customization),
    });

    // If the API is not available, use mock data as fallback
    if (!response.ok) {
      // API error, falling back to mock data
      return mockSubmitCakeOrder(customization);
    }

    return await handleResponse(response);
  } catch (_error) {
    // Error submitting cake order, falling back to mock data
    return mockSubmitCakeOrder(customization);
  }
};

export const submitReservation = async (details: ReservationRequest) => {
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
    const orderHistory = orders.map((order: OrderWithItems) => ({
      id: order.id.substring(0, 8).toUpperCase(),
      date: new Date(order.created_at).toLocaleDateString(),
      items: order.items
        .map((item: OrderItemResponse) => `${item.menu_item_name} (x${item.quantity})`)
        .join(', '),
      total: order.total_amount,
    }));

    return {
      id: member.id,
      name: member.name,
      email: member.email,
      balance: member.balance,
      memberSince: new Date(member.member_since).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
      }),
      orderHistory: orderHistory,
    };
  } catch (_error) {
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
      targetMemberId = memberData.id;
    }

    const response = await fetch(`${API_BASE_URL}/members/topup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        memberId: targetMemberId,
        amount: amount,
        description: `Top-up of $${amount.toFixed(2)}`,
      }),
    });

    return await handleResponse(response);
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message || 'Failed to process top-up',
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
  // Use mock data if configured
  if (USE_MOCK_DATA) {
    return mockPlaceOrder(orderData);
  }

  // Calculate total amount
  const totalAmount = orderData.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Validate order items before transformation
  for (const item of orderData.items) {
    if (!item.id || !item.quantity || !item.price) {
      throw new Error(`Invalid item data: ${JSON.stringify(item)}`);
    }
  }

  // Transform data to match API expectations
  const orderItems: OrderItem[] = orderData.items.map((item) => {
    const quantity = parseInt(item.quantity.toString());
    const priceAtTime = parseFloat(item.price.toString());

    // Validate transformed values
    if (!item.id || Number.isNaN(quantity) || Number.isNaN(priceAtTime)) {
      throw new Error(
        `Invalid item transformation: id=${item.id}, quantity=${quantity}, price=${priceAtTime}`
      );
    }

    return {
      menu_item_id: item.id,
      quantity: quantity,
      price_at_time: priceAtTime,
    };
  });

  // Create the payload in the exact format expected by the API
  const payload: CreateOrderRequest = {
    user_id: null, // Allow anonymous orders
    total_amount: totalAmount,
    status: 'pending',
    order_type: orderData.order_type || 'takeout',
    customer_name: orderData.customer_name,
    notes: orderData.notes || '',
    payment_method: orderData.payment_method || 'wechat_pay',
    items: orderItems,
  };

  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  // Handle error response
  if (!response.ok) {
    let errorMessage = 'Failed to place order';

    try {
      const errorText = await response.text();
      // API error placing order

      // Try to parse as JSON
      if (errorText) {
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.error || errorJson.message || errorMessage;
        } catch (_e) {
          // If not valid JSON, use the raw text
          errorMessage = errorText;
        }
      }
    } catch (_e) {
      // Error parsing error response
    }

    throw new Error(errorMessage);
  }

  // Handle success response
  const result = (await response.json()) as Order;

  return {
    success: true,
    order: {
      id: result.id || `order-${Date.now()}`,
      total_amount: totalAmount,
    },
    message: 'Order placed successfully',
  };
};

export const fetchMemberOrders = async (memberId?: string) => {
  if (USE_MOCK_DATA) {
    return [];
  }

  try {
    let targetMemberId = memberId;
    if (!targetMemberId) {
      const memberData = await fetchMemberData();
      targetMemberId = memberData.id;
    }

    const response = await fetch(
      `${API_BASE_URL}/orders/member?memberId=${targetMemberId}&limit=20`
    );
    return await handleResponse(response);
  } catch (_error) {
    return [];
  }
};
