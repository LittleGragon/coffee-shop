// /src/lib/mock-api.ts

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const menuItems = {
  coffee: [
    { id: 'c1', name: 'Espresso', price: 2.5 },
    { id: 'c2', name: 'Americano', price: 3.0 },
    { id: 'c3', name: 'Latte', price: 3.5 },
    { id: 'c4', name: 'Cappuccino', price: 3.5 },
  ],
  tea: [
    { id: 't1', name: 'Green Tea', price: 2.5 },
    { id: 't2', name: 'Black Tea', price: 2.5 },
    { id: 't3', name: 'Herbal Tea', price: 2.5 },
  ],
  pastries: [
    { id: 'p1', name: 'Croissant', price: 2.0 },
    { id: 'p2', name: 'Muffin', price: 2.2 },
    { id: 'p3', name: 'Scone', price: 2.5 },
  ],
};

const memberData = {
  name: 'Alex Doe',
  email: 'alex.doe@example.com',
  membershipLevel: 'Gold',
  balance: 75.50,
  points: 1250,
  orderHistory: [
    { id: 'ord1', date: '2023-10-25', items: '1x Latte, 1x Croissant', total: 7.00 },
    { id: 'ord2', date: '2023-10-22', items: '2x Americano', total: 7.00 },
    { id: 'ord3', date: '2023-10-18', items: '1x Green Tea', total: 3.00 },
  ],
};

export const mockFetchMenuItems = async (category: 'coffee' | 'tea' | 'pastries') => {
  await sleep(500);
  return menuItems[category] || [];
};

export const mockSubmitCakeOrder = async (customization: any) => {
  await sleep(1000);
  console.log('Mock submitting cake order:', customization);
  return { message: 'Cake order submitted successfully!', orderId: `mock-${Date.now()}` };
};

export const mockSubmitReservation = async (details: any) => {
  await sleep(1000);
  console.log('Mock submitting reservation:', details);
  return { message: 'Reservation confirmed successfully!', reservationId: `mock-${Date.now()}` };
};

export const mockFetchMemberData = async () => {
  await sleep(500);
  return memberData;
};

export const mockProcessTopUp = async (amount: number) => {
  await sleep(1000);
  console.log(`Mock processing top-up of $${amount}`);
  const newBalance = memberData.balance + amount;
  memberData.balance = newBalance; // Simulate updating the balance
  return { message: 'Top-up successful!', newBalance };
};