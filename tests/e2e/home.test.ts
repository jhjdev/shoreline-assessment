import { test, expect } from '@playwright/test';

test('homepage has weather information', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Shoreline/);
  await expect(page.getByText(/24 Hour Weather Forecast/)).toBeVisible();
});
