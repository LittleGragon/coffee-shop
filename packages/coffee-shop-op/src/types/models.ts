// Menu Item model
export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image_url?: string;
  description?: string;
  is_available: boolean;
  created_at: Date;
  updated_at: Date;
}

// Inventory Item model
export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  current_stock: number;
  minimum_stock: number;
  unit: string;
  cost_per_unit: number;
  supplier?: string;
  last_restock_date?: Date;
  expiry_date?: Date;
  created_at: Date;
  updated_at: Date;
}

// Order model
export interface Order {
  id: string;
  user_id?: string;
  total_amount: number;
  status: string;
  order_type: string;
  customization?: any;
  created_at: Date;
}

// Order Item model
export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  quantity: number;
  price_at_time: number;
}

// Reservation model
export interface Reservation {
  id: string;
  user_id?: string;
  customer_name: string;
  customer_phone: string;
  party_size: number;
  reservation_time: Date;
  status: string;
  created_at: Date;
}

// User model
export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  balance: number;
  member_since: Date;
  created_at: Date;
  updated_at: Date;
}

// Transaction model
export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  type: string;
  status: string;
  created_at: Date;
}

// Inventory Transaction model
export interface InventoryTransaction {
  id: string;
  inventory_item_id: string;
  type: string;
  quantity: number;
  unit_cost?: number;
  total_cost?: number;
  reason?: string;
  reference_id?: string;
  created_by: string;
  created_at: Date;
}