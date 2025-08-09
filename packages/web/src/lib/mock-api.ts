// /src/lib/mock-api.ts

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const menuItems = {
  coffee: [
    { 
      id: 'c1', 
      name: 'Espresso', 
      price: 2.5, 
      category: 'Coffee',
      description: 'Rich and intense espresso shot',
      image: 'https://images.unsplash.com/photo-1520516472218-ed48f8c8d3d7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      is_available: true
    },
    { 
      id: 'c2', 
      name: 'Americano', 
      price: 3.0, 
      category: 'Coffee',
      description: 'Espresso diluted with hot water',
      image: 'https://images.unsplash.com/photo-1551030173-122aabc4489c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      is_available: true
    },
    { 
      id: 'c3', 
      name: 'Latte', 
      price: 3.5, 
      category: 'Coffee',
      description: 'Espresso with steamed milk and a light layer of foam',
      image: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      is_available: true
    },
    { 
      id: 'c4', 
      name: 'Cappuccino', 
      price: 3.5, 
      category: 'Coffee',
      description: 'Equal parts espresso, steamed milk, and milk foam',
      image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      is_available: true
    },
  ],
  tea: [
    { 
      id: 't1', 
      name: 'Green Tea', 
      price: 2.5, 
      category: 'Tea',
      description: 'Light and refreshing green tea',
      image: 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      is_available: true
    },
    { 
      id: 't2', 
      name: 'Black Tea', 
      price: 2.5, 
      category: 'Tea',
      description: 'Strong and aromatic black tea',
      image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      is_available: true
    },
    { 
      id: 't3', 
      name: 'Herbal Tea', 
      price: 2.5, 
      category: 'Tea',
      description: 'Caffeine-free herbal infusion',
      image: 'https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      is_available: true
    },
  ],
  pastries: [
    { 
      id: 'p1', 
      name: 'Croissant', 
      price: 2.0, 
      category: 'Pastry',
      description: 'Buttery, flaky French pastry',
      image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      is_available: true
    },
    { 
      id: 'p2', 
      name: 'Muffin', 
      price: 2.2, 
      category: 'Pastry',
      description: 'Freshly baked blueberry muffin',
      image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      is_available: true
    },
    { 
      id: 'p3', 
      name: 'Scone', 
      price: 2.5, 
      category: 'Pastry',
      description: 'Traditional English scone with jam',
      image: 'https://images.unsplash.com/photo-1601369751553-f9f8a21e7bdf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      is_available: true
    },
  ],
};

const memberData = {
  id: 'member-123',
  name: 'Alex Doe',
  email: 'alex.doe@example.com',
  phone: '123-456-7890',
  membership_level: 'Gold',
  balance: 75.50,
  points: 1250,
  member_since: '2023-01-15',
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

export const mockPlaceOrder = async (orderData: any) => {
  await sleep(2000); // Simulate network delay
  console.log('Mock placing order:', orderData);
  
  // Create a mock order response
  const orderId = 'mock-order-' + Date.now();
  const totalAmount = orderData.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
  
  return {
    success: true,
    order: {
      id: orderId,
      customer_name: orderData.customer_name,
      total_amount: totalAmount,
      status: 'pending',
      created_at: new Date().toISOString()
    },
    message: 'Order placed successfully'
  };
};
