export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  image_url?: string;
  is_available: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  current_stock: number;
  minimum_stock: number;
  cost_per_unit: number;
  unit: string;
  supplier?: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Order {
  id: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  items: OrderItem[];
  total_amount: number;
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  order_type: 'dine-in' | 'takeout' | 'delivery';
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  menu_item_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  customizations?: string;
}

export interface Reservation {
  id: string;
  customer_name: string;
  customer_email?: string;
  customer_phone: string;
  party_size: number;
  reservation_date: Date;
  reservation_time: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  phone?: string;
  membership_level: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  points: number;
  balance: number;
  member_since: Date;
  created_at: Date;
  updated_at: Date;
}

export interface MemberTransaction {
  id: string;
  member_id: string;
  transaction_type: 'topup' | 'purchase' | 'refund';
  amount: number;
  description: string;
  balance_after: number;
  created_at: Date;
}

export interface MemberOrder extends Order {
  member_id?: string;
  points_earned?: number;
  points_used?: number;
}
