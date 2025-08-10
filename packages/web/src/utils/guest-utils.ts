/**
 * Generates or retrieves a persistent guest ID for non-logged in users
 * This ID is stored in localStorage to maintain consistency across sessions
 */
export function generateGuestId(): string {
  // For SSR compatibility, check if window exists
  if (typeof window === 'undefined') {
    return `guest_temp_${Date.now().toString(36)}`;
  }

  const storageKey = 'coffee_shop_guest_id';

  // Check if we already have a guest ID in localStorage
  const existingId = localStorage.getItem(storageKey);
  if (existingId) {
    return existingId;
  }

  // Generate a new UUID-like ID
  const newId =
    `guest_${Math.random().toString(36).substring(2, 15)}` +
    `${Math.random().toString(36).substring(2, 15)}` +
    `${Date.now().toString(36)}`;

  // Store it for future use
  localStorage.setItem(storageKey, newId);

  return newId;
}

export default { generateGuestId };
