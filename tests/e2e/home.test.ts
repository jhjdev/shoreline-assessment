import { test, expect } from '@playwright/test';

test('homepage has weather information', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Shoreline/);
  await expect(page.getByText(/Today's Weather/)).toBeVisible();
});

