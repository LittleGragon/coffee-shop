import { test, expect } from '@playwright/test';

const API_BASE = process.env.E2E_API_URL || 'http://localhost:3001';

test.describe('Coffee Shop Business Flows', () => {
  
  test.describe('Menu Management Flow', () => {
    test('should manage menu items lifecycle', async ({ request }) => {
      // Get all menu categories (skip if endpoint doesn't exist)
      const categoriesRes = await request.get(`${API_BASE}/api/menu/categories`);
      if (categoriesRes.status() === 404) {
        console.log('Menu categories endpoint not implemented, skipping...');
      } else {
        expect(categoriesRes.ok()).toBeTruthy();
      }
      
      // Get menu items by category
      const menuRes = await request.get(`${API_BASE}/api/menu?category=Coffee`);
      expect(menuRes.ok()).toBeTruthy();
      const menuItems = await menuRes.json();
      expect(Array.isArray(menuItems)).toBe(true);
      
      // Create new menu item
      const newItem = {
        name: 'Test Latte',
        price: 4.50,
        category: 'Coffee',
        description: 'Test coffee item',
        is_available: true
      };
      
      const createRes = await request.post(`${API_BASE}/api/menu`, {
        data: newItem
      });
      expect(createRes.status()).toBe(201);
      const createdItem = await createRes.json();
      expect(createdItem.name).toBe(newItem.name);
      
      // Update menu item availability
      const updateRes = await request.put(`${API_BASE}/api/menu/${createdItem.id}`, {
        data: { is_available: false }
      });
      expect(updateRes.ok()).toBeTruthy();
    });
  });

  test.describe('Order Processing Flow', () => {
    test('should process complete order lifecycle', async ({ request }) => {
      // Get available menu items
      const menuRes = await request.get(`${API_BASE}/api/menu?available=true`);
      expect(menuRes.ok()).toBeTruthy();
      const availableItems = await menuRes.json();
      expect(availableItems.length).toBeGreaterThan(0);
      
      // Create order with multiple items
      const orderData = {
        user_id: 'test-user-123',
        order_type: 'dine-in',
        items: [
          {
            menu_item_id: availableItems[0].id,
            quantity: 2,
            price_at_time: availableItems[0].price
          }
        ],
        total_amount: availableItems[0].price * 2
      };
      
      const createOrderRes = await request.post(`${API_BASE}/api/orders`, {
        data: orderData
      });
      expect(createOrderRes.status()).toBe(201);
      const createdOrder = await createOrderRes.json();
      expect(createdOrder.status).toBe('pending');
      
      // Update order status through workflow
      const statuses = ['confirmed', 'preparing', 'ready', 'completed'];
      for (const status of statuses) {
        const updateRes = await request.put(`${API_BASE}/api/orders/${createdOrder.id}`, {
          data: { status }
        });
        expect(updateRes.ok()).toBeTruthy();
        const updatedOrder = await updateRes.json();
        expect(updatedOrder.status).toBe(status);
      }
    });
  });

  test.describe('Member Management Flow', () => {
    test('should handle member registration and balance management', async ({ request }) => {
      // Create new member
      const memberData = {
        name: 'Test Customer',
        email: 'test@example.com',
        password: 'testpass123'
      };
      
      const registerRes = await request.post(`${API_BASE}/api/member/register`, {
        data: memberData
      });
      expect(registerRes.status()).toBe(201);
      const member = await registerRes.json();
      expect(member.balance).toBe(0);
      
      // Top up member balance
      const topUpRes = await request.post(`${API_BASE}/api/member/top-up`, {
        data: {
          user_id: member.id,
          amount: 50.00
        }
      });
      expect(topUpRes.ok()).toBeTruthy();
      
      // Check updated balance
      const balanceRes = await request.get(`${API_BASE}/api/member/${member.id}/balance`);
      expect(balanceRes.ok()).toBeTruthy();
      const balanceData = await balanceRes.json();
      expect(balanceData.balance).toBe(50.00);
    });
  });

  test.describe('Inventory Management Flow', () => {
    test('should track inventory and low stock alerts', async ({ request }) => {
      // Get all inventory items
      const inventoryRes = await request.get(`${API_BASE}/api/inventory`);
      expect(inventoryRes.ok()).toBeTruthy();
      const inventory = await inventoryRes.json();
      expect(Array.isArray(inventory)).toBe(true);
      
      // Add new inventory item
      const newInventoryItem = {
        name: 'Test Coffee Beans',
        sku: 'TCB-001',
        category: 'Raw Materials',
        current_stock: 100,
        minimum_stock: 20,
        unit: 'kg',
        cost_per_unit: 15.00,
        supplier: 'Test Supplier'
      };
      
      const createRes = await request.post(`${API_BASE}/api/inventory`, {
        data: newInventoryItem
      });
      expect(createRes.status()).toBe(201);
      const createdItem = await createRes.json();
      
      // Record stock usage transaction
      const transactionRes = await request.post(`${API_BASE}/api/inventory/${createdItem.id}/transactions`, {
        data: {
          type: 'usage',
          quantity: 85,
          reason: 'Daily coffee production',
          created_by: 'system'
        }
      });
      expect(transactionRes.ok()).toBeTruthy();
      
      // Check low stock items
      const lowStockRes = await request.get(`${API_BASE}/api/inventory?lowStock=true`);
      expect(lowStockRes.ok()).toBeTruthy();
      const lowStockItems = await lowStockRes.json();
      expect(lowStockItems.some((item: any) => item.id === createdItem.id)).toBe(true);
    });
  });

  test.describe('Reservation Management Flow', () => {
    test('should handle table reservations', async ({ request }) => {
      // Create reservation
      const reservationData = {
        customer_name: 'John Doe',
        customer_phone: '+1234567890',
        party_size: 4,
        reservation_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
        status: 'confirmed'
      };
      
      const createRes = await request.post(`${API_BASE}/api/reservations`, {
        data: reservationData
      });
      expect(createRes.status()).toBe(201);
      const reservation = await createRes.json();
      expect(reservation.status).toBe('confirmed');
      
      // Check time slot availability
      const availabilityRes = await request.get(`${API_BASE}/api/reservations/availability`, {
        params: {
          date: reservationData.reservation_time.split('T')[0],
          time: reservationData.reservation_time.split('T')[1].split('.')[0],
          party_size: '4'
        }
      });
      expect(availabilityRes.ok()).toBeTruthy();
      
      // Update reservation status
      const updateRes = await request.put(`${API_BASE}/api/reservations/${reservation.id}`, {
        data: { status: 'seated' }
      });
      expect(updateRes.ok()).toBeTruthy();
    });
  });

  test.describe('End-to-End Customer Journey', () => {
    test('should complete full customer experience', async ({ request }) => {
      // 1. Customer browses menu
      const menuRes = await request.get(`${API_BASE}/api/menu?available=true`);
      expect(menuRes.ok()).toBeTruthy();
      const menu = await menuRes.json();
      
      // 2. Customer registers as member
      const memberData = {
        name: 'Jane Customer',
        email: 'jane@example.com',
        password: 'password123'
      };
      
      const registerRes = await request.post(`${API_BASE}/api/member/register`, {
        data: memberData
      });
      expect(registerRes.status()).toBe(201);
      const member = await registerRes.json();
      
      // 3. Customer tops up balance
      const topUpRes = await request.post(`${API_BASE}/api/member/top-up`, {
        data: { user_id: member.id, amount: 25.00 }
      });
      expect(topUpRes.ok()).toBeTruthy();
      
      // 4. Customer makes reservation
      const reservationRes = await request.post(`${API_BASE}/api/reservations`, {
        data: {
          user_id: member.id,
          customer_name: member.name,
          customer_phone: '+1234567890',
          party_size: 2,
          reservation_time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
          status: 'confirmed'
        }
      });
      expect(reservationRes.status()).toBe(201);
      
      // 5. Customer places order
      const orderRes = await request.post(`${API_BASE}/api/orders`, {
        data: {
          user_id: member.id,
          order_type: 'dine-in',
          items: [
            {
              menu_item_id: menu[0].id,
              quantity: 2,
              price_at_time: menu[0].price
            }
          ],
          total_amount: menu[0].price * 2
        }
      });
      expect(orderRes.status()).toBe(201);
      const order = await orderRes.json();
      
      // 6. Order progresses through workflow
      const statusUpdates = ['confirmed', 'preparing', 'ready', 'completed'];
      for (const status of statusUpdates) {
        const updateRes = await request.put(`${API_BASE}/api/orders/${order.id}`, {
          data: { status }
        });
        expect(updateRes.ok()).toBeTruthy();
      }
      
      // 7. Check final member balance (should be reduced)
      const finalBalanceRes = await request.get(`${API_BASE}/api/member/${member.id}/balance`);
      expect(finalBalanceRes.ok()).toBeTruthy();
      const finalBalance = await finalBalanceRes.json();
      expect(finalBalance.balance).toBeLessThan(25.00);
    });
  });

  test.describe('Business Analytics Flow', () => {
    test('should provide business insights', async ({ request }) => {
      // Get order statistics
      const orderStatsRes = await request.get(`${API_BASE}/api/orders/stats`);
      expect(orderStatsRes.ok()).toBeTruthy();
      
      // Get popular menu items
      const popularItemsRes = await request.get(`${API_BASE}/api/menu/popular`);
      expect(popularItemsRes.ok()).toBeTruthy();
      
      // Get inventory turnover
      const inventoryStatsRes = await request.get(`${API_BASE}/api/inventory/stats`);
      expect(inventoryStatsRes.ok()).toBeTruthy();
      
      // Get reservation occupancy
      const occupancyRes = await request.get(`${API_BASE}/api/reservations/occupancy`);
      expect(occupancyRes.ok()).toBeTruthy();
    });
  });
});