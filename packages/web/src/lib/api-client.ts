/**
 * Coffee Shop Buddy API Client
 *
 * This file provides a typed API client for the Coffee Shop Buddy API.
 */

import type {
  ApiError,
  AvailabilityResponse,
  CakeOrderRequest,
  CakeOrderResponse,
  CreateMemberRequest,
  CreateMenuItemRequest,
  CreateOrderRequest,
  Member,
  MenuItem,
  Order,
  OrderWithItems,
  PaymentResponse,
  ProcessPaymentRequest,
  Reservation,
  ReservationRequest,
  TopUpRequest,
  TopUpResponse,
  UpdateMenuItemRequest,
  UpdateOrderRequest,
  UpdateReservationRequest,
} from '../../shared/src/api-types';

// Configuration
let API_BASE_URL = '/api';

// In browser/Vite environment
try {
  if (typeof window !== 'undefined' && typeof import.meta !== 'undefined' && import.meta.env) {
    API_BASE_URL = import.meta.env.VITE_API_BASE_URL || API_BASE_URL;
  }
} catch (_e) {
  // Error accessing environment variables
}

// Helper function to handle fetch responses
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;

    try {
      const errorData = (await response.json()) as ApiError;
      errorMessage = errorData.error || errorMessage;
    } catch (_e) {
      // If response is not JSON, use text content
      const errorText = await response.text();
      if (errorText) {
        errorMessage = errorText;
      }
    }

    throw new Error(errorMessage);
  }

  return response.json() as Promise<T>;
};

// API Client
export const apiClient = {
  // Menu Endpoints
  menu: {
    getAll: async (category?: string, available?: boolean): Promise<MenuItem[]> => {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (available !== undefined) params.append('available', String(available));

      const queryString = params.toString() ? `?${params.toString()}` : '';
      const response = await fetch(`${API_BASE_URL}/menu${queryString}`);
      return handleResponse<MenuItem[]>(response);
    },

    getCategories: async (): Promise<string[]> => {
      const response = await fetch(`${API_BASE_URL}/categories`);
      return handleResponse<string[]>(response);
    },

    create: async (menuItem: CreateMenuItemRequest): Promise<MenuItem> => {
      const response = await fetch(`${API_BASE_URL}/menu`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(menuItem),
      });
      return handleResponse<MenuItem>(response);
    },

    update: async (id: string, updates: UpdateMenuItemRequest): Promise<MenuItem> => {
      const response = await fetch(`${API_BASE_URL}/menu/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      return handleResponse<MenuItem>(response);
    },
  },

  // Order Endpoints
  orders: {
    create: async (orderData: CreateOrderRequest): Promise<Order> => {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      return handleResponse<Order>(response);
    },

    getAll: async (memberId?: string, limit?: number): Promise<OrderWithItems[]> => {
      const params = new URLSearchParams();
      if (memberId) params.append('memberId', memberId);
      if (limit) params.append('limit', String(limit));

      const queryString = params.toString() ? `?${params.toString()}` : '';
      const response = await fetch(`${API_BASE_URL}/orders${queryString}`);
      return handleResponse<OrderWithItems[]>(response);
    },

    getById: async (id: string): Promise<OrderWithItems> => {
      const response = await fetch(`${API_BASE_URL}/orders/${id}`);
      return handleResponse<OrderWithItems>(response);
    },

    updateStatus: async (id: string, statusUpdate: UpdateOrderRequest): Promise<Order> => {
      const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(statusUpdate),
      });
      return handleResponse<Order>(response);
    },

    processPayment: async (
      id: string,
      paymentData: ProcessPaymentRequest
    ): Promise<PaymentResponse> => {
      const response = await fetch(`${API_BASE_URL}/orders/${id}/payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData),
      });
      return handleResponse<PaymentResponse>(response);
    },
  },

  // Member Endpoints
  members: {
    create: async (memberData: CreateMemberRequest): Promise<Member> => {
      const response = await fetch(`${API_BASE_URL}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memberData),
      });
      return handleResponse<Member>(response);
    },

    getByEmail: async (email: string): Promise<Member> => {
      const response = await fetch(`${API_BASE_URL}/members?email=${encodeURIComponent(email)}`);
      return handleResponse<Member>(response);
    },

    getByPhone: async (phone: string): Promise<Member> => {
      const response = await fetch(`${API_BASE_URL}/members?phone=${encodeURIComponent(phone)}`);
      return handleResponse<Member>(response);
    },

    topUp: async (topUpData: TopUpRequest): Promise<TopUpResponse> => {
      const response = await fetch(`${API_BASE_URL}/members/topup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(topUpData),
      });
      return handleResponse<TopUpResponse>(response);
    },
  },

  // Cake Order Endpoints
  cakeOrders: {
    create: async (cakeData: CakeOrderRequest): Promise<CakeOrderResponse> => {
      const response = await fetch(`${API_BASE_URL}/cake-orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cakeData),
      });
      return handleResponse<CakeOrderResponse>(response);
    },
  },

  // Reservation Endpoints
  reservations: {
    create: async (reservationData: ReservationRequest): Promise<Reservation> => {
      const response = await fetch(`${API_BASE_URL}/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reservationData),
      });
      return handleResponse<Reservation>(response);
    },

    checkAvailability: async (
      date: string,
      time: string,
      partySize: number
    ): Promise<AvailabilityResponse> => {
      const params = new URLSearchParams({
        date,
        time,
        party_size: String(partySize),
      });

      const response = await fetch(
        `${API_BASE_URL}/reservations/availability?${params.toString()}`
      );
      return handleResponse<AvailabilityResponse>(response);
    },

    updateStatus: async (
      id: string,
      statusUpdate: UpdateReservationRequest
    ): Promise<Reservation> => {
      const response = await fetch(`${API_BASE_URL}/reservations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(statusUpdate),
      });
      return handleResponse<Reservation>(response);
    },
  },
};
