/**
 * Coffee Shop Buddy API Types
 * 
 * This file contains TypeScript interfaces for the Coffee Shop Buddy API.
 * It serves as the contract between frontend and backend implementations.
 */

// Common Types

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  error: string;
  details?: any;
}

// Menu Types

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image_url: string;
  is_available: boolean;
}

export interface CreateMenuItemRequest {
  name: string;
  category: string;
  price: number;
  description: string;
  image_url?: string;
  is_available?: boolean;
}

export interface UpdateMenuItemRequest {
  name?: string;
  category?: string;
  price?: number;
  description?: string;
  image_url?: string;
  is_available?: boolean;
}

// Order Types

export interface OrderItem {
  menu_item_id: string;
  quantity: number;
  price_at_time: number;
}

export interface CreateOrderRequest {
  user_id: string | null;  // null for guest orders
  total_amount: number;
  status: string;          // "pending" by default
  order_type: string;      // "takeout", "dine-in", etc.
  customer_name: string;
  notes?: string;
  payment_method?: string; // "cash", "card", "wechat_pay", etc.
  items: OrderItem[];
}

export interface Order {
  id: string;
  user_id: string | null;
  total_amount: number;
  status: string;
  order_type: string;
  customer_name: string;
  notes?: string;
  payment_method?: string;
  created_at: string;      // ISO date string
  updated_at: string;      // ISO date string
}

export interface OrderItemResponse {
  id: string;
  menu_item_id: string;
  menu_item_name: string;
  quantity: number;
  price_at_time: number;
}

export interface OrderWithItems extends Order {
  items: OrderItemResponse[];
}

export interface UpdateOrderRequest {
  status: string;  // "pending", "preparing", "ready", "completed", "cancelled"
}

export interface ProcessPaymentRequest {
  payment_method: string;  // "cash", "card", "member_balance", "wechat_pay"
  amount: number;
  user_id?: string;        // Required for member_balance payment
}

export interface PaymentResponse {
  success: boolean;
  order_id: string;
  payment_id: string;
  amount: number;
  payment_method: string;
  timestamp: string;       // ISO date string
}

// Member Types

export interface CreateMemberRequest {
  name: string;
  email: string;
  phone?: string;
  password?: string;       // Hashed on the server
}

export interface Member {
  id: string;
  name: string;
  email: string;
  phone?: string;
  balance: number;
  member_since: string;    // ISO date string
}

export interface TopUpRequest {
  memberId: string;
  amount: number;
  description?: string;
}

export interface TopUpResponse {
  success: boolean;
  newBalance: number;
  transaction_id: string;
}

// Cake Order Types

export interface CakeSize {
  id: string;
  name: string;
  price: number;
}

export interface CakeFlavor {
  id: string;
  name: string;
}

export interface CakeFrosting {
  id: string;
  name: string;
  color: string;
}

export interface CakeTopping {
  id: string;
  name: string;
  price: number;
}

export interface CakeFont {
  id: string;
  name: string;
}

export interface CakeOrderRequest {
  size: CakeSize;
  flavor: CakeFlavor;
  frosting: CakeFrosting;
  toppings: CakeTopping[];
  message?: string;
  font?: CakeFont;
  specialInstructions?: string;
}

export interface CakeOrderResponse {
  orderId: string;
  message: string;
}

// Reservation Types

export interface ReservationRequest {
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  date: string;            // ISO date string
  time: string;            // HH:MM format
  party_size: number;
  special_requests?: string;
}

export interface Reservation {
  id: string;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  date: string;
  time: string;
  party_size: number;
  special_requests?: string;
  status: string;          // "pending", "confirmed", "seated", "completed", "cancelled"
  created_at: string;      // ISO date string
}

export interface UpdateReservationRequest {
  status: string;  // "confirmed", "seated", "completed", "cancelled"
}

export interface AvailabilityResponse {
  available: boolean;
  alternative_times?: string[];  // If requested time is unavailable
}