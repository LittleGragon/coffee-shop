// /src/lib/api.ts

const API_BASE_URL = '/api';
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
  const response = await fetch(`${API_BASE_URL}/menu-items?category=${category}`);
  const data = await handleResponse(response);
  return data.data; // The API wraps data in a 'data' property
};

export const submitCakeOrder = async (customization: any) => {
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
  const response = await fetch(`${API_BASE_URL}/member`);
  const data = await handleResponse(response);
  return data.data; // The API wraps data in a 'data' property
};

export const processTopUp = async (amount: number) => {
  const response = await fetch(`${API_BASE_URL}/member/top-up`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ amount }),
  });
  return handleResponse(response);
};
