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
  const response = await fetch(`${API_BASE_URL}/menu-items?category=${category}`);
  const data = await handleResponse(response);
  return data.data;
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

export const fetchMemberData = async () => {
  if (USE_MOCK_DATA) {
    return mockFetchMemberData();
  }
  const response = await fetch(`${API_BASE_URL}/member`);
  const data = await handleResponse(response);
  return data.data;
};

export const processTopUp = async (amount: number) => {
  if (USE_MOCK_DATA) {
    return mockProcessTopUp(amount);
  }
  const response = await fetch(`${API_BASE_URL}/member/top-up`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ amount }),
  });
  return handleResponse(response);
};