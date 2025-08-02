// /src/lib/api.ts

// A mock function to simulate network delay
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ============================================================================
// Mock Data
// ============================================================================

const MOCK_MENU_ITEMS = {
  coffee: [
    { id: 'c1', name: 'Espresso', price: 3.00, image: 'https://images.unsplash.com/photo-1511920183353-34e61a95a512' },
    { id: 'c2', name: 'Americano', price: 3.50, image: 'https://images.unsplash.com/photo-1532004253691-b223946c1de1' },
    { id: 'c3', name: 'Latte', price: 4.50, image: 'https://images.unsplash.com/photo-1561882468-91101f2e5f87' },
    { id: 'c4', name: 'Cappuccino', price: 4.50, image: 'https://images.unsplash.com/photo-1572442388855-458a58494c73' },
  ],
  tea: [
    { id: 't1', name: 'Green Tea', price: 3.00, image: 'https://images.unsplash.com/photo-1627435601361-ec25f2b74c28' },
    { id: 't2', name: 'Black Tea', price: 3.00, image: 'https://images.unsplash.com/photo-1627894222733-2c896f47a24f' },
    { id: 't3', name: 'Oolong Tea', price: 3.50, image: 'https://images.unsplash.com/photo-1597318181433-3135227117c7' },
  ],
  pastries: [
    { id: 'p1', name: 'Croissant', price: 2.50, image: 'https://images.unsplash.com/photo-1530610476181-d83430b64dcd' },
    { id: 'p2', name: 'Muffin', price: 2.75, image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b' },
    { id: 'p3', name: 'Scone', price: 3.00, image: 'https://images.unsplash.com/photo-1606859211883-92c975b7a1a4' },
  ],
};

const MOCK_MEMBER_DATA = {
  name: 'Alex Doe',
  balance: 50.75,
  memberSince: '2022-01-15',
  orderHistory: [
    { id: 'ord1', date: '2023-10-25', items: '1x Latte, 1x Croissant', total: 7.00 },
    { id: 'ord2', date: '2023-10-22', items: '2x Americano', total: 7.00 },
    { id: 'ord3', date: '2023-10-18', items: '1x Green Tea', total: 3.00 },
  ],
};

// ============================================================================
// API Functions
// ============================================================================

export const fetchMenuItems = async (category: 'coffee' | 'tea' | 'pastries') => {
  await sleep(500);
  console.log(`Fetching ${category} menu items...`);
  return MOCK_MENU_ITEMS[category];
};

export const submitCakeOrder = async (customization: any) => {
  await sleep(1000);
  console.log('Submitting cake order:', customization);
  return { success: true, orderId: `cake-${Date.now()}` };
};

export const submitReservation = async (details: any) => {
  await sleep(1000);
  console.log('Submitting reservation:', details);
  if (!details.name || !details.phone) {
    return { success: false, message: 'Name and phone are required.' };
  }
  return { success: true, reservationId: `res-${Date.now()}` };
};

export const fetchMemberData = async () => {
  await sleep(700);
  console.log('Fetching member data...');
  return MOCK_MEMBER_DATA;
};

export const processTopUp = async (amount: number) => {
  await sleep(1200);
  console.log(`Processing top-up of $${amount}...`);
  if (amount <= 0) {
    return { success: false, message: 'Invalid top-up amount.' };
  }
  MOCK_MEMBER_DATA.balance += amount;
  return { success: true, newBalance: MOCK_MEMBER_DATA.balance };
};