import { test, expect } from '@playwright/test';
import { login } from './utils';

test('Users page loads', async ({ page }) => {
  await login(page);

  await page.getByRole('link', { name: 'Users' }).click();

  await expect(page).toHaveURL(/customuser/);
  await expect(page.getByRole('heading', { name: /select user to change/i })).toBeVisible();
});