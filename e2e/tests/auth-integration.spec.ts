import { test, expect } from '@playwright/test';

const API_BASE_URL = process.env.E2E_API_URL || 'http://localhost:3001';
const WEB_BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:5173';

test.describe('Authentication Integration', () => {
  const testUser = {
    email: `test-${Date.now()}@example.com`,
    password: 'password123',
    name: 'Test User'
  };

  test('should register a new user via API', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/api/auth/register`, {
      data: testUser
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    
    expect(data.success).toBe(true);
    expect(data.user.email).toBe(testUser.email);
    expect(data.user.name).toBe(testUser.name);
    expect(data.token).toBeDefined();
    expect(typeof data.token).toBe('string');
  });

  test('should login with registered user via API', async ({ request }) => {
    // First register the user
    await request.post(`${API_BASE_URL}/api/auth/register`, {
      data: testUser
    });

    // Then login
    const response = await request.post(`${API_BASE_URL}/api/auth/login`, {
      data: {
        email: testUser.email,
        password: testUser.password
      }
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    
    expect(data.success).toBe(true);
    expect(data.user.email).toBe(testUser.email);
    expect(data.token).toBeDefined();
  });

  test('should reject invalid login credentials', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/api/auth/login`, {
      data: {
        email: 'nonexistent@example.com',
        password: 'wrongpassword'
      }
    });

    expect(response.status()).toBe(401);
    const data = await response.json();
    expect(data.error).toBe('Invalid email or password');
  });

  test('should show login button when not authenticated', async ({ page }) => {
    await page.goto(WEB_BASE_URL);
    
    // Should see login button
    const loginButton = page.getByRole('button', { name: /login/i });
    await expect(loginButton).toBeVisible();
  });

  test('should allow browsing without authentication', async ({ page }) => {
    await page.goto(WEB_BASE_URL);
    
    // Should be able to navigate to menu
    await page.getByRole('link', { name: /menu/i }).click();
    await expect(page).toHaveURL(/.*\/menu/);
    
    // Should see menu items
    await expect(page.getByText(/coffee/i)).toBeVisible();
    
    // Should still see login button (not blocking access)
    const loginButton = page.getByRole('button', { name: /login/i });
    await expect(loginButton).toBeVisible();
  });

  test('should handle user registration and login flow in UI', async ({ page }) => {
    await page.goto(WEB_BASE_URL);
    
    // Click login button to open modal
    await page.getByRole('button', { name: /login/i }).click();
    
    // Should see auth modal
    await expect(page.getByText('Login')).toBeVisible();
    
    // Switch to sign up mode
    await page.getByText("Don't have an account? Sign up").click();
    await expect(page.getByText('Sign Up')).toBeVisible();
    
    // Fill registration form
    await page.getByPlaceholder('Your full name').fill(testUser.name);
    await page.getByPlaceholder('your@email.com').fill(testUser.email);
    await page.getByPlaceholder('••••••••').fill(testUser.password);
    
    // Submit registration
    await page.getByRole('button', { name: 'Sign Up' }).click();
    
    // Should close modal and show user name in header
    await expect(page.getByText('Sign Up')).not.toBeVisible();
    await expect(page.getByText(testUser.name)).toBeVisible();
    
    // Should see logout option
    await page.getByText(testUser.name).click();
    await expect(page.getByText('Logout')).toBeVisible();
  });

  test('should persist authentication across page reloads', async ({ page }) => {
    await page.goto(WEB_BASE_URL);
    
    // Register and login user
    await page.getByRole('button', { name: /login/i }).click();
    await page.getByText("Don't have an account? Sign up").click();
    
    await page.getByPlaceholder('Your full name').fill(testUser.name);
    await page.getByPlaceholder('your@email.com').fill(testUser.email);
    await page.getByPlaceholder('••••••••').fill(testUser.password);
    await page.getByRole('button', { name: 'Sign Up' }).click();
    
    // Verify logged in
    await expect(page.getByText(testUser.name)).toBeVisible();
    
    // Reload page
    await page.reload();
    
    // Should still be logged in
    await expect(page.getByText(testUser.name)).toBeVisible();
    await expect(page.getByRole('button', { name: /login/i })).not.toBeVisible();
  });
});