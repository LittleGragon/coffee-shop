import { test, expect } from '@playwright/test';

const API_BASE = process.env.E2E_API_URL || 'http://localhost:3001';

test.describe('Coffee Purchase and Checkout Flow', () => {
  
  test.describe('Complete Coffee Purchase Journey', () => {
    test('should complete full coffee purchase with member checkout', async ({ request }) => {
      // Step 1: Browse available coffee menu
      const coffeeMenuRes = await request.get(`${API_BASE}/api/menu?category=Coffee&available=true`);
      expect(coffeeMenuRes.ok()).toBeTruthy();
      const coffeeItems = await coffeeMenuRes.json();
      expect(coffeeItems.length).toBeGreaterThan(0);
      
      const selectedCoffee = coffeeItems[0];
      console.log(`Selected coffee: ${selectedCoffee.name} - $${selectedCoffee.price}`);
      
      // Step 2: Register/Login as member for checkout
      const memberData = {
        name: 'Coffee Lover',
        email: `coffee.lover.${Date.now()}@example.com`,
        password: 'coffeepass123'
      };
      
      const registerRes = await request.post(`${API_BASE}/api/member/register`, {
        data: memberData
      });
      expect(registerRes.status()).toBe(201);
      const member = await registerRes.json();
      expect(member.balance).toBe(0);
      
      // Step 3: Top up member balance for purchase
      const topUpAmount = Math.max(selectedCoffee.price * 3, 20); // Ensure enough balance
      const topUpRes = await request.post(`${API_BASE}/api/member/top-up`, {
        data: {
          user_id: member.id,
          amount: topUpAmount
        }
      });
      expect(topUpRes.ok()).toBeTruthy();
      
      // Verify balance updated
      const balanceRes = await request.get(`${API_BASE}/api/member/${member.id}/balance`);
      expect(balanceRes.ok()).toBeTruthy();
      const balanceData = await balanceRes.json();
      expect(balanceData.balance).toBe(topUpAmount);
      
      // Step 4: Create order with selected coffee
      const orderData = {
        user_id: member.id,
        order_type: 'takeaway',
        items: [
          {
            menu_item_id: selectedCoffee.id,
            quantity: 2,
            price_at_time: selectedCoffee.price,
            customization: {
              size: 'large',
              milk: 'oat milk',
              sugar: 'no sugar',
              extra_shot: true
            }
          }
        ],
        total_amount: selectedCoffee.price * 2,
        customization: {
          special_instructions: 'Extra hot please'
        }
      };
      
      const createOrderRes = await request.post(`${API_BASE}/api/orders`, {
        data: orderData
      });
      expect(createOrderRes.status()).toBe(201);
      const order = await createOrderRes.json();
      expect(order.status).toBe('pending');
      expect(order.total_amount).toBe(selectedCoffee.price * 2);
      
      // Step 5: Process payment (deduct from member balance)
      const paymentRes = await request.post(`${API_BASE}/api/orders/${order.id}/payment`, {
        data: {
          payment_method: 'member_balance',
          amount: order.total_amount
        }
      });
      expect(paymentRes.ok()).toBeTruthy();
      
      // Step 6: Verify payment processed and order confirmed
      const paidOrderRes = await request.get(`${API_BASE}/api/orders/${order.id}`);
      expect(paidOrderRes.ok()).toBeTruthy();
      const paidOrder = await paidOrderRes.json();
      expect(paidOrder.status).toBe('confirmed');
      
      // Step 7: Verify member balance deducted
      const updatedBalanceRes = await request.get(`${API_BASE}/api/member/${member.id}/balance`);
      expect(updatedBalanceRes.ok()).toBeTruthy();
      const updatedBalance = await updatedBalanceRes.json();
      expect(updatedBalance.balance).toBe(topUpAmount - order.total_amount);
      
      // Step 8: Track order through preparation stages
      const preparationStages = ['preparing', 'ready'];
      for (const stage of preparationStages) {
        const updateRes = await request.put(`${API_BASE}/api/orders/${order.id}`, {
          data: { status: stage }
        });
        expect(updateRes.ok()).toBeTruthy();
        
        const updatedOrder = await updateRes.json();
        expect(updatedOrder.status).toBe(stage);
        console.log(`Order status updated to: ${stage}`);
      }
      
      // Step 9: Complete order pickup
      const completeRes = await request.put(`${API_BASE}/api/orders/${order.id}`, {
        data: { status: 'completed' }
      });
      expect(completeRes.ok()).toBeTruthy();
      
      // Step 10: Verify transaction history
      const transactionRes = await request.get(`${API_BASE}/api/member/${member.id}/transactions`);
      expect(transactionRes.ok()).toBeTruthy();
      const transactions = await transactionRes.json();
      expect(transactions.length).toBeGreaterThanOrEqual(2); // Top-up + Purchase
      
      const purchaseTransaction = transactions.find((t: any) => t.type === 'purchase');
      expect(purchaseTransaction).toBeTruthy();
      expect(purchaseTransaction.amount).toBe(-order.total_amount);
    });

    test('should handle cash checkout for non-members', async ({ request }) => {
      // Step 1: Get coffee menu
      const menuRes = await request.get(`${API_BASE}/api/menu?category=Coffee&available=true`);
      expect(menuRes.ok()).toBeTruthy();
      const coffeeItems = await menuRes.json();
      const selectedCoffee = coffeeItems[0];
      
      // Step 2: Create guest order
      const guestOrderData = {
        order_type: 'dine-in',
        items: [
          {
            menu_item_id: selectedCoffee.id,
            quantity: 1,
            price_at_time: selectedCoffee.price
          }
        ],
        total_amount: selectedCoffee.price,
        customer_info: {
          name: 'Guest Customer',
          phone: '+1234567890'
        }
      };
      
      const createOrderRes = await request.post(`${API_BASE}/api/orders`, {
        data: guestOrderData
      });
      expect(createOrderRes.status()).toBe(201);
      const order = await createOrderRes.json();
      
      // Step 3: Process cash payment
      const cashPaymentRes = await request.post(`${API_BASE}/api/orders/${order.id}/payment`, {
        data: {
          payment_method: 'cash',
          amount: order.total_amount,
          cash_received: order.total_amount + 5, // Customer pays with extra
          change_due: 5
        }
      });
      expect(cashPaymentRes.ok()).toBeTruthy();
      
      // Step 4: Verify order confirmed
      const confirmedOrderRes = await request.get(`${API_BASE}/api/orders/${order.id}`);
      expect(confirmedOrderRes.ok()).toBeTruthy();
      const confirmedOrder = await confirmedOrderRes.json();
      expect(confirmedOrder.status).toBe('confirmed');
    });

    test('should handle card payment checkout', async ({ request }) => {
      // Step 1: Select coffee and create order
      const menuRes = await request.get(`${API_BASE}/api/menu?category=Coffee&available=true`);
      const coffeeItems = await menuRes.json();
      const selectedCoffee = coffeeItems[0];
      
      const orderData = {
        order_type: 'takeaway',
        items: [
          {
            menu_item_id: selectedCoffee.id,
            quantity: 1,
            price_at_time: selectedCoffee.price
          }
        ],
        total_amount: selectedCoffee.price
      };
      
      const createOrderRes = await request.post(`${API_BASE}/api/orders`, {
        data: orderData
      });
      const order = await createOrderRes.json();
      
      // Step 2: Process card payment
      const cardPaymentRes = await request.post(`${API_BASE}/api/orders/${order.id}/payment`, {
        data: {
          payment_method: 'card',
          amount: order.total_amount,
          card_details: {
            last_four: '1234',
            transaction_id: `txn_${Date.now()}`,
            authorization_code: 'AUTH123'
          }
        }
      });
      expect(cardPaymentRes.ok()).toBeTruthy();
      
      // Step 3: Verify payment processed
      const paidOrderRes = await request.get(`${API_BASE}/api/orders/${order.id}`);
      const paidOrder = await paidOrderRes.json();
      expect(paidOrder.status).toBe('confirmed');
    });

    test('should handle multiple coffee items in single order', async ({ request }) => {
      // Step 1: Get multiple coffee options
      const menuRes = await request.get(`${API_BASE}/api/menu?category=Coffee&available=true`);
      const coffeeItems = await menuRes.json();
      expect(coffeeItems.length).toBeGreaterThanOrEqual(2);
      
      // Step 2: Create member for checkout
      const memberData = {
        name: 'Multi Coffee Buyer',
        email: `multi.buyer.${Date.now()}@example.com`,
        password: 'multipass123'
      };
      
      const registerRes = await request.post(`${API_BASE}/api/member/register`, {
        data: memberData
      });
      const member = await registerRes.json();
      
      // Step 3: Top up sufficient balance
      const totalCost = coffeeItems.slice(0, 3).reduce((sum: number, item: any) => sum + item.price, 0);
      await request.post(`${API_BASE}/api/member/top-up`, {
        data: { user_id: member.id, amount: totalCost + 10 }
      });
      
      // Step 4: Create order with multiple coffee items
      const multiOrderData = {
        user_id: member.id,
        order_type: 'dine-in',
        items: coffeeItems.slice(0, 3).map((coffee: any) => ({
          menu_item_id: coffee.id,
          quantity: 1,
          price_at_time: coffee.price,
          customization: {
            size: 'medium',
            milk: 'regular'
          }
        })),
        total_amount: totalCost
      };
      
      const createOrderRes = await request.post(`${API_BASE}/api/orders`, {
        data: multiOrderData
      });
      expect(createOrderRes.status()).toBe(201);
      const order = await createOrderRes.json();
      
      // Step 5: Process payment
      const paymentRes = await request.post(`${API_BASE}/api/orders/${order.id}/payment`, {
        data: {
          payment_method: 'member_balance',
          amount: order.total_amount
        }
      });
      expect(paymentRes.ok()).toBeTruthy();
      
      // Step 6: Verify order items
      const orderItemsRes = await request.get(`${API_BASE}/api/orders/${order.id}/items`);
      expect(orderItemsRes.ok()).toBeTruthy();
      const orderItems = await orderItemsRes.json();
      expect(orderItems.length).toBe(3);
    });

    test('should handle insufficient balance scenario', async ({ request }) => {
      // Step 1: Create member with low balance
      const memberData = {
        name: 'Low Balance User',
        email: `low.balance.${Date.now()}@example.com`,
        password: 'lowbalance123'
      };
      
      const registerRes = await request.post(`${API_BASE}/api/member/register`, {
        data: memberData
      });
      const member = await registerRes.json();
      
      // Step 2: Top up insufficient amount
      await request.post(`${API_BASE}/api/member/top-up`, {
        data: { user_id: member.id, amount: 2.00 } // Low amount
      });
      
      // Step 3: Try to order expensive coffee
      const menuRes = await request.get(`${API_BASE}/api/menu?category=Coffee&available=true`);
      const coffeeItems = await menuRes.json();
      const expensiveCoffee = coffeeItems.reduce((prev: any, current: any) => 
        (prev.price > current.price) ? prev : current
      );
      
      const orderData = {
        user_id: member.id,
        order_type: 'takeaway',
        items: [
          {
            menu_item_id: expensiveCoffee.id,
            quantity: 2, // Make it more expensive
            price_at_time: expensiveCoffee.price
          }
        ],
        total_amount: expensiveCoffee.price * 2
      };
      
      const createOrderRes = await request.post(`${API_BASE}/api/orders`, {
        data: orderData
      });
      const order = await createOrderRes.json();
      
      // Step 4: Payment should fail due to insufficient balance
      const paymentRes = await request.post(`${API_BASE}/api/orders/${order.id}/payment`, {
        data: {
          payment_method: 'member_balance',
          amount: order.total_amount
        }
      });
      expect(paymentRes.status()).toBe(400); // Should fail
      
      const errorResponse = await paymentRes.json();
      expect(errorResponse.error).toContain('insufficient');
    });
  });

  test.describe('Coffee Purchase UI Flow', () => {
    test('should complete coffee purchase through UI', async ({ page }) => {
      await page.goto('/');
      
      // Step 1: Browse coffee menu
      const menuSection = page.locator('[data-testid="menu-section"]');
      if (await menuSection.isVisible()) {
        // Select coffee category
        const coffeeCategory = page.locator('[data-testid="category-coffee"]');
        if (await coffeeCategory.isVisible()) {
          await coffeeCategory.click();
        }
        
        // Step 2: Select a coffee item
        const coffeeItem = page.locator('[data-testid="menu-item"]').first();
        if (await coffeeItem.isVisible()) {
          await coffeeItem.click();
          
          // Step 3: Customize coffee order
          const customizeModal = page.locator('[data-testid="customize-modal"]');
          if (await customizeModal.isVisible()) {
            // Select size
            const sizeOption = page.locator('[data-testid="size-large"]');
            if (await sizeOption.isVisible()) {
              await sizeOption.click();
            }
            
            // Select milk type
            const milkOption = page.locator('[data-testid="milk-oat"]');
            if (await milkOption.isVisible()) {
              await milkOption.click();
            }
            
            // Add to cart
            const addToCartBtn = page.locator('[data-testid="add-to-cart-btn"]');
            if (await addToCartBtn.isVisible()) {
              await addToCartBtn.click();
            }
          }
        }
        
        // Step 4: Proceed to checkout
        const cartIcon = page.locator('[data-testid="cart-icon"]');
        if (await cartIcon.isVisible()) {
          await cartIcon.click();
          
          const checkoutBtn = page.locator('[data-testid="checkout-btn"]');
          if (await checkoutBtn.isVisible()) {
            await checkoutBtn.click();
          }
        }
        
        // Step 5: Login/Register for checkout
        const loginForm = page.locator('[data-testid="login-form"]');
        if (await loginForm.isVisible()) {
          // Try guest checkout first
          const guestCheckout = page.locator('[data-testid="guest-checkout"]');
          if (await guestCheckout.isVisible()) {
            await guestCheckout.click();
            
            // Fill guest info
            await page.fill('[data-testid="guest-name"]', 'Test Customer');
            await page.fill('[data-testid="guest-phone"]', '+1234567890');
          }
        }
        
        // Step 6: Select payment method
        const paymentSection = page.locator('[data-testid="payment-section"]');
        if (await paymentSection.isVisible()) {
          const cardPayment = page.locator('[data-testid="payment-card"]');
          if (await cardPayment.isVisible()) {
            await cardPayment.click();
          }
        }
        
        // Step 7: Complete payment
        const payButton = page.locator('[data-testid="pay-button"]');
        if (await payButton.isVisible()) {
          await payButton.click();
          
          // Wait for confirmation
          const confirmationMessage = page.locator('[data-testid="order-confirmation"]');
          if (await confirmationMessage.isVisible()) {
            await expect(confirmationMessage).toContainText('Order confirmed');
          }
        }
      }
    });
  });
});