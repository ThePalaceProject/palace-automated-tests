import { test, expect } from '@playwright/test';
import { login } from './utils';

test('Places page loads', async ({ page }) => {
  await login(page);

  await page.getByRole('link', { name: 'Places' }).click();

  await expect(page).toHaveURL(/library/i);
  await expect(page.getByRole('heading', { name: /select place to change/i })
).toBeVisible();
});