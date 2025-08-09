// /src/lib/api.ts
import {
  mockFetchMenuItems,
  mockSubmitCakeOrder,
  mockSubmitReservation,
  mockFetchMemberData,
  mockProcessTopUp,
} from './mock-api';

const USE_MOCK_DATA = (import.meta as any).env?.VITE_USE_MOCK_DATA === 'true';
const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Helper function to handle fetch responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// ============================================================================
// API Functions
// ============================================================================

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
  const response = await fetch(`${API_BASE_URL}/menu-items?category=${apiCategory}`);
  const data = await handleResponse(response);
  
  // Transform API data to match frontend expectations
  const transformedData = data.data.map((item: any) => ({
    id: item.id,
    name: item.name,
    category: item.category,
    price: parseFloat(item.price),
    description: item.description,
    image: item.image_url || '/api/placeholder/300/200', // Fallback image
    is_available: item.is_available
  }));
  
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
    console.error('Error fetching member data:', error);
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
    console.error('Error processing top-up:', error);
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
    // Mock order placement
    await new Promise(resolve => setTimeout(resolve, 2000));
    return {
      success: true,
      order: {
        id: 'mock-order-' + Date.now(),
        customer_name: orderData.customer_name,
        total_amount: orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        status: 'pending',
        created_at: new Date().toISOString()
      },
      message: 'Order placed successfully'
    };
  }

  try {
    // Get member data to associate with order
    const memberData = await fetchMemberData();
    
    const response = await fetch(`${API_BASE_URL}/orders/simple-test`, {
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
    console.error('Error placing order:', error);
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
    console.error('Error fetching member orders:', error);
    return [];
  }
};
