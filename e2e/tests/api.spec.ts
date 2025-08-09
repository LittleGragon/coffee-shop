import { test, expect } from '@playwright/test';

const API_BASE = process.env.E2E_API_URL || 'http://localhost:3001';

test.describe('Smoke checks - API and UI', () => {
  test('API: GET /api/menu returns 200 and an array', async ({ request }) => {
    const res = await request.get(`${API_BASE}/api/menu`);
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
  });

  test('API: GET /api/member returns 200', async ({ request }) => {
    const res = await request.get(`${API_BASE}/api/member`);
    expect(res.ok()).toBeTruthy();
  });

  test('UI: home page loads (baseURL) and body is visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
  });
});