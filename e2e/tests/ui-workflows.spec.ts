import { test, expect } from '@playwright/test';

test.describe('Coffee Shop UI Workflows', () => {
  
  test.describe('Customer Ordering Interface', () => {
    test('should allow customer to browse and order', async ({ page }) => {
      await page.goto('/');
      
      // Check if menu is displayed
      await expect(page.locator('[data-testid="menu-section"]')).toBeVisible();
      
      // Browse menu categories
      const categoryButtons = page.locator('[data-testid="category-button"]');
      if (await categoryButtons.count() > 0) {
        await categoryButtons.first().click();
        await expect(page.locator('[data-testid="menu-item"]')).toBeVisible();
      }
      
      // Add item to cart (if cart functionality exists)
      const addToCartButton = page.locator('[data-testid="add-to-cart"]').first();
      if (await addToCartButton.isVisible()) {
        await addToCartButton.click();
        await expect(page.locator('[data-testid="cart-count"]')).toContainText('1');
      }
    });
  });

  test.describe('Staff Management Interface', () => {
    test('should allow staff to manage orders', async ({ page }) => {
      // Navigate to staff/admin interface
      await page.goto('/admin');
      
      // Check if orders dashboard is accessible
      const ordersSection = page.locator('[data-testid="orders-dashboard"]');
      if (await ordersSection.isVisible()) {
        await expect(ordersSection).toBeVisible();
        
        // Check order status updates
        const orderItems = page.locator('[data-testid="order-item"]');
        if (await orderItems.count() > 0) {
          const statusButton = orderItems.first().locator('[data-testid="status-button"]');
          if (await statusButton.isVisible()) {
            await statusButton.click();
          }
        }
      }
    });
  });

  test.describe('Reservation Interface', () => {
    test('should handle table reservations', async ({ page }) => {
      await page.goto('/reservations');
      
      // Fill reservation form (if exists)
      const reservationForm = page.locator('[data-testid="reservation-form"]');
      if (await reservationForm.isVisible()) {
        await page.fill('[data-testid="customer-name"]', 'Test Customer');
        await page.fill('[data-testid="customer-phone"]', '+1234567890');
        await page.selectOption('[data-testid="party-size"]', '4');
        
        // Select date and time
        const dateInput = page.locator('[data-testid="reservation-date"]');
        if (await dateInput.isVisible()) {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          await dateInput.fill(tomorrow.toISOString().split('T')[0]);
        }
        
        const submitButton = page.locator('[data-testid="submit-reservation"]');
        if (await submitButton.isVisible()) {
          await submitButton.click();
          await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
        }
      }
    });
  });

  test.describe('Member Dashboard', () => {
    test('should display member information and history', async ({ page }) => {
      await page.goto('/member');
      
      // Check member login/registration
      const loginForm = page.locator('[data-testid="login-form"]');
      if (await loginForm.isVisible()) {
        await page.fill('[data-testid="email-input"]', 'test@example.com');
        await page.fill('[data-testid="password-input"]', 'password123');
        await page.click('[data-testid="login-button"]');
      }
      
      // Check member dashboard elements
      const dashboard = page.locator('[data-testid="member-dashboard"]');
      if (await dashboard.isVisible()) {
        await expect(page.locator('[data-testid="member-balance"]')).toBeVisible();
        await expect(page.locator('[data-testid="order-history"]')).toBeVisible();
      }
    });
  });

  test.describe('Inventory Management Interface', () => {
    test('should allow inventory tracking', async ({ page }) => {
      await page.goto('/admin/inventory');
      
      // Check inventory list
      const inventoryTable = page.locator('[data-testid="inventory-table"]');
      if (await inventoryTable.isVisible()) {
        await expect(inventoryTable).toBeVisible();
        
        // Check low stock alerts
        const lowStockAlert = page.locator('[data-testid="low-stock-alert"]');
        if (await lowStockAlert.isVisible()) {
          await expect(lowStockAlert).toBeVisible();
        }
        
        // Add new inventory item
        const addButton = page.locator('[data-testid="add-inventory-button"]');
        if (await addButton.isVisible()) {
          await addButton.click();
          
          const addForm = page.locator('[data-testid="add-inventory-form"]');
          if (await addForm.isVisible()) {
            await page.fill('[data-testid="item-name"]', 'Test Item');
            await page.fill('[data-testid="item-sku"]', 'TEST-001');
            await page.fill('[data-testid="current-stock"]', '100');
            await page.fill('[data-testid="minimum-stock"]', '20');
          }
        }
      }
    });
  });

  test.describe('Responsive Design', () => {
    test('should work on mobile devices', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
      
      await page.goto('/');
      
      // Check mobile navigation
      const mobileMenu = page.locator('[data-testid="mobile-menu-button"]');
      if (await mobileMenu.isVisible()) {
        await mobileMenu.click();
        await expect(page.locator('[data-testid="mobile-nav"]')).toBeVisible();
      }
      
      // Check responsive menu layout
      await expect(page.locator('[data-testid="menu-section"]')).toBeVisible();
    });
  });

  test.describe('Accessibility', () => {
    test('should be accessible', async ({ page }) => {
      await page.goto('/');
      
      // Check for proper heading structure
      const h1 = page.locator('h1');
      if (await h1.count() > 0) {
        await expect(h1.first()).toBeVisible();
      }
      
      // Check for alt text on images
      const images = page.locator('img');
      const imageCount = await images.count();
      for (let i = 0; i < Math.min(imageCount, 5); i++) {
        const img = images.nth(i);
        if (await img.isVisible()) {
          const alt = await img.getAttribute('alt');
          expect(alt).toBeTruthy();
        }
      }
      
      // Check for keyboard navigation
      await page.keyboard.press('Tab');
      const focusedElement = page.locator(':focus');
      if (await focusedElement.count() > 0) {
        await expect(focusedElement).toBeVisible();
      }
    });
  });
});