// /src/lib/api.ts
// Real API-only client. Removes mock-api imports and Vite import.meta.env usage.
// Uses NEXT_PUBLIC_API_BASE_URL for base URL. Provides minimal local types to satisfy TS.

type MenuItem = {
  id: string;
  name: string;
  category: string;
  price: number | string;
  description?: string;
  image_url?: string;
  is_available?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type CreateMemberRequest = {
  name: string;
  email: string;
  phone?: string;
  membership_level?: string;
};

export type OrderItem = {
  menu_item_id: string;
  quantity: number;
  price_at_time: number;
};

export type OrderWithItems = {
  id: string;
  user_id: string | null;
  total_amount: number | string;
  status: string;
  order_type: string;
  customization?: unknown;
  created_at: string;
  items: OrderItemResponse[];
};

export type OrderItemResponse = {
  id: string;
  order_id: string;
  menu_item_id: string;
  menu_item_name: string;
  quantity: number;
  price_at_time: number;
};

export type CreateOrderRequest = {
  user_id: string | null;
  total_amount: number;
  status: string;
  order_type: string;
  customer_name?: string;
  notes?: string;
  payment_method?: string;
  items: OrderItem[];
};

export type CakeOrderRequest = Record<string, unknown>;
export type ReservationRequest = Record<string, unknown>;

// Base URL: fall back to Next API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

// Helper to handle fetch responses
const handleResponse = async (response: Response): Promise<any> => {
  if (!response.ok) {
    const text = await response.text().catch(() => '');
    try {
      const errJson = text ? JSON.parse(text) : {};
      throw new Error(errJson.error || errJson.message || `HTTP ${response.status}`);
    } catch {
      throw new Error(text || `HTTP ${response.status}`);
    }
  }
  const ct = response.headers.get('content-type') || '';
  return ct.includes('application/json') ? response.json() : response.text();
};

// Public API surface (real endpoints only)
export const api = {
  // Menu Items
  getMenuItems: async (): Promise<any> => {
    const res = await fetch(`${API_BASE_URL}/menu`);
    if (!res.ok) throw new Error('Failed to fetch menu items');
    return res.json();
  },

  // Categories
  getCategories: async (): Promise<any> => {
    const res = await fetch(`${API_BASE_URL}/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  },

  // Members
  createMember: async (memberData: CreateMemberRequest): Promise<any> => {
    const res = await fetch(`${API_BASE_URL}/members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(memberData),
    });
    if (!res.ok) throw new Error('Failed to create member');
    return res.json();
  },

  getMemberByPhone: async (phone: string): Promise<any> => {
    const res = await fetch(`${API_BASE_URL}/members?phone=${encodeURIComponent(phone)}`);
    if (!res.ok) throw new Error('Failed to fetch member');
    return res.json();
  },

  topUpMember: async (memberId: string, amount: number): Promise<any> => {
    const res = await fetch(`${API_BASE_URL}/members/topup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memberId, amount }),
    });
    if (!res.ok) throw new Error('Failed to top up member balance');
    return res.json();
  },

  // Orders
  createOrder: async (orderData: CreateOrderRequest): Promise<any> => {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    if (!res.ok) throw new Error('Failed to create order');
    return res.json();
  },

  getMemberOrders: async (memberId: string): Promise<any> => {
    const res = await fetch(`${API_BASE_URL}/orders/member?memberId=${encodeURIComponent(memberId)}`);
    if (!res.ok) throw new Error('Failed to fetch member orders');
    return res.json();
  },
};

// Fetch categories (graceful default)
export const fetchCategories = async (): Promise<string[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/categories`);
    return await handleResponse(res);
  } catch {
    return ['Coffee', 'Tea', 'Pastries'];
  }
};

// Fetch menu items (no mock fallback; returns [])
export const fetchMenuItems = async (category: 'coffee' | 'tea' | 'pastries'): Promise<any[]> => {
  try {
    const map: Record<string, string> = { coffee: 'Coffee', tea: 'Tea', pastries: 'Pastry' };
    const apiCategory = map[category] || category;
    const res = await fetch(`${API_BASE_URL}/menu?category=${encodeURIComponent(apiCategory)}`);
    if (!res.ok) return [];
    const data = await handleResponse(res);
    const arr = Array.isArray(data) ? data : [];
    return arr.map((item: MenuItem) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      price: parseFloat(String(item.price)),
      description: item.description,
      image: (item as any).image || item.image_url || '/api/placeholder/300/200',
      is_available: item.is_available,
    }));
  } catch {
    return [];
  }
};

// Submit cake order (real only)
export const submitCakeOrder = async (customization: CakeOrderRequest): Promise<any> => {
  const res = await fetch(`${API_BASE_URL}/cake-orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(customization),
  });
  if (!res.ok) throw new Error('Failed to submit cake order');
  return handleResponse(res);
};

// Submit reservation (real only)
export const submitReservation = async (details: ReservationRequest): Promise<any> => {
  const res = await fetch(`${API_BASE_URL}/reservations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(details),
  });
  return handleResponse(res);
};

// Fetch current member data using auth + orders
export const fetchMemberData = async (): Promise<{
  id: string;
  name: string;
  email: string;
  balance: number;
  memberSince: string;
  orderHistory: { id: string; date: string; items: string; total: number }[];
}> => {
  try {
    const meRes = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { 'Content-Type': 'application/json' },
    });
    const me = await handleResponse(meRes);
    const user = me?.user || {};
    const userId: string = user?.id || '';

    let orderHistory: { id: string; date: string; items: string; total: number }[] = [];

    if (userId) {
      const ordersRes = await fetch(
        `${API_BASE_URL}/orders/member?memberId=${encodeURIComponent(userId)}&limit=20`
      );
      const orders: OrderWithItems[] = await handleResponse(ordersRes);
      orderHistory = Array.isArray(orders)
        ? orders.map((order) => ({
            id: String(order.id).substring(0, 8).toUpperCase(),
            date: new Date(order.created_at).toLocaleDateString(),
            items: (order.items || [])
              .map((item: OrderItemResponse) => `${item.menu_item_name} (x${item.quantity})`)
              .join(', '),
            total: Number(order.total_amount),
          }))
        : [];
    }

    return {
      id: userId,
      name: user?.name || 'User',
      email: user?.email || 'user@example.com',
      balance: 0,
      memberSince: user?.created_at
        ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
        : '',
      orderHistory,
    };
  } catch {
    return {
      id: '',
      name: 'User',
      email: 'user@example.com',
      balance: 0,
      memberSince: '',
      orderHistory: [],
    };
  }
};

// Top-up (real only)
export const processTopUp = async (amount: number, memberId: string): Promise<any> => {
  if (!memberId) throw new Error('memberId is required for top-up');
  const res = await fetch(`${API_BASE_URL}/members/topup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ memberId, amount, description: `Top-up of $${amount.toFixed(2)}` }),
  });
  return handleResponse(res);
};

// Place order (real only)
export const placeOrder = async (orderData: {
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  items: Array<{ id: string; name: string; price: number; quantity: number }>;
  order_type?: string;
  notes?: string;
  payment_method?: string;
}): Promise<{ success: boolean; order: { id: string; total_amount: number }; message: string }> => {
  const totalAmount = orderData.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const orderItems: OrderItem[] = orderData.items.map((item) => {
    const quantity = Number(item.quantity);
    const priceAtTime = Number(item.price);
    if (!item.id || Number.isNaN(quantity) || Number.isNaN(priceAtTime)) {
      throw new Error(
        `Invalid item transformation: id=${item.id}, quantity=${quantity}, price=${priceAtTime}`
      );
    }
    return { menu_item_id: item.id, quantity, price_at_time: priceAtTime };
  });

  const payload: CreateOrderRequest = {
    user_id: null,
    total_amount: totalAmount,
    status: 'pending',
    order_type: orderData.order_type || 'takeout',
    customer_name: orderData.customer_name,
    notes: orderData.notes || '',
    payment_method: orderData.payment_method || 'wechat_pay',
    items: orderItems,
  };

  const res = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    try {
      const json = txt ? JSON.parse(txt) : {};
      throw new Error(json.error || json.message || 'Failed to place order');
    } catch {
      throw new Error(txt || 'Failed to place order');
    }
  }

  const result: any = await res.json();
  return {
    success: true,
    order: { id: result?.id || `order-${Date.now()}`, total_amount: totalAmount },
    message: 'Order placed successfully',
  };
};

// Fetch member orders (real only)
export const fetchMemberOrders = async (memberId?: string): Promise<any[]> => {
  try {
    let target = memberId;
    if (!target) {
      const meRes = await fetch(`${API_BASE_URL}/auth/me`, { headers: { 'Content-Type': 'application/json' } });
      const me = await handleResponse(meRes);
      target = me?.user?.id;
      if (!target) return [];
    }
    const res = await fetch(`${API_BASE_URL}/orders/member?memberId=${encodeURIComponent(String(target))}&limit=20`);
    return await handleResponse(res);
  } catch {
    return [];
  }
};